import mongoose from 'mongoose';
export declare class Category {
    name: string;
    services: mongoose.Types.ObjectId[];
}
export declare const categorySchema: mongoose.Schema<Category, mongoose.Model<Category, any, any, any, (mongoose.Document<unknown, any, Category, any, mongoose.DefaultSchemaOptions> & Category & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (mongoose.Document<unknown, any, Category, any, mongoose.DefaultSchemaOptions> & Category & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}), any, Category>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Category, mongoose.Document<unknown, {}, Category, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Category & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Category, mongoose.Document<unknown, {}, Category, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Category & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    services?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId[], Category, mongoose.Document<unknown, {}, Category, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Category & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Category>;
export type HCategoryDocument = mongoose.HydratedDocument<Category>;
