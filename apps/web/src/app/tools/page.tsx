import type { Metadata } from "next";
import { CalculatorCard } from "../../components/CalculatorCard";
import { GlassCard } from "../../components/GlassCard";
import { GoldRiskPlanner } from "../../components/GoldRiskPlanner";

export const metadata: Metadata = {
  title: "Trading Calculators & Tools | FundedScope",
  description: "Use lot size, risk, position size, pip, drawdown, profit, margin, compounding and session tools for prop firm trading.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Trading Calculators & Tools | FundedScope",
    description: "Risk calculators and trading tools for funded-account traders.",
    url: "/tools",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trading Calculators & Tools | FundedScope",
    description: "Risk calculators and trading tools for funded-account traders.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

const calculators: Array<[string, string]> = [
  ["Lot Size Calculator", "Estimate position size from account balance, stop loss and risk percentage."],
  ["Risk Calculator", "Translate risk percentage into cash amount before entering a trade."],
  ["Position Size Calculator", "Plan trade size across forex, metals, indices and crypto-style CFDs."],
  ["Pip Calculator", "Estimate pip value and movement cost before execution."],
  ["Drawdown Calculator", "See how many full-risk losses fit inside a prop firm daily/max drawdown."],
  ["Profit Calculator", "Map profit targets to account size, payout split and remaining challenge progress."],
  ["Margin Calculator", "Estimate margin impact when broker leverage and contract size are known."],
  ["Compounding Calculator", "Model scaling plans, retained profit and account growth."],
  ["Economic Calendar", "Track high-impact news windows that can affect Gold, FX and indices."],
  ["Trading Sessions", "Plan London, New York, Asia and overlap volatility windows."]
];

const sessions = [
  ["Asia", "Lower FX volatility, watch JPY/AUD/NZD."],
  ["London", "Trend formation and major FX liquidity."],
  ["New York", "Gold, indices and USD news risk."],
  ["Overlap", "Highest liquidity, fastest spread changes."]
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Trading tools</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl">Calculators, calendars and risk controls for serious traders.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        FundedScope tools are designed for prop firm and live-account decisions: risk before entry, drawdown before challenge purchase and news context before volatility.
      </p>

      <div className="mt-8">
        <GoldRiskPlanner />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {calculators.map(([title, copy]) => (
          <CalculatorCard key={title} title={title} copy={copy} />
        ))}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        {sessions.map(([name, copy]) => (
          <GlassCard key={name}>
            <p className="text-sm uppercase tracking-[0.24em] text-violet">{name}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
