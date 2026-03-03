import { Document, HydratedDocument } from 'mongoose';
export declare class BlacklistToken {
    token: string;
    expiresAt: Date;
}
export declare const BlacklistTokenSchema: import("mongoose").Schema<BlacklistToken, import("mongoose").Model<BlacklistToken, any, any, any, (Document<unknown, any, BlacklistToken, any, import("mongoose").DefaultSchemaOptions> & BlacklistToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, BlacklistToken, any, import("mongoose").DefaultSchemaOptions> & BlacklistToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, BlacklistToken>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlacklistToken, Document<unknown, {}, BlacklistToken, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BlacklistToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    token?: import("mongoose").SchemaDefinitionProperty<string, BlacklistToken, Document<unknown, {}, BlacklistToken, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BlacklistToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, BlacklistToken, Document<unknown, {}, BlacklistToken, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BlacklistToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, BlacklistToken>;
export type HTokenDocument = HydratedDocument<BlacklistToken>;
