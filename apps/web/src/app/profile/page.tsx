import { GlassCard } from "../../components/GlassCard";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Profile</p>
      <h1 className="mt-3 text-4xl font-black text-white">Personalized trader profile</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">Experience, strategy, market preferences and risk tolerance power recommendations.</p>
      </GlassCard>
    </main>
  );
}
