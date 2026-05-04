import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestService } from './service-request.service';
export declare class ServiceRequestController {
    private readonly serviceRequestService;
    constructor(serviceRequestService: ServiceRequestService);
    create(dto: CreateServiceRequestDto, req: any): Promise<any>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").ServiceRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").ServiceRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").ServiceRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").ServiceRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    providerAccept(body: {
        id: string;
        price: number;
        endTime: string;
    }, req: any): Promise<any>;
    providerReject(id: string, req: any): Promise<any>;
    customerAccept(id: string, req: any): Promise<any>;
    customerReject(id: string, req: any): Promise<any>;
    customerCancel(id: string, req: any): Promise<any>;
    providerCancel(id: string, req: any): Promise<any>;
    completeService(body: {
        id: string;
        completionCode: string;
    }, req: any): Promise<any>;
    getRequestService(req: any): Promise<void>;
}
