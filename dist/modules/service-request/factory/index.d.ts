import { CreateServiceRequestDto } from '../dto/create-service-request.dto';
import { ServiceRequest } from '../../../models/service-request/service-request.schema';
import { Types } from 'mongoose';
export declare class ServiceRequestFactoryService {
    createServiceRequest(dto: CreateServiceRequestDto, customerId: Types.ObjectId): ServiceRequest;
}
