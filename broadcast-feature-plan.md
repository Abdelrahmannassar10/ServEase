# Broadcast Service Request — Complete Implementation Plan (Revised)

---

## Part 0 — Project Understanding

### Existing Architecture

**Stack:** NestJS + TypeScript + MongoDB (Mongoose) + JWT Auth  
**Roles:** `Customer`, `Provider`, `Admin`  
**Pattern:** `AbstractRepository` → `FactoryService` → `Service` → `Controller`

**`AbstractRepository` already provides:** `create`, `createMany`, `findById`, `findOne`, `find`,
`updateById`, `updateMany`, `deleteById`, `deleteMany`, `softDeleteById`, `paginate`, `aggregate`.

### Existing Direct-Request Flow (untouched)
```
Customer picks ONE Provider
 └─ POST /service-requests  →  ServiceRequest { status: WAITING, providerId }
Provider responds
 └─ PATCH provider-accept   →  { status: PENDING, price, endTime, scheduledEndAt }
 └─ PATCH provider-reject   →  { status: REFUSED }
Customer responds
 └─ PATCH customer-accept   →  { status: CONFIRMED, completionCode }
 └─ PATCH customer-reject   →  { status: REFUSED }
Customer completes
 └─ PATCH complete          →  { status: COMPLETED }, provider.debt += commission
Cron (every hour)
 └─ scheduledEndAt < now    →  { status: OUTDATED }, provider gets cancel fee
```

### Enum Naming Convention (important to understand)
| Enum name | Represents | Example values |
|-----------|-----------|----------------|
| `City` | Governorate level (محافظة) | `Cairo`, `Giza`, `Alexandria` |
| `state` | District/area level (حي) | `Nasr City`, `Maadi`, `Zamalek` |

**Provider schema uses them as:** `provider.city: City` (governorate) and `provider.state: state` (district).  
**ServiceRequest schema currently uses plain strings** — these must be updated to use the same enums.

---

## Part 1 — What Changes and Why

### Changes requested
| # | Requirement | Impact |
|---|------------|--------|
| 1 | `hourPrice` updatable via existing `updateProfile` | Add field to `UpdateProviderDto` only — no new endpoint |
| 2 | City/state enums on existing ServiceRequest | Update schema + `CreateServiceRequestDto` |
| 3 | `ProviderOffer.providerId` ref to `Provider.name` | Match existing `ServiceRequest.providerId` style |
| 4 | `offeredEndTime` on offers + respond DTO | Keeps `endTime`, `scheduledEndAt`, calendar, and cron complete |
| 5 | Full broadcast feature | New schema, repository, DTOs, service methods, endpoints |

### Broadcast — New Flow Diagram
```
POST /service-requests/broadcast  (Customer)
 └─ Find all Active providers matching: service + locationScope + (optional) top-rated
 └─ Create ONE ServiceRequest { status: OPEN, requestType: BROADCAST }
 └─ Create N ProviderOffer { status: PENDING } — one per matched provider

GET /service-requests/broadcast/available  (Provider)
 └─ Returns all PENDING ProviderOffers where the linked request is still OPEN

POST /service-requests/broadcast/respond  (Provider)
 ├─ REFUSE      → ProviderOffer { status: REFUSED }
 ├─ ACCEPT      → ProviderOffer { status: ACCEPTED, offeredPrice, offeredEndTime }
 │                → if preferredPrice matches: AUTO-CONFIRM (see below)
 │                → if HOURLY: AUTO-CONFIRM regardless of price
 └─ COUNTER_OFFER → ProviderOffer { status: COUNTER_OFFER, offeredPrice, offeredEndTime }

── AUTO-CONFIRM ──
 ServiceRequest { status: CONFIRMED, providerId, price, endTime, scheduledEndAt, completionCode }
 All other ProviderOffers → { status: EXPIRED }

GET /service-requests/:id/offers  (Customer)
 └─ Shows all non-REFUSED, non-EXPIRED offers if request is still OPEN
    (visible when no provider accepted at preferredPrice → customer can choose)

PATCH /service-requests/select-offer  (Customer)
 └─ Customer selects a COUNTER_OFFER → AUTO-CONFIRM with that offer's price/endTime

PATCH /service-requests/complete-hourly  (Customer)
 └─ OTP + hoursWorked → price = hoursWorked × provider.hourPrice → COMPLETED
```

---

## Part 2 — File Map

### New Files (create from scratch)
```
src/models/provider-offer/provider-offer.schema.ts
src/models/provider-offer/provider-offer.repository.ts
src/modules/service-request/dto/create-broadcast-request.dto.ts
src/modules/service-request/dto/provider-respond-broadcast.dto.ts
src/modules/service-request/dto/customer-select-offer.dto.ts
src/modules/service-request/dto/complete-hourly-service.dto.ts
```

### Modified Files (all changes described per step)
```
src/common/types/enum/index.ts
src/models/provider/provider.schema.ts
src/models/provider/provider.repository.ts
src/models/service-request/service-request.schema.ts
src/models/service-request/service-request.repository.ts
src/models/index.ts
src/modules/provider/dto/update-provider.dto.ts
src/modules/service-request/dto/create-service-request.dto.ts
src/modules/service-request/factory/index.ts
src/modules/service-request/service-request.service.ts
src/modules/service-request/service-request.controller.ts
src/modules/service-request/service-request.module.ts
```

---

## Part 3 — Step-by-Step Implementation

---

### STEP 1 — Enums
**File:** `src/common/types/enum/index.ts`

**Append at the bottom of the file (after existing `ProviderStatus`):**

```typescript
// ── Broadcast Feature ────────────────────────────────────────────────────────

export enum RequestType {
  DIRECT    = 'DIRECT',     // existing: customer targets one provider
  BROADCAST = 'BROADCAST',  // new: open request sent to multiple providers
}

export enum PaymentMode {
  FIXED  = 'FIXED',   // customer sets preferredPrice; provider negotiates
  HOURLY = 'HOURLY',  // price = hoursWorked × provider.hourPrice at completion
}

export enum LocationScope {
  GOVERNORATE = 'GOVERNORATE', // match providers in same governorate (provider.city)
  DISTRICT    = 'DISTRICT',    // match providers in same district (provider.state)
}

export enum OfferStatus {
  PENDING       = 'PENDING',        // provider has not responded yet
  ACCEPTED      = 'ACCEPTED',       // provider agreed (at preferredPrice or HOURLY)
  COUNTER_OFFER = 'COUNTER_OFFER',  // provider proposed different price
  REFUSED       = 'REFUSED',        // provider declined
  EXPIRED       = 'EXPIRED',        // another provider was confirmed first
}
```

