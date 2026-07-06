import { SpreadMatrix } from "../../components/SpreadMatrix";

export default function SpreadsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Spread intelligence</p>
      <h1 className="mt-3 max-w-5xl text-4xl font-black text-white md:text-6xl">Spreads for every tracked firm, pair and synthetic instrument.</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
        Forex majors, minors, exotics, crypto pairs and synthetic instruments are mapped across every prop firm. Current numbers are indicative baselines until live broker feeds are connected.
      </p>
      <SpreadMatrix />
    </main>
  );
}
