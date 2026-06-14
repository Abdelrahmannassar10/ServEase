# Broadcast Feature Postman Testing Guide

This guide tests the broadcast service-request feature after the new implementation.

## Project Health Check

From the project root:

```bash
pnpm.cmd run build
```

Expected result: build finishes successfully.

Current verification result: `pnpm.cmd run build` passed.

```bash
pnpm.cmd run test
```

Current result: Jest reports `No tests found` because there are no `*.spec.ts` files under `src`. This is not a compile failure, but it means there is no automated test coverage yet.

```bash
pnpm.cmd run start
```

Expected result: the NestJS app keeps running on `http://localhost:3000` unless `PORT` is set in `.env`.

## Recommended Test Data Setup

If you want ready verified accounts and active providers, run:

```bash
pnpm.cmd run seed:fake
```

The seed creates demo users with this password:

```text
Password123
```

Useful seeded customer:

```text
omar.hassan.demo@servease.test
```

Useful seeded provider examples:

```text
ahmed.sayed.plumbing.demo@servease.test
hana.nabil.cleaning.demo@servease.test
```

The seeded providers are already `Active`, so broadcast matching can work immediately.

## Postman Environment Variables

Create a Postman environment with:

```text
baseUrl = http://localhost:3000
customerToken =
providerToken =
serviceId =
requestId =
offerId =
completionCode =
```

For authenticated requests, use:

```text
Authorization: Bearer {{customerToken}}
```

or:

```text
Authorization: Bearer {{providerToken}}
```

Also set:

```text
Content-Type: application/json
```

## 1. Start The Server

```bash
pnpm.cmd run start
```

Keep this terminal open while testing in Postman.

## 2. Get A Service ID

Request:

```http
GET {{baseUrl}}/service/all
```

Copy one service `_id` into `serviceId`.

For the seeded plumbing provider, choose the `Plumbing` service ID.

## 3. Login As Customer

Request:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "email": "omar.hassan.demo@servease.test",
  "password": "Password123"
}
```

Save `access_token` as `customerToken`.

Postman test script:

```javascript
const json = pm.response.json();
pm.environment.set("customerToken", json.access_token);
```

## 4. Login As Provider

Request:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "email": "ahmed.sayed.plumbing.demo@servease.test",
  "password": "Password123"
}
```

Save `access_token` as `providerToken`.

Postman test script:

```javascript
const json = pm.response.json();
pm.environment.set("providerToken", json.access_token);
```

## 5. Fixed Broadcast: Create Request

Use the customer token.

Request:

```http
POST {{baseUrl}}/service-requests/broadcast
```

Body:

```json
{
  "serviceId": "{{serviceId}}",
  "governorate": "Cairo",
  "city": "Heliopolis",
  "street": "Demo Street",
  "exactLocation": "Building 10, Floor 2",
  "serviceNeeded": "Kitchen pipe leaking",
  "dateNeeded": "2026-06-20",
  "startTime": "10:00",
  "locationScope": "DISTRICT",
  "matchByTopRated": false,
  "paymentMode": "FIXED",
  "preferredPrice": 500
}
```

Expected result:

```json
{
  "request": {
    "status": "OPEN",
    "requestType": "BROADCAST"
  },
  "notifiedProviders": 1
}
```

Save `request._id` as `requestId`.

Postman test script:

```javascript
const json = pm.response.json();
pm.environment.set("requestId", json.request._id);
```

If you get `No active providers found`, try:

```json
"locationScope": "GOVERNORATE"
```

## 6. Provider: View Available Broadcasts

Use the provider token.

Request:

```http
GET {{baseUrl}}/service-requests/broadcast/available
```

Expected result: an array containing the broadcast request and its `offerId`.

Save the returned `offerId` if you want to inspect offers later.

## 7A. Provider: Accept Fixed Broadcast

Use the provider token.

Request:

```http
POST {{baseUrl}}/service-requests/broadcast/respond
```

Body:

```json
{
  "requestId": "{{requestId}}",
  "action": "ACCEPT",
  "offeredEndTime": "12:00"
}
```

