import { CreateServiceRequestDto } from '../dto/create-service-request.dto';
import { ServiceRequest } from '../../../models/service-request/service-request.schema';
import { Types } from 'mongoose';
import { CreateBroadcastRequestDto } from '../dto/create-broadcast-request.dto';
import { LocationScope, PaymentMode, RequestType, ServiceStatus } from '../../../common/types/enum';

export class ServiceRequestFactoryService {

  createServiceRequest(
    dto: CreateServiceRequestDto,
    customerId: Types.ObjectId,
  ): ServiceRequest {

    const request = new ServiceRequest();

    request.customerId = customerId;

    request.governorate = dto.governorate;
    request.city = dto.city;
    request.street = dto.street;
    request.exactLocation = dto.exactLocation;

    request.serviceNeeded = dto.serviceNeeded;
    request.dateNeeded = dto.dateNeeded;
    request.startTime = dto.startTime;
    request.addedToProviderCalendar = false;
    request.customerId = customerId;
    request.providerId = new Types.ObjectId(dto.providerId);

    request.paymentMode = dto.paymentMode ?? PaymentMode.FIXED;
    request.preferredPrice =
      (dto.paymentMode ?? PaymentMode.FIXED) === PaymentMode.FIXED
        ? dto.preferredPrice ?? null
        : null;

    return request;
  }

  createBroadcastServiceRequest(
    dto: CreateBroadcastRequestDto,
    customerId: Types.ObjectId,
  ): Partial<ServiceRequest> {
    return {
      customerId,
      requestType: RequestType.BROADCAST,
      status: ServiceStatus.OPEN,
      governorate: dto.governorate,
      city: dto.city,
      street: dto.street,
      exactLocation: dto.exactLocation,
      serviceNeeded: dto.serviceNeeded,
      dateNeeded: dto.dateNeeded,
      startTime: dto.startTime,
      locationScope: dto.locationScope,
      matchByTopRated: dto.matchByTopRated,
      paymentMode: dto.paymentMode,
      preferredPrice: dto.paymentMode === PaymentMode.FIXED ? dto.preferredPrice ?? null : null,
      addedToProviderCalendar: false,
    } as Partial<ServiceRequest>;
  }
}