**Also add two values to the existing `ServiceStatus` enum:**

```typescript
// inside the existing ServiceStatus enum — add after OUTDATED:
OPEN              = 'OPEN',               // broadcast request live, awaiting responses
PENDING_SELECTION = 'PENDING_SELECTION',  // (informational) used in getOffersSummary response
```

> **Note on `PENDING_SELECTION`:** This is not persisted as a DB status. The ServiceRequest stays `OPEN`
> until either auto-confirmed or manually confirmed. The value is returned in the `getOffersSummary`
> response payload to tell the frontend that no provider has accepted at preferredPrice yet and the
> customer should choose from counter-offers.

---

### STEP 2 — Provider Schema
**File:** `src/models/provider/provider.schema.ts`

**Add one field inside the `Provider` class (after `reviewsCount`):**

```typescript
@Prop({ type: Number, default: null, min: 0 })
hourPrice?: number;   // provider's hourly rate in EGP — used only for HOURLY broadcast requests
```

> This field is picked up automatically by the existing `updateProfile()` method
> because it spreads `...updateProviderDto` into the update payload. No service
> or controller changes needed for the provider module.

---

### STEP 3 — Update `UpdateProviderDto`
**File:** `src/modules/provider/dto/update-provider.dto.ts`

**Add this field inside the class (e.g. after `specialization`):**

```typescript
@IsOptional()
@IsNumber()
@Min(0)
hourPrice?: number;
```

**Also add `@IsOptional()` to `gender` if not already present, since it is currently not optional:**

```typescript
// Existing field — add @IsOptional()
@IsOptional()
@IsString()
@IsNotEmpty()
@IsEnum(Gender)
gender?: Gender;
```

> After this step, `POST /provider/profile` accepts `hourPrice` in the body and persists it.
> No new endpoint is needed.

---

### STEP 4 — Update ServiceRequest Schema (enum types + broadcast fields)
**File:** `src/models/service-request/service-request.schema.ts`

**Add imports at the top:**

```typescript
import { City, state, RequestType, PaymentMode } from '../../common/types/enum';
```

**Replace the existing plain-string `governorate` and `city` props with enum-constrained versions:**

```typescript
// BEFORE:
@Prop({ required: true })
governorate: string;

@Prop({ required: true })
city: string;

// AFTER:
@Prop({ type: String, required: true, enum: City })
governorate: City;     // governorate (محافظة) — e.g. "Cairo", "Giza"
                       // must match City enum, same level as provider.city

@Prop({ type: String, required: true, enum: state })
city: state;           // district/area (حي) — e.g. "Nasr City", "Maadi"
                       // must match state enum, same level as provider.state
```

**Append these new fields after the existing `scheduledEndAt` prop:**

```typescript
// ── Broadcast fields ─────────────────────────────────────────────────────────

@Prop({ type: String, enum: RequestType, default: RequestType.DIRECT })
requestType: RequestType;
// DIRECT = existing flow; BROADCAST = new open-request flow

@Prop({ type: String, enum: LocationScope, default: null })
locationScope?: LocationScope;
// GOVERNORATE → match providers in same governorate (provider.city)
// DISTRICT    → match providers in same district  (provider.state)

@Prop({ type: Boolean, default: false })
matchByTopRated: boolean;
// if true, only match providers with averageRating >= 4.0

@Prop({ type: String, enum: PaymentMode, default: PaymentMode.FIXED })
paymentMode: PaymentMode;
// FIXED  → preferredPrice is set upfront; negotiation allowed
// HOURLY → price calculated at completion: hoursWorked × provider.hourPrice

@Prop({ type: Number, default: null })
preferredPrice?: number;
// customer's target price — required when paymentMode = FIXED

@Prop({ type: Number, default: null })
hoursWorked?: number;
// filled at hourly completion time by customer
```

---

### STEP 5 — Update `CreateServiceRequestDto` (add enum validators)
**File:** `src/modules/service-request/dto/create-service-request.dto.ts`

**Add imports:**

```typescript
import { IsEnum } from 'class-validator';
import { City, state } from '../../../common/types/enum';
```

**Replace the `governorate` and `city` fields:**

```typescript
// BEFORE:
@IsString()
@IsNotEmpty()
governorate: string;

@IsString()
@IsNotEmpty()
city: string;

// AFTER:
@IsEnum(City)
@IsNotEmpty()
governorate: City;    // must be a valid Egyptian governorate from City enum

@IsEnum(state)
@IsNotEmpty()
city: state;          // must be a valid district from state enum
```

> The factory, service, and controller for direct requests are unchanged — they already
> pass `dto.governorate` and `dto.city` through. Only the validation layer tightens.

---

### STEP 6 — Create ProviderOffer Schema
**File:** `src/models/provider-offer/provider-offer.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OfferStatus } from '../../common/types/enum';
import { ServiceRequest } from '../service-request/service-request.schema';
import { Provider } from '../provider/provider.schema';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ProviderOffer {
  readonly _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ServiceRequest.name,   // ref by class name — consistent with ServiceRequest.customerId style
    required: true,
  })
  serviceRequestId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Provider.name,         // ref by class name — consistent with ServiceRequest.providerId style
    required: true,
  })
  providerId: Types.ObjectId;

  @Prop({ type: String, enum: OfferStatus, default: OfferStatus.PENDING })
  status: OfferStatus;

  // Set when status is ACCEPTED or COUNTER_OFFER
  @Prop({ type: Number, default: null })
  offeredPrice?: number;

  // Set when status is ACCEPTED or COUNTER_OFFER
  // Mirrors the existing endTime field on ServiceRequest
  // Used to populate ServiceRequest.endTime and calculate scheduledEndAt on confirm
  @Prop({ type: String, default: null })
  offeredEndTime?: string;   // HH:MM format

  @Prop({ type: Date, default: null })
  respondedAt?: Date;
}

export const providerOfferSchema = SchemaFactory.createForClass(ProviderOffer);
export type HProviderOfferDocument = HydratedDocument<ProviderOffer>;
```

---

