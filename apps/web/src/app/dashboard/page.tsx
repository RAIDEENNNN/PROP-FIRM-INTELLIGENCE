import type { Metadata } from "next";
import Link from "next/link";
import { FirmLogo } from "../../components/FirmLogo";
import { GlassCard } from "../../components/GlassCard";
import { GoldRiskPlanner } from "../../components/GoldRiskPlanner";
import { MarketReferenceGrid } from "../../components/MarketReferenceGrid";
import { MetricCard } from "../../components/MetricCard";
import { DashboardProfileCard } from "../../components/DashboardProfileCard";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { TradeReadinessCheck } from "../../components/TradeReadinessCheck";
import { dashboardMetrics, featuredFirms, newsEvents } from "../../lib/data";
import { noindexMetadata } from "../../lib/seo";
import { spreadRecords } from "../../lib/spreads";

export const metadata: Metadata = noindexMetadata(
  "Trader Dashboard Preview | FundedScope",
  "Preview market context, Gold risk, watchlists, journal reminders, prop firm alerts and trade readiness.",
  "/dashboard"
);

const workspaceTabs = [
  { label: "Gold", href: "/gold" },
  { label: "Trader DNA", href: "/trader-dna" },
  { label: "Watchlist", href: "/profile" },
  { label: "Calendar", href: "/market-intelligence#calendar" },
  { label: "AI Summary", href: "/ai" },
  { label: "Journal", href: "/journal" },
  { label: "Performance", href: "/trader-dna#performance" },
  { label: "News", href: "/news-radar" },
  { label: "Broker Alerts", href: "/alerts" }
];

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
  const spreadModelDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(spreadRecords[0]?.updatedAt ?? "2026-07-15T06:00:00.000Z"));
  const goldRows = spreadRecords
    .filter((record) => record.symbol === "XAUUSD")
    .sort((a, b) => a.spread - b.spread)
    .slice(0, 4);

  return (
    <ProtectedRoute label="dashboard">
    <main className="mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Dashboard preview</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">Your trading intelligence dashboard.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Start your day with market context, prop restrictions, watchlist alerts, risk limits, AI summaries and journal reminders.
          </p>
        </div>
        <Link href="/gold" className="rounded-full bg-white px-5 py-3 text-center font-bold text-void">
          Open Gold command center
        </Link>
      </div>

      <nav aria-label="Dashboard tools" className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {workspaceTabs.map((tab, index) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:border-electric/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric ${
              index === 0 ? "bg-electric text-void hover:text-void" : "border border-white/10 text-slate-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
        <GlassCard className="glow-border">
          <MarketReferenceGrid />
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
          <p className="text-sm uppercase tracking-[0.28em] text-warning">Gold spread estimates</p>
          <h2 className="mt-2 text-2xl font-black text-white">Lowest XAUUSD estimate rows</h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">Research estimates reviewed {spreadModelDate}; not live quotes.</p>
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
                    {record.spread} {record.quoteUnit} est.
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
        <DashboardProfileCard />
        <TradeReadinessCheck />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Saved watchlist</p>
          <h2 className="mt-2 text-2xl font-black text-white">Firms you are monitoring</h2>
          <div className="mt-5 grid gap-3">
            {featuredFirms.slice(0, 4).map((firm) => (
              <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FirmLogo firm={firm} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-black text-white">{firm.name}</p>
                    <p className="truncate text-xs text-slate-500">{firm.payoutFrequency} payout · {firm.maxDrawdown} max DD</p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-black text-electric">{firm.score}/100</p>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">News</p>
          <h2 className="mt-2 text-2xl font-black text-white">Signals that move risk</h2>
          <div className="mt-5 space-y-3">
            {newsEvents.map((event) => (
              <Link
                key={event.title}
                href={event.href}
                aria-label={`Open research item: ${event.title}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-electric/30 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-electric/10 px-3 py-1 text-xs text-electric">{event.impact}</span>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
                <p className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-white">
                  <span>{event.title}</span>
                  <span aria-hidden="true" className="text-slate-500 transition group-hover:text-electric">→</span>
                </p>
              </Link>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
    </ProtectedRoute>
  );
}
