import Link from "next/link";
import { FirmLogo } from "../../components/FirmLogo";
import { GlassCard } from "../../components/GlassCard";
import { GoldRiskPlanner } from "../../components/GoldRiskPlanner";
import { propFirms } from "../../lib/data";
import { spreadRecords } from "../../lib/spreads";
import { getFirmTrust } from "../../lib/trust";

const highImpactEvents = [
  { event: "US CPI / inflation data", countdown: "Next major inflation print", risk: "Gold can spike both directions within seconds." },
  { event: "FOMC / Fed speech window", countdown: "Watch New York session", risk: "Spread widening and slippage risk can rise." },
  { event: "NFP / unemployment data", countdown: "First Friday risk window", risk: "Avoid revenge trades after the first impulse." }
];

const journalReminders = [
  "You tend to perform worse when entering before high-impact USD news.",
  "Gold trades need wider stop planning than EURUSD-style setups.",
  "If the first XAUUSD trade loses, reduce size instead of immediately re-entering."
];

export default function GoldPage() {
  const goldSpreads = spreadRecords
    .filter((record) => record.symbol === "XAUUSD")
    .sort((a, b) => a.spread - b.spread)
    .slice(0, 8);

  const restrictedFirms = propFirms
    .filter((firm) => firm.markets.includes("Commodities"))
    .slice(0, 5)
    .map((firm) => ({ firm, trust: getFirmTrust(firm) }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Gold command center</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-4xl md:text-6xl">Trade XAUUSD with the context traders usually open five websites to find.</h1>
      <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
        One page for Gold volatility context, high-impact news risk, prop firm spread comparison, rule reminders, personal risk limits and journal prompts. Live market/news APIs can replace these launch baselines when keys are connected.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-slate-400">Gold trend</p>
          <p className="mt-2 text-3xl font-black text-white">Volatile</p>
          <p className="mt-2 text-sm text-slate-500">Launch baseline · live feed ready</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">XAUUSD spread mode</p>
          <p className="mt-2 text-3xl font-black text-warning">Medium</p>
          <p className="mt-2 text-sm text-slate-500">Compare firm rows below</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">News risk</p>
          <p className="mt-2 text-3xl font-black text-danger">High</p>
          <p className="mt-2 text-sm text-slate-500">USD data can move Gold sharply</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Rule reminder</p>
          <p className="mt-2 text-3xl font-black text-white">Check news</p>
          <p className="mt-2 text-sm text-slate-500">Some firms restrict news trading</p>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Best prop firm Gold spreads today</p>
          <h2 className="mt-2 text-2xl font-black text-white">Lowest XAUUSD spread rows</h2>
          <div className="mt-5 space-y-3">
            {goldSpreads.map((record) => {
              const firm = propFirms.find((item) => item.slug === record.firmSlug);
              return (
                <Link key={record.firmSlug} href={`/prop-firms/${record.firmSlug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {firm ? <FirmLogo firm={firm} size="sm" /> : null}
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{record.firmName}</p>
                      <p className="text-xs text-slate-500">{record.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-electric">
                      {record.spread} {record.quoteUnit}
                    </p>
                    <p className="text-xs text-slate-500">{record.status}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-danger">Today's high-impact risk</p>
          <h2 className="mt-2 text-2xl font-black text-white">News countdown checklist</h2>
          <div className="mt-5 space-y-3">
            {highImpactEvents.map((item) => (
              <div key={item.event} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">{item.event}</p>
                <p className="mt-1 text-sm text-electric">{item.countdown}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.risk}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-warning">Prop firm restrictions</p>
          <h2 className="mt-2 text-2xl font-black text-white">Gold rules to check before entry</h2>
          <div className="mt-5 space-y-3">
            {restrictedFirms.map(({ firm, trust }) => (
              <div key={firm.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{firm.name}</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{trust.confidence}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Check news-trading, max drawdown and commodity execution rules before opening XAUUSD. Last checked {trust.lastChecked}.
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">AI risk summary</p>
          <h2 className="mt-2 text-2xl font-black text-white">Today’s Gold trading notes</h2>
          <p className="mt-5 leading-8 text-slate-300">
            Gold is treated as a high-volatility instrument in this launch model. If USD news is close, reduce risk or wait for spreads to normalize. Prefer firms with clear commodity rules, stable XAUUSD spread rows and no hidden news-trading traps.
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-black text-white">Journal reminders</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
              {journalReminders.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6">
        <GoldRiskPlanner />
      </div>
    </main>
  );
}
