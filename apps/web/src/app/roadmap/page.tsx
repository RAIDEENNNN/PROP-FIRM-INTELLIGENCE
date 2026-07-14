import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Product Updates | FundedScope",
  description: "See FundedScope product improvements, active intelligence work and platform priorities."
};

const columns = [
  {
    title: "Available",
    tone: "text-emerald-200",
    items: ["Compare prop firms", "Compare brokers", "Trader DNA profile", "Score methodology", "SEO pages", "Favicon and brand assets"]
  },
  {
    title: "Active Intelligence Work",
    tone: "text-electric",
    items: ["Account profiles", "Verified reviews", "Rule change history", "Watchlists and alerts", "Broker spread verification"]
  },
  {
    title: "Priority Areas",
    tone: "text-gold",
    items: ["Mobile experience", "AI assistant", "Notifications", "Trading journal memory", "Trader Connect", "Broker API access", "Premium reports"]
  }
];

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),rgba(255,255,255,0.03)] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Product updates</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Building the place traders open before they trade.</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
          FundedScope is evolving from comparison pages into a trader intelligence system: verified data, personal profiles, alerts, broker intelligence and AI decision support.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {columns.map((column) => (
          <GlassCard key={column.title}>
            <h2 className={`text-2xl font-black ${column.tone}`}>{column.title}</h2>
            <div className="mt-5 space-y-3">
              {column.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-200">
                  {column.title === "Available" ? "☑" : column.title === "Active Intelligence Work" ? "◆" : "◇"} {item}
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </section>

      <GlassCard className="mt-8">
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Build principle</p>
        <h2 className="mt-2 text-3xl font-black text-white">Every release must help traders make a better decision.</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Every product priority must improve discovery, comparison, tracking, verification, risk awareness or personal trading discipline.
        </p>
      </GlassCard>
    </main>
  );
}
