import Link from "next/link";
import { BrokerLogo } from "../components/BrokerLogo";
import { FirmLogo } from "../components/FirmLogo";
import { GlassCard } from "../components/GlassCard";
import { JsonLd } from "../components/JsonLd";
import { UniversalSearch } from "../components/UniversalSearch";
import { brokers } from "../lib/brokers";
import { featuredFirms, newsEvents, propFirms } from "../lib/data";
import { currencyHeat, marketEvents, pairImpacts, tradingSessions, volatilityMeters } from "../lib/market-intelligence";
import { spreadRecords } from "../lib/spreads";

const stats = [
  { label: "Prop Firm Profiles", value: String(propFirms.length), icon: "♟" },
  { label: "Broker Profiles", value: String(brokers.length), icon: "▣" },
  { label: "Research Areas", value: "3", icon: "🏛" },
  { label: "Source Policy", value: "Public", icon: "◷" }
];

const popularSearches = ["FTMO", "FundedNext", "The 5%ers", "Exness", "IC Markets"];

const communityStats = [
  { label: "Profiles checked", value: String(propFirms.length + brokers.length), detail: "Firm and broker pages under public source review" },
  { label: "Research alerts", value: String(newsEvents.length + marketEvents.length), detail: "Rule, market and economic-risk items in the curated preview" },
  { label: "Decision tools", value: "9", detail: "Compare, spreads, calculators, alerts, DNA and market intelligence" }
];

const roadmapItems = [
  ["Now", "Public comparison layer", "Prop firms, brokers, spreads, alerts and Market Intelligence are visible without an account."],
  ["Next", "Personalized trader workspace", "Saved watchlists, My News, rule-change alerts and Trading DNA recommendations."],
  ["Later", "Broker and firm monitoring", "Spread monitoring, payout proof moderation, score history and verified trader reviews."]
];

const testimonials = [
  ["Gold scalper", "I want to know if conditions are worth trading before I care which firm is cheapest."],
  ["Challenge buyer", "The rule context matters more than a coupon when one mistake can fail an account."],
  ["Swing trader", "A filtered news feed beats scrolling through every calendar event."]
];

const faqs = [
  ["What is FundedScope?", "A trading intelligence platform for comparing prop firms, brokers, rules, spreads, market risk and trader fit recommendations."],
  ["Is this financial advice?", "No. FundedScope provides research, comparison data and educational decision support. Traders should verify official terms before acting."],
  ["Why are some spreads source-checked?", "FundedScope only publishes exact numeric trading costs when they are supported by an official page, verified manual review or feed backed source."]
];

