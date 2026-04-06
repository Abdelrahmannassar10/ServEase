import { HydratedDocument, Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery, DeleteResult } from 'mongoose';
export declare class AbstractRepository<T> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    create(item: Partial<T>): Promise<HydratedDocument<T>>;
    findOne(filter: QueryFilter<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): import("mongoose").Query<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "findOne", {}>;
    findById(id: string, projection?: ProjectionType<T>, options?: QueryOptions<T>): import("mongoose").Query<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "findOne", {}>;
    find(filter: QueryFilter<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): import("mongoose").Query<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>[], import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "find", {}>;
    findAll(filter: QueryFilter<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): import("mongoose").Query<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>[], import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "find", {}>;
    count(filter: QueryFilter<T>): import("mongoose").Query<number, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "countDocuments", {}>;
    findOneAndUpdate(filter: QueryFilter<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): import("mongoose").Query<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "findOneAndUpdate", {}>;
    updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): import("mongoose").Query<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "findOneAndUpdate", {}>;
    updateMany(filter: QueryFilter<T>, update: UpdateQuery<T>): import("mongoose").Query<import("mongoose").UpdateWriteOpResult, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>, {}, T, "updateMany", {}>;
    deleteMany(filter: QueryFilter<T>): Promise<DeleteResult>;
    softDeleteById(id: string): Promise<HydratedDocument<T> | null>;
    restoreById(id: string): Promise<HydratedDocument<T> | null>;
}
