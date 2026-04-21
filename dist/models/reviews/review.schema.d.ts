import { ReviewType } from "@common/types/enum";
import { Types } from "mongoose";
export declare class Review {
    readonly id: Types.ObjectId;
    userId: Types.ObjectId;
    customerId: Types.ObjectId;
    ProviderId: Types.ObjectId;
    rate: Number;
    content: string;
    status: ReviewType;
}
export declare const reviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, import("mongoose").Document<unknown, any, Review, any, import("mongoose").DefaultSchemaOptions> & Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, Review>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, {
    readonly id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    customerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    ProviderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    rate?: import("mongoose").SchemaDefinitionProperty<Number, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ReviewType, Review, import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, Review>;
