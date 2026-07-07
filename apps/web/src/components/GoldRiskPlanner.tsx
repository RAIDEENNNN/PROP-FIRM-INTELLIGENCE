"use client";

import { useMemo, useState } from "react";

export function GoldRiskPlanner() {
  const [balance, setBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("0.5");
  const [dailyDrawdown, setDailyDrawdown] = useState("5");

  const result = useMemo(() => {
    const account = Number(balance) || 0;
    const risk = Number(riskPercent) || 0;
    const dd = Number(dailyDrawdown) || 0;
    const riskAmount = account * (risk / 100);
    const dailyLimit = account * (dd / 100);
    const maxTrades = riskAmount > 0 ? Math.floor(dailyLimit / riskAmount) : 0;

    return {
      riskAmount,
      dailyLimit,
      maxTrades
    };
  }, [balance, dailyDrawdown, riskPercent]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm uppercase tracking-[0.24em] text-electric">Your Gold risk limit</p>
      <h2 className="mt-2 text-2xl font-black text-white">Account-aware XAUUSD risk</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-slate-400">
          Account balance
          <input value={balance} onChange={(event) => setBalance(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-400">
          Risk per trade %
          <input value={riskPercent} onChange={(event) => setRiskPercent(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-400">
          Daily drawdown %
          <input value={dailyDrawdown} onChange={(event) => setDailyDrawdown(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" />
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-slate-500">Risk per trade</p>
          <p className="mt-1 text-2xl font-black text-white">${result.riskAmount.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-slate-500">Daily loss limit</p>
          <p className="mt-1 text-2xl font-black text-white">${result.dailyLimit.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-slate-500">Max full-risk losses</p>
          <p className="mt-1 text-2xl font-black text-warning">{result.maxTrades}</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Educational calculator only. Always follow the exact prop firm drawdown rule for your account.</p>
    </div>
  );
}
