import type { Metadata } from "next";
import { DecisionEngine } from "../../components/DecisionEngine";

export const metadata: Metadata = {
  title: "Trader Decision Engine | FundedScope",
  description: "Find a research-ready trading setup based on country, capital, experience, platform, risk and trading style."
};

export default function DecisionEnginePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <section className="mb-8 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),rgba(255,255,255,0.03)] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Trader Decision Engine™</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Research the setup that fits your capital, country and trading style.</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
          FundedScope does not tell users what to trade. It explains which markets, brokers and firms may be worth researching first based on transparent suitability inputs.
        </p>
      </section>
      <DecisionEngine />
    </main>
  );
}
