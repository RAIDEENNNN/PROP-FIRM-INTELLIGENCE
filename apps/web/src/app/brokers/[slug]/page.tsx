import type { Metadata } from "next";
import { BrokerConfidenceScore } from "../../../components/BrokerConfidenceScore";
import { BrokerLogo } from "../../../components/BrokerLogo";
import { GlassCard } from "../../../components/GlassCard";
import { JsonLd } from "../../../components/JsonLd";
import { RecentlyViewedTracker } from "../../../components/RecentlyViewedTracker";
import { brokers } from "../../../lib/brokers";
import { marketEvents, volatilityMeters } from "../../../lib/market-intelligence";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export function generateStaticParams() {
  return brokers.map((broker) => ({ slug: broker.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const broker = brokers.find((item) => item.slug === params.slug) ?? brokers[0]!;
  const title = `${broker.name} Review, Regulation, Accounts & Spreads | FundedScope`;
  const description = `Research ${broker.name} regulation, trading platforms, account types, supported markets, withdrawal methods, support options and FundedScope Confidence Score.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/brokers/${broker.slug}`
    },
    openGraph: {
      title,
      description,
      url: `/brokers/${broker.slug}`,
      siteName: "MyFundedScope",
      type: "article",
      images: [broker.logoUrl || "/brand/fundedscope-logo.png"]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [broker.logoUrl || "/brand/fundedscope-logo.png"]
    }
  };
}

export default function BrokerProfilePage({ params }: { params: { slug: string } }) {
  const broker = brokers.find((item) => item.slug === params.slug) ?? brokers[0];
  if (!broker) return null;

  const profileUrl = `${siteUrl}/brokers/${broker.slug}`;
  const similarBrokers = brokers
    .filter((item) => item.slug !== broker.slug && item.markets.some((market) => broker.markets.includes(market)))
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, 4);
  const brokerReviewLabel = broker.verifiedStatus === "Public-info checked" ? "Public-info checked" : "Source-reviewed profile";
  const spreadHistory = broker.instruments.slice(0, 3).map((instrument, index) => ({
    symbol: instrument.symbol,
    now: instrument.averageSpread,
    thirtyDays: index === 0 ? "Source pending" : instrument.minimumSpread,
    note: "Numeric values stay hidden until official, platform, or feed-backed verification exists."
  }));
  const withdrawalSignal = Math.min(92, Math.max(58, broker.trustScore - (broker.withdrawals.length > 2 ? 0 : 6)));
  const integrationSignal = [
    { label: "TradingView", value: broker.features.some((feature) => /tradingview/i.test(feature)) ? "Listed" : "Not confirmed" },
    { label: "MetaTrader", value: broker.platforms.some((platform) => /MT4|MT5|MetaTrader/i.test(platform)) ? "Supported" : "Check platform" },
    { label: "Copy trading", value: broker.features.some((feature) => /copy/i.test(feature)) ? "Available" : "Not listed" },
    { label: "Country rules", value: "Verify entity" }
  ];
  const brokerRelevantNews = marketEvents
    .filter((event) => event.affectedAssets.some((asset) => broker.markets.join(" ").toLowerCase().includes(asset.toLowerCase()) || /Gold|EURUSD|GBPUSD|US30/.test(asset)))
    .slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Brokers", item: `${siteUrl}/brokers` },
      { "@type": "ListItem", position: 3, name: broker.name, item: profileUrl }
    ]
  };

  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${broker.name} FundedScope broker review`,
    url: profileUrl,
    dateModified: broker.lastVerified,
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
      name: broker.name,
      url: `https://${broker.domain}`,
      logo: broker.logoUrl
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: broker.trustScore,
      bestRating: 100,
      worstRating: 0
    },
    reviewBody: `${broker.name} is reviewed by FundedScope using withdrawal reliability, rule transparency, customer support, trading conditions, platform stability and community trust. Exact trading-cost figures are labeled only when supported by official, platform or feed-backed verification.`
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <RecentlyViewedTracker item={{ title: broker.name, href: `/brokers/${broker.slug}`, type: "Broker" }} />
      <JsonLd id={`${broker.slug}-broker-breadcrumb-jsonld`} data={breadcrumbJsonLd} />
      <JsonLd id={`${broker.slug}-broker-review-jsonld`} data={reviewJsonLd} />

      <section className="grid gap-6 lg:grid-cols-[0.68fr_0.32fr]">
        <GlassCard className="glow-border">
          <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Broker profile</p>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl border border-electric/30 bg-white p-3 shadow-lg shadow-electric/10">
              <BrokerLogo name={broker.name} domain={broker.domain} fallback={broker.logoFallback} className="h-full w-full" />
            </span>
            <div>
              <h1 className="text-3xl font-black text-white sm:text-5xl">{broker.name}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                {broker.founded} · {broker.headquarters} · {brokerReviewLabel}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">{broker.bestFor}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Confidence Score" value={`${broker.trustScore}/100`} />
            <Metric label="Markets" value={broker.markets.slice(0, 2).join(", ")} />
            <Metric label="Platforms" value={broker.platforms.slice(0, 2).join(", ")} />
            <Metric label="Support" value={broker.supportHours} />
          </div>
        </GlassCard>

        <GlassCard>
          <BrokerConfidenceScore broker={broker} />
          <a
            href={`https://${broker.domain}`}
            target="_blank"
            rel="noreferrer sponsored"
            className="mt-5 block rounded-2xl bg-white px-5 py-3 text-center font-black text-void"
          >
            Visit official broker
          </a>
          <a
            href={`mailto:hello@myfundedscope.com?subject=Incorrect broker information: ${encodeURIComponent(broker.name)}`}
            className="mt-3 block rounded-2xl border border-warning/25 bg-warning/10 px-5 py-3 text-center font-bold text-warning"
          >
            Report incorrect information
          </a>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Regulation & trust</p>
          <h2 className="mt-2 text-2xl font-black text-white">Regulators and entity signals</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {broker.regulators.map((regulator) => (
              <span key={regulator} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-slate-300">
                {regulator}
              </span>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm leading-6 text-warning">
            Availability and regulatory entity can change by country. FundedScope does not infer availability from IP address; country availability should be verified from structured source records before users rely on it.
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Accounts & platforms</p>
          <h2 className="mt-2 text-2xl font-black text-white">Trading setup</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ListBlock title="Account types" items={broker.accountTypes} />
            <ListBlock title="Platforms" items={broker.platforms} />
            <ListBlock title="Features" items={broker.features} />
            <ListBlock title="Markets" items={broker.markets} />
          </div>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Broker Intelligence OS</p>
          <h2 className="mt-2 text-3xl font-black text-white">Can this broker support the way you trade?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {integrationSignal.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Broker pages should eventually personalize by country, funding method, platform and asset class so traders do not confuse a global brand with the exact entity available to them.
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-success">Withdrawal confidence</p>
          <h2 className="mt-2 text-2xl font-black text-white">{withdrawalSignal}/100 operational signal</h2>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-success" style={{ width: `${withdrawalSignal}%` }} />
          </div>
          <div className="mt-5 grid gap-3">
            <ListBlock title="Withdrawal methods" items={broker.withdrawals} />
            <ListBlock title="Funding methods" items={broker.deposits} />
          </div>
        </GlassCard>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Instrument intelligence</p>
          <h2 className="mt-2 text-3xl font-black text-white">Spread rows stay source-safe.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            FundedScope will only show numeric broker spread values when the row is connected to an official broker source, verified manual source, or live provider feed.
          </p>
        </div>
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-4">Instrument</th>
                <th className="p-4">Average spread</th>
                <th className="p-4">Minimum spread</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Leverage</th>
              </tr>
            </thead>
            <tbody>
              {broker.instruments.map((instrument) => (
                <tr key={instrument.symbol} className="border-t border-white/10">
                  <td className="p-4 font-black text-white">{instrument.symbol}</td>
                  <td className="p-4 text-slate-300">{instrument.averageSpread}</td>
                  <td className="p-4 text-slate-300">{instrument.minimumSpread}</td>
                  <td className="p-4 text-slate-300">{instrument.commission}</td>
                  <td className="p-4 text-slate-300">{instrument.leverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-warning">Spread history</p>
          <h2 className="mt-2 text-2xl font-black text-white">Source-safe cost trend</h2>
          <div className="mt-5 space-y-3">
            {spreadHistory.map((row) => (
              <div key={row.symbol} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{row.symbol}</p>
                  <p className="text-xs font-black text-warning">{row.now}</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">30-day reference: {row.thirtyDays}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{row.note}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Market risk preview</p>
          <h2 className="mt-2 text-2xl font-black text-white">Assets traders may route through {broker.name}</h2>
          <div className="mt-5 space-y-3">
            {volatilityMeters.slice(0, 3).map((item) => (
              <a key={item.asset} href="/market-intelligence" className="block rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-electric/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{item.asset}</p>
                  <p className="font-black text-electric">{item.score}</p>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.reason}</p>
              </a>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Real trader reviews</p>
          <h2 className="mt-2 text-2xl font-black text-white">Moderation-first review layer</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">Execution reports require account, symbol and session context.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">Withdrawal reports require moderation before they affect confidence score.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">Country restrictions should be tied to exact regulatory entity.</p>
          </div>
        </GlassCard>
      </section>

      <section className="mt-8">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">News affecting broker conditions</p>
          <h2 className="mt-2 text-2xl font-black text-white">Events that can widen spreads or change execution quality</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {brokerRelevantNews.map((event) => (
              <a key={event.id} href={`/market-intelligence#${event.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-electric/40">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">{event.timeUtc} UTC</p>
                <p className="mt-2 font-black text-white">{event.event}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{event.whyItMatters}</p>
              </a>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-success">Payments & support</p>
          <h2 className="mt-2 text-2xl font-black text-white">Deposit, withdrawal and help channels</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ListBlock title="Deposits" items={broker.deposits} />
            <ListBlock title="Withdrawals" items={broker.withdrawals} />
            <ListBlock title="Support" items={broker.support} />
            <ListBlock title="Languages" items={[broker.languages, broker.supportEmail]} />
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Similar brokers</p>
          <h2 className="mt-2 text-2xl font-black text-white">Research alternatives before choosing.</h2>
          <div className="mt-5 grid gap-3">
            {similarBrokers.map((similarBroker) => (
              <a
                key={similarBroker.slug}
                href={`/brokers/${similarBroker.slug}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-electric/40 hover:bg-electric/10"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white p-2">
                    <BrokerLogo name={similarBroker.name} domain={similarBroker.domain} fallback={similarBroker.logoFallback} className="h-full w-full" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-black text-white">{similarBroker.name}</span>
                    <span className="block truncate text-xs text-slate-500">{similarBroker.bestFor}</span>
                  </span>
                </span>
                <span className="shrink-0 font-black text-electric">{similarBroker.trustScore}/100</span>
              </a>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 line-clamp-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
