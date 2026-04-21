import { Role } from '@common/types/enum';
import { HydratedDocument, Types } from 'mongoose';
export declare class Admin {
    readonly _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    otp: string;
    otpExpiry: Date;
    role: Role;
    isDeleted: boolean;
    deletedAt: Date;
}
export declare const adminSchema: import("mongoose").Schema<Admin, import("mongoose").Model<Admin, any, any, any, (import("mongoose").Document<unknown, any, Admin, any, import("mongoose").DefaultSchemaOptions> & Admin & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Admin, any, import("mongoose").DefaultSchemaOptions> & Admin & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Admin>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Admin, import("mongoose").Document<unknown, {}, Admin, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    readonly _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userName?: import("mongoose").SchemaDefinitionProperty<string, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otp?: import("mongoose").SchemaDefinitionProperty<string, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otpExpiry?: import("mongoose").SchemaDefinitionProperty<Date, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<Role, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDeleted?: import("mongoose").SchemaDefinitionProperty<boolean, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date, Admin, import("mongoose").Document<unknown, {}, Admin, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Admin>;
export type HAdminDocument = HydratedDocument<Admin>;