### STEP 7 — Create ProviderOffer Repository
**File:** `src/models/provider-offer/provider-offer.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { ProviderOffer, HProviderOfferDocument } from './provider-offer.schema';
import { OfferStatus } from '../../common/types/enum';

@Injectable()
export class ProviderOfferRepository extends AbstractRepository<HProviderOfferDocument> {
  constructor(
    @InjectModel(ProviderOffer.name)
    private readonly providerOfferModel: Model<HProviderOfferDocument>,
  ) {
    super(providerOfferModel);
  }

  /**
   * All PENDING offers for a specific provider, with the linked ServiceRequest populated.
   * The populate `match` filters to OPEN requests only — non-OPEN ones return null
   * and are stripped in the service layer.
   */
  async findPendingByProviderId(providerId: string): Promise<HProviderOfferDocument[]> {
    return this.providerOfferModel
      .find({ providerId: new Types.ObjectId(providerId), status: OfferStatus.PENDING })
      .populate({
        path: 'serviceRequestId',
        match: { status: 'OPEN' },
        select: '-completionCode -addedToProviderCalendar -__v -isDeleted',
      })
      .sort({ createdAt: -1 });
  }

  /**
   * Find a specific provider's offer for a specific request.
   * Used to validate the provider is part of the broadcast and hasn't responded yet.
   */
  async findByRequestAndProvider(
    requestId: string,
    providerId: string,
  ): Promise<HProviderOfferDocument | null> {
    return this.providerOfferModel.findOne({
      serviceRequestId: new Types.ObjectId(requestId),
      providerId:       new Types.ObjectId(providerId),
    });
  }

  /**
   * All active (non-refused, non-expired) offers for a request.
   * Used by the customer's getOffersSummary endpoint.
   */
  async findActiveByRequestId(requestId: string): Promise<HProviderOfferDocument[]> {
    return this.providerOfferModel
      .find({
        serviceRequestId: new Types.ObjectId(requestId),
        status: { $nin: [OfferStatus.REFUSED, OfferStatus.EXPIRED] },
      })
      .populate(
        'providerId',
        'firstName lastName userName profileURL averageRating service hourPrice city state',
      )
      .sort({ createdAt: -1 });
  }

  /**
   * Mark all other providers' pending/counter offers as EXPIRED.
   * Called immediately after one provider is confirmed.
   */
  async expireOtherOffers(
    requestId: string,
    confirmedProviderId: string,
  ): Promise<void> {
    await this.providerOfferModel.updateMany(
      {
        serviceRequestId: new Types.ObjectId(requestId),
        providerId: { $ne: new Types.ObjectId(confirmedProviderId) },
        status: { $in: [OfferStatus.PENDING, OfferStatus.COUNTER_OFFER] },
      },
      { $set: { status: OfferStatus.EXPIRED, respondedAt: new Date() } },
    );
  }
}
```

---

### STEP 8 — Add `findMatchingProviders` to Provider Repository
**File:** `src/models/provider/provider.repository.ts`

**Add import at the top:**

```typescript
import { Types } from 'mongoose';
import { LocationScope, ProviderStatus } from '../../common/types/enum';
```

**Add this method inside the class:**

```typescript
/**
 * Find active providers matching a broadcast request's criteria.
 * Returns only _id values (lean) — enough to create ProviderOffer docs.
 *
 * Matching logic:
 *   LocationScope.GOVERNORATE → provider.city   matches request.governorate  (City enum)
 *   LocationScope.DISTRICT    → provider.state  matches request.city         (state enum)
 */
async findMatchingProviders(params: {
  serviceId: string;
  locationScope: LocationScope;
  governorate?: string;   // used when scope = GOVERNORATE
  district?: string;      // used when scope = DISTRICT
  matchByTopRated: boolean;
  topRatedMinRating?: number;  // defaults to 4.0 in calling code
}): Promise<{ _id: Types.ObjectId }[]> {
  const filter: Record<string, any> = {
    service:       new Types.ObjectId(params.serviceId),
    adminApproved: ProviderStatus.Active,
    isDeleted:     { $ne: true },
  };

  if (params.locationScope === LocationScope.GOVERNORATE && params.governorate) {
    filter['city'] = params.governorate;    // provider.city === request.governorate
  }
  if (params.locationScope === LocationScope.DISTRICT && params.district) {
    filter['state'] = params.district;     // provider.state === request.city
  }
  if (params.matchByTopRated) {
    filter['averageRating'] = { $gte: params.topRatedMinRating ?? 4.0 };
  }

  return this.providerModel.find(filter).select('_id').lean();
}
```

---

### STEP 9 — Add Method to ServiceRequest Repository
**File:** `src/models/service-request/service-request.repository.ts`

**Add this method inside the class:**

```typescript
/**
 * All broadcast requests belonging to a customer (for customer's request list).
 * These appear in findByCustomerId too, but this is useful for targeted queries.
 */
async findBroadcastsByCustomerId(customerId: string): Promise<HServiceRequestDocument[]> {
  return this.serviceRequestModel
    .find({ customerId, requestType: 'BROADCAST' })
    .sort({ createdAt: -1 });
}

/**
 * Find CONFIRMED requests where scheduledEndAt has passed.
 * UPDATED: also returns HOURLY confirmed requests (price may be null — handled in service).
 * Previously this was fine because DIRECT always has price, but HOURLY BROADCAST
 * confirmed requests have null price until completion.
 */
async findOutdatedConfirmedRequests(date: Date): Promise<HServiceRequestDocument[]> {
  return this.serviceRequestModel.find({
    status: ServiceStatus.CONFIRMED,
    scheduledEndAt: { $lte: date },
  });
  // Note: the existing method already handles this correctly.
  // The service layer (handleOutdatedConfirmedRequests) must be updated to skip fee
  // calculation when request.paymentMode === PaymentMode.HOURLY.
}
```

> The existing `findOutdatedConfirmedRequests` method is already correct —
> no schema change needed. Only the **service method** that processes those
> results needs updating (see Step 12).

---

### STEP 10 — Update `models/index.ts`
**File:** `src/models/index.ts`

**Append at the bottom:**

```typescript
export * from './provider-offer/provider-offer.schema';
export * from './provider-offer/provider-offer.repository';
```

---

### STEP 11 — Create New DTOs

**File A:** `src/modules/service-request/dto/create-broadcast-request.dto.ts`

