import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { CreateBroadcastRequestDto } from './dto/create-broadcast-request.dto';
import { ProviderRespondBroadcastDto, BroadcastResponseAction } from './dto/provider-respond-broadcast.dto';
import { CustomerSelectOfferDto } from './dto/customer-select-offer.dto';
import { CompleteHourlyServiceDto } from './dto/complete-hourly-service.dto';
import { CancelBroadcastRequestDto } from './dto/cancel-broadcast-request.dto';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import {
  OfferStatus,
  PaymentMode,
  ProviderStatus,
  RequestType,
  Role,
  ServiceStatus,
} from '../../common/types/enum';
import { ServiceRequestFactoryService } from './factory';
import { ServiceRequestRepository } from '../../models/service-request/service-request.repository';
import { ProviderOfferRepository } from '../../models/provider-offer/provider-offer.repository';
import { generateCode, safeDecrypt, sendMail } from '../../common/helper';
import { ProviderRepository } from '@models/index';
import { GeneralSettingService } from '@modules/general-setting/general-setting.service';

@Injectable()
export class ServiceRequestService {
  private readonly logger = new Logger(ServiceRequestService.name);

  constructor(
    private readonly serviceRequestRepository: ServiceRequestRepository,
    private readonly serviceRequestFactory: ServiceRequestFactoryService,
    private readonly providerRepository: ProviderRepository,
    private readonly generalSettingService: GeneralSettingService,
    private readonly providerOfferRepository: ProviderOfferRepository,
    private readonly configService: ConfigService,
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

    const providerTimeConflict =
      await this.serviceRequestRepository.findConfirmedProviderTimeConflict(
        new Types.ObjectId(dto.providerId),
        dto.dateNeeded,
        dto.startTime,
      );

    if (providerTimeConflict) {
      throw new ConflictException(
        'You cannot send this request because the provider is busy at this time',
      );
    }

    const serviceRequest = this.serviceRequestFactory.createServiceRequest(
      dto,
      customerId,
    );

    serviceRequest.status = ServiceStatus.WAITING;
    const created = await this.serviceRequestRepository.create(serviceRequest);
    const createdRequest = await this.findOne(created._id.toString());

    await this.notifyDirectRequestCreated(createdRequest);

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

  private async confirmBroadcastRequest(params: {
    request: any;
    offer: any;
    confirmedProviderId: Types.ObjectId;
    price: number | null;
  }) {
    const { request, offer, confirmedProviderId, price } = params;

    const scheduledEndAt = new Date(request.dateNeeded);
    const [hours, minutes] = offer.offeredEndTime.split(':').map(Number);
    scheduledEndAt.setHours(hours, minutes, 0, 0);

    const completionCode = generateCode();

    const updated = await this.serviceRequestRepository.updateById(request._id.toString(), {
      status: ServiceStatus.CONFIRMED,
      providerId: confirmedProviderId,
      price: price ?? null,
      endTime: offer.offeredEndTime,
      scheduledEndAt,
      completionCode,
      addedToProviderCalendar: true,
    });

    await this.providerOfferRepository.expireOtherOffers(
      request._id.toString(),
      confirmedProviderId.toString(),
    );

    // Fetch updated request with provider data populated
    const confirmedRequest = await this.findOne(request._id.toString());
    await this.notifyRequestConfirmed(confirmedRequest);
    const {
      __v,
      isDeleted,
      addedToProviderCalendar: cal,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(confirmedRequest));

    return {
      ...data,
      message: 'Request confirmed successfully',
    };
  }

  async createBroadcastRequest(
    dto: CreateBroadcastRequestDto,
    customerId: Types.ObjectId,
  ) {
    const matchParams = {
      serviceId: dto.serviceId,
      locationScope: dto.locationScope,
      governorate: dto.governorate,
      district: dto.city,
      matchByTopRated: dto.matchByTopRated,
      topRatedMinRating: 4.0,
    };

    const matchedProviders = await this.providerRepository.findMatchingProviders(
      matchParams,
    );

    if (!matchedProviders.length) {
      throw new BadRequestException(
        'No active providers found matching your filters. Try switching from DISTRICT to GOVERNORATE scope, or disable the top-rated filter.',
      );
    }

    const requestData = this.serviceRequestFactory.createBroadcastServiceRequest(
      dto,
      customerId,
    );
    const created = await this.serviceRequestRepository.create(requestData);

    const offerDocs = matchedProviders.map((p) => ({
      serviceRequestId: created._id,
      providerId: p._id,
      status: OfferStatus.PENDING,
    }));
    await this.providerOfferRepository.createMany(offerDocs);
    const createdRequest = await this.findOne(created._id.toString());
    await this.notifyBroadcastRequestCreated(createdRequest, matchedProviders);

    const {
      __v,
      isDeleted,
      completionCode,
      addedToProviderCalendar,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(created));

    return {
      request: { ...data, provider: null },
      notifiedProviders: matchedProviders.length,
    };
  }

  async getAvailableBroadcastRequests(providerId: Types.ObjectId) {
    const pendingOffers = await this.providerOfferRepository.findPendingByProviderId(
      providerId.toString(),
    );

    return pendingOffers
      .filter((offer: any) => offer.serviceRequestId !== null)
      .map((offer: any) => ({
        offerId: offer._id,
        request: JSON.parse(JSON.stringify(offer.serviceRequestId)),
      }));
  }

  async providerRespondToBroadcast(
    dto: ProviderRespondBroadcastDto,
    providerId: Types.ObjectId,
  ) {
    const offer = await this.providerOfferRepository.findByRequestAndProvider(
      dto.requestId,
      providerId.toString(),
    );
    if (!offer) throw new NotFoundException('No offer found for this request');
    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('You have already responded to this request');
    }

    const request = await this.findOne(dto.requestId);
    if (request.status !== ServiceStatus.OPEN) {
      throw new BadRequestException('This request is no longer open for offers');
    }

    const provider = await this.providerRepository.findById(providerId.toString());
    if (!provider) throw new NotFoundException('Provider not found');
    if (provider.adminApproved === ProviderStatus.Banned) {
      throw new BadRequestException('You are banned. Contact the support team.');
    }
    if (provider.adminApproved === ProviderStatus.Stopped) {
      throw new BadRequestException('Your account is stopped. Pay your debt or contact support.');
    }

    if (dto.action === BroadcastResponseAction.REFUSE) {
      await this.providerOfferRepository.updateById(offer._id.toString(), {
        status: OfferStatus.REFUSED,
        respondedAt: new Date(),
      });
      await this.notifyCustomerProviderRefused(request, provider);
      return { message: 'Request refused' };
    }

    if ((request as any).paymentMode === PaymentMode.HOURLY) {
      if (dto.action === BroadcastResponseAction.COUNTER_OFFER) {
        throw new BadRequestException(
          'Counter-offers are not allowed for hourly payment requests',
        );
      }
      if (!provider.hourPrice) {
        throw new BadRequestException(
          'You have not set an hourly rate. Update your profile with hourPrice before accepting hourly requests.',
        );
      }
      await this.providerOfferRepository.updateById(offer._id.toString(), {
        status: OfferStatus.ACCEPTED,
        offeredEndTime: dto.offeredEndTime,
        respondedAt: new Date(),
      });
      return this.confirmBroadcastRequest({
        request,
        offer: { ...JSON.parse(JSON.stringify(offer)), offeredEndTime: dto.offeredEndTime },
        confirmedProviderId: providerId,
        price: null,
      });
    }

    if (dto.action === BroadcastResponseAction.ACCEPT) {
      await this.providerOfferRepository.updateById(offer._id.toString(), {
        status: OfferStatus.ACCEPTED,
        offeredPrice: (request as any).preferredPrice,
        offeredEndTime: dto.offeredEndTime,
        respondedAt: new Date(),
      });
      return this.confirmBroadcastRequest({
        request,
        offer: { ...JSON.parse(JSON.stringify(offer)), offeredEndTime: dto.offeredEndTime },
        confirmedProviderId: providerId,
        price: (request as any).preferredPrice,
      });
    }

    if (dto.action === BroadcastResponseAction.COUNTER_OFFER) {
      if (!dto.offeredPrice) {
        throw new BadRequestException('offeredPrice is required for a counter-offer');
      }
      await this.providerOfferRepository.updateById(offer._id.toString(), {
        status: OfferStatus.COUNTER_OFFER,
        offeredPrice: dto.offeredPrice,
        offeredEndTime: dto.offeredEndTime,
        respondedAt: new Date(),
      });
      await this.notifyCustomerCounterOffer(request, provider, {
        offeredPrice: dto.offeredPrice,
        offeredEndTime: dto.offeredEndTime,
      });
      return {
        message: 'Counter-offer submitted. The customer will be notified to review it.',
      };
    }
  }

