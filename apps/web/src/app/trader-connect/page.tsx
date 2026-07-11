import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Trader Connect | FundedScope",
  description: "Find accountability partners, trading circles and verified trader profiles through FundedScope Trader Connect."
};

const traders = [
  { name: "Maya R.", country: "United Kingdom", style: "London session Gold trader", markets: "Gold, EUR/USD", lookingFor: "Accountability partner" },
  { name: "Daniel K.", country: "Nigeria", style: "ICT day trader", markets: "XAUUSD, NAS100", lookingFor: "Prop challenge group" },
  { name: "Sofia L.", country: "Spain", style: "Swing trader", markets: "Forex, indices", lookingFor: "Weekly review partner" }
];

const circles = ["Gold Traders", "ICT Traders", "SMC Traders", "Scalpers", "Swing Traders", "Funded Traders", "Beginner Traders", "Crypto Traders"];

export default function TraderConnectPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.18),transparent_30%),rgba(255,255,255,0.03)] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Trader Connect™</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Find traders who match how you trade.</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
          Not a noisy chatroom. Trader Connect is designed for accountability partners, trading circles, verified profiles and useful trader matching.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Find your trading match</p>
          <h2 className="mt-2 text-3xl font-black text-white">Filter by what actually matters.</h2>
          <div className="mt-5 grid gap-3">
            {["Country", "Trading style", "Markets", "Experience", "Prop firm", "Broker", "Language"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-4 md:grid-cols-3">
          {traders.map((trader) => (
            <GlassCard key={trader.name}>
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-electric to-violet text-xl font-black text-white">
                {trader.name.slice(0, 1)}
              </div>
              <h2 className="mt-4 text-xl font-black text-white">{trader.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{trader.country}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>{trader.style}</p>
                <p>{trader.markets}</p>
                <p className="font-bold text-electric">{trader.lookingFor}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Trading circles</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {circles.map((circle) => (
              <span key={circle} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200">
                {circle}
              </span>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Verified credibility</p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">✔ Verified Funded Trader</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">✔ Verified Payout</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">✔ Community Mentor</p>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
