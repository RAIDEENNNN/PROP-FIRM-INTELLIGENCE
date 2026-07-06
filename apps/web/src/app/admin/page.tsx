import { GlassCard } from "../../components/GlassCard";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-danger">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-white">Operations cockpit</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {["Users", "Firms", "Spreads", "News", "Reviews", "Payments", "KYC", "Audit logs"].map((item) => (
          <GlassCard key={item}>
            <p className="text-xl font-black text-white">{item}</p>
            <p className="mt-2 text-sm text-slate-400">Admin controls scaffolded for {item.toLowerCase()}.</p>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