```typescript
import {
  IsNotEmpty, IsString, IsDate, Matches, IsMongoId,
  IsNumber, IsBoolean, IsEnum, IsOptional, Min, ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { City, state, LocationScope, PaymentMode } from '../../../common/types/enum';

export class CreateBroadcastRequestDto {
  // The service category the customer needs (e.g. PLUMBER ObjectId)
  @IsMongoId()
  @IsNotEmpty()
  serviceId: string;

  // ── Location (stored as governorate/city on ServiceRequest) ──────────────────

  @IsEnum(City)
  @IsNotEmpty()
  governorate: City;       // governorate level (e.g. "Cairo")

  @IsEnum(state)
  @IsNotEmpty()
  city: state;             // district level (e.g. "Nasr City")

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  exactLocation: string;

  // ── Service details ───────────────────────────────────────────────────────────

  @IsString()
  @IsNotEmpty()
  serviceNeeded: string;   // free-text description of work needed

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateNeeded: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;       // HH:MM

  // ── Matching filters ─────────────────────────────────────────────────────────

  @IsEnum(LocationScope)
  @IsNotEmpty()
  locationScope: LocationScope;
  // GOVERNORATE → find providers in same governorate (provider.city === dto.governorate)
  // DISTRICT    → find providers in same district   (provider.state === dto.city)

  @IsBoolean()
  matchByTopRated: boolean;   // true = also restrict to providers with averageRating >= 4.0

  // ── Payment ──────────────────────────────────────────────────────────────────

  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode;

  // Required only when paymentMode = FIXED
  @ValidateIf((o) => o.paymentMode === PaymentMode.FIXED)
  @IsNumber()
  @Min(150)
  preferredPrice?: number;
}
```

---

**File B:** `src/modules/service-request/dto/provider-respond-broadcast.dto.ts`

```typescript
import {
  IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, ValidateIf,
} from 'class-validator';

export enum BroadcastResponseAction {
  ACCEPT        = 'ACCEPT',
  COUNTER_OFFER = 'COUNTER_OFFER',
  REFUSE        = 'REFUSE',
}

export class ProviderRespondBroadcastDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsEnum(BroadcastResponseAction)
  action: BroadcastResponseAction;

  // Required for ACCEPT and COUNTER_OFFER (not REFUSE)
  // Used to set ServiceRequest.endTime and calculate scheduledEndAt on confirm
  // Keeps cron job (outdated confirmed requests) and calendar working correctly
  @ValidateIf((o) => o.action !== BroadcastResponseAction.REFUSE)
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  offeredEndTime: string;    // HH:MM — provider's estimated end time

  // Required only for COUNTER_OFFER; must not be present for ACCEPT (uses preferredPrice)
  @ValidateIf((o) => o.action === BroadcastResponseAction.COUNTER_OFFER)
  @IsNumber()
  @Min(150)
  offeredPrice?: number;
}
```

---

**File C:** `src/modules/service-request/dto/customer-select-offer.dto.ts`

```typescript
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CustomerSelectOfferDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsMongoId()
  @IsNotEmpty()
  offerId: string;    // _id of the ProviderOffer the customer accepts
}
```

---

**File D:** `src/modules/service-request/dto/complete-hourly-service.dto.ts`

```typescript
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CompleteHourlyServiceDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  completionCode: string;   // OTP the provider shows the customer

  @IsNumber()
  @Min(1)
  hoursWorked: number;      // number of hours worked; price = this × provider.hourPrice
}
```

---

### STEP 12 — Update Factory
**File:** `src/modules/service-request/factory/index.ts`

**Add imports:**

```typescript
import { CreateBroadcastRequestDto } from '../dto/create-broadcast-request.dto';
import { RequestType, PaymentMode, ServiceStatus } from '../../../common/types/enum';
```

**Add this method inside `ServiceRequestFactoryService`:**

```typescript
createBroadcastServiceRequest(
  dto: CreateBroadcastRequestDto,
  customerId: Types.ObjectId,
): Partial<ServiceRequest> {
  return {
    customerId,
    requestType:     RequestType.BROADCAST,
    status:          ServiceStatus.OPEN,
    governorate:     dto.governorate,
    city:            dto.city,
    street:          dto.street,
    exactLocation:   dto.exactLocation,
    serviceNeeded:   dto.serviceNeeded,
    dateNeeded:      dto.dateNeeded,
    startTime:       dto.startTime,
    locationScope:   dto.locationScope,
    matchByTopRated: dto.matchByTopRated,
    paymentMode:     dto.paymentMode,
    preferredPrice:  dto.preferredPrice ?? null,
    addedToProviderCalendar: false,
  } as any;   // 'as any' because Partial<ServiceRequest> doesn't include new fields yet at type-level
}
```

---

### STEP 13 — Service Layer Changes
**File:** `src/modules/service-request/service-request.service.ts`

#### 13a — Add imports

```typescript
import { ProviderOfferRepository } from '../../models/provider-offer/provider-offer.repository';
import {
  LocationScope, OfferStatus, PaymentMode, ProviderStatus, RequestType, ServiceStatus,
} from '../../common/types/enum';
import { CreateBroadcastRequestDto } from './dto/create-broadcast-request.dto';
import {
  BroadcastResponseAction,
  ProviderRespondBroadcastDto,
} from './dto/provider-respond-broadcast.dto';
import { CustomerSelectOfferDto } from './dto/customer-select-offer.dto';
import { CompleteHourlyServiceDto } from './dto/complete-hourly-service.dto';
```

#### 13b — Add `ProviderOfferRepository` to constructor

```typescript
constructor(
  private readonly serviceRequestRepository: ServiceRequestRepository,
  private readonly serviceRequestFactory: ServiceRequestFactoryService,
  private readonly providerRepository: ProviderRepository,
  private readonly generalSettingService: GeneralSettingService,
  private readonly providerOfferRepository: ProviderOfferRepository,   // ADD
) {}
```

#### 13c — Add private helper `confirmBroadcastRequest()`

