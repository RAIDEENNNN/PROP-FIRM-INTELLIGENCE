import Link from "next/link";
import { BrokerLogo } from "../components/BrokerLogo";
import { FirmLogo } from "../components/FirmLogo";
import { GlassCard } from "../components/GlassCard";
import { JsonLd } from "../components/JsonLd";
import { UniversalSearch } from "../components/UniversalSearch";
import { brokers } from "../lib/brokers";
import { featuredFirms, newsEvents, propFirms } from "../lib/data";
import { spreadRecords } from "../lib/spreads";

const stats = [
  { label: "Active Traders", value: "10,000+", icon: "♟" },
  { label: "Prop Firms", value: "100+", icon: "🏛" },
  { label: "Brokers", value: String(brokers.length), icon: "▣" },
  { label: "Updates", value: "24/7", icon: "◷" }
];

const popularSearches = ["FTMO", "FundedNext", "The 5%ers", "Exness", "IC Markets"];

const faqs = [
  ["What is FundedScope?", "A trading intelligence platform for comparing prop firms, brokers, rules, spreads, market risk and trader-fit recommendations."],
  ["Is this financial advice?", "No. FundedScope provides research, comparison data and educational decision support. Traders should verify official terms before acting."],
  ["Why are some spreads source-checked?", "FundedScope only publishes exact numeric trading costs when they are supported by an official page, verified manual review or feed-backed source."]
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

      <section className="grid gap-8 py-4 lg:grid-cols-[0.76fr_1fr] lg:items-center lg:py-8">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0b0b14]/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
            Trusted by 10,000+ traders worldwide
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl md:text-7xl">
            Make Smarter
            <span className="block bg-gradient-to-r from-purple-400 via-violet to-fuchsia-400 bg-clip-text text-transparent">
              Trading Decisions.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Compare prop firms and brokers with transparent data, real reviews and powerful tools built to protect your capital and grow your edge.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
            <h2 className="text-2xl font-black text-white">Latest News & Updates</h2>
            <Link href="/news-radar" className="text-sm font-black text-purple-300">View All →</Link>
          </div>
          <div className="mt-5 space-y-4">
            {newsEvents.map((event, index) => (
              <div key={event.title} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet/80 to-[#172554]" />
                <div>
                  <p className="text-sm font-bold text-white">{event.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{event.time}</p>
                </div>
                <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${index === 1 ? "bg-slate-700 text-slate-200" : "bg-violet/30 text-purple-100"}`}>
                  {event.impact}
                </span>
              </div>
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
    </main>
  );
}

function HeroDashboard({ firms, brokers }: { firms: typeof featuredFirms; brokers: typeof import("../lib/brokers").brokers }) {
  const previewRoutes = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Prop Firms", href: "/prop-firms" },
    { label: "Brokers", href: "/brokers" },
    { label: "Compare", href: "/compare" },
    { label: "News", href: "/news-radar" },
    { label: "Tools", href: "/tools" }
  ];
  const metrics = [
    { label: "Prop Firms", value: String(propFirms.length), href: "/prop-firms" },
    { label: "Brokers", value: String(brokers.length), href: "/brokers" },
    { label: "News Updates", value: "247", href: "/news-radar" },
    { label: "Watchlist", value: "12", href: "/dashboard" }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090914] p-4 shadow-[0_0_80px_rgba(124,58,237,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.24),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(217,70,239,0.16),transparent_24%)]" />
      <div className="relative grid gap-4 lg:grid-cols-[140px_1fr]">
        <aside className="hidden rounded-2xl border border-white/10 bg-black/25 p-3 lg:block">
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
            <p className="text-[10px] font-black uppercase text-purple-200">Trader DNA™</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[70%] rounded-full bg-violet" />
            </div>
            <p className="mt-2 text-xs text-slate-400">70%</p>
          </Link>
        </aside>

        <div className="rounded-2xl border border-white/10 bg-[#0d0d18]/90 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Welcome back, Trader 👋</h2>
              <p className="mt-1 text-sm text-slate-400">Your trading intelligence dashboard</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-violet/50 text-sm font-black text-purple-200">70%</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metrics.map((metric) => (
              <DashMetric key={metric.label} {...metric} />
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <DashboardList
              title="Top Prop Firms"
              href="/prop-firms"
              items={firms.map((firm) => ({ name: firm.name, value: `${firm.rating.toFixed(1)} ★`, href: `/prop-firms/${firm.slug}` }))}
            />
            <DashboardList
              title="Top Brokers"
              href="/brokers"
              items={brokers.slice(0, 5).map((broker) => ({ name: broker.name, value: `${(broker.trustScore / 20).toFixed(1)} ★`, href: `/brokers/${broker.slug}` }))}
            />
            <DashboardList
              title="Market Overview"
              href="/gold"
              items={[
                { name: "Gold (XAU/USD)", value: "Source check", href: "/gold" },
                { name: "EUR/USD", value: "Source check", href: "/spreads" },
                { name: "GBP/USD", value: "Source check", href: "/spreads" },
                { name: "BTC/USD", value: "Source check", href: "/spreads" }
              ]}
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

function DashboardList({ title, href, items }: { title: string; href: string; items: Array<{ name: string; value: string; href: string }> }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between">
        <p className="font-black text-white">{title}</p>
        <Link href={href} className="rounded-lg px-2 py-1 text-[10px] font-bold text-purple-300 transition hover:bg-purple-400/10 hover:text-purple-100">
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map(({ name, value, href: itemHref }, index) => (
          <Link key={`${title}-${name}`} href={itemHref} className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm transition hover:bg-white/10">
            <span className="truncate text-slate-300">{index + 1}. {name}</span>
            <span className="font-black text-amber-300">{value}</span>
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
