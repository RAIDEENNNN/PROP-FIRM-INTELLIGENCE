import { GlassCard } from "../../components/GlassCard";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Admin workspace | FundedScope", "Private FundedScope administration workspace.", "/admin");

const adminModules = [
  {
    title: "Prop firms",
    endpoint: "GET/POST /api/admin/firms",
    state: "Content operations",
    fields: "draft, under-review, published, archived"
  },
  {
    title: "Challenges",
    endpoint: "Supabase: prop_firm_challenges",
    state: "Data operations",
    fields: "pricing, targets, drawdown, platform, verification"
  },
  {
    title: "Rules",
    endpoint: "Supabase: prop_firm_rules",
    state: "Data operations",
    fields: "rule category, current value, source, last verified"
  },
  {
    title: "Rule-change history",
    endpoint: "Supabase: prop_firm_rule_history",
    state: "Source history",
    fields: "previous value, new value, source, verified by"
  },
  {
    title: "Information reports",
    endpoint: "GET/PATCH /api/admin/reports",
    state: "Moderation queue ready",
    fields: "status, assigned admin, evidence, resolution notes"
  },
  {
    title: "Reviews",
    endpoint: "GET/PATCH /api/reviews + admin workflow",
    state: "Existing moderation",
    fields: "pending, verified, rejected"
  },
  {
    title: "Brokers",
    endpoint: "Supabase: brokers",
    state: "Data operations",
    fields: "accounts, instruments, regulations, availability"
  },
  {
    title: "Broker accounts",
    endpoint: "Supabase: broker_accounts",
    state: "Data operations",
    fields: "deposit, spread model, leverage, platforms"
  },
  {
    title: "Notifications",
    endpoint: "GET/PATCH /api/persistence/notifications",
    state: "User delivery ready",
    fields: "title, message, type, href, read state"
  }
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-danger">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-white">Operations cockpit</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
        Internal-only tools must remain behind authenticated admin routes. Public users should only receive published records and concise methodology, never database IDs, private source URLs, admin notes or scoring overrides.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {adminModules.map((item) => (
          <GlassCard key={item.title}>
            <div className="flex items-start justify-between gap-4">
              <p className="text-xl font-black text-white">{item.title}</p>
              <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-black text-electric">{item.state}</span>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{item.endpoint}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.fields}</p>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
