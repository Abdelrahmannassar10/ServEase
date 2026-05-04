import mongoose from 'mongoose';
export declare class Category {
    name: string;
    services: mongoose.Types.ObjectId[];
}
export declare const categorySchema: mongoose.Schema<Category, mongoose.Model<Category, any, any, any, any, any, Category>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Category, mongoose.Document<unknown, {}, Category, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Category & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Category, mongoose.Document<unknown, {}, Category, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Category & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    services?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId[], Category, mongoose.Document<unknown, {}, Category, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Category & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Category>;
export type HCategoryDocument = mongoose.HydratedDocument<Category>;
