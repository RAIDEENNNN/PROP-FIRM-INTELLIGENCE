import { GlassCard } from "../../components/GlassCard";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">About the creator</p>
      <h1 className="mt-3 text-4xl font-black text-white">Built to make prop firm research cleaner, faster and fairer.</h1>
      <GlassCard className="mt-8">
        <p className="leading-8 text-slate-300">
          FundedScope is designed as a premium trader intelligence platform: comparison data, rule-change tracking, payout transparency and tools that help traders avoid bad-fit challenges.
        </p>
      </GlassCard>
    </main>
  );
}
