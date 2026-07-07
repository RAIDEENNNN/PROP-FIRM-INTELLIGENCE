import { fallbackMarkets } from "../lib/markets";

export default function Loading() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-glow backdrop-blur-xl">
        <div className="fundedscope-pulse mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-glow">
          <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" className="h-full w-full object-cover" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.32em] text-electric">FundedScope</p>
        <h1 className="mt-3 text-3xl font-black text-white">Preparing your trading intelligence.</h1>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="progress-sweep h-full w-1/2 rounded-full bg-gradient-to-r from-electric via-white to-violet" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {fallbackMarkets.slice(0, 4).map((market) => (
            <div key={market.symbol} className="rounded-2xl border border-white/10 bg-void/70 p-3">
              <p className="text-xs text-slate-500">{market.label}</p>
              <p className="mt-1 font-black text-white">{market.price}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
