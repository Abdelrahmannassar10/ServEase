# Plan: Repository Layer Refactoring & Optimization

**TL;DR:** Your repository pattern is solid as a base, but has 8-10 optimization opportunities. Main issues: missing type safety on methods, no encapsulation of populate/lean chains, duplicate methods (find/findAll), no pagination support, hardcoded soft-delete fields, and inconsistent service usage patterns. The refactoring spans 5 phases focusing on type safety, query encapsulation, missing features, error handling, and consistency across services.

---

## Current Issues Identified

| Issue                             | Impact                                        | Severity   |
| --------------------------------- | --------------------------------------------- | ---------- |
| No explicit return types          | Type inference errors, harder debugging       | Medium     |
| Populate/lean chained in services | Breaks repository abstraction, tight coupling | High       |
| Duplicate find/findAll methods    | Code confusion, maintenance debt              | Low        |
| Hardcoded soft delete fields      | Can't customize per entity                    | Medium     |
| No pagination support             | Inefficient for large datasets                | Medium     |
| Weak typing on aggregate()        | Type safety lost                              | Medium     |
| Missing batch operations          | Performance issues with bulk writes           | Medium     |
| No query builder pattern          | Complex queries leak into services            | Low-Medium |

---

## Refactoring Phases

### Phase 1: Type Safety & Consolidation

1. **Add explicit return type annotations:**
   - `Promise<HydratedDocument<T> | null>` for single document returns
   - `Promise<HydratedDocument<T>[]>` for array returns
   - `Promise<DeleteResult>` for delete operations
   - `Promise<AggregationResult<T>[]>` for aggregations

2. **Create `src/models/types/repository.types.ts`** for shared type definitions

3. **Remove duplicate `findAll()` method** (keep only `find()`)

4. **Update 8 service files** to use `find()` instead of `findAll()`

### Phase 2: Encapsulate Query Operations

1. **Extend query option signatures:**
   - `find(filter, options?: { populate?: string[], lean?: boolean, select?: string[], sort?: any, skip?: number, limit?: number })`
   - `findOne(filter, options?: { populate?: string[], lean?: boolean, select?: string[] })`
   - `findById(id, options?: { populate?: string[], lean?: boolean, select?: string[] })`

2. **Remove direct Mongoose query chains from services**
   - Move all `.populate()` calls into repository method options
   - Move all `.lean()` calls into repository method options
   - Replace 8 occurrences scattered across service files

### Phase 3: Add Missing Features

1. **Add `paginate()` method:**
   - `paginate(filter, page: number, limit: number, options?)`
   - Returns: `{ data: HydratedDocument<T>[], total: number, page: number, pages: number }`

2. **Add batch operations:**
   - `createMany(items: Partial<T>[]): Promise<HydratedDocument<T>[]>`
   - Refactor `updateMany()` for better consistency

3. **Improve soft delete implementation:**
   - Make field names configurable (isDeleted, deletedAt, changeCredentialTimestamp)
   - Add auto-scoping: all find operations exclude soft-deleted by default (add option to include them)
   - Add `includeDeleted` flag to find methods

4. **Type-safe aggregation:**
   - Replace `aggregate(pipeline: any[])` with `aggregate<R>(pipeline: any[]): Promise<R[]>`
   - Create helper methods for common aggregation patterns (count, stats, etc.)

### Phase 4: Error Handling & Validation

1. **Add existence validation:**
   - Before delete operations, verify entity exists
   - Throw meaningful error messages instead of silently returning null

2. **Add duplicate prevention:**
   - Check unique constraints on create operations (email, username, etc.)
   - Leverage schema-level validation but wrap with readable errors

3. **Improve error messages:**
   - Wrap Mongoose validation errors
   - Add context to error responses (entity type, operation, filter)

### Phase 5: Documentation & Consistency

1. **Audit all 8 service files** for consistent repository usage:
   - admin.service.ts
   - auth.service.ts
   - common.service.ts
   - customer.service.ts
   - provider.service.ts
   - service.service.ts
   - service-request.service.ts
   - review.service.ts

2. **Replace all ad-hoc patterns** with standardized repository methods

3. **Add JSDoc documentation** with usage examples

---

## Key Implementation Details

### New Type Definitions (repository.types.ts)

```typescript
// Query options that services will pass to repository methods
interface QueryOptions<T> {
  populate?: string[];
  lean?: boolean;
  select?: string[];
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  session?: any; // For transaction support future
}

interface PaginationResult<T> {
  data: HydratedDocument<T>[];
  total: number;
  page: number;
  pages: number;
}

interface AggregationResult<T> {
  // Generic type for aggregate results
}

// Soft delete options (configurable per entity)
interface SoftDeleteConfig {
  isDeletedField: string;
  deletedAtField: string;
  autoScope: boolean; // Auto-exclude soft-deleted in find operations
}
```

