import { HydratedDocument, ProjectionType } from 'mongoose';

/**
 * Query options for repository methods
 * Encapsulates populate, lean, select, sort, and pagination options
 */
export interface QueryOptions<T> {
  /** Relations to populate */
  populate?: (string | { path: string; select?: string })[];
  /** Exclude all non-specified fields (Mongoose lean for raw objects) */
  lean?: boolean;
  /** Field projection/selection */
  select?: string | ProjectionType<T>;
  /** Sort options */
  sort?: Record<string, 1 | -1>;
  /** Number of documents to skip (for pagination) */
  skip?: number;
  /** Maximum number of documents to return */
  limit?: number;
  /** Session for transaction support (future use) */
  session?: any;
  /** Include soft-deleted records (default: false) */
  includeDeleted?: boolean;
}

/**
 * Pagination result wrapper
 */
export interface PaginationResult<T> {
  /** Array of documents */
  data: HydratedDocument<T>[];
  /** Total number of documents matching filter (ignoring pagination) */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Total number of pages */
  pages: number;
}

/**
 * Generic aggregation result (flexible for any aggregation output)
 */
export interface AggregationResult<T = any> {
  [key: string]: any;
}

/**
 * Soft delete configuration per entity
 */
export interface SoftDeleteConfig {
  /** Field name for soft delete flag (e.g., 'isDeleted') */
  isDeletedField?: string;
  /** Field name for deletion timestamp (e.g., 'deletedAt') */
  deletedAtField?: string;
  /** Field name for credential change timestamp (e.g., 'changeCredentialTimestamp') */
  changeCredentialTimestampField?: string;
  /** Automatically exclude soft-deleted records in find operations */
  autoScope?: boolean;
}
