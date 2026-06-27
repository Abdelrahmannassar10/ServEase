# ServEase Backend

ServEase is a NestJS backend for a service marketplace where customers can book trusted providers, providers can manage direct and broadcast requests, and admins can supervise users, approvals, requests, payments, and platform settings.

The backend includes authentication, role-based authorization, provider onboarding, service requests, broadcast offers, request lifecycle management, email notifications, reviews, payments, file uploads, statistics, and a WebSocket chatbot integration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Authentication and Roles](#authentication-and-roles)
- [API Overview](#api-overview)
- [Service Request Workflow](#service-request-workflow)
- [Email Notifications](#email-notifications)
- [Chat WebSocket](#chat-websocket)
- [Database Seeding](#database-seeding)
- [Deployment](#deployment)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Features

- Customer registration, login, email verification, password reset, and profile management.
- Provider registration with CV and ID card uploads.
- Admin approval, rejection, search, dashboard statistics, and user management.
- JWT authentication with role-based guards for Customer, Provider, and Admin.
- Direct service requests between customers and providers.
- Broadcast service requests that match multiple providers by service and location.
- Provider offers, counter-offers, acceptance, rejection, cancellation, and completion flows.
- Provider busy-time protection for direct requests.
- Fixed-price and hourly service flows.
- Completion-code based service completion.
- Provider calendar for confirmed requests.
- Automatic email notifications for request lifecycle events.
- Reviews for providers and completed requests.
- Provider debt payment flow through Paymob.
- Cloudinary upload support for profile images, CVs, and ID cards.
- Socket.IO chatbot gateway with persistent chat history.
- Cron handling for outdated confirmed requests.
- Fake data seeding for local development and demos.

## Tech Stack

- Runtime: Node.js
- Framework: NestJS
- Language: TypeScript
- Database: MongoDB
- ODM: Mongoose
- Authentication: Passport, JWT, Local Strategy, Google OAuth
- Realtime: Socket.IO WebSockets
- Email: Resend
- Uploads: Multer and Cloudinary
- Payments: Paymob
- Validation: class-validator and class-transformer
- Testing: Jest and Supertest
- Package manager: pnpm

## Project Structure

```text
src/
  app.module.ts
  main.ts
  config/
    env/
      dev.config.ts
  common/
    decorators/
    guard/
    helper/
    interceptors/
    strategy/
    types/
    cloudinary/
  database/
    seed-fake-data.ts
  models/
    abstract.repository.ts
    admin/
    chat/
    common/
    customer/
    general-settings/
    provider/
    provider-offer/
    reviews/
    service/
    service-request/
    token/
  modules/
    admin/
    auth/
    chat/
    common/
    customer/
    general-setting/
    payment/
    provider/
    review/
    service/
    service-request/
  shared/
    modules/
test/
```

## Getting Started

### Prerequisites

- Node.js 22 or newer
- pnpm 10
- MongoDB database
- Resend API key for email delivery
- Cloudinary account if using file uploads
- Paymob credentials if using provider debt payments

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

Create a `.env` file in the project root.

```env
PORT=3000
DB_URL=mongodb+srv://user:password@cluster/database

JWT_SECRET=replace-with-a-strong-secret
ENCRYPTION_SECRET_KEY=replace-with-a-32-plus-character-secret

FRONTEND_URL=http://localhost:5173
CHATBOT_API_URL=http://localhost:8000/chat

RESEND_API_KEY=re_xxxxxxxxx

EMAIL_USER=
EMAIL_PASS=

CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

PAYMOB_API_KEY=your-paymob-api-key
PAYMOB_INTEGRATION_ID=your-paymob-integration-id
PAYMOB_IFRAME_ID=your-paymob-iframe-id
PAYMOB_BASE_URL=https://accept.paymob.com/api
PAYMOB_CURRENCY=EGP
PAYMOB_HMAC=your-paymob-hmac-secret
```

Important: `CloudinaryService` currently reads `CLOUD_NAME`, `API_KEY`, and `API_SECRET`.

### Run Locally

```bash
pnpm run start:dev
```

The API starts on:

```text
http://localhost:3000
```

Health check:

```text
GET /
```

## Scripts

```bash
pnpm run start          # Start NestJS
pnpm run start:dev      # Start in watch mode
pnpm run start:debug    # Start in debug watch mode
pnpm run start:prod     # Start compiled production build
pnpm run build          # Compile TypeScript
pnpm run lint           # Run ESLint with auto-fix
pnpm run format         # Run Prettier
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:cov       # Run test coverage
pnpm run test:e2e       # Run e2e tests
pnpm run seed:fake      # Seed fake demo data
```

## Authentication and Roles

The backend uses JWT authentication and role-based guards.

Roles:

- `Customer`
- `Provider`
- `Admin`

Protected requests should include:

```http
Authorization: Bearer <access_token>
```

Authentication strategies:

- `local` for customer/provider login
- `admin-local` for admin login
- `jwt` for protected HTTP routes
- `google` for Google OAuth
- WebSocket JWT guard for chat events

## API Overview

This is a high-level route map. Some routes require JWT authentication and specific roles.

### Auth

```text
POST /auth/register/customer
POST /auth/register/provider
POST /auth/login
GET  /auth/google
GET  /auth/google/callback
POST /auth/confirm-email
POST /auth/refresh-token
POST /auth/resend-otp
POST /auth/forget-passwordOTP
POST /auth/check-forget-password-otp
POST /auth/change-password-after-otp
POST /auth/logout
```

### Admin

```text
POST /admin/create
POST /admin/login
GET  /admin/dashboard-stats
GET  /admin/pending-providers
POST /admin/active-provider/:providerId
POST /admin/reject-provider
GET  /admin/customers
GET  /admin/providers
GET  /admin
GET  /admin/user/:userId
GET  /admin/pending-approvals-details
GET  /admin/search-admin
POST /admin/delete/:Id
GET  /admin/requests
GET  /admin/request/:id
POST /admin/logout
```

### Customers

```text
GET  /customer
GET  /customer/:id
POST /customer/update-profile
POST /customer/update-password
GET  /customer/providers/:serviceId
POST /customer/delete-account
```

### Providers

```text
GET    /provider
GET    /provider/:id
POST   /provider/profile
POST   /provider/update-password
DELETE /provider/soft-delete
```

### Services

```text
POST   /service/add
GET    /service/all
DELETE /service/:id
```

### Service Requests

```text
POST  /service-requests
GET   /service-requests
GET   /service-requests/:id
GET   /service-requests/get-requests

PATCH /service-requests/provider-accept
PATCH /service-requests/provider-reject
PATCH /service-requests/customer-accept
PATCH /service-requests/customer-reject
PATCH /service-requests/customer-cancel
PATCH /service-requests/provider-cancel
PATCH /service-requests/complete
PATCH /service-requests/complete-hourly
GET   /service-requests/calendar

POST  /service-requests/broadcast
GET   /service-requests/broadcast/available
POST  /service-requests/broadcast/respond
GET   /service-requests/broadcast/:id/offers
PATCH /service-requests/broadcast/select-offer
PATCH /service-requests/broadcast/complete-hourly
PATCH /service-requests/broadcast/cancel
```

### Reviews

```text
POST   /review/global-review
GET    /review/global-reviews
POST   /review/request-review
GET    /review/provider-reviews/:providerId
GET    /review/request-reviews
DELETE /review/delete-review/:reviewId
```

### Common and Statistics

```text
POST /common/upload-photo
GET  /common/general-counts
GET  /common/users-growth
GET  /common/requests-status-statistics
```

### General Settings

```text
GET   /general-setting
PATCH /general-setting
```

### Payments

```text
POST /payments/provider-debt
POST /payments/paymob-webhook
```

## Service Request Workflow

### Direct Request

1. Customer creates a request for a specific provider.
2. The backend checks for duplicate customer requests at the same date/time.
3. The backend checks if the provider is already busy with a confirmed request at the selected time.
4. Provider accepts or rejects the request.
5. For fixed-price requests, the customer confirms or rejects the provider offer.
6. For hourly requests, acceptance can confirm the request directly.
7. Confirmed requests are added to the provider calendar.
8. Customer completes the request using the completion code.
9. Provider debt and platform revenue are updated when applicable.

Provider busy-time rule:

- A customer cannot create a direct request if the selected `startTime` falls inside a provider's confirmed request window on the same day.
- The conflict check compares the new request start time against confirmed request `startTime` and `endTime`.

### Broadcast Request

1. Customer creates a broadcast request for a service and location.
2. Matching providers are selected by service, governorate/district, and optional top-rated filter.
3. Providers can refuse, accept, or send a counter-offer.
4. Direct accept can confirm the request.
5. Counter-offers can be reviewed and selected by the customer.
6. Other pending offers expire after a provider is confirmed.
7. Broadcast requests can be cancelled while still open.

## Email Notifications

The project uses Resend through:

```text
src/common/helper/email.helper.ts
```

Templates live in:

```text
src/config/env/dev.config.ts
```

Request lifecycle notifications include:

- New direct request sent to provider
- New broadcast request sent to matched providers
- Provider accepted request
- Provider rejected request
- Provider sent counter-offer
- Request confirmed for customer and provider
- Customer rejected offer
- Customer cancelled request
- Provider cancelled request
- Broadcast request cancelled
- Service completed for customer and provider

Email sending is intentionally non-blocking for business actions. If email delivery fails, the request state change still succeeds and the error is logged with Nest `Logger.warn`.

More detail is documented in:

```text
REQUEST_EMAIL_NOTIFICATIONS_PLAN.md
```

## Chat WebSocket

The chat gateway uses Socket.IO on the `/chat` namespace.

Namespace:

```text
/chat
```

Events:

```text
chat:message
chat:history
chat:response
chat:error
```

The gateway requires a valid JWT and allows Customer and Provider roles.

The chatbot service calls `CHATBOT_API_URL`, retries temporary failures, and stores chat history in MongoDB.

## Database Seeding

Seed fake data:

```bash
pnpm run seed:fake
```

The seed script requires:

```env
DB_URL=mongodb://...
```

It creates demo customers, providers, services, and request-related data for local development and testing.

## Deployment

The repository includes `render.yaml` for Render deployment.

Build command:

```bash
corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm run build
```

Start command:

```bash
pnpm run start:prod
```

Production entry point:

```bash
node dist/main
```

Make sure production environment variables match the variables used by the application, especially:

- `DB_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `FRONTEND_URL`
- `CHATBOT_API_URL`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`
- Paymob variables if payment is enabled

## Verification

Run a production build:

```bash
pnpm run build
```

Run tests:

```bash
pnpm run test
pnpm run test:e2e
```

Check the app starts:

```bash
pnpm run start:dev
```

Then open:

```text
http://localhost:3000
```

## Troubleshooting

### MongoDB connection fails

Check that `DB_URL` exists in `.env` and points to a reachable MongoDB database.

### Emails are not sent

Check:

- `RESEND_API_KEY`
- Sender domain verification in Resend
- Server logs for `Email notification failed`

### Cloudinary uploads fail

Check:

- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`
- Uploaded file size and type

### Google OAuth callback fails

The Google strategy currently uses:

```text
http://localhost:3000/auth/google/callback
```

Make sure the same callback URL is configured in the Google Cloud Console for local development.

### Provider appears unavailable

Direct request creation blocks the request when the provider already has a confirmed request on the same day and selected time window.

### Chatbot does not respond

Check:

- `CHATBOT_API_URL`
- Chatbot service availability
- JWT sent by the Socket.IO client
- Server logs for chatbot timeout or retry errors

## License

This project is private and currently marked as `UNLICENSED` in `package.json`.
