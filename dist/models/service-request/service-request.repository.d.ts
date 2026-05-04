import { Model, Types } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { ServiceRequest, HServiceRequestDocument } from './service-request.schema';
export declare class ServiceRequestRepository extends AbstractRepository<HServiceRequestDocument> {
    private readonly serviceRequestModel;
    constructor(serviceRequestModel: Model<HServiceRequestDocument>);
    findByCustomerId(customerId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findByProviderId(providerId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findDuplicateRequest(customerId: string | Types.ObjectId, providerId: string | Types.ObjectId, dateNeeded: Date, startTime: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ServiceRequest, {}, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
