import Link from "next/link";
import { dashboardMetrics, featuredFirms, newsEvents } from "../lib/data";
import { FirmLogo } from "./FirmLogo";
import { GlassCard } from "./GlassCard";
import { MetricCard } from "./MetricCard";
import { RiskMeter } from "./RiskMeter";

export function CommandPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <GlassCard className="glow-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-electric">Live comparison</p>
            <h2 className="mt-2 text-2xl font-black text-white">Command center</h2>
          </div>
          <span className="rounded-full bg-success/15 px-3 py-1 text-sm text-success">Online</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          {featuredFirms.slice(0, 3).map((firm) => (
            <div key={firm.slug} className="grid gap-4 border-b border-white/10 p-4 last:border-0 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-3">
                <FirmLogo firm={firm} size="sm" />
                <div>
                  <p className="font-bold text-white">{firm.name}</p>
                  <p className="text-sm text-slate-400">{firm.challengeFee} · {firm.payout}</p>
                </div>
              </div>
              <RiskMeter score={firm.score} />
              <p className="text-right text-sm text-slate-300">{firm.rating.toFixed(1)} ★</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <p className="text-sm uppercase tracking-[0.28em] text-violet">News radar</p>
        <h2 className="mt-2 text-2xl font-black text-white">Signals that move risk</h2>
        <div className="mt-6 space-y-4">
          {newsEvents.map((event) => (
            <Link
              key={event.title}
              href={event.href}
              aria-label={`Open research item: ${event.title}`}
              className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-electric/30 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-electric/10 px-3 py-1 text-xs text-electric">{event.impact}</span>
                <span className="text-xs text-slate-500">{event.time}</span>
              </div>
              <p className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-white">
                <span>{event.title}</span>
                <span aria-hidden="true" className="text-slate-500 transition group-hover:text-electric">→</span>
              </p>
            </Link>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