```typescript
/**
 * Confirms a broadcast request with a specific provider.
 * Sets endTime and scheduledEndAt from the offer's offeredEndTime —
 * this keeps the outdated-cron and provider calendar working correctly.
 */
private async confirmBroadcastRequest(params: {
  request: any;
  offer: any;                // the ProviderOffer document
  confirmedProviderId: Types.ObjectId;
  price: number | null;      // null for HOURLY (calculated at completion)
}) {
  const { request, offer, confirmedProviderId, price } = params;

  // Calculate scheduledEndAt from dateNeeded + offeredEndTime (same logic as providerAccept)
  const scheduledEndAt = new Date(request.dateNeeded);
  const [hours, minutes] = offer.offeredEndTime.split(':').map(Number);
  scheduledEndAt.setHours(hours, minutes, 0, 0);

  const completionCode = generateCode();

  await this.serviceRequestRepository.updateById(request._id.toString(), {
    status:                 ServiceStatus.CONFIRMED,
    providerId:             confirmedProviderId,
    price:                  price ?? null,
    endTime:                offer.offeredEndTime,   // matches ServiceRequest.endTime field
    scheduledEndAt,                                 // used by outdated cron
    completionCode,
    addedToProviderCalendar: true,
  });

  // Expire all other providers' pending/counter offers
  await this.providerOfferRepository.expireOtherOffers(
    request._id.toString(),
    confirmedProviderId.toString(),
  );

  return { message: 'Request confirmed successfully', completionCode };
}
```

#### 13d — Add `createBroadcastRequest()`

```typescript
async createBroadcastRequest(
  dto: CreateBroadcastRequestDto,
  customerId: Types.ObjectId,
) {
  // Build filter params for provider matching
  const matchParams = {
    serviceId:        dto.serviceId,
    locationScope:    dto.locationScope,
    governorate:      dto.governorate,   // used if scope = GOVERNORATE
    district:         dto.city,          // used if scope = DISTRICT
    matchByTopRated:  dto.matchByTopRated,
    topRatedMinRating: 4.0,
  };

  const matchedProviders = await this.providerRepository.findMatchingProviders(matchParams);

  if (!matchedProviders.length) {
    throw new BadRequestException(
      'No active providers found matching your filters. ' +
      'Try switching from DISTRICT to GOVERNORATE scope, or disable the top-rated filter.',
    );
  }

  // Create the broadcast ServiceRequest
  const requestData = this.serviceRequestFactory.createBroadcastServiceRequest(dto, customerId);
  const created = await this.serviceRequestRepository.create(requestData);

  // Create one ProviderOffer per matched provider
  const offerDocs = matchedProviders.map((p) => ({
    serviceRequestId: created._id,
    providerId:       p._id,
    status:           OfferStatus.PENDING,
  }));
  await this.providerOfferRepository.createMany(offerDocs);

  const { __v, isDeleted, completionCode, addedToProviderCalendar } =
    JSON.parse(JSON.stringify(created));

  return {
    request:           JSON.parse(JSON.stringify(created)),
    notifiedProviders: matchedProviders.length,
  };
}
```

#### 13e — Add `getAvailableBroadcastRequests()` (Provider)

```typescript
/**
 * Returns all OPEN broadcast requests that this provider was matched to
 * and has not yet responded to.
 * Hides sensitive customer data (completionCode, addedToProviderCalendar).
 */
async getAvailableBroadcastRequests(providerId: Types.ObjectId) {
  const pendingOffers = await this.providerOfferRepository.findPendingByProviderId(
    providerId.toString(),
  );

  // After populate with match: { status: 'OPEN' }, non-matching requests are null — strip them
  return pendingOffers
    .filter((offer: any) => offer.serviceRequestId !== null)
    .map((offer: any) => {
      const req = JSON.parse(JSON.stringify(offer.serviceRequestId));
      return {
        offerId:   offer._id,
        request:   req,
      };
    });
}
```

#### 13f — Add `providerRespondToBroadcast()` (Provider)

```typescript
async providerRespondToBroadcast(
  dto: ProviderRespondBroadcastDto,
  providerId: Types.ObjectId,
) {
  // 1. Validate offer exists and belongs to this provider
  const offer = await this.providerOfferRepository.findByRequestAndProvider(
    dto.requestId,
    providerId.toString(),
  );
  if (!offer) throw new NotFoundException('No offer found for this request');
  if (offer.status !== OfferStatus.PENDING) {
    throw new BadRequestException('You have already responded to this request');
  }

  // 2. Validate request is still open
  const request = await this.findOne(dto.requestId);
  if (request.status !== ServiceStatus.OPEN) {
    throw new BadRequestException('This request is no longer open for offers');
  }

  // 3. Check provider is allowed to work
  const provider = await this.providerRepository.findById(providerId.toString());
  if (!provider) throw new NotFoundException('Provider not found');
  if (provider.adminApproved === ProviderStatus.Banned) {
    throw new BadRequestException('You are banned. Contact the support team.');
  }
  if (provider.adminApproved === ProviderStatus.Stopped) {
    throw new BadRequestException('Your account is stopped. Pay your debt or contact support.');
  }

  // 4. Handle REFUSE (same for FIXED and HOURLY)
  if (dto.action === BroadcastResponseAction.REFUSE) {
    await this.providerOfferRepository.updateById(offer._id.toString(), {
      status:      OfferStatus.REFUSED,
      respondedAt: new Date(),
    });
    return { message: 'Request refused' };
  }

  // 5. HOURLY mode: only ACCEPT or REFUSE are valid
  if ((request as any).paymentMode === PaymentMode.HOURLY) {
    if (dto.action === BroadcastResponseAction.COUNTER_OFFER) {
      throw new BadRequestException(
        'Counter-offers are not allowed for hourly payment requests',
      );
    }
    // HOURLY ACCEPT
    if (!provider.hourPrice) {
      throw new BadRequestException(
        'You have not set an hourly rate. Update your profile with hourPrice before accepting hourly requests.',
      );
    }
    await this.providerOfferRepository.updateById(offer._id.toString(), {
      status:         OfferStatus.ACCEPTED,
      offeredEndTime: dto.offeredEndTime,
      respondedAt:    new Date(),
    });
    return this.confirmBroadcastRequest({
      request,
      offer: { ...JSON.parse(JSON.stringify(offer)), offeredEndTime: dto.offeredEndTime },
      confirmedProviderId: providerId,
      price: null,   // HOURLY — price calculated at completion
    });
  }

  // 6. FIXED mode — ACCEPT at customer's preferredPrice
  if (dto.action === BroadcastResponseAction.ACCEPT) {
    await this.providerOfferRepository.updateById(offer._id.toString(), {
      status:         OfferStatus.ACCEPTED,
      offeredPrice:   (request as any).preferredPrice,
      offeredEndTime: dto.offeredEndTime,
      respondedAt:    new Date(),
    });
    return this.confirmBroadcastRequest({
      request,
      offer: { ...JSON.parse(JSON.stringify(offer)), offeredEndTime: dto.offeredEndTime },
      confirmedProviderId: providerId,
      price: (request as any).preferredPrice,
    });
  }

  // 7. FIXED mode — COUNTER_OFFER
  if (dto.action === BroadcastResponseAction.COUNTER_OFFER) {
    if (!dto.offeredPrice) {
      throw new BadRequestException('offeredPrice is required for a counter-offer');
    }
    await this.providerOfferRepository.updateById(offer._id.toString(), {
      status:         OfferStatus.COUNTER_OFFER,
      offeredPrice:   dto.offeredPrice,
      offeredEndTime: dto.offeredEndTime,
      respondedAt:    new Date(),
    });
    return {
      message: 'Counter-offer submitted. The customer will be notified to review it.',
    };
  }
}
```

