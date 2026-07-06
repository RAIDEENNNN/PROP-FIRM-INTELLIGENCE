# Testing Checklist

## Build and type checks

- [ ] `npm install`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run prisma:generate`
- [ ] `npm run prisma:migrate`
- [ ] `npm run db:seed`

## Responsive QA

- [ ] Header logo visible on mobile
- [ ] Mobile menu opens/closes
- [ ] All nav links visible on mobile
- [ ] Home hero does not overflow
- [ ] Firm cards stack correctly
- [ ] Directory filters stack correctly
- [ ] Compare cards are usable on mobile
- [ ] Spread matrix cards are usable on mobile
- [ ] Pricing cards and comparison matrix work on mobile
- [ ] Footer links wrap cleanly

## Auth QA

- [ ] Sign up creates user
- [ ] Duplicate email returns 409
- [ ] Sign in returns access and refresh tokens
- [ ] Invalid password returns 401
- [ ] Refresh rotates token
- [ ] Logout clears refresh token hash
- [ ] Protected routes reject missing token

## API QA

- [ ] `GET /api/health`
- [ ] `GET /api/firms`
- [ ] `GET /api/firms/:slug`
- [ ] `POST /api/compare`
- [ ] `POST /api/compare/recommendations`
- [ ] `GET /api/spreads/instruments`
- [ ] `GET /api/spreads/records`
- [ ] `GET /api/news`
- [ ] `POST /api/alerts`
- [ ] `POST /api/reviews`
- [ ] `GET /api/admin/overview` as admin

## Billing QA

- [ ] Stripe key present
- [ ] Checkout session returns URL
- [ ] Billing portal returns URL for customer
- [ ] Webhook endpoint configured with raw body before live use

## Data QA

- [ ] Seed creates firms
- [ ] Seed creates accounts
- [ ] Seed creates rules
- [ ] Seed creates instruments
- [ ] Seed creates spread records
- [ ] Maven Trading and every tracked firm have XAUUSD and XAGUSD spread rows
- [ ] Spread search finds XAUUSD, XAGUSD, NAS100 and US30
- [ ] Seed creates launch news
- [ ] Optional admin user created only with real admin env values

## Security QA

- [ ] Admin routes reject non-admin users
- [ ] Review moderation requires admin
- [ ] Spread import requires admin
- [ ] News creation requires admin
- [ ] Validation errors return 400
- [ ] No secrets committed

## Launch QA

- [ ] Domain connected
- [ ] HTTPS enabled
- [ ] Analytics installed
- [ ] Error monitoring installed
- [ ] Privacy/Terms/Affiliate Disclosure published
- [ ] Sitemap submitted
- [ ] Soft launch user feedback collected
