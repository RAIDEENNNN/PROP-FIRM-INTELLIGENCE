import { GlassCard } from "../../components/GlassCard";

const brokers = [
  ["IC Markets", "Forex, indices, commodities, crypto", "Raw spread focus", "Live feed ready"],
  ["Pepperstone", "Forex, indices, commodities", "Execution reputation", "Live feed ready"],
  ["Eightcap", "Forex, crypto, indices", "Crypto CFD coverage", "Live feed ready"],
  ["OANDA", "Forex, metals, indices", "Regulated global brand", "Research source"]
];

const criteria = [
  ["Spreads", "Raw and standard account spread comparison."],
  ["Commissions", "Round-turn cost and account-type fees."],
  ["Execution", "Slippage, restrictions and execution notes."],
  ["Assets", "Forex, Gold, indices, crypto, commodities and stocks."],
  ["Trust", "Regulation, operating history, reviews and transparency."],
  ["Trader fit", "Scalping, swing, news trading and strategy compatibility."]
];

export default function BrokersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Broker intelligence</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl">Compare brokers like you compare prop firms.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        Broker intelligence is the next FundedScope layer: spreads, commissions, trading conditions, assets, trust and strategy fit in one decision system.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {brokers.map(([name, markets, edge, status]) => (
          <GlassCard key={name}>
            <p className="text-xl font-black text-white">{name}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{markets}</p>
            <p className="mt-4 rounded-full border border-white/10 px-3 py-1 text-xs text-electric">{edge}</p>
            <p className="mt-3 text-xs text-slate-500">{status}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-10">
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Broker score formula</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {criteria.map(([title, copy]) => (
            <GlassCard key={title}>
              <h2 className="text-xl font-black text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  );
}
