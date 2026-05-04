import { HydratedDocument, Types } from 'mongoose';
import { ServiceStatus } from '../../common/types/enum';
export declare class ServiceRequest {
    readonly _id: Types.ObjectId;
    customerId: Types.ObjectId;
    providerId: Types.ObjectId;
    governorate: string;
    city: string;
    street: string;
    exactLocation: string;
    serviceNeeded: string;
    dateNeeded: Date;
    startTime: string;
    endTime?: string;
    price?: number;
    status: ServiceStatus;
    completionCode?: string | null;
    addedToProviderCalendar: boolean;
}
export declare const serviceRequestSchema: import("mongoose").Schema<ServiceRequest, import("mongoose").Model<ServiceRequest, any, any, any, (import("mongoose").Document<unknown, any, ServiceRequest, any, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, ServiceRequest, any, import("mongoose").DefaultSchemaOptions> & ServiceRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, ServiceRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    readonly _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    providerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    governorate?: import("mongoose").SchemaDefinitionProperty<string, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    street?: import("mongoose").SchemaDefinitionProperty<string, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    exactLocation?: import("mongoose").SchemaDefinitionProperty<string, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serviceNeeded?: import("mongoose").SchemaDefinitionProperty<string, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dateNeeded?: import("mongoose").SchemaDefinitionProperty<Date, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<string, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number | undefined, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ServiceStatus, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    completionCode?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    addedToProviderCalendar?: import("mongoose").SchemaDefinitionProperty<boolean, ServiceRequest, import("mongoose").Document<unknown, {}, ServiceRequest, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ServiceRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ServiceRequest>;
export type HServiceRequestDocument = HydratedDocument<ServiceRequest>;
