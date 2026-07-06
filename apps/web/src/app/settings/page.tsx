import { GlassCard } from "../../components/GlassCard";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Settings</p>
      <h1 className="mt-3 text-4xl font-black text-white">Account settings</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">Security, billing, email preferences and notification settings.</p>
      </GlassCard>
    </main>
  );
}
