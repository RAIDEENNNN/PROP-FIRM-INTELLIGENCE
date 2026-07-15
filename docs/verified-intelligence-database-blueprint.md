# FundedScope Verified Intelligence Database Blueprint

FundedScope should not be a shallow listing site. The product standard is to become the world's most trusted prop firm and broker intelligence database.

The database must support:

- verified firm/broker profiles;
- field-level sources;
- last-checked timestamps;
- rule and pricing history;
- admin verification workflow;
- user reviews;
- instrument-level broker comparison;
- public trust badges such as `Public-info checked by FundedScope`.

Do not create these tables blindly in production. First pull and confirm the existing Supabase production schema. Then add new tables through versioned SQL migrations in dependency order.

## Core verification model

Every important data point should be able to answer:

- What is the value?
- Where did it come from?
- Who verified it?
- When was it last checked?
- What official URL supports it?
- Did the value change over time?

Recommended shared verification fields:

```text
source_url
source_label
verified_by
last_verified_at
verification_status
published
created_at
updated_at
```

Recommended verification statuses:

```text
unverified
pending_review
verified
needs_update
rejected
archived
```

## Prop firm intelligence

Launch with 20-30 high-quality firms, not hundreds of incomplete profiles.

Priority firms:

- FTMO
- FundedNext
- The5ers
- Funding Pips
- E8 Markets
- Topstep
- Blueberry Funded
- Alpha Capital Group
- Goat Funded Trader
- AquaFunded
- ThinkCapital
- BrightFunded
- Maven Trading
- Funded Trading Plus
- MyFundedFX
- City Traders Imperium

### Prop firm profile fields

Store each prop firm as its own profile:

```text
company_name
slug
logo_url
website_url
affiliate_url
headquarters
founded_year
supported_countries
restricted_countries
languages
trust_score
fundedscope_score
verified_by_fundedscope
last_verified_at
official_website
status
```

### Prop firm challenges

Store every account/challenge separately, not just one generic row.

Example rows:

```text
10K Challenge
25K Challenge
50K Challenge
100K Challenge
200K Challenge
```

Each challenge should store:

```text
prop_firm_id
name
account_size
price
currency
profit_target_phase_one
profit_target_phase_two
daily_drawdown
maximum_drawdown
refundable_fee
profit_split
minimum_trading_days
maximum_trading_days
evaluation_type
platforms
source_url
last_verified_at
```

### Prop firm rules

Rules are where FundedScope becomes different.

Track:

```text
weekend_holding
overnight_holding
news_trading
scalping
ea_allowed
copy_trading
martingale
grid_trading
vpn_allowed
high_frequency_trading
consistency_rule
maximum_lot_size
inactivity_rule
restricted_countries
```

The existing `prop_firm_rules` table can store flexible rules by category/title/value. If the UI needs faster filtering later, add normalized boolean/rule summary tables.

### Prop firm payments

Recommended future table: `prop_firm_payment_methods`

Fields:

```text
prop_firm_id
method
minimum_payout
payout_frequency
fee
processing_time
crypto_supported
bank_transfer_supported
wise_supported
rise_supported
deel_supported
source_url
last_verified_at
```

### Prop firm platforms

Recommended future table: `prop_firm_platforms`

Supported values:

```text
MT4
MT5
cTrader
DXTrade
TradeLocker
MatchTrader
```

### Prop firm support

Recommended future table: `prop_firm_support_channels`

Fields:

```text
prop_firm_id
email
live_chat
discord
telegram
working_hours
average_response_time
source_url
last_verified_at
```

### Prop firm reviews

Users should rate separate dimensions:

```text
challenge_rating
support_rating
payout_rating
rules_rating
overall_rating
review_body
status
verified_payout
```

Reviews should stay `pending_review` until admin/editor approval.

### Prop firm history

Recommended future table: `prop_firm_rule_history`

Examples:

```text
2026-01-10 | Profit split changed from 80% to 90%
2026-03-02 | Removed minimum trading days
2026-06-14 | Changed daily drawdown
```

Fields:

```text
prop_firm_id
field_name
old_value
new_value
change_summary
source_url
changed_at
verified_by
created_at
```

### Public-info checked by FundedScope badge

Only show this when manually checked:

- challenge rules;
- pricing;
- payout information;
- platforms;
- contact information;
- company details;
- source URLs;
- last verification date.

Public display:

```text
✅ Public-info checked by FundedScope
Last reviewed: 10 July 2026
```

## Broker intelligence

Broker profiles should be deeper than prop firm profiles because live traders may use broker intelligence every day.

Launch with 15-20 major brokers:

