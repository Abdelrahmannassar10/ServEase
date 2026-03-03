import mongoose from 'mongoose';
export declare class Service {
    name: string;
    categoryId: mongoose.Types.ObjectId;
}
export declare const serviceSchema: mongoose.Schema<Service, mongoose.Model<Service, any, any, any, (mongoose.Document<unknown, any, Service, any, mongoose.DefaultSchemaOptions> & Service & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (mongoose.Document<unknown, any, Service, any, mongoose.DefaultSchemaOptions> & Service & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}), any, Service>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Service, mongoose.Document<unknown, {}, Service, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Service & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    categoryId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Service>;
export type HServiceDocument = mongoose.HydratedDocument<Service>;
