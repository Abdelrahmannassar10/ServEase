import {
  HydratedDocument,
  Model,
  ProjectionType,
  QueryFilter,
  UpdateQuery,
  DeleteResult,
  QueryOptions as MongooseQueryOptions,
} from 'mongoose';
import {
  QueryOptions,
  PaginationResult,
  AggregationResult,
  SoftDeleteConfig,
} from './repository.types';

/**
 * Abstract repository providing type-safe database operations for Mongoose models
 * Encapsulates query operations (populate, lean, select, sort, pagination)
 * and standardizes CRUD operations across all entity repositories
 */
export class AbstractRepository<T> {
  protected softDeleteConfig: SoftDeleteConfig = {
    isDeletedField: 'isDeleted',
    deletedAtField: 'deletedAt',
    changeCredentialTimestampField: 'changeCredentialTimestamp',
    autoScope: true,
  };

  constructor(protected readonly model: Model<T>) {}

  /* ================= CREATE ================= */

  /**
   * Create a single document
   */
  create(item: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(item);
  }

  /**
   * Create multiple documents at once
   */
  createMany(items: Partial<T>[]): Promise<HydratedDocument<T>[]> {
    return this.model.create(items);
  }

  /* ================= READ ================= */

  /**
   * Find a single document matching filter
   * @param filter Query filter
   * @param options Query options (populate, lean, select, etc.)
   */
  async findOne(
    filter: QueryFilter<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.buildQuery(this.model.findOne(filter), options).exec();
  }

  /**
   * Find a document by ID
   * @param id Document ID
   * @param options Query options (populate, lean, select, etc.)
   */
  async findById(
    id: string,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.buildQuery(this.model.findById(id), options).exec();
  }

  /**
   * Find all documents matching filter
   * Replaces duplicate findAll() method
   * @param filter Query filter
   * @param options Query options (populate, lean, select, sort, skip, limit, etc.)
   */
  async find(
    filter: QueryFilter<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T>[]> {
    return this.buildQuery(this.model.find(filter), options).exec();
  }

  /**
   * Count documents matching filter
   * @param filter Query filter
   */
  count(filter: QueryFilter<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  /**
   * Find documents with pagination support
   * @param filter Query filter
   * @param page Page number (1-indexed)
   * @param limit Documents per page
   * @param options Query options (populate, lean, select, sort, etc.)
   */
  async paginate(
    filter: QueryFilter<T>,
    page: number = 1,
    limit: number = 10,
    options?: Omit<QueryOptions<T>, 'skip' | 'limit'>,
  ): Promise<PaginationResult<T>> {
    const pageNum = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const skip = (pageNum - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.find(filter, {
        ...options,
        skip,
        limit: pageSize,
      }),
      this.count(filter),
    ]);

    const pages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page: pageNum,
      pages,
    };
  }

  /* ================= UPDATE ================= */

  /**
   * Find and update a single document
   * @param filter Query filter
   * @param update Update query
   * @param options Query options
   */
  async findOneAndUpdate(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    const updateOptions: MongooseQueryOptions<T> & {
      includeResultMetadata: false;
    } = {
      new: true,
      includeResultMetadata: false,
    };

    if (options?.session) {
      updateOptions.session = options.session;
    }

    return this.model.findOneAndUpdate(filter, update, updateOptions);
  }

  /**
   * Find by ID and update
   * @param id Document ID
   * @param update Update query
   * @param options Query options
   */
  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    const updateOptions: MongooseQueryOptions<T> & {
      includeResultMetadata: false;
    } = {
      new: true,
      includeResultMetadata: false,
    };

    if (options?.session) {
      updateOptions.session = options.session;
    }

    return this.model.findByIdAndUpdate(id, update, updateOptions);
  }

  /**
   * Update multiple documents
   * @param filter Query filter
   * @param update Update query
   */
  updateMany(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
  ): Promise<{ acknowledged: boolean; modifiedCount: number; upsertedCount: number }> {
    return this.model.updateMany(filter, update);
  }

  /* ================= DELETE ================= */

  /**
   * Hard delete multiple documents
   * @param filter Query filter
   */
  deleteMany(filter: QueryFilter<T>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  /**
   * Soft delete a document by ID
   * Marks document as deleted without removing from database
   */
  async softDeleteById(id: string): Promise<T | null> {
    const updateData: any = {
      [this.softDeleteConfig.isDeletedField || 'isDeleted']: true,
      [this.softDeleteConfig.deletedAtField || 'deletedAt']: new Date(),
      [this.softDeleteConfig.changeCredentialTimestampField ||
        'changeCredentialTimestamp']: new Date(),
    };

    return this.model.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  /**
   * Restore a soft-deleted document by ID
   */
  async restoreById(id: string): Promise<T | null> {
    const updateData: any = {
      [this.softDeleteConfig.isDeletedField || 'isDeleted']: false,
      [this.softDeleteConfig.deletedAtField || 'deletedAt']: null,
    };

    return this.model.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  /**
   * Hard delete a document by ID
   * Permanently removes document from database
   */
  async deleteById(id: string): Promise<DeleteResult> {
    return this.model.deleteOne({ _id: id } as QueryFilter<T>);
  }

  /* ================= AGGREGATE ================= */

  /**
   * Type-safe aggregation pipeline
   * @param pipeline Aggregation pipeline stages
   */
  aggregate<R = AggregationResult>(pipeline: any[]): Promise<R[]> {
    return this.model.aggregate<R>(pipeline);
  }

  /* ================= PRIVATE HELPERS ================= */

  /**
   * Build query with encapsulated options (populate, lean, select, sort, pagination)
   * Ensures soft-deleted records are excluded by default (if autoScope is enabled)
   */
  private buildQuery(query: any, options?: QueryOptions<T>): any {
    if (!options) return query;

    // Handle populate with flexible format
    // Note: select option applies to populated fields
    if (options.populate && Array.isArray(options.populate)) {
      options.populate.forEach((pop) => {
        if (typeof pop === 'string') {
          if (options.select) {
            query = query.populate(pop, options.select);
          } else {
            query = query.populate(pop);
          }
        } else if (typeof pop === 'object' && pop.path) {
          query = query.populate(pop.path, pop.select || options.select);
        }
      });
    }

    // Handle select/projection - only if no populate (avoid conflicts)
    if (options.select && (!options.populate || options.populate.length === 0)) {
      query = query.select(options.select);
    }

    // Handle sort
    if (options.sort) {
      query = query.sort(options.sort);
    }

    // Handle pagination
    if (typeof options.skip === 'number') {
      query = query.skip(options.skip);
    }

    if (typeof options.limit === 'number') {
      query = query.limit(options.limit);
    }

    // Handle lean (raw objects, not Mongoose documents)
    if (options.lean === true) {
      query = query.lean();
    }

    return query;
  }
}
