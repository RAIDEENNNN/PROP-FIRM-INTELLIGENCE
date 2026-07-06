import { GlassCard } from "../../components/GlassCard";
import { newsEvents } from "../../lib/data";

export default function NewsRadarPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">News radar</p>
      <h1 className="mt-3 text-4xl font-black text-white">Rule changes, payout signals and market risk</h1>
      <div className="mt-8 space-y-4">
        {newsEvents.map((event) => (
          <GlassCard key={event.title}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-violet/15 px-3 py-1 text-xs text-violet">{event.impact} impact</span>
                <h2 className="mt-3 text-xl font-bold text-white">{event.title}</h2>
              </div>
              <p className="text-sm text-slate-400">{event.time}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
