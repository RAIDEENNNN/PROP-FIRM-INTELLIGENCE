import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { TradeReadinessCheck } from "../../components/TradeReadinessCheck";
import { traderDnaPrinciples, traderDnaProfile } from "../../lib/trader-dna";

export const metadata: Metadata = {
  title: "Trader DNA: Personal Trading Memory | FundedScope",
  description: "Build a personal trading profile that remembers habits, markets, risk tolerance, mistakes, strengths and decision patterns.",
  alternates: { canonical: "/trader-dna" },
  openGraph: {
    title: "Trader DNA | FundedScope",
    description: "The personal trading memory competitors cannot copy.",
    url: "/trader-dna",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trader DNA | FundedScope",
    description: "The personal trading memory competitors cannot copy.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function TraderDnaPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Trader DNA</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl md:text-6xl">The personal trading memory competitors cannot copy.</h1>
      <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300">
        FundedScope becomes sticky when it learns the trader: markets, sessions, emotions, mistakes, risk tolerance, prop accounts, brokers and improvement path.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {traderDnaProfile.memoryStats.map(([label, value]) => (
          <GlassCard key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Identity layer</p>
          <h2 className="mt-2 text-3xl font-black text-white">{traderDnaProfile.identity}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Mini label="Current level" value={traderDnaProfile.level} />
            <Mini label="Next level" value={traderDnaProfile.nextLevel} />
            <Mini label="Primary market" value={traderDnaProfile.primaryMarket} />
            <Mini label="Best session" value={traderDnaProfile.bestSession} />
            <Mini label="Risk sweet spot" value={traderDnaProfile.riskSweetSpot} />
            <Mini label="Danger zone" value={traderDnaProfile.dangerZone} />
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">DNA score</p>
          <p className="mt-2 text-6xl font-black text-electric">{traderDnaProfile.dnaScore}/100</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This score reflects how much FundedScope knows about this trader and how strong the personal decision engine has become.
          </p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-success via-electric to-violet" style={{ width: `${traderDnaProfile.dnaScore}%` }} />
          </div>
        </GlassCard>
      </section>

      <section className="mt-6">
        <TradeReadinessCheck />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-success">Strengths</p>
          <div className="mt-5 space-y-3">
            {traderDnaProfile.strengths.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-warning">Weaknesses</p>
          <div className="mt-5 space-y-3">
            {traderDnaProfile.weaknesses.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Weekly AI mentor</p>
          <h2 className="mt-2 text-2xl font-black text-white">Sunday review</h2>
          <div className="mt-5 space-y-3">
            {traderDnaProfile.weeklyMentor.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Personal statistics</p>
          <h2 className="mt-2 text-2xl font-black text-white">Not just win rate. Everything.</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {traderDnaProfile.personalStats.map(([label, value]) => (
              <Mini key={label} label={label} value={value} />
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {traderDnaPrinciples.map((item) => (
          <GlassCard key={item.title}>
            <h2 className="text-xl font-black text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
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
