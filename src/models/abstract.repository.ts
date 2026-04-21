import {
  HydratedDocument,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
  DeleteResult,
} from 'mongoose';

export class AbstractRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  create(item: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(item);
  }
  /* ================= READ ================= */

  findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOne(filter, projection, options);
  }

  findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findById(id, projection, options);
  }

  find(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.find(
      {
        ...filter,
      },
      projection,
      options,
    );
  }
  findAll(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.find(
      filter,
      projection,
      options,
    );
  }
  count(filter: QueryFilter<T>) {
    return this.model.countDocuments(filter);
  }

  /* ================= UPDATE ================= */

  findOneAndUpdate(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      ...options,
    });
  }

  updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      ...options,
    });
  }

  updateMany(filter: QueryFilter<T>, update: UpdateQuery<T>) {
    return this.model.updateMany(filter, update);
  }


  /* ================= DELETE ================= */
  deleteMany(filter: QueryFilter<T>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  async softDeleteById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          changeCredentialTimestamp: new Date(),
        },
      },
      { new: true },
    );
  }
  async restoreById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
        },
      },
      { new: true },
    );
  }
}
