import type { Metadata } from "next";
import { BrokerConfidenceScore } from "../../components/BrokerConfidenceScore";
import { BrokerLogo } from "../../components/BrokerLogo";
import { GlassCard } from "../../components/GlassCard";
import { brokerScoreWeights, brokers, brokerStats } from "../../lib/brokers";

export const metadata: Metadata = {
  title: "Broker Intelligence & Comparison | FundedScope",
  description: "Compare brokers by regulation, accounts, instruments, spreads, withdrawals, platforms, support and the explainable FundedScope Confidence Score.",
  alternates: { canonical: "/brokers" },
  openGraph: {
    title: "Broker Intelligence & Comparison | FundedScope",
    description: "Broker intelligence for Gold, forex, crypto, indices and live traders.",
    url: "/brokers",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Broker Intelligence & Comparison | FundedScope",
    description: "Broker intelligence for Gold, forex, crypto, indices and live traders.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

const topGold = brokers.slice(0, 6);
const supportLeaders = brokers.slice(0, 4);
const brokerFaqs = [
  {
    question: "Are exact broker spreads shown on every broker?",
    answer: "FundedScope publishes exact numeric spreads only when a broker source, trading platform check or approved feed supports the figure. Otherwise the row is labeled as source-checked so traders know to verify execution costs before trading."
  },
  {
    question: "Why compare brokers by instrument?",
    answer: "A broker can be strong for EURUSD and weaker for Gold, crypto or indices. FundedScope compares the market you actually trade instead of giving everyone the same generic ranking."
  },
  {
    question: "What makes a broker score high?",
    answer: "Withdrawal reliability, rule transparency, customer support, trading conditions, platform stability and community trust. Paid listings cannot buy a better FundedScope Confidence Score."
  },
  {
    question: "Why do some fields require a source check?",
    answer: "Because accuracy matters. If a field is time-sensitive or not source-backed, FundedScope labels it clearly instead of presenting an unsupported number."
  }
];

export default function BrokersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.18),transparent_34%),rgba(255,255,255,0.03)] p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Broker Intelligence™</p>
            <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight text-white sm:text-5xl">
              Compare brokers by regulation, spreads, platforms and the markets you actually trade.
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300">
              FundedScope broker pages are built for live traders: instrument-level spread policy, withdrawals, regulation, execution, support, platforms and source history — not just lazy star ratings.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Stat label="Brokers tracked" value={brokerStats.brokers.toString()} />
              <Stat label="Regulators mapped" value={brokerStats.regulators.toString()} />
              <Stat label="Instrument rows" value={brokerStats.instruments.toString()} />
              <Stat label="Platforms tracked" value={brokerStats.platforms.toString()} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4 shadow-2xl shadow-electric/10">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-electric/25 via-blue-600/10 to-violet/20 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Broker directory</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {brokers.slice(0, 12).map((broker) => (
                  <div key={`${broker.slug}-hero-logo`} className="grid aspect-square place-items-center rounded-2xl border border-white/10 bg-white p-2">
                    <BrokerLogo name={broker.name} domain={broker.domain} fallback={broker.logoFallback} className="h-10 w-10" />
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-black text-emerald-200">Why some spread fields are source-checked</p>
                <p className="mt-2 text-xs leading-5 text-emerald-100/80">
                  FundedScope only shows exact trading-cost figures when the value is backed by an official page, platform check or approved data source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {brokers.map((broker) => (
          <GlassCard key={broker.slug} className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-electric/30 bg-white p-2 shadow-lg shadow-electric/10">
                  <BrokerLogo name={broker.name} domain={broker.domain} fallback={broker.logoFallback} className="h-full w-full" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black text-white">{broker.name}</h2>
                  <p className="text-xs text-slate-500">{broker.founded} · {broker.headquarters}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-electric">{broker.trustScore}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Confidence</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">{broker.bestFor}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {broker.regulators.slice(0, 3).map((regulator) => (
                <span key={regulator} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {regulator}
                </span>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <Mini label="Accounts" value={broker.accountTypes.slice(0, 3).join(", ")} />
              <Mini label="Platforms" value={broker.platforms.slice(0, 3).join(", ")} />
              <Mini label="Markets" value={broker.markets.slice(0, 3).join(", ")} />
              <Mini label="Support" value={broker.supportHours} />
            </div>

            <div className="mt-5">
              <BrokerConfidenceScore broker={broker} compact />
            </div>

            <p className="mt-5 rounded-2xl border border-warning/20 bg-warning/10 p-3 text-xs leading-5 text-warning">
              Spread policy: {broker.name} is listed for research. Exact executable spreads should be verified inside the broker platform unless a FundedScope source check is shown.
            </p>

            <a
              href={`/brokers/${broker.slug}`}
              className="mt-5 block rounded-2xl border border-electric/25 bg-electric/10 px-5 py-3 text-center font-black text-electric transition hover:border-electric/50 hover:bg-electric/15"
            >
              View broker profile
            </a>
          </GlassCard>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">FundedScope Confidence Score™</p>
          <h2 className="mt-2 text-3xl font-black text-white">Not stars. A score traders can inspect.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The broker Confidence Score is designed around withdrawal reliability, rule transparency, customer support, trading conditions, platform stability and community trust. Featured placements cannot buy a higher score.
          </p>
        </GlassCard>
        <div className="grid gap-3 sm:grid-cols-2">
          {brokerScoreWeights.map(([label, weight]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-white">{label}</p>
                <p className="font-black text-electric">{weight}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-electric" style={{ width: `${weight * 5}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-violet">Compare by instrument</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Gold traders should not see the same ranking as EURUSD traders.</h2>
          </div>
          <p className="text-sm text-slate-400">Exact values appear only after source verification.</p>
        </div>

        <div className="mt-6 grid gap-3 md:hidden">
          {topGold.map((broker) => (
            <GlassCard key={`${broker.slug}-mobile-gold`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-white">{broker.name}</p>
                <p className="font-black text-electric">{broker.trustScore}/100</p>
              </div>
              {broker.instruments.slice(0, 3).map((instrument) => (
                <div key={instrument.symbol} className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="font-bold text-white">{instrument.symbol}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Avg spread: {instrument.averageSpread} · Commission: {instrument.commission}
                  </p>
                </div>
              ))}
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6 hidden overflow-x-auto p-0 md:block">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-4">Broker</th>
                <th className="p-4">Gold / XAUUSD spread</th>
                <th className="p-4">EURUSD spread</th>
                <th className="p-4">NASDAQ spread</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Platforms</th>
                <th className="p-4">Regulation score</th>
              </tr>
            </thead>
            <tbody>
              {topGold.map((broker) => {
                const gold = broker.instruments.find((instrument) => instrument.symbol === "XAUUSD") ?? broker.instruments[0]!;
                const eurusd = broker.instruments.find((instrument) => instrument.symbol === "EURUSD") ?? broker.instruments[1] ?? gold;
                const nas = broker.instruments.find((instrument) => instrument.symbol === "NAS100") ?? broker.instruments[2] ?? gold;
                return (
                  <tr key={broker.slug} className="border-t border-white/10">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white p-1.5">
                          <BrokerLogo name={broker.name} domain={broker.domain} fallback={broker.logoFallback} className="h-full w-full" />
                        </span>
                        <span className="font-black text-white">{broker.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{gold.averageSpread}</td>
                    <td className="p-4 text-slate-300">{eurusd.averageSpread}</td>
                    <td className="p-4 text-slate-300">{nas.averageSpread}</td>
                    <td className="p-4 text-slate-300">{gold.commission}</td>
                    <td className="p-4 text-slate-300">{broker.platforms.slice(0, 3).join(", ")}</td>
                    <td className="p-4 font-black text-electric">{broker.score.regulation}/100</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <GlassCard>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">Support intelligence</p>
          </div>
          <h2 className="mt-4 text-3xl font-black text-white">Broker support matters when money is involved.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            FundedScope tracks support hours, contact options, languages, payment methods and account types because a broker is not just a spread number. It is where traders deposit, withdraw and solve urgent problems.
          </p>
        </GlassCard>

        <div className="grid gap-3 sm:grid-cols-2">
          {supportLeaders.map((broker) => (
            <div key={`${broker.slug}-support`} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white p-2">
                  <BrokerLogo name={broker.name} domain={broker.domain} fallback={broker.logoFallback} className="h-full w-full" />
                </span>
                <div>
                  <p className="font-black text-white">{broker.name}</p>
                  <p className="text-xs text-slate-400">{broker.languages}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Mini label="Support hours" value={broker.supportHours} />
                <Mini label="Channels" value={broker.support.slice(0, 3).join(", ")} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Broker FAQ</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">What the broker page is telling you.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            The goal is simple: help traders compare brokers without pretending unverified spread data is live.
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {brokerFaqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-xl font-black text-electric">+</span>
                <div>
                  <h3 className="text-lg font-black text-white">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 line-clamp-2 font-bold text-white">{value}</p>
    </div>
  );
}