### Method Signature Examples

**Before:**

```typescript
// In service
const request = await this.serviceRequestRepository
  .findById(id)
  .populate('providerId', 'firstName lastName userName dob age profileUrl')
  .populate('customerId', 'firstName lastName userName dob age profileUrl');
```

**After:**

```typescript
// In service
const request = await this.serviceRequestRepository.findById(id, {
  populate: ['providerId', 'customerId'],
  select: 'firstName lastName userName dob age profileUrl',
});
```

---

## Files to Modify

| File                                                         | Changes                                                        | Priority |
| ------------------------------------------------------------ | -------------------------------------------------------------- | -------- |
| `src/models/abstract.repository.ts`                          | Main refactoring: add types, consolidate methods, new features | P0       |
| `src/models/types/repository.types.ts`                       | New file: type definitions                                     | P0       |
| `src/models/admin/admin.repository.ts`                       | Minimal (just extend new abstract)                             | P2       |
| `src/models/common/user.repository.ts`                       | Minimal (just extend new abstract)                             | P2       |
| `src/models/customer/customer.repository.ts`                 | Minimal (just extend new abstract)                             | P2       |
| `src/models/provider/provider.repository.ts`                 | Minimal (just extend new abstract)                             | P2       |
| `src/models/service/service.repository.ts`                   | Minimal (just extend new abstract)                             | P2       |
| `src/models/reviews/reviews.repository.ts`                   | Minimal (just extend new abstract)                             | P2       |
| `src/models/token/token.repository.ts`                       | Minimal (just extend new abstract)                             | P2       |
| `src/models/general-settings/general-settings.repository.ts` | Minimal (just extend new abstract)                             | P2       |
| `src/modules/admin/admin.service.ts`                         | Update repository calls                                        | P1       |
| `src/modules/auth/auth.service.ts`                           | Update repository calls                                        | P1       |
| `src/modules/common/common.service.ts`                       | Update repository calls                                        | P1       |
| `src/modules/customer/customer.service.ts`                   | Update repository calls                                        | P1       |
| `src/modules/provider/provider.service.ts`                   | Update repository calls                                        | P1       |
| `src/modules/service/service.service.ts`                     | Update repository calls                                        | P1       |
| `src/modules/service-request/service-request.service.ts`     | Move `.populate()` to repo options                             | P1       |
| `src/modules/review/review.service.ts`                       | Move `.populate()` to repo options, type aggregate             | P1       |

---

## Verification Strategy

1. **Type Safety:**
   - Run `tsc --strict` with 0 errors
   - No implicit `any` types in repository methods

2. **Service Integration:**
   - All services use new repository method signatures
   - No direct `.populate()` or `.lean()` chaining in services
   - No hardcoded field names in service-level query logic

3. **Functional Testing:**
   - CRUD operations: create, find, findOne, findById, update, delete
   - Pagination: paginate() returns correct data + metadata
   - Soft deletes: entities excluded by default, included when flagged
   - Populate: relationships populated correctly with select options
   - Aggregations: type-safe results, common patterns work

4. **Performance:**
   - Verify no N+1 queries
   - Lean() removes unnecessary fields
   - Indexes working as expected

---

## Rollout Strategy

1. **Phase 1:** Implement abstract repository changes + types (can work in isolation)
2. **Phase 2:** Update one service at a time, test each independently
3. **Phase 3:** Add pagination + batch operations, test with small datasets
4. **Phase 4:** Add soft delete scoping, test backward compatibility
5. **Phase 5:** Full integration testing, update documentation

---

## Key Decisions & Rationale

| Decision                          | Rationale                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| Encapsulate populate/lean in repo | Reduces tight coupling to Mongoose, easier to swap DBs later                          |
| Remove findAll() method           | Redundant duplicate, search-and-replace friendly migration                            |
| Auto-scope soft deletes           | Prevents accidental exposure of deleted data, explicit include flag maintains control |
| Generic aggregate<R>()            | Prevents type loss, enables better IDE autocomplete                                   |
| Optional options in methods       | Backward compatible, existing calls still work                                        |

---

## Out of Scope (Deliberately)

- Database indexing strategy (schema-level concern)
- Query performance optimization / caching (Redis layer)
- Archiving strategy (separate from soft deletes, future phase)
- Transaction support (would require connection pooling refactor)
- Multi-tenancy support (larger architectural change)

---

## Success Metrics

- ✅ All 18 modified files pass TypeScript strict mode
- ✅ All 8 service files use standardized repository patterns
- ✅ No `.populate()` or `.lean()` calls in services
- ✅ Pagination works without page 0 off-by-one errors
- ✅ Soft delete defaults prevent data leaks
- ✅ E2E tests pass with new repository signatures
- ✅ Performance benchmarks show no regression
