import type { Metadata } from "next";
import Link from "next/link";
import { FirmLogo } from "../../components/FirmLogo";
import { GlassCard } from "../../components/GlassCard";
import { ScoreBreakdown } from "../../components/ScoreBreakdown";
import { propFirms } from "../../lib/data";
import { getFirmTrust, getScoreBreakdown } from "../../lib/trust";

export const metadata: Metadata = {
  title: "Side-by-Side Prop Firm Comparison | FundedScope",
  description: "Compare prop firms side by side across fees, profit targets, drawdown, payout rules, score breakdowns, markets and trader fit.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Side-by-Side Prop Firm Comparison | FundedScope",
    description: "A structured comparison dashboard for choosing better-fit prop firms.",
    url: "/compare",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Side-by-Side Prop Firm Comparison | FundedScope",
    description: "A structured comparison dashboard for choosing better-fit prop firms.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

const compareModes = [
  ["Prop firms", "Challenge fees, payout rules, drawdown, score formula and market access."],
  ["Brokers", "Spreads, commissions, execution notes, assets, leverage and regulation."],
  ["Challenges", "One-step, two-step, instant funding, futures combines and scaling plans."],
  ["Trading conditions", "Fees, spreads, commissions, payout rules, leverage and restrictions."]
];

const decisionChecklist = [
  "Does the drawdown style fit your strategy?",
  "Can you trade your main market without restrictions?",
  "Is payout speed aligned with your cash-flow goal?",
  "Does the fee make sense versus rules and account size?",
  "Are spreads acceptable for your pair/session?",
  "Is the profile recently checked and source-labeled?"
];

export default function ComparePage() {
  const comparedFirms = propFirms.slice(0, 5).map((firm) => ({
    firm,
    trust: getFirmTrust(firm),
    score: getScoreBreakdown(firm)
  }));
  const leader = comparedFirms[0];
  const fastestPayout = [...comparedFirms].sort((a, b) => {
    const fast = (value: string) => (/on demand|weekly|fast|5 days/i.test(value) ? 0 : /bi-weekly|14 days/i.test(value) ? 1 : 2);
    return fast(a.firm.payoutFrequency) - fast(b.firm.payoutFrequency);
  })[0];
  const lowestFee = [...comparedFirms].sort((a, b) => Number(a.firm.challengeFee.replace(/\D/g, "") || 9999) - Number(b.firm.challengeFee.replace(/\D/g, "") || 9999))[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Compare anything</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl">Stop comparing tabs. Compare decisions.</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
        FundedScope compare is structured around the actual trader decision: score reason, rules, payout, fee, market fit, spread context and source confidence.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {compareModes.map(([title, copy]) => (
          <GlassCard key={title}>
            <p className="text-lg font-black text-white">{title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
          </GlassCard>
        ))}
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Best overall</p>
          <h2 className="mt-2 text-2xl font-black text-white">{leader?.firm.name}</h2>
          <p className="mt-2 text-sm text-slate-400">{leader?.firm.score}/100 with the strongest combined profile in this set.</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-success">Fastest payout fit</p>
          <h2 className="mt-2 text-2xl font-black text-white">{fastestPayout?.firm.name}</h2>
          <p className="mt-2 text-sm text-slate-400">{fastestPayout?.firm.payoutFrequency} payout positioning.</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-warning">Lowest entry fee</p>
          <h2 className="mt-2 text-2xl font-black text-white">{lowestFee?.firm.name}</h2>
          <p className="mt-2 text-sm text-slate-400">Challenge fee starts around {lowestFee?.firm.challengeFee}.</p>
        </GlassCard>
      </section>

      <section className="mt-8 grid gap-4 md:hidden">
        {comparedFirms.map(({ firm, trust }) => (
          <GlassCard key={firm.slug}>
            <div className="flex items-center gap-3">
              <FirmLogo firm={firm} />
              <div>
                <h2 className="text-xl font-black text-white">{firm.name}</h2>
                <p className="text-sm text-slate-400">{firm.country} · {firm.rating.toFixed(1)} ★</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Score" value={`${firm.score}/100`} />
              <Metric label="Fee" value={firm.challengeFee} />
              <Metric label="Target" value={firm.profitTarget} />
              <Metric label="Daily DD" value={firm.dailyDrawdown} />
              <Metric label="Payout" value={firm.payout} />
              <Metric label="Max DD" value={firm.maxDrawdown} />
            </div>
            <div className="mt-5">
              <ScoreBreakdown firm={firm} compact />
            </div>
            <p className="mt-4 text-sm text-slate-400">Best for: {trust.bestFor.join(", ")}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-8 hidden gap-4 md:grid xl:grid-cols-5">
        {comparedFirms.map(({ firm, trust, score }, index) => (
          <article key={firm.slug} className={`glass rounded-[2rem] p-5 ${index === 0 ? "glow-border" : ""}`}>
            <div className="flex items-center gap-3">
              <FirmLogo firm={firm} size="sm" />
              <div className="min-w-0">
                <Link href={`/prop-firms/${firm.slug}`} className="block truncate text-lg font-black text-white hover:text-electric">
                  {firm.name}
                </Link>
                <p className="text-xs text-slate-500">{firm.country}</p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score</p>
              <p className="mt-1 text-4xl font-black text-electric">{firm.score}</p>
              <p className="text-xs text-slate-500">out of 100</p>
            </div>

            <div className="mt-4 space-y-2">
              {score.rows.slice(0, 3).map((row) => (
                <div key={row.key}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-slate-500">{row.label}</span>
                    <span className="font-bold text-white">
                      {row.earned}/{row.max}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-electric" style={{ width: `${row.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <Metric label="Fee" value={firm.challengeFee} />
              <Metric label="Payout" value={firm.payout} />
              <Metric label="Daily DD" value={firm.dailyDrawdown} />
              <Metric label="Max DD" value={firm.maxDrawdown} />
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-electric">Best for</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {trust.bestFor.slice(0, 2).map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">Source: {trust.sourceLabel}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Decision checklist</p>
          <h2 className="mt-2 text-2xl font-black text-white">Before choosing a firm</h2>
          <div className="mt-5 space-y-3">
            {decisionChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-violet">What comes next</p>
          <h2 className="mt-2 text-2xl font-black text-white">Compare brokers and prop firms together.</h2>
          <p className="mt-4 leading-7 text-slate-300">
            The next layer connects broker spreads, commissions and execution notes into the same decision engine, so traders can compare the full path: broker, prop firm, challenge, account rules and risk.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/brokers" className="rounded-full bg-white px-5 py-3 text-center font-bold text-void">
              View broker layer
            </Link>
            <Link href="/spreads" className="rounded-full border border-white/10 px-5 py-3 text-center font-bold text-white">
              Compare spreads
            </Link>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