  async getOffersSummary(requestId: string, customerId: Types.ObjectId) {
    const request = await this.findOneForUser(requestId, customerId, 'customerId');

    if ((request as any).requestType !== RequestType.BROADCAST) {
      throw new BadRequestException('This is not a broadcast request');
    }

    if (
      request.status === ServiceStatus.CONFIRMED ||
      request.status === ServiceStatus.COMPLETED
    ) {
      throw new BadRequestException('This request has already been confirmed');
    }

    const offers = await this.providerOfferRepository.findActiveByRequestId(requestId);

    const hasDirectAccept = offers.some((o: any) => o.status === OfferStatus.ACCEPTED);

    return {
      requestStatus: request.status,
      selectionRequired: !hasDirectAccept,
      preferredPrice: (request as any).preferredPrice,
      paymentMode: (request as any).paymentMode,
      offers: offers.map((o: any) => {
        const provider = o.providerId;
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
          ...cleanProvider
        } = JSON.parse(JSON.stringify(provider));

        return {
          offerId: o._id,
          provider: cleanProvider,
          offerStatus: o.status,
          offeredPrice: o.offeredPrice,
          offeredEndTime: o.offeredEndTime,
          respondedAt: o.respondedAt,
        };
      }),
    };
  }

  async customerSelectOffer(dto: CustomerSelectOfferDto, customerId: Types.ObjectId) {
    const request = await this.findOneForUser(dto.requestId, customerId, 'customerId');

    if (request.status !== ServiceStatus.OPEN) {
      throw new BadRequestException('Only open requests can have an offer selected manually');
    }

    const offer = await this.providerOfferRepository.findById(dto.offerId);
    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.serviceRequestId.toString() !== dto.requestId) {
      throw new BadRequestException('This offer does not belong to the given request');
    }
    if (offer.status !== OfferStatus.COUNTER_OFFER) {
      throw new BadRequestException('You can only select a counter-offer');
    }

    return this.confirmBroadcastRequest({
      request,
      offer,
      confirmedProviderId: offer.providerId as Types.ObjectId,
      price: offer.offeredPrice ?? null,
    });
  }

  async completeHourlyService(dto: CompleteHourlyServiceDto, customerId: Types.ObjectId) {
    const request = await this.findOneForUser(dto.requestId, customerId, 'customerId');

    if (request.status !== ServiceStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed requests can be completed');
    }
    if ((request as any).paymentMode !== PaymentMode.HOURLY) {
      throw new BadRequestException('Use the standard /complete endpoint for fixed-price requests');
    }
    if (!dto.completionCode || dto.completionCode !== request.completionCode) {
      throw new BadRequestException('Invalid completion code (OTP)');
    }
    if (!request.providerId) {
      throw new BadRequestException('Provider is missing on this request');
    }

    const providerIdValue = this.getId(request.providerId);
    const provider = await this.providerRepository.findById(providerIdValue);
    if (!provider) throw new NotFoundException('Provider not found');
    if (!provider.hourPrice) {
      throw new BadRequestException('Provider does not have an hourly rate set. Contact support.');
    }

    const price = dto.hoursWorked * provider.hourPrice;

    const settings = await this.generalSettingService.getGeneralSettings();
    const debtAmount = Math.round(price * (settings.webCommission / 100));

    provider.debt = (provider.debt || 0) + debtAmount;
    if (provider.debt > settings.providerDebt) {
      provider.adminApproved = ProviderStatus.Stopped;
    }
    provider.providerCancelCount = 0;

    await this.providerRepository.updateById(providerIdValue, provider);
    await this.generalSettingService.updateSettings({
      revenue: settings.revenue + debtAmount,
    });

    const updated = await this.serviceRequestRepository.updateById(dto.requestId, {
      status: ServiceStatus.COMPLETED,
      price,
      hoursWorked: dto.hoursWorked,
      completionCode: null,
      addedToProviderCalendar: false,
    });

    const completed = await this.findOne(dto.requestId);
    await this.notifyRequestCompleted(completed);
    const {
      __v,
      isDeleted,
      addedToProviderCalendar,
      completionCode,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(completed));

    return { ...data };
  }

  async cancelBroadcastRequest(
    dto: CancelBroadcastRequestDto,
    customerId: Types.ObjectId,
  ) {
    const request = await this.findOneForUser(dto.requestId, customerId, 'customerId');

    if ((request as any).requestType !== RequestType.BROADCAST) {
      throw new BadRequestException('This is not a broadcast request');
    }

    if (request.status !== ServiceStatus.OPEN) {
      throw new BadRequestException(
        'Only open broadcast requests can be cancelled. This request has already been confirmed or completed.',
      );
    }

    await this.notifyBroadcastRequestCancelled(request);

    // Expire all pending/counter-offer offers for this request
    await this.providerOfferRepository.expireAllOffers(dto.requestId);

    // Mark the request as cancelled
    await this.serviceRequestRepository.updateById(dto.requestId, {
      status: ServiceStatus.CANCELLED,
    });

    const cancelled = await this.findOne(dto.requestId);
    const {
      __v,
      isDeleted,
      addedToProviderCalendar,
      completionCode,
      createdAt,
      updatedAt,
      ...data
    } = JSON.parse(JSON.stringify(cancelled));

    return {
      ...data,
      provider: null,
      message: 'Broadcast request cancelled successfully. All providers have been notified.',
    };
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

        if (!providerId) {
          return {
            ...serviceData,
            provider: null,
          };
        }

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

          if (!customerId) {
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
              customer: null,
            };
          }

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
      throw new BadRequestException('You are banned, Call the support team');
    }
    if (provider.adminApproved === ProviderStatus.Stopped) {
      throw new BadRequestException(
        'Your account is stopped, Pay your dept or call the support team',
      );
    }

    if (!dto.endTime) {
      throw new BadRequestException('End time is required');
    }

    const paymentMode = (request as any).paymentMode ?? PaymentMode.FIXED;

    if (paymentMode === PaymentMode.FIXED) {
      if (!dto.price) {
        throw new BadRequestException(
          'Price is required for fixed-price requests',
        );
      }
      if (dto.price <= 150) {
        throw new BadRequestException('Price must be greater than 150');
      }
    }

    if (paymentMode === PaymentMode.HOURLY) {
      if (!provider.hourPrice) {
        throw new BadRequestException(
          'You have not set an hourly rate. Update your profile with hourPrice before accepting hourly requests.',
        );
      }
    }

    const date = new Date(request.dateNeeded);
    const [hours, minutes] = dto.endTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    const updatePayload: Record<string, any> = {
      providerId,
      endTime: dto.endTime,
      scheduledEndAt: date,
      status:
        paymentMode === PaymentMode.HOURLY
          ? ServiceStatus.CONFIRMED
          : ServiceStatus.PENDING,
    };

    if (paymentMode === PaymentMode.HOURLY) {
      updatePayload.completionCode = generateCode();
      updatePayload.addedToProviderCalendar = true;
    }

    if (paymentMode === PaymentMode.FIXED) {
      updatePayload.price = dto.price;
    }

    const updated = await this.serviceRequestRepository.updateById(id, updatePayload);
    const latestRequest = await this.findOne(id);

    await this.notifyCustomerProviderAccepted(latestRequest);

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
    const latestRequest = await this.findOne(id);

    await this.notifyCustomerProviderRejected(latestRequest);

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
    const latestRequest = await this.findOne(id);

    await this.notifyRequestConfirmed(latestRequest);

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
    const latestRequest = await this.findOne(id);

    await this.notifyProviderCustomerRejected(latestRequest);

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
    const latestRequest = await this.findOne(id);

    await this.notifyProviderCustomerCancelled(latestRequest);

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
    const request = await this.findOneForUser(id, providerId, 'providerId');

    if (request.status !== ServiceStatus.CONFIRMED) {
      throw new BadRequestException(
        'Provider can only cancel confirmed service',
      );
    }

    if (!request.providerId) {
      throw new BadRequestException('Provider is missing');
    }

    const providerIdValue = this.getId(request.providerId);
    const provider = await this.providerRepository.findById(providerIdValue);

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const paymentMode = (request as any).paymentMode ?? PaymentMode.FIXED;

    if (paymentMode === PaymentMode.HOURLY) {
      const updated = await this.serviceRequestRepository.updateById(id, {
        status: ServiceStatus.REFUSED,
        addedToProviderCalendar: false,
        completionCode: null,
      });
      const latestRequest = await this.findOne(id);

      await this.notifyCustomerProviderCancelled(latestRequest);

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

    if (!request.price) {
      throw new BadRequestException(
        'Cannot calculate cancel fee because price is missing',
      );
    }

    const settings = await this.generalSettingService.getGeneralSettings();

    const cancelFee = Math.round(
      request.price * (settings.providerCancelFee / 100),
    );

    if (
      (provider.providerCancelFees || 0) + cancelFee >=
        settings.providerCancelFee ||
      (provider.providerCancelCount || 0) + 1 >= settings.providerCancelCount
    ) {
      provider.adminApproved = ProviderStatus.Banned;
    }

    provider.providerCancelCount = (provider.providerCancelCount || 0) + 1;
    provider.providerCancelFees =
      (provider.providerCancelFees || 0) + cancelFee;
    provider.debt = (provider.debt || 0) + cancelFee;

    await this.providerRepository.updateById(providerIdValue, provider);

    const updated = await this.serviceRequestRepository.updateById(id, {
      status: ServiceStatus.REFUSED,
      addedToProviderCalendar: false,
      completionCode: null,
    });
    const latestRequest = await this.findOne(id);

    await this.notifyCustomerProviderCancelled(latestRequest);

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
    const request = await this.findOneForUser(id, customerId, 'customerId');

    if (request.status !== ServiceStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed service can be completed');
    }

    if (!dto.completionCode) {
      throw new BadRequestException('Completion code is required');
    }

    if (dto.completionCode !== request.completionCode) {
      throw new BadRequestException('Invalid completion code');
    }

    if ((request as any).paymentMode === PaymentMode.HOURLY) {
      throw new BadRequestException(
        'This is an hourly-rate request. Use PATCH /service-requests/complete-hourly instead.',
      );
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

    const provider = await this.providerRepository.findById(providerIdValue);

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const settings = await this.generalSettingService.getGeneralSettings();

    const debtAmount = Math.round(
      request.price * (settings.webCommission / 100),
    );

    provider.debt = (provider.debt || 0) + debtAmount;

    if (provider.debt > settings.providerDebt) {
      provider.adminApproved = ProviderStatus.Stopped;
    }

    provider.providerCancelCount = 0;

    await this.providerRepository.updateById(providerIdValue, provider);

    await this.generalSettingService.updateSettings({
      revenue: settings.revenue + debtAmount,
    });

    const updated = await this.serviceRequestRepository.updateById(id, {
      status: ServiceStatus.COMPLETED,
      completionCode: null,
      addedToProviderCalendar: false,
    });
    const latestRequest = await this.findOne(id);

    await this.notifyRequestCompleted(latestRequest);

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

  private getTemplates(): any {
    return this.configService.get('EMAIL_TEMPLATES') ?? {};
  }

  private userName(user: any, fallback: string): string {
    if (!user) return fallback;
    const firstName = user.firstName ?? '';
    const lastName = user.lastName ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.userName || fallback;
  }

  private requestDetails(request: any, extra: Record<string, unknown> = {}) {
    return {
      serviceNeeded: request.serviceNeeded,
      dateNeeded: request.dateNeeded,
      startTime: request.startTime,
      endTime: request.endTime,
      governorate: request.governorate,
      city: request.city,
      street: request.street,
      exactLocation: request.exactLocation,
      paymentMode: request.paymentMode,
      preferredPrice: request.preferredPrice,
      price: request.price,
      completionCode: request.completionCode,
      ...extra,
    };
  }

  private async sendRequestNotification(
    to: string | undefined,
    template: any,
    ...bodyArgs: unknown[]
  ) {
    if (!to || !template?.subject || typeof template.body !== 'function') return;

    try {
      await sendMail({
        to,
        subject: template.subject,
        html: template.body(...bodyArgs),
      });
    } catch (error) {
      this.logger.warn(
        `Email notification failed for ${to}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private async notifyDirectRequestCreated(request: any) {
    const templates = this.getTemplates();
    const provider = request.providerId;
    const customer = request.customerId;

    await this.sendRequestNotification(
      provider?.email,
      templates.directRequestCreatedProvider,
      this.userName(provider, 'Provider'),
      this.userName(customer, 'Customer'),
      this.requestDetails(request),
    );
  }

  private async notifyBroadcastRequestCreated(
    request: any,
    providers: { _id: Types.ObjectId }[],
  ) {
    const templates = this.getTemplates();
    const customer = request.customerId;

    await Promise.all(
      providers.map(async (providerRef) => {
        const provider = await this.providerRepository.findById(
          providerRef._id.toString(),
        );

        await this.sendRequestNotification(
          provider?.email,
          templates.broadcastRequestCreatedProvider,
          this.userName(provider, 'Provider'),
          this.userName(customer, 'Customer'),
          this.requestDetails(request),
        );
      }),
    );
  }

  private async notifyCustomerProviderAccepted(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;

    await this.sendRequestNotification(
      customer?.email,
      templates.providerAcceptedRequestCustomer,
      this.userName(customer, 'Customer'),
      this.userName(provider, 'Provider'),
      this.requestDetails(request),
    );
  }

  private async notifyCustomerProviderRejected(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;

    await this.sendRequestNotification(
      customer?.email,
      templates.providerRejectedRequestCustomer,
      this.userName(customer, 'Customer'),
      this.userName(provider, 'Provider'),
      this.requestDetails(request),
    );
  }

  private async notifyCustomerProviderRefused(request: any, provider: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;

    await this.sendRequestNotification(
      customer?.email,
      templates.providerRejectedRequestCustomer,
      this.userName(customer, 'Customer'),
      this.userName(provider, 'Provider'),
      this.requestDetails(request),
    );
  }

  private async notifyCustomerCounterOffer(
    request: any,
    provider: any,
    offer: { offeredPrice?: number; offeredEndTime?: string },
  ) {
    const templates = this.getTemplates();
    const customer = request.customerId;

    await this.sendRequestNotification(
      customer?.email,
      templates.providerCounterOfferCustomer,
      this.userName(customer, 'Customer'),
      this.userName(provider, 'Provider'),
      this.requestDetails(request, offer),
    );
  }

  private async notifyRequestConfirmed(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;
    const details = this.requestDetails(request);

    await Promise.all([
      this.sendRequestNotification(
        customer?.email,
        templates.requestConfirmedCustomer,
        this.userName(customer, 'Customer'),
        this.userName(provider, 'Provider'),
        details,
      ),
      this.sendRequestNotification(
        provider?.email,
        templates.requestConfirmedProvider,
        this.userName(provider, 'Provider'),
        this.userName(customer, 'Customer'),
        details,
      ),
    ]);
  }

  private async notifyProviderCustomerRejected(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;

    await this.sendRequestNotification(
      provider?.email,
      templates.customerRejectedOfferProvider,
      this.userName(provider, 'Provider'),
      this.userName(customer, 'Customer'),
      this.requestDetails(request),
    );
  }

  private async notifyProviderCustomerCancelled(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;

    await this.sendRequestNotification(
      provider?.email,
      templates.customerCancelledRequestProvider,
      this.userName(provider, 'Provider'),
      this.userName(customer, 'Customer'),
      this.requestDetails(request),
    );
  }

  private async notifyCustomerProviderCancelled(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;

    await this.sendRequestNotification(
      customer?.email,
      templates.providerCancelledRequestCustomer,
      this.userName(customer, 'Customer'),
      this.userName(provider, 'Provider'),
      this.requestDetails(request),
    );
  }

  private async notifyBroadcastRequestCancelled(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const offers = await this.providerOfferRepository.findActiveByRequestId(
      request._id.toString(),
    );

    await Promise.all(
      offers.map((offer: any) =>
        this.sendRequestNotification(
          offer.providerId?.email,
          templates.broadcastRequestCancelledProvider,
          this.userName(offer.providerId, 'Provider'),
          this.userName(customer, 'Customer'),
          this.requestDetails(request),
        ),
      ),
    );
  }

  private async notifyRequestCompleted(request: any) {
    const templates = this.getTemplates();
    const customer = request.customerId;
    const provider = request.providerId;
    const details = this.requestDetails(request);

    await Promise.all([
      this.sendRequestNotification(
        customer?.email,
        templates.requestCompletedCustomer,
        this.userName(customer, 'Customer'),
        this.userName(provider, 'Provider'),
        details,
      ),
      this.sendRequestNotification(
        provider?.email,
        templates.requestCompletedProvider,
        this.userName(provider, 'Provider'),
        this.userName(customer, 'Customer'),
        details,
      ),
    ]);
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

      if (!providerId) {
        return {
          ...serviceData,
          provider: null,
        };
      }

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
      if (!request.providerId) continue;

      if ((request as any).paymentMode === PaymentMode.HOURLY) {
        await this.serviceRequestRepository.updateById(request._id.toString(), {
          status: ServiceStatus.OUTDATED,
          addedToProviderCalendar: false,
          completionCode: null,
        });
        continue;
      }

      if (!request.price) continue;

      const provider = await this.providerRepository.findById(
        request.providerId.toString(),
      );

      if (!provider) continue;

      const settings = await this.generalSettingService.getGeneralSettings();

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
