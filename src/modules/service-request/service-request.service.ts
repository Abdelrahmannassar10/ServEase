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
import { Role, ServiceStatus } from '../../common/types/enum';
import { ServiceRequestFactoryService } from './factory';
import { ServiceRequestRepository } from '../../models/service-request/service-request.repository';
import { generateCode } from '../../common/helper';
import { ProviderRepository } from '@models/index';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly serviceRequestRepository: ServiceRequestRepository,
    private readonly serviceRequestFactory: ServiceRequestFactoryService,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async create(
    dto: CreateServiceRequestDto,
    customerId: Types.ObjectId,
  ) {
    const duplicate =
    await this.serviceRequestRepository.findDuplicateRequest(
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
    const serviceRequest =
      this.serviceRequestFactory.createServiceRequest(dto, customerId);

    serviceRequest.status = ServiceStatus.WAITING;
    const created =
    await this.serviceRequestRepository.create(serviceRequest);

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
  private async findOneForUser(
  requestId: string,
  userId: Types.ObjectId,
  field: 'customerId' | 'providerId',
) {
  const request = await this.findOne(requestId);

  if (request[field]?.toString() !== userId.toString()) {
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
    const request = await this.serviceRequestRepository.findById(id)
    .populate('providerId', 'firstName lastName userName dob age profileUrl')
    .populate('customerId', 'firstName lastName userName dob age profileUrl');

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    return request;
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

    if (!dto.price || !dto.endTime) {
      throw new BadRequestException(
        'Price and end time are required',
      );
    }
    
  const updated = await this.serviceRequestRepository.updateById(id, {
  providerId,
  price:dto.price,
  endTime:dto.endTime,
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
    const update =await this.serviceRequestRepository.updateById(id, {
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

    const update =await this.serviceRequestRepository.updateById(id, {
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
    const update =await this.serviceRequestRepository.updateById(id, {
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
    const update =await this.serviceRequestRepository.updateById(id, {
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
  const request = await this.findOneForUser(id, providerId, 'providerId');

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

  const provider = await this.providerRepository.findById(request.providerId.toString());

  if (!provider) {
    throw new NotFoundException('Provider not found');
  }

  const cancelFee = Math.round(request.price * 0.2);

  await this.providerRepository.updateById(request.providerId.toString(), {
    providerCancelCount: (provider.providerCancelCount || 0) + 1,
    providerCancelFees: (provider.providerCancelFees || 0) + cancelFee,
  });

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

  return data;
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

  const provider = await this.providerRepository.findById(request.providerId.toString());

  if (!provider) {
    throw new NotFoundException('Provider not found');
  }

  const debtAmount = Math.round(request.price * 0.4);

  await this.providerRepository.updateById(request.providerId.toString(), {
    debt: (provider.debt || 0) + debtAmount,
    providerCancelCount: 0,
  });

  const updated = await this.serviceRequestRepository.updateById(id, {
    status: ServiceStatus.COMPLETED,
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

  return data;
}
async getProviderCalendar(providerId: Types.ObjectId) {
  return this.serviceRequestRepository.findProviderCalendarRequests(
    providerId.toString(),
  );
}

async findRequests(user:any){
  if(user.role === Role.CUSTOMER){
    this.serviceRequestRepository.find({})
  }
}
}
