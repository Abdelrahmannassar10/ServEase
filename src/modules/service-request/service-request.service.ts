import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ProviderStatus, Role, ServiceStatus } from '../../common/types/enum';
import { ServiceRequestFactoryService } from './factory';
import { ServiceRequestRepository } from '../../models/service-request/service-request.repository';
import { generateCode, safeDecrypt } from '../../common/helper';
import { ProviderRepository } from '@models/index';
import { GeneralSettingService } from '@modules/general-setting/general-setting.service';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly serviceRequestRepository: ServiceRequestRepository,
    private readonly serviceRequestFactory: ServiceRequestFactoryService,
    private readonly providerRepository: ProviderRepository,
    private readonly generalSettingService: GeneralSettingService,
  ) {}

  async create(dto: CreateServiceRequestDto, customerId: Types.ObjectId) {
    const duplicate = await this.serviceRequestRepository.findDuplicateRequest(
      customerId,
      new Types.ObjectId(dto.providerId),
      dto.dateNeeded,
      dto.startTime,
    );

    if (duplicate) {
      throw new ConflictException(
        'You already sent a request to this provider at the same date and time',
      );
    }
    const serviceRequest = this.serviceRequestFactory.createServiceRequest(
      dto,
      customerId,
    );

    serviceRequest.status = ServiceStatus.WAITING;
    const created = await this.serviceRequestRepository.create(serviceRequest);

    const {
      __v,
      isDeleted,
      providerCancelFees,
      providerCancelCount,
      completionCode,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(created));

    return data;
  }
  private getId(value: any): string {
    return value?._id ? value._id.toString() : value?.toString();
  }
  private async findOneForUser(
    requestId: string,
    userId: Types.ObjectId,
    field: 'customerId' | 'providerId',
  ) {
    const request = await this.findOne(requestId);

    const requestOwnerId = this.getId(request[field]);
    const loggedUserId = userId.toString();

    if (requestOwnerId !== loggedUserId) {
      throw new UnauthorizedException(
        'You are not allowed to access this service request',
      );
    }

    return request;
  }

  async findAll() {
    return this.serviceRequestRepository.find({});
  }

  async findOne(id: string) {
    const request = await this.serviceRequestRepository.findByIdWithUsers(id);

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    return request;
  }
  async findRequests(user: any) {
    if (user.role === Role.CUSTOMER) {
      const requests = await this.serviceRequestRepository.findByCustomerId(
        user._id.toString(),
      );

      return requests.map((request: any) => {
        const req = JSON.parse(JSON.stringify(request));

        const {
          __v,
          isDeleted,
          addedToProviderCalendar,
          completionCode,
          createdAt,
          updatedAt,
          customerId,
          providerId,
          ...serviceData
        } = req;

        const {
          password,
          otp,
          otpExpiry,
          isVerified,
          isDeleted: providerIsDeleted,
          __v: providerV,
          createdAt: providerCreatedAt,
          updatedAt: providerUpdatedAt,
          role,
          mobileNumber,
          debt,
          providerCancelFees,
          providerCancelCount,
          ...providerData
        } = providerId;

        return {
          ...serviceData,
          provider: providerData,
        };
      });
    }
    if (user.role === Role.PROVIDER) {
      const requests = await this.serviceRequestRepository.findByProviderId(
        user._id.toString(),
      );

      return await Promise.all(
        requests.map(async (request: any) => {
          const req = JSON.parse(JSON.stringify(request));

          const {
            __v,
            isDeleted,
            addedToProviderCalendar,
            completionCode,
            createdAt,
            updatedAt,
            customerId,
            providerId,
            ...serviceData
          } = req;

          const {
            password,
            otp,
            otpExpiry,
            isVerified,
            isDeleted: customerIsDeleted,
            __v: customerV,
            createdAt: customerCreatedAt,
            updatedAt: customerUpdatedAt,
            role,
            mobileNumber,
            ...customerData
          } = customerId;
          const settings =
            await this.generalSettingService.getGeneralSettings();
          const commissionPercentage = settings.webCommission;
          const commission = Math.round(
            (req.price || 0) * (commissionPercentage / 100),
          );
          const earnings = (req.price || 0) - commission;
          return {
            ...serviceData,

            commission,

            earnings,

            customer:
              req.status === ServiceStatus.CONFIRMED
                ? {
                    ...customerData,
                    mobileNumber:
                      (await safeDecrypt(customerId.mobileNumber)) ?? null,
                  }
                : customerData,
          };
        }),
      );
    }
    return new UnauthorizedException(
      'You are not allowed to access service requests',
    );
  }
  async providerAccept(
    id: string,
    dto: UpdateServiceRequestDto,
    providerId: Types.ObjectId,
  ) {
    const request = await this.findOneForUser(id, providerId, 'providerId');

    if (request.status !== ServiceStatus.WAITING) {
      throw new BadRequestException(
        'Provider can only accept a waiting request',
      );
    }
    const provider = await this.providerRepository.findOne({
      _id: providerId,
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    if (provider.adminApproved === ProviderStatus.Banned) {
      throw new BadRequestException(
        'You are banned, Call the support team',
      );
    }
    if (provider.adminApproved === ProviderStatus.Stopped) {
      throw new BadRequestException(
        'Your account is stopped, Pay your dept or call the support team',
      );
    }

    if (!dto.price || !dto.endTime) {
      throw new BadRequestException('Price and end time are required');
    }
    if (dto.price <= 150) {
      throw new BadRequestException('Price must be greater than 150');
    }
    const date = new Date(request.dateNeeded);
    const [hours, minutes] = dto.endTime.split(':').map(Number);

    date.setHours(hours, minutes, 0, 0);

    const updated = await this.serviceRequestRepository.updateById(id, {
      providerId,
      price: dto.price,
      endTime: dto.endTime,
      scheduledEndAt: date,
      status: ServiceStatus.PENDING,
    });

    const {
      __v,
      isDeleted,
      providerCancelFees,
      providerCancelCount,
      addedToProviderCalendar,
      completionCode,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(updated));

    return data;
  }

  async providerReject(id: string, providerId: Types.ObjectId) {
    const request = await this.findOneForUser(id, providerId, 'providerId');

    if (request.status !== ServiceStatus.WAITING) {
      throw new BadRequestException(
        'Provider can only reject a waiting request',
      );
    }
    const update = await this.serviceRequestRepository.updateById(id, {
      status: ServiceStatus.REFUSED,
    });
    const {
      __v,
      isDeleted,
      providerCancelFees,
      providerCancelCount,
      addedToProviderCalendar,
      completionCode,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(update));

    return data;
  }

  async customerAccept(id: string, customerId: Types.ObjectId) {
    const request = await this.findOneForUser(id, customerId, 'customerId');

    if (request.status !== ServiceStatus.PENDING) {
      throw new BadRequestException(
        'Customer can only accept a pending request',
      );
    }

    const completionCode = generateCode();

    const update = await this.serviceRequestRepository.updateById(id, {
      status: ServiceStatus.CONFIRMED,
      completionCode,
      addedToProviderCalendar: true,
    });

    const {
      __v,
      isDeleted,
      providerCancelFees,
      providerCancelCount,
      addedToProviderCalendar,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(update));

    return data;
  }

  async customerReject(id: string, customerId: Types.ObjectId) {
    const request = await this.findOneForUser(id, customerId, 'customerId');

    if (request.status !== ServiceStatus.PENDING) {
      throw new BadRequestException(
        'Customer can only reject a pending request',
      );
    }
    const update = await this.serviceRequestRepository.updateById(id, {
      status: ServiceStatus.REFUSED,
    });
    const {
      __v,
      isDeleted,
      providerCancelFees,
      providerCancelCount,
      addedToProviderCalendar,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(update));
    return data;
  }

  async customerCancel(id: string, customerId: Types.ObjectId) {
    const request = await this.findOneForUser(id, customerId, 'customerId');

    if (request.status !== ServiceStatus.CONFIRMED) {
      throw new BadRequestException(
        'Customer can only cancel confirmed service',
      );
    }
    const update = await this.serviceRequestRepository.updateById(id, {
      status: ServiceStatus.REFUSED,
      addedToProviderCalendar: false,
      completionCode: null,
    });
    const {
      __v,
      isDeleted,
      providerCancelFees,
      providerCancelCount,
      addedToProviderCalendar,
      createdAt,
      updatedAt,
      completionCode,
      ...data
    } = JSON.parse(JSON.stringify(update));

    return data;
  }

  async providerCancel(id: string, providerId: Types.ObjectId) {
  const request = await this.findOneForUser(
    id,
    providerId,
    'providerId',
  );

  if (request.status !== ServiceStatus.CONFIRMED) {
    throw new BadRequestException(
      'Provider can only cancel confirmed service',
    );
  }

  if (!request.price) {
    throw new BadRequestException(
      'Cannot calculate cancel fee because price is missing',
    );
  }

  if (!request.providerId) {
    throw new BadRequestException('Provider is missing');
  }

  const providerIdValue = this.getId(request.providerId);

  const provider = await this.providerRepository.findById(
    providerIdValue,
  );

  if (!provider) {
    throw new NotFoundException('Provider not found');
  }

  const settings =
    await this.generalSettingService.getGeneralSettings();

  const cancelFee = Math.round(
    request.price * (settings.providerCancelFee / 100),
  );

  if (
    (provider.providerCancelFees || 0) + cancelFee >=
      settings.providerCancelFee ||
    (provider.providerCancelCount || 0) + 1 >=
      settings.providerCancelCount
  ) {
    provider.adminApproved = ProviderStatus.Banned;
  }

  provider.providerCancelCount =
    (provider.providerCancelCount || 0) + 1;

  provider.providerCancelFees =
    (provider.providerCancelFees || 0) + cancelFee;
  provider.debt =
    (provider.debt || 0) + cancelFee;

  await this.providerRepository.updateById(
    providerIdValue,
    provider,
  );

  const updated = await this.serviceRequestRepository.updateById(id, {
    status: ServiceStatus.REFUSED,
    addedToProviderCalendar: false,
    completionCode: null,
  });

  const {
    __v,
    isDeleted,
    addedToProviderCalendar,
    completionCode,
    createdAt,
    updatedAt,
    ...data
  } = JSON.parse(JSON.stringify(updated));

  return {
  ...data,
  providerStats: {
    providerCancelCount: provider.providerCancelCount,
    providerCancelFees: provider.providerCancelFees,
    debt: provider.debt || 0,
  },
};
}

async completeService(
  id: string,
  dto: UpdateServiceRequestDto,
  customerId: Types.ObjectId,
) {
  const request = await this.findOneForUser(
    id,
    customerId,
    'customerId',
  );

  if (request.status !== ServiceStatus.CONFIRMED) {
    throw new BadRequestException(
      'Only confirmed service can be completed',
    );
  }

  if (!dto.completionCode) {
    throw new BadRequestException('Completion code is required');
  }

  if (dto.completionCode !== request.completionCode) {
    throw new BadRequestException('Invalid completion code');
  }

  if (!request.price) {
    throw new BadRequestException(
      'Cannot calculate provider debt because price is missing',
    );
  }

  if (!request.providerId) {
    throw new BadRequestException('Provider is missing');
  }

  const providerIdValue = this.getId(request.providerId);

  const provider = await this.providerRepository.findById(
    providerIdValue,
  );

  if (!provider) {
    throw new NotFoundException('Provider not found');
  }

  const settings =
    await this.generalSettingService.getGeneralSettings();

  const debtAmount = Math.round(
    request.price * (settings.webCommission / 100),
  );

  provider.debt = (provider.debt || 0) + debtAmount;

  if (provider.debt > settings.providerDebt) {
    provider.adminApproved = ProviderStatus.Stopped;
  }

  provider.providerCancelCount = 0;

  await this.providerRepository.updateById(
    providerIdValue,
    provider,
  );

  const updated = await this.serviceRequestRepository.updateById(id, {
    status: ServiceStatus.COMPLETED,
    completionCode: null,
    addedToProviderCalendar: false,
  });

  const {
    __v,
    isDeleted,
    addedToProviderCalendar,
    completionCode,
    createdAt,
    updatedAt,
    ...data
  } = JSON.parse(JSON.stringify(updated));

  return data;
}
  async getProviderCalendar(providerId: Types.ObjectId) {
    const requests =
      await this.serviceRequestRepository.findProviderCalendarRequests(
        providerId.toString(),
      );

    return await Promise.all(
      requests.map(async (request: any) => {
        const {
          __v,
          isDeleted,
          addedToProviderCalendar,
          createdAt,
          updatedAt,
          customerId,
          ...data
        } = JSON.parse(JSON.stringify(request));

        const {
          password,
          otp,
          otpExpiry,
          isVerified,
          isDeleted: customerIsDeleted,
          __v: customerV,
          createdAt: customerCreatedAt,
          updatedAt: customerUpdatedAt,
          mobileNumber,
          userAgent,
          role,
          ...customerData
        } = customerId;

        return {
          ...data,
          customer: {
            ...customerData,
            mobileNumber: (await safeDecrypt(mobileNumber)) ?? null,
          },
        };
      }),
    );
  }
  async findOneDetails(id: string, user: any) {
    if (user.role === Role.PROVIDER) {
      const request = await this.findOneForUser(id, user._id, 'providerId');
      const req = JSON.parse(JSON.stringify(request));

      const {
        __v,
        isDeleted,
        addedToProviderCalendar,
        createdAt,
        updatedAt,
        customerId,
        providerId,
        ...serviceData
      } = req;

      const {
        password,
        otp,
        otpExpiry,
        isVerified,
        isDeleted: customerIsDeleted,
        __v: customerV,
        createdAt: customerCreatedAt,
        updatedAt: customerUpdatedAt,
        role,
        mobileNumber,
        ...customerData
      } = customerId;

      const settings = await this.generalSettingService.getGeneralSettings();
      const commissionPercentage = settings.webCommission;
      const commission = Math.round(
        (req.price || 0) * (commissionPercentage / 100),
      );
      const earnings = (req.price || 0) - commission;

      return {
        ...serviceData,
        commission,
        earnings,
        customer:
          req.status === ServiceStatus.CONFIRMED
            ? {
                ...customerData,
                mobileNumber:
                  (await safeDecrypt(customerId.mobileNumber)) ?? null,
              }
            : customerData,
      };
    }

    if (user.role === Role.CUSTOMER) {
      const request = await this.findOneForUser(id, user._id, 'customerId');
      const req = JSON.parse(JSON.stringify(request));

      const {
        __v,
        isDeleted,
        addedToProviderCalendar,
        createdAt,
        updatedAt,
        customerId,
        providerId,
        completionCode,

        ...serviceData
      } = req;

      const {
        password,
        otp,
        otpExpiry,
        isVerified,
        isDeleted: providerIsDeleted,
        __v: providerV,
        createdAt: providerCreatedAt,
        updatedAt: providerUpdatedAt,
        role,
        ...providerData
      } = providerId;

      return {
        ...serviceData,
        provider: providerData,
      };
    }

    return this.findOne(id);
  }
  async handleOutdatedConfirmedRequests() {
    const outdatedDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const requests =
      await this.serviceRequestRepository.findOutdatedConfirmedRequests(
        outdatedDate,
      );

    for (const request of requests) {
      if (!request.price || !request.providerId) continue;

      const provider = await this.providerRepository.findById(
        request.providerId.toString(),
      );

      if (!provider) continue;

      const settings =
        await this.generalSettingService.getGeneralSettings();

      const cancelFee = Math.round(
        request.price * (settings.providerCancelFee / 100),
      );

      await this.providerRepository.updateById(request.providerId.toString(), {
        providerCancelCount: (provider.providerCancelCount || 0) + 1,

        providerCancelFees: (provider.providerCancelFees || 0) + cancelFee,
        debt: (provider.debt || 0) + cancelFee,
      });

      await this.serviceRequestRepository.updateById(request._id.toString(), {
        status: ServiceStatus.OUTDATED,
        addedToProviderCalendar: false,
        completionCode: null,
      });
    }
  }
}
