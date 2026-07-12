# Sitemap Deployment Audit

Use this checklist after each deployment that changes public routes, `sitemap.ts`, `robots.ts`, or canonical domain settings.

## Robots

- Confirm `https://myfundedscope.com/robots.txt` returns HTTP 200.
- Confirm `/_next/` is not disallowed. Google must be able to crawl Next.js JavaScript and CSS assets to render pages correctly.
- Confirm private routes remain disallowed:
  - `/admin`
  - `/api/`
  - `/dashboard`
  - `/profile`
  - `/settings`
  - `/journal`
  - `/alerts`
  - `/welcome`
  - `/onboarding-complete`
  - `/sign-in`
  - `/sign-up`
  - `/report`
- Confirm the sitemap line is present:
  - `Sitemap: https://myfundedscope.com/sitemap.xml`

## Sitemap

- Confirm `https://myfundedscope.com/sitemap.xml` returns HTTP 200.
- Confirm `Content-Type` is `application/xml` or `text/xml`.
- Confirm there are no redirects for `/sitemap.xml`.
- Confirm every URL uses the canonical domain:
  - `https://myfundedscope.com/...`
- Confirm no route-group names appear:
  - bad: `/(marketing)/...`
- Confirm no dynamic placeholders appear:
  - bad: `/prop-firms/[slug]`
  - bad: `/brokers/[slug]`
- Confirm private routes are excluded:
  - `/admin`
  - `/api`
  - `/dashboard`
  - `/profile`
  - `/settings`
  - `/sign-in`
  - `/sign-up`
  - `/alerts`
  - `/journal`
  - `/report`
- Confirm duplicate URLs are not present.
- Confirm every submitted URL returns HTTP 200.
- Confirm prop firm pages are generated from current prop firm data.
- Confirm article pages are generated from current article data.
- Confirm broker profile pages appear only after the real `/brokers/[slug]` route exists.

## Search Console

- Open the URL-prefix property for `https://myfundedscope.com/`.
- Confirm the sitemap remains successfully submitted.
- If a new sitemap is submitted, use:
  - `sitemap.xml`
- Reinspect a representative public page after deployment:
  - homepage
  - one prop firm page
  - one article page
