import { GlassCard } from "../../components/GlassCard";

export default function JournalPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Journal</p>
      <h1 className="mt-3 text-4xl font-black text-white">Track challenges and funded accounts</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">Challenge tracking, funded account progress, payout milestones and rule-risk notes will live here.</p>
      </GlassCard>
    </main>
  );
}
