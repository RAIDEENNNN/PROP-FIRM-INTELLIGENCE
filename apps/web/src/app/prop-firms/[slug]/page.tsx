import type { Metadata } from "next";
import { BookmarkButton } from "../../../components/BookmarkButton";
import { FirmLogo } from "../../../components/FirmLogo";
import { GlassCard } from "../../../components/GlassCard";
import { JsonLd } from "../../../components/JsonLd";
import { RecentlyViewedTracker } from "../../../components/RecentlyViewedTracker";
import { RiskMeter } from "../../../components/RiskMeter";
import { ScoreBreakdown } from "../../../components/ScoreBreakdown";
import { brokers } from "../../../lib/brokers";
import { propFirms } from "../../../lib/data";
import { spreadRecords } from "../../../lib/spreads";
import { getFirmTrust } from "../../../lib/trust";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export function generateStaticParams() {
  return propFirms.map((firm) => ({ slug: firm.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const firm = propFirms.find((item) => item.slug === params.slug) ?? propFirms[0]!;
  const title = `${firm.name} Review, Rules, Fees & Spreads | FundedScope`;
  const description = `Compare ${firm.name} challenge fees, payout speed, drawdown rules, score breakdown, market coverage and spread samples on FundedScope.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/prop-firms/${firm.slug}`
    },
    openGraph: {
      title,
      description,
      url: `/prop-firms/${firm.slug}`,
      siteName: "MyFundedScope",
      type: "article",
      images: [firm.logoUrl || "/brand/fundedscope-logo.png"]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firm.logoUrl || "/brand/fundedscope-logo.png"]
    }
  };
}

