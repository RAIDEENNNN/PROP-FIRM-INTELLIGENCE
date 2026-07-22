"use client";

import { useMemo, useState } from "react";
import { readinessLabel } from "../lib/trader-dna";

export function TradeReadinessCheck() {
  const [sleep, setSleep] = useState("");
  const [losses, setLosses] = useState("");
  const [news, setNews] = useState("");
  const [plan, setPlan] = useState("");
  const [emotion, setEmotion] = useState("");

  const score = useMemo(() => {
    if (!sleep || !losses || !news || !plan || !emotion) return null;
    let value = 86;
    const sleepHours = Number(sleep) || 0;
    const lossCount = Number(losses) || 0;
    if (sleepHours < 6) value -= 14;
    if (lossCount >= 2) value -= 18;
    if (lossCount >= 3) value -= 12;
    if (news === "high") value -= 10;
    if (plan === "no") value -= 18;
    if (emotion === "tilted") value -= 22;
    if (emotion === "impatient") value -= 12;
    return Math.max(0, Math.min(100, value));
  }, [emotion, losses, news, plan, sleep]);

  const label = score == null ? "Fill inputs" : readinessLabel(score);
  const tone = score == null ? "text-slate-300" : score >= 80 ? "text-success" : score >= 65 ? "text-warning" : "text-danger";
  const ring = score == null ? "border-white/10 bg-white/[0.03]" : score >= 80 ? "border-success/30 bg-success/10" : score >= 65 ? "border-warning/30 bg-warning/10" : "border-danger/30 bg-danger/10";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm uppercase tracking-[0.24em] text-electric">Decision engine</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Are conditions good enough to trade?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">This is not buy/sell advice. It checks whether your conditions are good enough to trade.</p>
        </div>
        <div className={`rounded-3xl border px-5 py-4 text-center ${ring}`}>
          <p className={`text-4xl font-black ${tone}`}>{score ?? "--"}</p>
          <p className={`text-xs uppercase tracking-[0.2em] ${tone}`}>{label}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <label className="text-sm text-slate-400">
          Sleep hours
          <input value={sleep} onChange={(event) => setSleep(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-400">
          Consecutive losses
          <input value={losses} onChange={(event) => setLosses(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-400">
          News risk
          <select value={news} onChange={(event) => setNews(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
            <option value="">Choose</option>
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">
          Written plan?
          <select value={plan} onChange={(event) => setPlan(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
            <option value="">Choose</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">
          Emotion
          <select value={emotion} onChange={(event) => setEmotion(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
            <option value="">Choose</option>
            <option value="calm">Calm</option>
            <option value="impatient">Impatient</option>
            <option value="tilted">Tilted</option>
          </select>
        </label>
      </div>

      <p className="mt-5 rounded-2xl border border-white/10 bg-void/70 p-4 text-sm leading-6 text-slate-300">
        {score == null
          ? "Fill the check before FundedScope gives a readiness score. No score is shown from blank inputs."
          : score >= 80
          ? "Conditions look acceptable. Stay inside your plan and avoid increasing size after wins."
          : score >= 65
            ? "Wait. Conditions are mixed. Let spreads/news settle, reduce size, or demand a cleaner setup."
            : "Do not force trades. Journal, review the plan and wait for better mental/market conditions."}
      </p>
    </div>
  );
}
