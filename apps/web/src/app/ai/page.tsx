import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { TradeReadinessCheck } from "../../components/TradeReadinessCheck";
import { traderDnaProfile } from "../../lib/trader-dna";

export const metadata: Metadata = {
  title: "FundedScope AI Trading Assistant | Trader DNA",
  description: "A personalized AI trading assistant concept that uses Trader DNA, journal patterns, market risk, spreads and prop firm rules.",
  alternates: { canonical: "/ai" },
  openGraph: {
    title: "FundedScope AI Trading Assistant",
    description: "Personalized trading intelligence built around your profile, habits and risk.",
    url: "/ai",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "FundedScope AI Trading Assistant",
    description: "Personalized trading intelligence built around your profile, habits and risk.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

const prompts = [
  ["Should I trade Gold today?", "Uses your Trader DNA, news risk, spread status, session and recent journal behaviour."],
  ["Why did I lose money this week?", "Looks across trades, emotions, timing, market conditions and repeated mistakes."],
  ["Which prop firm suits me?", "Matches your strategy, risk tolerance, payout needs, markets and rule sensitivity."],
  ["Explain today’s CPI risk.", "Summarizes likely volatility, affected assets and what to avoid before/after release."],
  ["What should I improve next?", "Turns your journal and stats into one focused improvement target."]
];

const evidence = [
  ["Trader memory", `${traderDnaProfile.memoryStats[0]?.[1]} trades remembered`],
  ["Best market", traderDnaProfile.primaryMarket],
  ["Best session", traderDnaProfile.bestSession],
  ["Risk sweet spot", traderDnaProfile.riskSweetSpot],
  ["Danger zone", traderDnaProfile.dangerZone],
  ["Identity", traderDnaProfile.identity]
];

export default function AiPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">FundedScope AI</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl md:text-6xl">Not ChatGPT. Your trading context, remembered.</h1>
      <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300">
        FundedScope AI should answer with evidence: your broker, prop firm, journal history, market conditions, risk limits, emotional patterns and goals.
      </p>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.48fr_0.52fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Ask AI</p>
          <div className="mt-5 rounded-3xl border border-white/10 bg-void p-4">
            <p className="text-sm text-slate-500">Question</p>
            <p className="mt-2 text-2xl font-black text-white">Should I trade Gold today?</p>
          </div>
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-warning">Answer</p>
            <p className="mt-3 leading-7 text-slate-300">
              Wait. Gold is tradable today, but not yet. Your journal shows weaker performance before high-impact USD news, and your best results come after London liquidity confirms direction. Reduce risk or wait for spreads to normalize.
            </p>
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Evidence used</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {evidence.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-6">
        <TradeReadinessCheck />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {prompts.map(([question, context]) => (
          <GlassCard key={question}>
            <h2 className="text-lg font-black text-white">{question}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{context}</p>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
