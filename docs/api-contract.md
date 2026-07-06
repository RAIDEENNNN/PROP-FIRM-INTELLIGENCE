# API Contract

Base URL: `/api`

## Health

- `GET /health`

## Auth

- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

## User and profile

- `GET /users/me`
- `PATCH /users/me`
- `GET /trader-profile`
- `PUT /trader-profile`

## Prop firms

- `GET /firms`
- `GET /firms/:slug`
- `GET /firms/:slug/rules/history`

## Comparison and recommendations

- `POST /compare`
- `POST /compare/recommendations`

## Spreads

- `GET /spreads/instruments`
- `GET /spreads/records`
- `POST /spreads/records`

## News

- `GET /news`
- `POST /news`

## Alerts

- `GET /alerts`
- `POST /alerts`
- `PATCH /alerts/:id`

## Reviews

- `GET /reviews/firm/:firmId`
- `POST /reviews`

## Billing

- `POST /billing/checkout`
- `POST /billing/portal`
- `POST /billing/webhook`

## Tools

- `POST /tools/lot-size`
- `POST /tools/drawdown`
- `POST /tools/profit-target`

## Admin

- `GET /admin/overview`
- `GET /admin/audit-logs`
- `POST /admin/firms`