- Exness
- IC Markets
- Pepperstone
- Vantage
- Eightcap
- Tickmill
- FP Markets
- Fusion Markets
- OANDA
- FOREX.com
- CMC Markets
- IG
- XM
- HFM / HotForex
- AvaTrade
- XTB
- Admirals
- Swissquote
- Saxo

### Broker profile fields

Recommended table: `brokers`

```text
broker_name
slug
logo_url
website_url
affiliate_url
founded_year
headquarters
countries_served
languages
trust_score
fundedscope_score
verified_by_fundedscope
last_verified_at
status
```

### Broker regulations

Recommended table: `broker_regulations`

Regulation is one of the most important broker sections.

Fields:

```text
broker_id
regulator
licence_number
country
entity_name
licence_status
verification_link
negative_balance_protection
segregated_client_funds
last_verified_at
```

### Broker trading accounts

Recommended table: `broker_accounts`

Examples:

```text
Standard
Pro
Raw Spread
Zero
Islamic
Demo
```

Fields:

```text
broker_id
account_name
minimum_deposit
commission
spread_type
swap_type
maximum_leverage
minimum_lot
maximum_lot
margin_call
stop_out
platforms
base_currencies
source_url
last_verified_at
```

### Broker instruments

Recommended table: `broker_instruments`

Store every instrument, not just broad categories.

Examples:

```text
XAUUSD
EURUSD
GBPUSD
USDJPY
BTCUSD
ETHUSD
US30
NAS100
GER40
Oil
Silver
```

Fields:

```text
broker_id
symbol
instrument_name
asset_class
average_spread
minimum_spread
commission
swap_long
swap_short
trading_hours
maximum_leverage
contract_size
source_url
last_verified_at
```

### Broker deposits

Recommended table: `broker_deposit_methods`

Fields:

```text
broker_id
method
processing_time
fee
minimum_deposit
maximum_deposit
source_url
last_verified_at
```

### Broker withdrawals

Recommended table: `broker_withdrawal_methods`

Fields:

```text
broker_id
method
fee
average_processing_time
minimum_withdrawal
maximum_withdrawal
source_url
last_verified_at
```

### Broker platforms

Recommended table: `broker_platforms`

Supported values:

```text
MT4
MT5
TradingView
cTrader
DXTrade
MatchTrader
WebTrader
Mobile App
```

### Broker features

Recommended table: `broker_features`

Track:

```text
copy_trading
vps
api
islamic_account
demo
social_trading
ea_support
scalping
news_trading
hedging
```

### Broker support

Recommended table: `broker_support_channels`

Fields:

```text
broker_id
live_chat
email
phone
telegram
whatsapp
discord
working_hours
average_response_time
source_url
last_verified_at
```

### Broker reviews

Users should rate:

```text
deposits_rating
withdrawals_rating
support_rating
execution_rating
spreads_rating
overall_rating
review_body
status
```

### Broker history

Recommended table: `broker_history`

Examples:

```text
2026-03 | Reduced Gold spread
2026-07 | Added TradingView integration
2026-09 | Introduced new Raw account
```

### Broker performance metrics

Recommended table: `broker_performance_metrics`

Fields:

```text
broker_id
metric_date
average_eurusd_spread
average_gold_spread
withdrawal_speed
support_response_time
execution_speed
slippage_rating
trust_score
complaint_ratio
uptime
source_url
last_verified_at
```

### Broker FundedScope score

Broker pages should show:

```text
Overall: 9.4 / 10
Regulation
Execution
Spreads
Withdrawals
Support
Platforms
Transparency
```

Each category must explain why the broker earned its score.

### Compare brokers by instrument

This is a key differentiator.

Users should be able to compare brokers by instrument:

```text
Gold / XAUUSD
EURUSD
GBPUSD
BTCUSD
NAS100
US30
```

For each instrument, compare:

```text
average_spread
minimum_spread
commission
swap_long
swap_short
maximum_leverage
execution_speed
regulation_score
```

This is more useful than giving every broker one generic ranking.

## Admin panel requirements

The admin panel must let trusted staff:

- add/edit prop firms;
- upload/update logos;
- add/edit challenges;
- add/edit firm rules;
- record source URL;
- record verified by;
- record last verified date;
- publish/unpublish profiles;
- add/edit brokers;
- add/edit broker accounts;
- add/edit broker instruments;
- add/edit regulations;
- update spreads;
- approve/reject reviews;
- view change history;
- manage notifications.

No developer should be required every time a firm or broker changes its rules.

## Daily verification workflow

Every morning:

1. Review one or two firms/brokers.
2. Visit the official website.
3. Read current rules/pricing/conditions.
4. Update FundedScope through the admin panel.
5. Record:
   - source URL;
   - date checked;
   - who verified it;
   - what changed.

After 30 days, FundedScope should have a high-quality verified database instead of a broad but shallow list.