export default function HomePage() {
  const topFirms = featuredFirms.slice(0, 3);
  const topBrokers = brokers.slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <JsonLd
        id="homepage-faq-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer }
          }))
        }}
      />

      <section className="grid gap-8 py-4 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)] lg:items-center lg:py-8">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0b0b14]/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
            Independent trader research platform
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl md:text-7xl">
            Make Smarter
            <span className="block bg-gradient-to-r from-purple-400 via-violet to-fuchsia-400 bg-clip-text text-transparent">
              Trading Decisions.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Compare prop firms and brokers with transparent data, public review signals and powerful tools built to protect your capital and grow your edge.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link href="/market-intelligence" className="rounded-xl bg-electric px-6 py-4 text-center font-black text-void shadow-[0_0_32px_rgba(53,211,255,0.22)] transition hover:scale-[1.01]">
              Market Intel
            </Link>
            <Link href="/prop-firms" className="rounded-xl bg-violet px-6 py-4 text-center font-black text-white shadow-[0_0_32px_rgba(124,58,237,0.36)] transition hover:scale-[1.01]">
              ⚖ Compare Prop Firms
            </Link>
            <Link href="/brokers" className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center font-black text-white transition hover:border-purple-400/40 hover:bg-purple-500/10">
              ⇅ Compare Brokers
            </Link>
          </div>

          <div className="mt-7">
            <p className="text-sm font-semibold text-slate-400">Popular Searches:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <Link key={item} href="/prop-firms" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-purple-400/40 hover:text-white">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <HeroDashboard firms={topFirms} brokers={topBrokers} />
      </section>

      <section className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-[#0c0c16]/90 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet/20 text-xl text-purple-200">{stat.icon}</span>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <UniversalSearch compact />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.66fr_0.34fr]">
        <GlassCard className="glow-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-electric">Trading Intelligence Preview</p>
              <h2 className="mt-2 text-3xl font-black text-white">What deserves attention before you trade?</h2>
            </div>
            <Link href="/market-intelligence" className="rounded-full border border-electric/30 px-4 py-2 text-sm font-black text-electric transition hover:bg-electric/10">
              Open full brief
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {marketEvents.slice(0, 3).map((event) => (
              <Link key={event.id} href={`/market-intelligence#${event.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-electric/40 hover:bg-electric/10">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black text-white">{event.currency}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${event.impact === "High" ? "bg-rose-500/20 text-rose-200" : "bg-slate-700 text-slate-200"}`}>
                    {event.impact}
                  </span>
                </div>
                <p className="mt-3 text-sm font-black text-white">{event.event}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{event.timeUtc} UTC · Forecast {event.forecast}</p>
                <p className="mt-4 line-clamp-3 text-xs leading-5 text-slate-500">{event.whyItMatters}</p>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-violet">Currency heat map</p>
          <h2 className="mt-2 text-2xl font-black text-white">Macro pressure by currency</h2>
          <div className="mt-5 space-y-3">
            {currencyHeat.map((item) => (
              <div key={item.currency} className="grid grid-cols-[48px_1fr] items-center gap-3">
                <p className="font-black text-white">{item.currency}</p>
                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-electric" style={{ width: `${item.heat * 20}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
        <GlassCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">Compare Prop Firms</h2>
              <p className="mt-2 text-sm text-slate-400">Find the best prop firm for your trading style and goals.</p>
            </div>
            <Link href="/prop-firms" className="hidden text-sm font-black text-purple-300 sm:inline-block">View All Firms →</Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {topFirms.map((firm) => (
              <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="rounded-2xl border border-white/10 bg-[#10101c] p-4 transition hover:border-purple-400/40 hover:bg-purple-500/10">
                <div className="flex items-center gap-3">
                  <FirmLogo firm={firm} size="sm" />
                  <div>
                    <p className="font-black text-white">{firm.name}</p>
                    <p className="text-xs text-emerald-300">{firm.rating.toFixed(1)} Excellent</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                  <Mini label="Profit Split" value={firm.payout.includes("Weekly") ? "80%" : "90%"} />
                  <Mini label="Fee" value={firm.challengeFee} />
                  <Mini label="Max Funding" value={firm.maxAccount} />
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-white">Research Radar</h2>
            <Link href="/news-radar" className="text-sm font-black text-[#d9b96f] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b96f]">View all →</Link>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Curated intelligence preview. Live provider headlines appear here once the news API is configured and verified.
          </p>
          <div className="mt-5 space-y-4">
            {newsEvents.map((event, index) => (
              <Link
                key={event.title}
                href={event.href}
                aria-label={`Open research item: ${event.title}`}
                className="group grid grid-cols-[56px_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:-translate-y-0.5 hover:border-[#d9b96f]/35 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b96f]"
              >
                <div className="grid h-14 w-14 place-items-center rounded-xl border border-[#d9b96f]/20 bg-gradient-to-br from-[#d9b96f]/20 via-white/[0.04] to-slate-950 text-sm font-black text-[#d9b96f] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  {index === 0 ? "RC" : index === 1 ? "GV" : "PP"}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{event.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{event.time}</p>
                </div>
                <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${index === 1 ? "bg-slate-700 text-slate-200" : "bg-[#d9b96f]/15 text-[#f3d68f]"}`}>
                  {event.impact}
                </span>
                <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-slate-400 transition group-hover:border-[#d9b96f]/40 group-hover:text-[#d9b96f]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-purple-300">Compare Brokers</p>
          <h2 className="mt-3 text-3xl font-black text-white">Broker intelligence by platform, regulation and trading costs.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Research brokers by accounts, platforms, payment methods and verified-cost policy. We separate confirmed facts from figures that still require source checks.
          </p>
          <Link href="/brokers" className="mt-6 inline-block rounded-xl bg-violet px-5 py-3 font-black text-white">
            View Broker Comparison
          </Link>
        </GlassCard>

        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="p-4">Broker</th>
                <th className="p-4">EUR/USD Spread</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Platforms</th>
                <th className="p-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {topBrokers.map((broker) => (
                <tr key={broker.slug} className="border-t border-white/10">
                  <td className="p-4">
                    <Link href={`/brokers/${broker.slug}`} className="flex items-center gap-3 font-black text-white">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white p-1.5">
                        <BrokerLogo name={broker.name} domain={broker.domain} fallback={broker.logoFallback} className="h-full w-full" />
                      </span>
                      {broker.name}
                    </Link>
                  </td>
                  <td className="p-4 text-slate-300">Source-checked</td>
                  <td className="p-4 text-slate-300">Account based</td>
                  <td className="p-4 text-slate-300">{broker.platforms.slice(0, 3).join(" / ")}</td>
                  <td className="p-4 font-black text-purple-300">{broker.trustScore}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-success">Recently updated firms</p>
          <h2 className="mt-2 text-2xl font-black text-white">Rule pages worth checking</h2>
          <div className="mt-5 space-y-3">
            {[...propFirms].sort((a, b) => b.lastRuleUpdate.localeCompare(a.lastRuleUpdate)).slice(0, 4).map((firm) => (
              <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-success/40">
                <span className="min-w-0">
                  <span className="block truncate font-black text-white">{firm.name}</span>
                  <span className="block text-xs text-slate-500">{firm.lastRuleUpdate}</span>
                </span>
                <span className="shrink-0 text-sm font-black text-success">{firm.score}</span>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-warning">Volatility watch</p>
          <h2 className="mt-2 text-2xl font-black text-white">Markets that may punish sloppy entries</h2>
          <div className="mt-5 space-y-3">
            {volatilityMeters.map((item) => (
              <div key={item.asset} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-black text-white">{item.asset}</p>
                  <p className="font-black text-warning">{item.score}/100</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.reason}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Session command</p>
          <h2 className="mt-2 text-2xl font-black text-white">Trading sessions at a glance</h2>
          <div className="mt-5 grid gap-3">
            {tradingSessions.map((session) => (
              <div key={session.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-black text-white">{session.name}</p>
                  <p className="text-xs font-black uppercase text-electric">{session.status}</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">{session.focus}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Why create an account?</p>
          <h2 className="mt-2 text-3xl font-black text-white">FundedScope becomes more useful when it knows your trading life.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "My News based on pairs, sessions and prop-firm rules",
              "Rule-change alerts for firms you actually use",
              "Broker watchlists and spread-monitoring notes",
              "Trading DNA insights from journal and profile data"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold leading-6 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-violet">Community signal</p>
          <h2 className="mt-2 text-2xl font-black text-white">Built around decision habits</h2>
          <div className="mt-5 grid gap-3">
            {communityStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-1 font-bold text-slate-300">{stat.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-gold">Trader voice</p>
          <h2 className="mt-2 text-2xl font-black text-white">What the product is being shaped around</h2>
          <div className="mt-5 space-y-3">
            {testimonials.map(([role, quote]) => (
              <div key={role} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">{role}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">&quot;{quote}&quot;</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Roadmap</p>
          <h2 className="mt-2 text-2xl font-black text-white">From comparison site to trader operating system</h2>
          <div className="mt-5 space-y-3">
            {roadmapItems.map(([phase, title, copy]) => (
              <div key={phase} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[72px_1fr]">
                <p className="text-sm font-black text-electric">{phase}</p>
                <div>
                  <p className="font-black text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}

function HeroDashboard({ firms, brokers: previewBrokers }: { firms: typeof featuredFirms; brokers: typeof import("../lib/brokers").brokers }) {
  const previewRoutes = [
    { label: "Dashboard Preview", href: "/dashboard" },
    { label: "Prop Firms", href: "/prop-firms" },
    { label: "Brokers", href: "/brokers" },
    { label: "Compare", href: "/compare" },
    { label: "Market Intel", href: "/market-intelligence" },
    { label: "Calculators", href: "/calculators" }
  ];
  const metrics = [
    { label: "Prop Firms", value: String(propFirms.length), href: "/prop-firms" },
    { label: "Brokers", value: String(brokers.length), href: "/brokers" },
    { label: "Readiness", value: "82%", href: "/market-intelligence" },
    { label: "High Risk", value: "13:30", href: "/market-intelligence" }
  ];

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#090914] p-4 shadow-[0_0_80px_rgba(124,58,237,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.24),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(217,70,239,0.16),transparent_24%)]" />
      <div className="relative grid min-w-0 gap-4 xl:grid-cols-[150px_minmax(0,1fr)]">
        <aside className="hidden rounded-2xl border border-white/10 bg-black/25 p-3 xl:block">
          <Link href="/" className="mb-5 flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-purple-400/30 bg-black shadow-[0_0_20px_rgba(124,58,237,0.35)]">
              <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" width={36} height={36} decoding="async" className="h-full w-full object-contain p-0.5" />
            </span>
            <span className="text-xs font-black text-white">FundedScope</span>
          </Link>
          {previewRoutes.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 block rounded-xl px-3 py-2 text-xs font-bold transition hover:bg-white/10 hover:text-white ${
                index === 0 ? "bg-violet/40 text-white" : "text-slate-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/trader-dna" className="mt-8 block rounded-2xl bg-violet/15 p-3 transition hover:bg-violet/25">
            <p className="text-[10px] font-black uppercase text-purple-200">Trader DNA™ Preview</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[55%] rounded-full bg-violet" />
            </div>
            <p className="mt-2 text-xs text-slate-400">Personalized after sign-in</p>
          </Link>
        </aside>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0d0d18]/90 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">
                Product preview
              </span>
              <h2 className="mt-3 text-xl font-black text-white">See how FundedScope works</h2>
              <p className="mt-1 text-sm text-slate-400">A public preview of the trading intelligence dashboard.</p>
            </div>
            <Link href="/sign-up" className="hidden rounded-full border border-violet/40 px-4 py-2 text-xs font-black text-purple-100 transition hover:bg-violet/15 sm:inline-flex">
              Personalize yours
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 2xl:grid-cols-4">
            {metrics.map((metric) => (
              <DashMetric key={metric.label} {...metric} />
            ))}
          </div>

          <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-[0.9fr_0.9fr_1.15fr]">
            <DashboardList
              title="Top Prop Firms"
              href="/prop-firms"
              items={firms.map((firm) => ({ name: firm.name, value: `${firm.rating.toFixed(1)} ★`, href: `/prop-firms/${firm.slug}` }))}
            />
            <DashboardList
              title="Top Brokers"
              href="/brokers"
              items={previewBrokers.slice(0, 5).map((broker) => ({ name: broker.name, value: `${(broker.trustScore / 20).toFixed(1)} ★`, href: `/brokers/${broker.slug}` }))}
            />
            <DashboardList
              className="xl:col-span-2 2xl:col-span-1"
              title="Pair Impact"
              href="/market-intelligence"
              items={pairImpacts.map((item) => ({ name: item.pair, value: item.overall.replace(" volatility", ""), href: "/market-intelligence" }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashMetric({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-white/[0.07]">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </Link>
  );
}

function DashboardList({ title, href, items, className = "" }: { title: string; href: string; items: Array<{ name: string; value: string; href: string }>; className?: string }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4 ${className}`}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="min-w-0 text-base font-black leading-tight text-white">{title}</p>
        <Link href={href} className="rounded-lg px-2 py-1 text-[10px] font-bold text-purple-300 transition hover:bg-purple-400/10 hover:text-purple-100">
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map(({ name, value, href: itemHref }, index) => (
          <Link key={`${title}-${name}`} href={itemHref} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-xl px-2 py-1.5 text-sm transition hover:bg-white/10">
            <span className="min-w-0 leading-snug text-slate-300">{index + 1}. {name}</span>
            <span className="shrink-0 text-right font-black leading-tight text-amber-300">{value}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