#### 13g — Add `getOffersSummary()` (Customer)

```typescript
/**
 * Returns all active provider offers on a broadcast request.
 * Used after no provider has accepted at preferredPrice — customer reviews counter-offers.
 */
async getOffersSummary(requestId: string, customerId: Types.ObjectId) {
  const request = await this.findOneForUser(requestId, customerId, 'customerId');

  if ((request as any).requestType !== RequestType.BROADCAST) {
    throw new BadRequestException('This is not a broadcast request');
  }

  if (request.status === ServiceStatus.CONFIRMED ||
      request.status === ServiceStatus.COMPLETED) {
    throw new BadRequestException('This request has already been confirmed');
  }

  const offers = await this.providerOfferRepository.findActiveByRequestId(requestId);

  const hasDirectAccept = offers.some((o: any) => o.status === OfferStatus.ACCEPTED);

  return {
    requestStatus:      request.status,                    // OPEN
    selectionRequired:  !hasDirectAccept,                  // true = customer must choose
    preferredPrice:     (request as any).preferredPrice,
    paymentMode:        (request as any).paymentMode,
    offers: offers.map((o: any) => ({
      offerId:        o._id,
      provider:       o.providerId,                        // populated: name, rating, etc.
      offerStatus:    o.status,
      offeredPrice:   o.offeredPrice,
      offeredEndTime: o.offeredEndTime,
      respondedAt:    o.respondedAt,
    })),
  };
}
```

#### 13h — Add `customerSelectOffer()` (Customer)

```typescript
/**
 * Customer selects a counter-offer from a provider.
 * Only valid when the request is OPEN (no provider accepted at preferredPrice).
 */
async customerSelectOffer(dto: CustomerSelectOfferDto, customerId: Types.ObjectId) {
  const request = await this.findOneForUser(dto.requestId, customerId, 'customerId');

  if (request.status !== ServiceStatus.OPEN) {
    throw new BadRequestException(
      'Only open requests can have an offer selected manually',
    );
  }

  const offer = await this.providerOfferRepository.findById(dto.offerId);
  if (!offer) throw new NotFoundException('Offer not found');
  if (offer.serviceRequestId.toString() !== dto.requestId) {
    throw new BadRequestException('This offer does not belong to the given request');
  }
  if (offer.status !== OfferStatus.COUNTER_OFFER) {
    throw new BadRequestException('You can only select a counter-offer');
  }

  return this.confirmBroadcastRequest({
    request,
    offer,
    confirmedProviderId: offer.providerId as Types.ObjectId,
    price: offer.offeredPrice,
  });
}
```

#### 13i — Add `completeHourlyService()` (Customer)

```typescript
/**
 * Complete an hourly broadcast request.
 * Customer provides OTP + hours worked.
 * Price = hoursWorked × provider.hourPrice is calculated here.
 * Debt/commission logic mirrors the existing completeService().
 */
async completeHourlyService(dto: CompleteHourlyServiceDto, customerId: Types.ObjectId) {
  const request = await this.findOneForUser(dto.requestId, customerId, 'customerId');

  if (request.status !== ServiceStatus.CONFIRMED) {
    throw new BadRequestException('Only confirmed requests can be completed');
  }
  if ((request as any).paymentMode !== PaymentMode.HOURLY) {
    throw new BadRequestException(
      'Use the standard /complete endpoint for fixed-price requests',
    );
  }
  if (!dto.completionCode || dto.completionCode !== request.completionCode) {
    throw new BadRequestException('Invalid completion code (OTP)');
  }
  if (!request.providerId) {
    throw new BadRequestException('Provider is missing on this request');
  }

  const providerIdValue = this.getId(request.providerId);
  const provider = await this.providerRepository.findById(providerIdValue);
  if (!provider) throw new NotFoundException('Provider not found');
  if (!provider.hourPrice) {
    throw new BadRequestException(
      'Provider does not have an hourly rate set. Contact support.',
    );
  }

  // Calculate final price
  const price = dto.hoursWorked * provider.hourPrice;

  // Debt and commission — same logic as completeService()
  const settings = await this.generalSettingService.getGeneralSettings();
  const debtAmount = Math.round(price * (settings.webCommission / 100));

  provider.debt = (provider.debt || 0) + debtAmount;
  if (provider.debt > settings.providerDebt) {
    provider.adminApproved = ProviderStatus.Stopped;
  }
  provider.providerCancelCount = 0;

  await this.providerRepository.updateById(providerIdValue, provider);
  await this.generalSettingService.updateSettings({
    revenue: settings.revenue + debtAmount,
  });

  const updated = await this.serviceRequestRepository.updateById(dto.requestId, {
    status:                 ServiceStatus.COMPLETED,
    price,
    hoursWorked:            dto.hoursWorked,
    completionCode:         null,
    addedToProviderCalendar: false,
  });

  const {
    __v, isDeleted, addedToProviderCalendar, completionCode,
    createdAt, updatedAt, ...data
  } = JSON.parse(JSON.stringify(updated));

  return { ...data };
}
```

#### 13j — Update existing `handleOutdatedConfirmedRequests()` for HOURLY

