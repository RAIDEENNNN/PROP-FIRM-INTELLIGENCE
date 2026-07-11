import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { liveSources } from "../../lib/live-sources";

export const metadata: Metadata = {
  title: "Platform Status | FundedScope",
  description: "Check FundedScope platform, API, market data, news, email and payment readiness."
};

const systems = [
  ["Frontend", "Operational", "Live Next.js application"],
  ["Backend API", "Needs deployment URL", "Express API is built; production host must be connected"],
  ["Database", "Partially connected", "Supabase project exists; production API connection is next"],
  ["Stripe", "Ready for keys", "Subscription routes are scaffolded"],
  ["Emails", "Ready for provider", "Resend/provider key required"],
  ["Analytics", "Ready for IDs", "GA4 and Clarity load when env vars are set"]
];

export default function StatusPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Platform Status</p>
      <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">FundedScope system health.</h1>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {systems.map(([name, status, detail]) => (
          <GlassCard key={name}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-white">{name}</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-electric">{status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
          </GlassCard>
        ))}
      </section>
      <section className="mt-8">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Live source registry</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {liveSources.map((source) => {
              const configured = source.envKeys.length === 0 || source.envKeys.every((key) => Boolean(process.env[key]));
              return (
                <div key={source.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-black text-white">{source.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{source.launchUse}</p>
                  <p className={`mt-3 text-sm font-bold ${configured ? "text-emerald-300" : "text-warning"}`}>{configured ? "Configured" : "Awaiting keys"}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
