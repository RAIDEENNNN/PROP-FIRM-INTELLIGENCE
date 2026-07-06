import { GlassCard } from "../../components/GlassCard";
import { getSourceReadiness, liveSources } from "../../lib/live-sources";

export default function SourcesPage() {
  const readiness = getSourceReadiness();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Live source plugins</p>
      <h1 className="mt-3 max-w-5xl text-4xl font-black text-white md:text-6xl">Built to plug into real market, news, review and payment sources.</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
        FundedScope launches with a source registry: public crypto market data can attach immediately, while premium FX, synthetic, news, Stripe and moderation feeds activate as soon as keys/accounts are added.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-slate-400">Sources mapped</p>
          <p className="mt-2 text-3xl font-black text-white">{readiness.total}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Live-ready now</p>
          <p className="mt-2 text-3xl font-black text-success">{readiness.connected}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Need keys</p>
          <p className="mt-2 text-3xl font-black text-warning">{readiness.keyRequired}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Editorial review</p>
          <p className="mt-2 text-3xl font-black text-violet">{readiness.manualReview}</p>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {liveSources.map((source) => (
          <GlassCard key={source.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{source.category}</p>
                <h2 className="mt-2 text-xl font-black text-white">{source.name}</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  source.status === "Live-ready" || source.status === "Connected"
                    ? "bg-success/15 text-success"
                    : source.status === "Manual review"
                      ? "bg-violet/15 text-violet"
                      : "bg-warning/15 text-warning"
                }`}
              >
                {source.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{source.description}</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">{source.launchUse}</p>
            {source.envKeys.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {source.envKeys.map((key) => (
                  <code key={key} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-electric">
                    {key}
                  </code>
                ))}
              </div>
            ) : null}
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
