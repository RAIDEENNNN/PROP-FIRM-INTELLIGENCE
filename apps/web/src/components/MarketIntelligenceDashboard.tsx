"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  currencyHeat,
  getMarketReadiness,
  marketEvents,
  newsReplay,
  pairImpacts,
  propFirmWarnings,
  traderFilters,
  tradingSessions,
  volatilityMeters,
  type MarketEvent
} from "../lib/market-intelligence";
import { GlassCard } from "./GlassCard";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

const impactClass = {
  High: "bg-danger/15 text-danger border-danger/25",
  Medium: "bg-warning/15 text-warning border-warning/25",
  Low: "bg-success/15 text-success border-success/25"
};

export function MarketIntelligenceDashboard() {
  const [filter, setFilter] = useState("Gold Trader");
  const [selectedPair, setSelectedPair] = useState("Gold");
  const [selectedEventId, setSelectedEventId] = useState(marketEvents[0]!.id);
  const [dnaCompletion, setDnaCompletion] = useState<number | null>(null);
  const [sessionsNow, setSessionsNow] = useState(() => new Date());

  const events = useMemo(
    () => (filter === "All" ? marketEvents : marketEvents.filter((event) => event.traderTags.includes(filter))),
    [filter]
  );
  const selectedEvent = marketEvents.find((event) => event.id === selectedEventId) ?? marketEvents[0]!;
  const readiness = getMarketReadiness(filter);
  const canShowReadiness = typeof dnaCompletion === "number" && dnaCompletion >= 35;
  const pair = pairImpacts.find((item) => item.pair === selectedPair) ?? pairImpacts[0]!;
  const liveSessions = useMemo(() => getLiveSessions(sessionsNow), [sessionsNow]);

  useEffect(() => {
    const interval = window.setInterval(() => setSessionsNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfileCompletion() {
      if (!isSupabaseBrowserConfigured()) {
        if (active) setDnaCompletion(null);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        if (active) setDnaCompletion(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name,country,trader_type,experience_level,markets,risk_tolerance,preferences")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      const checks = [
        profile?.full_name,
        profile?.country,
        profile?.trader_type,
        profile?.experience_level,
        Array.isArray(profile?.markets) && profile.markets.length,
        profile?.risk_tolerance,
        profile?.preferences && Object.keys(profile.preferences as Record<string, unknown>).length
      ];
      setDnaCompletion(Math.round((checks.filter(Boolean).length / checks.length) * 100));
    }

    void loadProfileCompletion();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-8 grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[0.65fr_0.35fr]">
        <GlassCard className="overflow-hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-electric">Market Intelligence Preview</p>
              <h2 className="mt-2 text-3xl font-black text-white">Risk context preview for trading decisions.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Curated market context highlights the assets, sessions and rule conditions traders should verify before opening or holding positions. Live news and calendar feeds appear here once provider APIs are configured.
              </p>
            </div>
            <div className="rounded-3xl border border-electric/25 bg-electric/10 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-electric">Trading Readiness</p>
              <p className="mt-2 text-4xl font-black text-white">{canShowReadiness ? `${readiness.score}%` : "Set DNA"}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {canShowReadiness ? `${dnaCompletion}% profile basis` : "Complete your Trading DNA before FundedScope scores readiness."}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(canShowReadiness ? readiness.reasons : ["No fake readiness score before profile setup", "Add markets, style, risk and preferences", "Session timing updates from UTC for every timezone", "Economic events stay educational until provider feeds are connected"]).map((reason) => (
              <p key={reason} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-slate-200">
                {reason}
              </p>
            ))}
          </div>
          {!canShowReadiness ? (
            <Link href="/profile#trading-dna-form" className="mt-5 inline-flex rounded-2xl border border-electric/30 px-5 py-3 text-sm font-black text-electric transition hover:bg-electric/10">
              Complete Trading DNA
            </Link>
          ) : null}
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-violet">My News filter</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {traderFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
                className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                  filter === item ? "border-electric bg-electric text-void" : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-electric/40"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-slate-400">Filtered events</p>
            <p className="mt-1 text-3xl font-black text-white">{events.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Preview of a profile-aware feed using strategy, asset and prop-firm context. Live provider headlines require configured API keys.</p>
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
        <GlassCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <p className="text-sm uppercase tracking-[0.24em] text-electric">Economic calendar</p>
            <h2 className="mt-2 text-2xl font-black text-white">Curated events with FundedScope Insight™</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">Educational, not financial advice</span>
          </div>
          <div className="mt-5 grid gap-3">
            {events.map((event) => (
              <EventRow key={event.id} event={event} selected={event.id === selectedEvent.id} onSelect={() => setSelectedEventId(event.id)} />
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-danger">Before news</p>
          <h2 className="mt-2 text-2xl font-black text-white">{selectedEvent.event}</h2>
          <div className="mt-5 rounded-3xl border border-danger/25 bg-danger/10 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-danger">Source status</p>
            <p className="mt-2 text-2xl font-black text-white">Live calendar pending</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">Connect a verified calendar/news provider before displaying real-time countdowns.</p>
          </div>
          <p className="mt-5 text-sm font-black text-white">Why it matters</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{selectedEvent.whyItMatters}</p>
          <div className="mt-5 grid gap-3">
            {selectedEvent.averageMove.map((item) => (
              <div key={item.asset} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="font-bold text-white">{item.asset}</span>
                <span className={`font-black ${toneText(item.tone)}`}>{item.move}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-warning">Volatility meter</p>
          <div className="mt-5 grid gap-4">
            {volatilityMeters.map((item) => (
              <div key={item.asset}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{item.asset}</p>
                  <p className="text-sm text-warning">{"★".repeat(item.stars)}{"☆".repeat(5 - item.stars)}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-success via-warning to-danger" style={{ width: `${item.score}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.reason}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-danger">News heat map</p>
          <div className="mt-5 grid gap-3">
            {currencyHeat.map((item) => (
              <div key={item.currency} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-black text-white">{item.currency}</p>
                  <p aria-label={`${item.heat} heat`} className="text-lg">{"🔥".repeat(item.heat)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.summary}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">Trading sessions</p>
          <div className="mt-5 grid gap-3">
            {liveSessions.map((session) => (
              <div key={session.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{session.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${session.status === "Open" ? "bg-success/15 text-success" : session.status === "Opens soon" ? "bg-warning/15 text-warning" : "bg-white/10 text-slate-300"}`}>
                    {session.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{session.focus}</p>
                <p className="mt-2 text-[11px] font-bold text-slate-500">{session.localWindow}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-violet">Pair impact</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {pairImpacts.map((item) => (
              <button
                key={item.pair}
                type="button"
                onClick={() => setSelectedPair(item.pair)}
                aria-pressed={selectedPair === item.pair}
                className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                  selectedPair === item.pair ? "border-violet bg-violet text-white" : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-violet/50"
                }`}
              >
                {item.pair}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Overall</p>
            <p className="mt-2 text-2xl font-black text-white">{pair.overall}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {pair.events.map((event) => (
                <span key={event} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {event}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{pair.note}</p>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-warning">Prop firm warning</p>
          <h2 className="mt-2 text-2xl font-black text-white">News rules are part of market risk.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {propFirmWarnings.map((item) => (
              <div key={item.firm} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{item.firm}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${toneBg(item.tone)}`}>{item.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.rule}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">AI expectation map</p>
          <h2 className="mt-2 text-2xl font-black text-white">What should I expect?</h2>
          <div className="mt-5 grid gap-3">
            <Scenario label="Higher than forecast" value={selectedEvent.scenario.higher} />
            <Scenario label="Lower than forecast" value={selectedEvent.scenario.lower} />
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">This is educational information, not financial advice. Always verify live prices and prop-firm rules.</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-violet">News replay</p>
          <h2 className="mt-2 text-2xl font-black text-white">{newsReplay.event}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Mini label="Expected" value={newsReplay.expected} />
            <Mini label="Actual" value={newsReplay.actual} />
          </div>
          <div className="mt-4 grid gap-3">
            {newsReplay.moves.map(([asset, move]) => (
              <div key={asset} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-bold text-white">{asset}</p>
                <p className="font-black text-electric">{move}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function getLiveSessions(now: Date) {
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;

  return tradingSessions.map((session) => {
    const open = isWithinSession(utcHour, session.openUtc, session.closeUtc);
    const hoursUntilOpen = getHoursUntil(utcHour, session.openUtc);
    const status = open ? "Open" : hoursUntilOpen <= 1.5 ? "Opens soon" : "Closed";
    return {
      ...session,
      status,
      localWindow: `${formatLocalHour(session.openUtc)} - ${formatLocalHour(session.closeUtc)} local`
    };
  });
}

function isWithinSession(hour: number, openUtc: number, closeUtc: number) {
  if (openUtc < closeUtc) return hour >= openUtc && hour < closeUtc;
  return hour >= openUtc || hour < closeUtc;
}

function getHoursUntil(hour: number, targetUtc: number) {
  return (targetUtc - hour + 24) % 24;
}

function formatLocalHour(utcHour: number) {
  const date = new Date();
  date.setUTCHours(utcHour, 0, 0, 0);
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date);
}

function EventRow({ event, selected, onSelect }: { event: MarketEvent; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`grid gap-3 rounded-2xl border p-4 text-left transition hover:border-electric/40 sm:grid-cols-[72px_70px_1fr_auto] sm:items-center ${
        selected ? "border-electric/40 bg-electric/10" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <span className="font-mono text-sm font-black text-white">{event.timeUtc}</span>
      <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-black text-electric">{event.currency}</span>
      <span>
        <span className="block font-black text-white">{event.event}</span>
        <span className="mt-1 block text-xs text-slate-400">Forecast {event.forecast} · Previous {event.previous} · Actual {event.actual}</span>
      </span>
      <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${impactClass[event.impact]}`}>{event.impact}</span>
    </button>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Scenario({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-black text-white">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function toneText(tone: "danger" | "warning" | "success" | "electric") {
  if (tone === "danger") return "text-danger";
  if (tone === "warning") return "text-warning";
  if (tone === "success") return "text-success";
  return "text-electric";
}

function toneBg(tone: string) {
  if (tone === "danger") return "bg-danger/15 text-danger";
  if (tone === "warning") return "bg-warning/15 text-warning";
  return "bg-electric/15 text-electric";
}