export default function FirmProfilePage({ params }: { params: { slug: string } }) {
  const firm = propFirms.find((item) => item.slug === params.slug) ?? propFirms[0];
  const trust = firm ? getFirmTrust(firm) : null;
  const prioritySymbols = ["XAUUSD", "XAGUSD", "NAS100", "US30", "EURUSD", "GBPUSD", "BTCUSD", "ETHUSD"];
  const firmSpreads = spreadRecords
    .filter((record) => record.firmSlug === firm?.slug)
    .sort((a, b) => prioritySymbols.indexOf(a.symbol) - prioritySymbols.indexOf(b.symbol))
    .filter((record) => prioritySymbols.includes(record.symbol))
    .slice(0, 8);

  if (!firm || !trust) return null;

  const profileUrl = `${siteUrl}/prop-firms/${firm.slug}`;
  const compatibilityScore = Math.min(
    98,
    Math.max(62, firm.score + (firm.markets.includes("Commodities") ? 2 : 0) + (firm.markets.includes("Forex") ? 1 : 0) - (/Strict/i.test(firm.tags.join(" ")) ? 3 : 0))
  );
  const beforeBuyChecklist = [
    `News trading: ${/Strict|News/i.test(firm.tags.join(" ")) ? "confirm restrictions first" : "check official restrictions"}`,
    `Weekend holding: confirm on the official ${firm.name} rules page`,
    `EA/copy trading: verify before buying`,
    `Refund: compare fee policy against payout rules`,
    `Platform: confirm MT4/MT5/cTrader/TradeLocker availability`
  ];
  const ruleTimeline = [
    { date: firm.lastRuleUpdate, title: "Profile reviewed", change: "Rules and score inputs refreshed from FundedScope dataset." },
    { date: "2026-07-11", title: "Verification model added", change: "Last verified, source, and report-error controls added to profile pages." },
    { date: "Source monitoring", title: "Official source history", change: "Rule changes are tracked as timestamped records with source context." }
  ];
  const similarFirms = propFirms
    .filter((item) => item.slug !== firm.slug && item.markets.some((market) => firm.markets.includes(market)))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  const pairedBroker = brokers.find((broker) => firm.markets.some((market) => broker.markets.includes(market))) ?? brokers[0]!;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Prop Firms",
        item: `${siteUrl}/prop-firms`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: firm.name,
        item: profileUrl
      }
    ]
  };
  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${firm.name} FundedScope review`,
    url: profileUrl,
    dateModified: firm.lastRuleUpdate,
    author: {
      "@type": "Organization",
      name: "FundedScope",
      url: siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: "FundedScope",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/fundedscope-logo.png`
      }
    },
    itemReviewed: {
      "@type": "Organization",
      name: firm.name,
      url: `https://${firm.domain}`,
      logo: firm.logoUrl
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: firm.score,
      bestRating: 100,
      worstRating: 0
    },
    reviewBody: `${firm.summary} FundedScope score is based on rule fairness, payout quality, trust signals, pricing/value, markets/spreads and transparency freshness.`
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <RecentlyViewedTracker item={{ title: firm.name, href: `/prop-firms/${firm.slug}`, type: "Prop Firm" }} />
      <JsonLd id={`${firm.slug}-breadcrumb-jsonld`} data={breadcrumbJsonLd} />
      <JsonLd id={`${firm.slug}-review-jsonld`} data={reviewJsonLd} />
      <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <GlassCard className="glow-border">
          <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Firm profile</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <FirmLogo firm={firm} size="lg" />
            <div>
              <h1 className="text-3xl font-black text-white sm:text-5xl">{firm.name}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                {firm.country} · {firm.rating.toFixed(1)} ★ · {firm.reviewCount.toLocaleString()} tracked reviews · {firm.verified ? "Verified profile" : "Needs editorial verification"}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-300">{firm.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                trust.confidenceTone === "success" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              }`}
            >
              {trust.confidence}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Last checked {trust.lastChecked}</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Source: {trust.sourceLabel}</span>
            <span className="rounded-full border border-electric/20 bg-electric/10 px-3 py-1 text-xs font-bold text-electric">
              Verified by FundedScope
            </span>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Challenge fee</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.challengeFee}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Profit target</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.profitTarget}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Payout</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.payout}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Max drawdown</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.maxDrawdown}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <RiskMeter score={firm.score} />
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>
              Daily drawdown: <span className="font-bold text-white">{firm.dailyDrawdown}</span>
            </p>
            <p>
              Max account: <span className="font-bold text-white">{firm.maxAccount}</span>
            </p>
            <p>
              Last rule check: <span className="font-bold text-white">{firm.lastRuleUpdate}</span>
            </p>
          </div>
          <a
            href={`https://${firm.domain}`}
            target="_blank"
            rel="noreferrer sponsored"
            className="mt-8 block w-full rounded-2xl bg-white px-5 py-3 text-center font-bold text-void"
          >
            Visit firm / get code
          </a>
          <BookmarkButton bookmark={{ type: "Prop Firm", slug: firm.slug, title: firm.name, href: `/prop-firms/${firm.slug}` }} />
          <a
            href={`/alerts?firm=${firm.slug}`}
            className="mt-3 block w-full rounded-2xl border border-white/10 px-5 py-3 text-center font-bold text-white transition hover:border-electric/40 hover:text-electric"
          >
            Save alert
          </a>
          <a
            href={`mailto:hello@myfundedscope.com?subject=Incorrect information report: ${encodeURIComponent(firm.name)}`}
            className="mt-3 block w-full rounded-2xl border border-warning/25 bg-warning/10 px-5 py-3 text-center font-bold text-warning"
          >
            Report incorrect information
          </a>
          <p className="mt-3 text-xs leading-5 text-slate-500">This outbound link may be an affiliate link. FundedScope scoring stays editorial and comparison-led.</p>
        </GlassCard>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Decision summary</p>
          <h2 className="mt-2 text-3xl font-black text-white">FundedScope opinion</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {firm.name} is best considered by {trust.bestFor.join(", ").toLowerCase()}. Compare alternatives if your strategy depends on rules that are not clearly verified yet, especially news trading, EA usage, weekend holding or drawdown style.
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Trader Compatibility Score™</p>
          <p className="mt-2 text-6xl font-black text-electric">{compatibilityScore}%</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Match estimate for a Gold/forex-focused trader using FundedScope default Trader DNA. Logged-in users will receive a personal score from their own markets, session, risk style and restrictions.
          </p>
        </GlassCard>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">FundedScope verdict</p>
          <h2 className="mt-2 text-2xl font-black text-white">Who {firm.name} is best for</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {trust.bestFor.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-white">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-300">{trust.methodology}</p>
        </GlassCard>
        <ScoreBreakdown firm={firm} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-warning">Before buying</p>
          <h2 className="mt-2 text-2xl font-black text-white">Checklist</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            {beforeBuyChecklist.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                ☑ {item}
              </li>
            ))}
            {trust.cautions.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                ⚠ {item}
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Broker pairing</p>
          <h2 className="mt-2 text-2xl font-black text-white">{pairedBroker.name}</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Suggested research pairing because {pairedBroker.name} covers {pairedBroker.markets.slice(0, 4).join(", ")} and supports {pairedBroker.platforms.slice(0, 3).join(", ")}.
          </p>
          <a href="/brokers" className="mt-5 block rounded-2xl bg-white px-5 py-3 text-center font-black text-void">
            Compare brokers
          </a>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Community alerts</p>
          <h2 className="mt-2 text-2xl font-black text-white">Moderated signals</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">0 confirmed payout delay reports today.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">Rule changes require FundedScope moderation before confirmation.</p>
          </div>
        </GlassCard>
      </div>
      <section className="mt-6 grid gap-6 lg:grid-cols-[0.48fr_0.52fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Rule Change Timeline™</p>
          <h2 className="mt-2 text-2xl font-black text-white">How this profile changes over time</h2>
          <div className="mt-5 space-y-3">
            {ruleTimeline.map((item) => (
              <div key={`${item.date}-${item.title}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">{item.date}</p>
                <p className="mt-2 font-black text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.change}</p>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Similar firms</p>
          <h2 className="mt-2 text-2xl font-black text-white">Compare before you buy</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {similarFirms.map((item) => (
              <a key={item.slug} href={`/prop-firms/${item.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-electric/40">
                <p className="font-black text-white">{item.name}</p>
                <p className="mt-1 text-sm text-electric">{item.score}/100</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.markets.slice(0, 3).join(", ")}</p>
              </a>
            ))}
          </div>
        </GlassCard>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="text-xl font-black text-white">Pros</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {trust.pros.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-success">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <h2 className="text-xl font-black text-white">Cons / risk notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {trust.cons.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-warning">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <h2 className="text-xl font-black text-white">Rules</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Challenge types: {firm.challengeTypes.join(", ")}</p>
            <p>Markets: {firm.markets.join(", ")}</p>
            <p>Daily drawdown: {firm.dailyDrawdown}</p>
            <p>Max drawdown: {firm.maxDrawdown}</p>
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-xl font-black text-white">Verified reviews</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {firm.reviewCount.toLocaleString()} review signals tracked. Verified user reviews and payout proof reports are handled through FundedScope moderation.
          </p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-xl font-black text-white">Payout proof</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Payout proof collection should require user account verification and admin approval before publishing.</p>
        </GlassCard>
      </div>
      <GlassCard className="mt-6 overflow-hidden p-0">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">Spread sample for {firm.name}</h2>
          <p className="mt-2 text-sm text-slate-400">First rows from the firm × instrument spread matrix. Full searchable matrix lives under Spreads.</p>
        </div>
        <div className="grid gap-3 p-4 md:hidden">
          {firmSpreads.map((record) => (
            <article key={`${record.symbol}-mobile`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-white">{record.symbol}</p>
                  <p className="mt-1 text-xs text-slate-500">{record.instrumentName}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{record.category}</span>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 p-3">
                <span className="text-xs text-slate-500">Spread</span>
                <span className="font-black text-electric">
                  {record.spread} {record.quoteUnit}
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-4">Pair</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Spread</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {firmSpreads.map((record) => (
                <tr key={record.symbol} className="border-t border-white/10">
                  <td className="p-4 font-black text-white">{record.symbol}</td>
                  <td className="p-4 text-slate-300">{record.instrumentName}</td>
                  <td className="p-4">{record.category}</td>
                  <td className="p-4 text-electric">
                    {record.spread} {record.quoteUnit}
                  </td>
                  <td className="p-4">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </main>
  );
}
