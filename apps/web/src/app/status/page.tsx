import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { liveSources } from "../../lib/live-sources";

export const metadata: Metadata = {
  title: "Platform Status | FundedScope",
  description: "Check FundedScope platform, API, market data, news, email and payment readiness."
};

const systems: Array<[string, string, string]> = [
  ["Website", "Operational", "Public comparison, broker intelligence and research pages are available."],
  ["Accounts", "Under development", "Sign-up and profile flows exist, but full UAT for verification, password reset and persistence is still required."],
  ["Data platform", "Under development", "Firm, broker, rules and source-status data are maintained, but admin workflows need production role enforcement."],
  ["Payments", "Not launched", "Paid subscriptions and checkout are disabled until Stripe, feature access and billing UAT are complete."],
  ["Email delivery", "Under development", "Account and product email delivery needs end-to-end verification before being marked operational."],
  ["Market feeds", "Degraded", "Market reference APIs may be unavailable. Static examples must not be treated as live quotes or live calendar events."],
  ["Verified reviews", "Not launched", "Trader reviews and payout proof require moderation workflow completion before affecting public scores."],
  ["Analytics", "Under development", "Product analytics are planned for reliability and usability measurement, but are not a launch-critical live service yet."]
];

function statusClass(status: string) {
  if (status === "Operational") return "border-success/30 bg-success/10 text-success";
  if (status === "Degraded") return "border-warning/30 bg-warning/10 text-warning";
  if (status === "Not launched") return "border-danger/30 bg-danger/10 text-danger";
  return "border-electric/30 bg-electric/10 text-electric";
}

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
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(status)}`}>{status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
          </GlassCard>
        ))}
      </section>
      <section className="mt-8">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Source registry</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {liveSources.map((source) => {
              const configured = source.envKeys.length === 0 || source.envKeys.every((key) => Boolean(process.env[key]));
              return (
                <div key={source.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-black text-white">{source.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{source.launchUse}</p>
                  <p className={`mt-3 text-sm font-bold ${configured ? "text-emerald-300" : "text-warning"}`}>{configured ? "Configured" : "Not configured"}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
