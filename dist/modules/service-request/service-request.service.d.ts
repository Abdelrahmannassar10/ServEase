import { Types } from 'mongoose';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestFactoryService } from './factory';
import { ServiceRequestRepository } from '../../models/service-request/service-request.repository';
import { ProviderRepository } from "../../models/index";
export declare class ServiceRequestService {
    private readonly serviceRequestRepository;
    private readonly serviceRequestFactory;
    private readonly providerRepository;
    constructor(serviceRequestRepository: ServiceRequestRepository, serviceRequestFactory: ServiceRequestFactoryService, providerRepository: ProviderRepository);
    create(dto: CreateServiceRequestDto, customerId: Types.ObjectId): Promise<any>;
    private findOneForUser;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    providerAccept(id: string, dto: UpdateServiceRequestDto, providerId: Types.ObjectId): Promise<any>;
    providerReject(id: string, providerId: Types.ObjectId): Promise<any>;
    customerAccept(id: string, customerId: Types.ObjectId): Promise<any>;
    customerReject(id: string, customerId: Types.ObjectId): Promise<any>;
    customerCancel(id: string, customerId: Types.ObjectId): Promise<any>;
    providerCancel(id: string, providerId: Types.ObjectId): Promise<any>;
    completeService(id: string, dto: UpdateServiceRequestDto, customerId: Types.ObjectId): Promise<any>;
    findRequests(user: any): Promise<void>;
}