```typescript
// EXISTING METHOD — update the logic inside the for-loop:

async handleOutdatedConfirmedRequests() {
  const outdatedDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const requests =
    await this.serviceRequestRepository.findOutdatedConfirmedRequests(outdatedDate);

  for (const request of requests) {
    if (!request.providerId) continue;

    // NEW: HOURLY requests have no price set at CONFIRMED time.
    // Mark them OUTDATED without applying a cancel fee (price is unknown).
    if ((request as any).paymentMode === PaymentMode.HOURLY) {
      await this.serviceRequestRepository.updateById(request._id.toString(), {
        status:                  ServiceStatus.OUTDATED,
        addedToProviderCalendar: false,
        completionCode:          null,
      });
      continue;  // skip fee logic below
    }

    // EXISTING: FIXED price requests — apply cancel fee as before
    if (!request.price) continue;

    const provider = await this.providerRepository.findById(
      request.providerId.toString(),
    );
    if (!provider) continue;

    const settings = await this.generalSettingService.getGeneralSettings();
    const cancelFee = Math.round(
      request.price * (settings.providerCancelFee / 100),
    );

    await this.providerRepository.updateById(request.providerId.toString(), {
      providerCancelCount: (provider.providerCancelCount || 0) + 1,
      providerCancelFees:  (provider.providerCancelFees || 0) + cancelFee,
      debt:                (provider.debt || 0) + cancelFee,
    });

    await this.serviceRequestRepository.updateById(request._id.toString(), {
      status:                  ServiceStatus.OUTDATED,
      addedToProviderCalendar: false,
      completionCode:          null,
    });
  }
}
```

---

### STEP 14 — Controller Endpoints
**File:** `src/modules/service-request/service-request.controller.ts`

**Add imports:**

```typescript
import { CreateBroadcastRequestDto }     from './dto/create-broadcast-request.dto';
import { ProviderRespondBroadcastDto }   from './dto/provider-respond-broadcast.dto';
import { CustomerSelectOfferDto }        from './dto/customer-select-offer.dto';
import { CompleteHourlyServiceDto }      from './dto/complete-hourly-service.dto';
```

**Add these 6 endpoints inside `ServiceRequestController`:**

> ⚠️ Place `broadcast/available` and `broadcast/respond` BEFORE any `:id` route to avoid
> NestJS treating "broadcast" as a param. The existing `@Get(':id')` must stay last.

```typescript
// ── BROADCAST: Customer creates open request ────────────────────────────────

@Post('broadcast')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
createBroadcast(
  @Body() dto: CreateBroadcastRequestDto,
  @Request() req: any,
) {
  return this.serviceRequestService.createBroadcastRequest(dto, req.user._id);
}

// ── BROADCAST: Provider sees open requests they are matched to ──────────────

@Get('broadcast/available')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
getAvailableBroadcasts(@Request() req: any) {
  return this.serviceRequestService.getAvailableBroadcastRequests(req.user._id);
}

// ── BROADCAST: Provider accepts / counter-offers / refuses ─────────────────

@Post('broadcast/respond')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
respondToBroadcast(
  @Body() dto: ProviderRespondBroadcastDto,
  @Request() req: any,
) {
  return this.serviceRequestService.providerRespondToBroadcast(dto, req.user._id);
}

// ── BROADCAST: Customer sees all provider offers ───────────────────────────

@Get('broadcast/:id/offers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
getOffersSummary(@Param('id') id: string, @Request() req: any) {
  return this.serviceRequestService.getOffersSummary(id, req.user._id);
}

// ── BROADCAST: Customer selects a counter-offer ────────────────────────────

@Patch('broadcast/select-offer')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
selectOffer(
  @Body() dto: CustomerSelectOfferDto,
  @Request() req: any,
) {
  return this.serviceRequestService.customerSelectOffer(dto, req.user._id);
}

// ── BROADCAST: Customer completes hourly service (OTP + hours) ─────────────

@Patch('broadcast/complete-hourly')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
completeHourly(
  @Body() dto: CompleteHourlyServiceDto,
  @Request() req: any,
) {
  return this.serviceRequestService.completeHourlyService(dto, req.user._id);
}
```

---

### STEP 15 — Update ServiceRequest Module
**File:** `src/modules/service-request/service-request.module.ts`

```typescript
import { ProviderOffer, providerOfferSchema } from '../../models/provider-offer/provider-offer.schema';
import { ProviderOfferRepository }            from '../../models/provider-offer/provider-offer.repository';

@Module({
  imports: [
    UserMongooseModule,
    GeneralSettingModule,
    MongooseModule.forFeature([
      { name: ServiceRequest.name, schema: serviceRequestSchema },
      { name: ProviderOffer.name,  schema: providerOfferSchema },   // ADD
    ]),
  ],
  controllers: [ServiceRequestController],
  providers: [
    ServiceRequestService,
    ServiceRequestFactoryService,
    ServiceRequestRepository,
    ProviderOfferRepository,     // ADD
  ],
  exports: [
    ServiceRequestService,
    ServiceRequestRepository,
    ProviderOfferRepository,     // ADD
  ],
})
export class ServiceRequestModule {}
```

---

## Part 4 — Complete API Reference

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/service-requests` | CUSTOMER | *(existing)* Direct request to one provider |
| `GET` | `/service-requests` | ALL | *(existing)* My requests |
| `PATCH` | `/service-requests/provider-accept` | PROVIDER | *(existing)* Accept direct request |
| `PATCH` | `/service-requests/provider-reject` | PROVIDER | *(existing)* Reject direct request |
| `PATCH` | `/service-requests/customer-accept` | CUSTOMER | *(existing)* Accept provider offer |
| `PATCH` | `/service-requests/customer-reject` | CUSTOMER | *(existing)* Reject provider offer |
| `PATCH` | `/service-requests/customer-cancel` | CUSTOMER | *(existing)* Cancel confirmed |
| `PATCH` | `/service-requests/provider-cancel` | PROVIDER | *(existing)* Cancel confirmed |
| `PATCH` | `/service-requests/complete` | CUSTOMER | *(existing)* Complete with OTP |
| `GET` | `/service-requests/calendar` | PROVIDER | *(existing)* Provider calendar |
| `GET` | `/service-requests/:id` | ALL | *(existing)* Request details |
| `POST` | `/service-requests/broadcast` | CUSTOMER | **NEW** Create broadcast |
| `GET` | `/service-requests/broadcast/available` | PROVIDER | **NEW** Open requests for me |
| `POST` | `/service-requests/broadcast/respond` | PROVIDER | **NEW** Accept / Counter / Refuse |
| `GET` | `/service-requests/broadcast/:id/offers` | CUSTOMER | **NEW** See provider offers |
| `PATCH` | `/service-requests/broadcast/select-offer` | CUSTOMER | **NEW** Select counter-offer |
| `PATCH` | `/service-requests/broadcast/complete-hourly` | CUSTOMER | **NEW** Complete hourly |
| `POST` | `/provider/profile` | PROVIDER | *(existing — now accepts `hourPrice`)* |

---

## Part 5 — Complete Status Machine

```
DIRECT requests (existing, unchanged):
  WAITING → PENDING → CONFIRMED → COMPLETED
                               → REFUSED
                               → OUTDATED (cron)
           → REFUSED

