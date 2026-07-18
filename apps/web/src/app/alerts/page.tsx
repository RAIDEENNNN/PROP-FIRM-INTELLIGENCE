import { GlassCard } from "../../components/GlassCard";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Alerts | FundedScope", "Private FundedScope alert preferences and notifications.", "/alerts");

const alertGroups = [
  {
    title: "Rule changes",
    detail: "Daily-loss, max-loss, consistency, payout and platform updates for saved firms.",
    channels: ["In-app", "Email"]
  },
  {
    title: "Payout proof",
    detail: "Moderated payout confirmations and disputes linked to firms you follow.",
    channels: ["In-app"]
  },
  {
    title: "Spread watch",
    detail: "Gold, indices, forex and synthetic spread movements when provider-backed data is available.",
    channels: ["In-app", "Email"]
  },
  {
    title: "Broker risk",
    detail: "Regulatory, payment, platform and account-condition changes for tracked brokers.",
    channels: ["In-app"]
  }
];

const savedTriggers = [
  ["FTMO", "Rule change watch", "High"],
  ["Gold / XAUUSD", "Volatility and spread watch", "Medium"],
  ["Exness", "Broker condition watch", "Medium"]
];

export default function AlertsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Alerts</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-black text-white sm:text-6xl">Policy, payout and spread alerts.</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
        Track the events that can change a trader’s decision before buying a challenge, choosing a broker or holding risk through volatile sessions.
      </p>

      <section className="mt-8 grid gap-4 lg:grid-cols-4">
        {alertGroups.map((group) => (
          <GlassCard key={group.title}>
            <h2 className="text-xl font-black text-white">{group.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{group.detail}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.channels.map((channel) => (
                <span key={channel} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-electric">
                  {channel}
                </span>
              ))}
            </div>
          </GlassCard>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.6fr_0.4fr]">
        <GlassCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet">Saved triggers</p>
              <h2 className="mt-2 text-2xl font-black text-white">Your active watchlist logic</h2>
            </div>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success">Ready</span>
          </div>
          <div className="mt-5 grid gap-3">
            {savedTriggers.map(([name, detail, priority]) => (
              <div key={name} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-black text-white">{name}</p>
                  <p className="mt-1 text-sm text-slate-400">{detail}</p>
                </div>
                <span className="w-fit rounded-full bg-violet/20 px-3 py-1 text-xs font-black uppercase text-purple-100">{priority}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Delivery rules</p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Critical alerts should appear in the notification bell first.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Email digests group lower-priority changes to avoid noisy trading sessions.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Every alert links back to a source, firm, broker or radar item.</p>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