Expected result:

```json
{
  "message": "Request confirmed successfully",
  "completionCode": "123456"
}
```

Save `completionCode`. The request should now be `CONFIRMED`, with price `500`.

## 7B. Alternative: Provider Sends Counter Offer

Use this instead of step 7A if you want to test manual customer selection.

Request:

```http
POST {{baseUrl}}/service-requests/broadcast/respond
```

Body:

```json
{
  "requestId": "{{requestId}}",
  "action": "COUNTER_OFFER",
  "offeredPrice": 650,
  "offeredEndTime": "13:00"
}
```

Expected result:

```json
{
  "message": "Counter-offer submitted. The customer will be notified to review it."
}
```

## 8. Customer: View Offers

Use the customer token.

Request:

```http
GET {{baseUrl}}/service-requests/broadcast/{{requestId}}/offers
```

Expected result: active offers for this request.

If you used a counter offer, copy the counter offer `_id` or `offerId` into `offerId`.

## 9. Customer: Select Counter Offer

Only use this if step 7B was used.

Request:

```http
PATCH {{baseUrl}}/service-requests/broadcast/select-offer
```

Body:

```json
{
  "requestId": "{{requestId}}",
  "offerId": "{{offerId}}"
}
```

Expected result:

```json
{
  "message": "Request confirmed successfully",
  "completionCode": "123456"
}
```

Save `completionCode`.

## 10. Complete Fixed Broadcast

Use the customer token.

Request:

```http
PATCH {{baseUrl}}/service-requests/complete
```

Body:

```json
{
  "id": "{{requestId}}",
  "completionCode": "{{completionCode}}"
}
```

Expected result: request status becomes `COMPLETED`.

## 11. Hourly Broadcast Flow

First, make sure the provider has an hourly price.

Use the provider token.

Request:

```http
POST {{baseUrl}}/provider/profile
```

Body:

```json
{
  "hourPrice": 100
}
```

Create an hourly broadcast with the customer token:

```http
POST {{baseUrl}}/service-requests/broadcast
```

Body:

```json
{
  "serviceId": "{{serviceId}}",
  "governorate": "Cairo",
  "city": "Heliopolis",
  "street": "Demo Street",
  "exactLocation": "Building 10, Floor 2",
  "serviceNeeded": "Hourly plumbing help",
  "dateNeeded": "2026-06-20",
  "startTime": "10:00",
  "locationScope": "DISTRICT",
  "matchByTopRated": false,
  "paymentMode": "HOURLY"
}
```

Provider accepts:

```http
POST {{baseUrl}}/service-requests/broadcast/respond
```

Body:

```json
{
  "requestId": "{{requestId}}",
  "action": "ACCEPT",
  "offeredEndTime": "14:00"
}
```

Expected result: request is confirmed and `price` remains `null` until completion.

Customer completes hourly request:

```http
PATCH {{baseUrl}}/service-requests/broadcast/complete-hourly
```

Body:

```json
{
  "requestId": "{{requestId}}",
  "completionCode": "{{completionCode}}",
  "hoursWorked": 4
}
```

Expected result: request status becomes `COMPLETED`, and final price is `400`.

## Important Validation Notes

Use exact enum values. Examples:

```text
Cairo
Heliopolis
Nasr City
Maadi
DISTRICT
GOVERNORATE
FIXED
HOURLY
ACCEPT
COUNTER_OFFER
REFUSE
```

Do not include extra fields in JSON bodies. The app uses `forbidNonWhitelisted: true`, so unknown fields are rejected.

`dateNeeded` should be a valid date string. `startTime` and `offeredEndTime` must use `HH:mm`, for example `10:00` or `14:30`.

## Useful Debug Requests

Customer or provider request list:

```http
GET {{baseUrl}}/service-requests
```

Request details:

```http
GET {{baseUrl}}/service-requests/{{requestId}}
```

Provider calendar:

```http
GET {{baseUrl}}/service-requests/calendar
```

Admin all requests, if you have an admin token:

```http
GET {{baseUrl}}/admin/requests
```