BROADCAST — FIXED payment:
  OPEN ──(provider ACCEPT at preferredPrice)──────────→ CONFIRMED → COMPLETED
                                                                   → REFUSED (customer cancel)
                                                                   → OUTDATED (cron)
       ──(all providers COUNTER_OFFER/REFUSE)──────────→ OPEN  (stays open)
       ──(customer selects a counter-offer)────────────→ CONFIRMED → (same as above)

BROADCAST — HOURLY payment:
  OPEN ──(provider ACCEPT)───────────────────────────→ CONFIRMED → COMPLETED (via complete-hourly)
                                                                  → REFUSED
                                                                  → OUTDATED (cron, no fee)
       ──(all providers REFUSE)────────────────────────→ OPEN  (stays open)
```

---

## Part 6 — Edge Cases and Notes

**1. No providers matched on broadcast creation**
Throw `BadRequestException` with a friendly hint to widen the location scope or disable the top-rated filter.

**2. Request already confirmed when provider tries to respond**
The `request.status !== ServiceStatus.OPEN` check in `providerRespondToBroadcast` catches this.

**3. Provider responds twice**
The `offer.status !== OfferStatus.PENDING` check prevents double responses.

**4. HOURLY provider has no `hourPrice` set**
Checked in `providerRespondToBroadcast` at ACCEPT time (not at completion) — gives the provider a clear error before they commit.

**5. HOURLY outdated requests in cron**
The updated `handleOutdatedConfirmedRequests()` marks HOURLY requests as OUTDATED without applying a fee, since the price is unknown at that stage.

**6. OPEN broadcast requests expiring after `dateNeeded`**
The existing cron filters on `scheduledEndAt` (only set after CONFIRM). OPEN requests never get CONFIRMED, so they stay OPEN forever unless addressed. **Recommended follow-up:** add a second cron query that marks `OPEN` broadcast requests as `OUTDATED` when `dateNeeded < now`.

**7. Backward compatibility of city/state enum enforcement**
Existing ServiceRequest documents in MongoDB still have plain-string values. The enum constraint is enforced only at the **application layer** (DTO validation + schema `enum` option). Old documents are not invalidated at the DB level, so reads are safe. Any **writes** to old documents via existing endpoints will now enforce the enum — ensure all existing form data already uses valid enum values before deploying.

**8. `findRequests()` for providers with broadcast**
The existing `findByProviderId` populates by `providerId` field. Broadcast requests only have `providerId` set **after** CONFIRM, so OPEN broadcast requests are invisible to `findRequests()` for providers (correct — they use `broadcast/available` instead). CONFIRMED/COMPLETED broadcast requests appear normally via `findByProviderId`.

---

## Part 7 — Implementation Order (Safe Sequence)

```
Step 1   enum/index.ts             — add enums, add OPEN to ServiceStatus
Step 2   provider.schema.ts        — add hourPrice
Step 3   update-provider.dto.ts    — add hourPrice field
Step 4   service-request.schema.ts — enum types for governorate/city + broadcast fields
Step 5   create-service-request.dto.ts — add enum validators
Step 6   provider-offer.schema.ts  — create
Step 7   provider-offer.repository.ts — create
Step 8   provider.repository.ts    — add findMatchingProviders()
Step 9   service-request.repository.ts — add findBroadcastsByCustomerId()
Step 10  models/index.ts           — export ProviderOffer
Step 11  DTOs (4 new files)        — create all four
Step 12  factory/index.ts          — add createBroadcastServiceRequest()
Step 13  service-request.service.ts — add imports, 6 new methods, update cron handler
Step 14  service-request.controller.ts — add 6 new endpoints
Step 15  service-request.module.ts — register ProviderOffer model + repo
```

---

## Part 8 — Testing Scenarios

### Scenario A — FIXED, auto-confirm at preferredPrice
1. Customer: `POST /service-requests/broadcast` → `paymentMode: FIXED`, `preferredPrice: 500`, `locationScope: DISTRICT`
2. System: 3 providers found → 3 ProviderOffers created, ServiceRequest `OPEN`
3. Provider A: `POST broadcast/respond` → `COUNTER_OFFER, offeredPrice: 600, offeredEndTime: "15:00"`
4. Provider B: `POST broadcast/respond` → `ACCEPT, offeredEndTime: "14:30"`  
   → **Auto-confirms with Provider B at 500**  
   → Provider A and C offers → `EXPIRED`  
   → ServiceRequest: `CONFIRMED, endTime: "14:30", scheduledEndAt: computed`

### Scenario B — FIXED, customer selects counter-offer
1. Same setup as A
2. Provider A: `COUNTER_OFFER, 600, "15:00"` | Provider B: `REFUSE` | Provider C: `COUNTER_OFFER, 550, "14:00"`
3. Customer: `GET /service-requests/broadcast/:id/offers` → sees A and C
4. Customer: `PATCH /service-requests/broadcast/select-offer` → selects C's offerId  
   → **Confirms with Provider C at 550, endTime "14:00"**  
   → Provider A offer → `EXPIRED`

### Scenario C — HOURLY, single accept
1. Customer: `POST /service-requests/broadcast` → `paymentMode: HOURLY`, `locationScope: GOVERNORATE`
2. Provider sets hourPrice via `POST /provider/profile` → `{ hourPrice: 100 }`
3. Provider: `POST broadcast/respond` → `ACCEPT, offeredEndTime: "17:00"`  
   → **Auto-confirms, price is null**
4. Customer: `PATCH /service-requests/broadcast/complete-hourly` → `completionCode, hoursWorked: 4`  
   → `price = 4 × 100 = 400` → `status: COMPLETED` → provider.debt += commission
