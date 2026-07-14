import { GlassCard } from "../../components/GlassCard";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Alerts | FundedScope", "Private FundedScope alert preferences and notifications.", "/alerts");

export default function AlertsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Alerts</p>
      <h1 className="mt-3 text-4xl font-black text-white">Policy, payout and spread alerts</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">Saved preferences and notification triggers connect to the alerts API module.</p>
      </GlassCard>
    </main>
  );
}
