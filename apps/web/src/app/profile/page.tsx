import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { traderDnaProfile } from "../../lib/trader-dna";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Profile</p>
      <h1 className="mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">Your trader profile should become your unfair advantage.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        This is where FundedScope stops being a comparison site and becomes a personal operating system for trading decisions.
      </p>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Trader DNA summary</p>
          <h2 className="mt-2 text-3xl font-black text-white">{traderDnaProfile.identity}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Mini label="Primary market" value={traderDnaProfile.primaryMarket} />
            <Mini label="Best session" value={traderDnaProfile.bestSession} />
            <Mini label="Risk sweet spot" value={traderDnaProfile.riskSweetSpot} />
            <Mini label="Danger zone" value={traderDnaProfile.dangerZone} />
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Progress</p>
          <p className="mt-2 text-5xl font-black text-electric">{traderDnaProfile.level}</p>
          <p className="mt-3 text-sm text-slate-400">Next level: {traderDnaProfile.nextLevel}</p>
          <Link href="/trader-dna" className="mt-6 block rounded-full bg-white px-5 py-3 text-center font-bold text-void">
            View full DNA
          </Link>
        </GlassCard>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {traderDnaProfile.memoryStats.map(([label, value]) => (
          <GlassCard key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
