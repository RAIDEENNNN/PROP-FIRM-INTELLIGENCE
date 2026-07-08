import type { Metadata } from "next";
import Link from "next/link";
import { FirmLogo } from "../../components/FirmLogo";
import { GlassCard } from "../../components/GlassCard";
import { GoldRiskPlanner } from "../../components/GoldRiskPlanner";
import { MetricCard } from "../../components/MetricCard";
import { TradeReadinessCheck } from "../../components/TradeReadinessCheck";
import { dashboardMetrics, featuredFirms, newsEvents } from "../../lib/data";
import { fallbackMarkets } from "../../lib/markets";
import { spreadRecords } from "../../lib/spreads";
import { traderDnaProfile } from "../../lib/trader-dna";

export const metadata: Metadata = {
  title: "Trader Dashboard & Today's Edge | FundedScope",
  description: "Start your trading day with market context, Gold risk, watchlists, journal reminders, prop firm alerts and trade readiness.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: true }
};

const workspaceTabs = ["Gold", "Trader DNA", "Watchlist", "Calendar", "AI Summary", "Journal", "Performance", "News", "Broker Alerts"];

const aiBrief = [
  "Gold risk is elevated around USD news windows. Reduce size or wait for spreads to normalize.",
  "Your saved prop firms have similar max drawdown, but payout frequency differs — check before scaling.",
  "Journal pattern: avoid immediate re-entry after first XAUUSD loss."
];

const calendar = [
  ["London open", "Volatility build-up"],
  ["US data window", "High-impact risk"],
  ["NY close", "Journal review"]
];

export default function DashboardPage() {
  const goldRows = spreadRecords
    .filter((record) => record.symbol === "XAUUSD")
    .sort((a, b) => a.spread - b.spread)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Today’s Edge</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">Your daily trading intelligence dashboard.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Start your day with market context, prop restrictions, watchlist alerts, risk limits, AI summaries and journal reminders.
          </p>
        </div>
        <Link href="/gold" className="rounded-full bg-white px-5 py-3 text-center font-bold text-void">
          Open Gold command center
        </Link>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {workspaceTabs.map((tab, index) => (
          <span key={tab} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${index === 0 ? "bg-electric text-void" : "border border-white/10 text-slate-300"}`}>
            {tab}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
        <GlassCard className="glow-border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-electric">Today’s market</p>
              <h2 className="mt-2 text-3xl font-black text-white">Markets that matter now</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Auto-refresh ready</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {fallbackMarkets.map((market) => (
              <div key={market.symbol} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">{market.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{market.price}</p>
                <p className={`mt-1 text-sm font-bold ${market.tone === "up" ? "text-success" : market.tone === "down" ? "text-danger" : "text-slate-400"}`}>
                  {market.change} · {market.source}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">AI summary</p>
          <h2 className="mt-2 text-2xl font-black text-white">Morning brief</h2>
          <div className="mt-5 space-y-3">
            {aiBrief.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-warning">Gold spreads</p>
          <h2 className="mt-2 text-2xl font-black text-white">Best XAUUSD rows</h2>
          <div className="mt-5 space-y-3">
            {goldRows.map((record) => {
              const firm = featuredFirms.find((item) => item.slug === record.firmSlug);
              return (
                <div key={record.firmSlug} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {firm ? <FirmLogo firm={firm} size="sm" /> : null}
                    <p className="truncate text-sm font-bold text-white">{record.firmName}</p>
                  </div>
                  <p className="text-sm font-black text-electric">
                    {record.spread} {record.quoteUnit}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-danger">Calendar</p>
          <h2 className="mt-2 text-2xl font-black text-white">Events to respect</h2>
          <div className="mt-5 space-y-3">
            {calendar.map(([time, note]) => (
              <div key={time} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">{time}</p>
                <p className="mt-1 text-sm text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Journal reminders</p>
          <h2 className="mt-2 text-2xl font-black text-white">Your pattern notes</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">You tend to perform worse before major news. Wait for confirmation.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Your best sessions are London open and first two hours of New York.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">After two losses, dashboard recommends stopping or reducing risk.</p>
          </div>
        </GlassCard>
      </section>

      <section className="mt-6">
        <GoldRiskPlanner />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Trader DNA</p>
          <h2 className="mt-2 text-3xl font-black text-white">{traderDnaProfile.identity}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            FundedScope remembers your trades, mistakes, best sessions, emotional patterns and risk sweet spot so every recommendation becomes more personal over time.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-slate-500">DNA score</p>
              <p className="mt-1 text-3xl font-black text-electric">{traderDnaProfile.dnaScore}/100</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-slate-500">Best session</p>
              <p className="mt-1 font-black text-white">{traderDnaProfile.bestSession}</p>
            </div>
          </div>
          <Link href="/trader-dna" className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-bold text-void">
            Open Trader DNA
          </Link>
        </GlassCard>
        <TradeReadinessCheck />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Saved watchlist</p>
          <h2 className="mt-2 text-2xl font-black text-white">Firms you are monitoring</h2>
          <div className="mt-5 grid gap-3">
            {featuredFirms.slice(0, 4).map((firm) => (
              <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <FirmLogo firm={firm} size="sm" />
                  <div>
                    <p className="font-black text-white">{firm.name}</p>
                    <p className="text-xs text-slate-500">{firm.payoutFrequency} payout · {firm.maxDrawdown} max DD</p>
                  </div>
                </div>
                <p className="text-sm font-black text-electric">{firm.score}/100</p>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">News</p>
          <h2 className="mt-2 text-2xl font-black text-white">Signals that move risk</h2>
          <div className="mt-5 space-y-3">
            {newsEvents.map((event) => (
              <div key={event.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-electric/10 px-3 py-1 text-xs text-electric">{event.impact}</span>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{event.title}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
