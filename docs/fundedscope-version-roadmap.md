# FundedScope Version Roadmap

FundedScope should be positioned as:

```text
Trade Smarter. Choose Better.
```

Long-form positioning:

```text
The intelligence platform every trader checks before they trade.
```

This roadmap keeps the company focused on what to build now, what to improve next and what to save for later.

## Version 1.0 — Launch foundation

Goal: prove FundedScope is a real, trusted trader intelligence product.

### Product

- Public website live on `myfundedscope.com`.
- SEO foundations:
  - sitemap;
  - robots;
  - metadata;
  - Organization schema;
  - brand articles;
  - About page.
- Prop firm directory.
- Individual prop firm pages.
- Basic comparison.
- Basic spread intelligence.
- Calculator/tools pages.
- Pricing page.
- Legal/trust pages.
- Supabase production project.
- Initial production tables:
  - `profiles`;
  - `prop_firms`;
  - `prop_firm_challenges`;
  - `prop_firm_rules`.

### Intelligence

- Public scoring explanation.
- Early Confidence Score logic.
- Verified by FundedScope™ concept.
- Rule History™ concept.
- Trader DNA™ onboarding concept.

### Admin/data

- Migration structure in Git.
- No more manually creating random tables.
- Admin dashboard planned but not yet complete.

### Success criteria

- Site is indexable.
- Core pages load fast.
- Users understand what FundedScope is.
- Founder can start manually verifying 20-30 firms.
- Supabase schema is pulled/confirmed exactly.

## Version 1.5 — First serious product

Goal: move from static product to database-backed intelligence platform.

### Product

- Supabase Auth connected:
  - sign up;
  - login;
  - password reset;
  - email verification;
  - secure sessions.
- Profiles connected to `profiles`.
- Prop firm pages connected to database.
- Challenges/rules connected to database.
- Admin panel MVP:
  - add/edit prop firms;
  - add/edit challenges;
  - add/edit rules;
  - source URL;
  - last verified;
  - verified by;
  - publish/unpublish.
- Verified by FundedScope™ badge live.
- Rule History™ table and UI.
- Reviews MVP with moderation.
- Watchlist/saved firms MVP.

### Data

- 20-30 high-quality verified prop firms.
- Each firm has:
  - company details;
  - challenge rows;
  - key rules;
  - payout information;
  - platform information;
  - verification status.

### Monetization

- Stripe test mode connected.
- Pro subscription skeleton.
- Affiliate disclosure and affiliate link routing.

### Success criteria

- Founder can update firm data without developer.
- Users can trust when a profile was last checked.
- Public pages no longer rely primarily on mock data.

## Version 2.0 — FundedScope Intelligence System™

Goal: create the secret sauce that separates FundedScope from normal comparison sites.

### Intelligence systems

- FundedScope Confidence Score™ for prop firms live.
- FundedScope Confidence Score™ for brokers live.
- Verified by FundedScope™ workflow live.
- Rule History™ live.
- Broker Intelligence™ live.
- Trader DNA™ recommendations live.
- Market Health™ daily dashboard live.

### Broker intelligence

- Broker database launched with 15-20 major brokers:
  - Exness;
  - IC Markets;
  - Pepperstone;
  - Vantage;
  - Eightcap;
  - Tickmill;
  - FP Markets;
  - Fusion Markets;
  - OANDA;
  - FOREX.com;
  - CMC Markets;
  - IG;
  - XM;
  - HFM;
  - AvaTrade;
  - XTB;
  - Admirals;
  - Swissquote;
  - Saxo.
- Broker profile pages.
- Broker regulation data.
- Broker account types.
- Broker instruments.
- Deposits/withdrawals.
- Platforms/features/support.
- Broker reviews.
- Instrument-level comparison:
  - Gold/XAUUSD;
  - EURUSD;
  - GBPUSD;
  - BTCUSD;
  - NAS100;
  - US30.

### External APIs

- Twelve Data live market data.
- GNews live news.
- Resend transactional emails.
- Stripe production subscriptions.
- GA4 and Clarity analytics.

### Success criteria

- Traders can compare firms and brokers by real decision factors.
- Premium has a clear reason to exist.
- FundedScope becomes a daily research habit.

## Version 3.0 — Trading operating system

Goal: become the platform traders open before every trading day.

### Product

- AI Coach connected to Trader DNA.
- Weekly AI trading review.
- Trading journal with screenshots.
- Trade Readiness™:
  - Ready;
  - Wait;
  - Do not trade.
- Market Health™ per instrument/session.
- Alerts:
  - rule changes;
  - spread changes;
  - broker updates;
  - prop firm discounts;
  - major news;
  - personal risk warnings.
- Personal dashboards.
- Public verified trader/review reputation layer.
- Business/API access for partners.

### Moat

FundedScope becomes harder to replace because it remembers:

- trader goals;
- trade history;
- mistakes;
- psychology;
- markets;
- brokers;
- prop accounts;
- performance patterns.

### Success criteria

Traders say:

```text
Open FundedScope before you place your first trade.
```

## What not to build yet

Do not build these before the core database/admin/scoring foundation is stable:

- fully autonomous AI trading recommendations;
- hundreds of shallow firm/broker profiles;
- complex social network features;
- paid API product;
- enterprise dashboards;
- mobile app;
- advanced TradingView/MT5 integrations.

## Company standard

Every release must answer:

```text
Will this help traders make better decisions than they could yesterday?
```

If yes, it belongs on the roadmap.

If no, postpone it.
