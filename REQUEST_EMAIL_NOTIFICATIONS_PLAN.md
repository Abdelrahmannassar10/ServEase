# Request Email Notifications Plan

## Goal

Add email notifications for service-request lifecycle events using the same email system already used by the project:

- `sendMail` from `src/common/helper/email.helper.ts`
- `EMAIL_TEMPLATES` from `src/config/env/dev.config.ts`
- Resend delivery through `RESEND_API_KEY`

The notifications should inform both providers and customers when a request changes state, without blocking the main request action if email delivery fails.

## Files Changed

- `src/modules/service-request/service-request.service.ts`
- `src/config/env/dev.config.ts`
- `src/models/provider-offer/provider-offer.repository.ts`

## Notification Events

### Provider Notifications

- New direct request created
- New broadcast request matched to provider
- Customer confirmed request
- Customer rejected provider offer
- Customer cancelled confirmed request
- Broadcast request cancelled
- Service marked completed

### Customer Notifications

- Provider accepted direct request
- Provider rejected direct request
- Provider refused broadcast request
- Provider sent counter-offer
- Request confirmed
- Provider cancelled confirmed request
- Service marked completed

## Implementation Plan

1. Reuse the existing email helper.

   Import `sendMail` into `ServiceRequestService` and send notifications through the same helper already used by auth and admin emails.

2. Load templates from config.

   Inject `ConfigService` into `ServiceRequestService` and read request notification templates from `EMAIL_TEMPLATES`.

3. Add safe notification wrapper.

   Add `sendRequestNotification()` to catch and log email errors. This keeps request creation, acceptance, cancellation, and completion from failing only because email delivery failed.

4. Add request email helpers.

   Add helper methods for:

   - user display names
   - request detail formatting
   - direct request creation notification
   - broadcast request creation notification
   - provider response notification
   - confirmation notification
   - cancellation notification
   - completion notification

5. Wire notifications after successful database updates.

   Send emails only after the request state has already been created or updated successfully.

6. Add templates in `dev.config.ts`.

   Add request templates under `EMAIL_TEMPLATES`, following the existing template style.

7. Add reusable template helpers.

   Add shared helpers for request notification layout, request summary rows, date formatting, location formatting, money formatting, and completion code display.

8. Include provider email in broadcast offer population.

   Update `ProviderOfferRepository.findActiveByRequestId()` to include provider `email`, so broadcast cancellation emails can be sent.

## Template Keys Added

- `directRequestCreatedProvider`
- `broadcastRequestCreatedProvider`
- `providerAcceptedRequestCustomer`
- `providerRejectedRequestCustomer`
- `providerCounterOfferCustomer`
- `requestConfirmedCustomer`
- `requestConfirmedProvider`
- `customerRejectedOfferProvider`
- `customerCancelledRequestProvider`
- `providerCancelledRequestCustomer`
- `broadcastRequestCancelledProvider`
- `requestCompletedCustomer`
- `requestCompletedProvider`

## Verification

Run:

```bash
pnpm.cmd run build
```

Expected result:

- NestJS build completes successfully.
- No dependency-injection errors.
- No TypeScript errors.

## Notes

- Email failures are logged with Nest `Logger.warn`.
- Email failures do not roll back request actions.
- Completion code is included only when available.
- Broadcast cancellation notification is sent before offers are expired, so provider emails are still available.
