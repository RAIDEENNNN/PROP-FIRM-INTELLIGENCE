import { GlassCard } from "../../components/GlassCard";

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Calculators</p>
      <h1 className="mt-3 text-4xl font-black text-white">Evaluation calculators for serious risk control</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {["Lot size calculator", "Drawdown calculator", "Profit target calculator"].map((title) => (
          <GlassCard key={title}>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <div className="mt-5 space-y-3">
              <input className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Account balance" />
              <input className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Risk / target value" />
              <button className="w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void">Calculate</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
