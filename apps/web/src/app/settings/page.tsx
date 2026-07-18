import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Account settings | FundedScope", "Private FundedScope security, billing and notification settings.", "/settings");

const settingsSections = [
  {
    title: "Profile",
    detail: "Trading identity, country, timezone, markets, strategy and account goals.",
    href: "/profile#trading-dna-form",
    action: "Edit profile"
  },
  {
    title: "Alerts",
    detail: "Rule-change, payout, broker and spread notification preferences.",
    href: "/alerts",
    action: "Manage alerts"
  },
  {
    title: "Billing",
    detail: "Plan access, upgrade path and premium feature availability.",
    href: "/pricing",
    action: "View plans"
  },
  {
    title: "Data quality",
    detail: "Report incorrect firm, broker, spread or article information.",
    href: "/report",
    action: "Report issue"
  }
];

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Settings</p>
      <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Account settings</h1>
      <p className="mt-4 text-base leading-7 text-slate-300">
        Keep your trading profile, saved alerts, billing and data-quality workflows pointed at the decisions you actually make.
      </p>

      <section className="mt-8 grid gap-4">
        {settingsSections.map((section) => (
          <GlassCard key={section.title}>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-white">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{section.detail}</p>
              </div>
              <Link href={section.href} className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:border-electric/40 hover:text-electric">
                {section.action}
              </Link>
            </div>
          </GlassCard>
        ))}
      </section>

      <GlassCard className="mt-8">
        <p className="text-sm uppercase tracking-[0.24em] text-violet">Account protection</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["Session-based access", "Private profile routes", "Source-backed reports"].map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-200">
              {item}
            </p>
          ))}
        </div>
      </GlassCard>
    </main>
  );
}
