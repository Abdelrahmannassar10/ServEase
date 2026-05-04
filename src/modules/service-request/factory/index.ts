import { CreateServiceRequestDto } from '../dto/create-service-request.dto';
import { ServiceRequest } from '../../../models/service-request/service-request.schema';
import { Types } from 'mongoose';

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

    return request;
  }
}