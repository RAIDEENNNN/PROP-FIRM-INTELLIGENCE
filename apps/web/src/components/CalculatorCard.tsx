"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "./GlassCard";

type CalculatorCardProps = {
  title: string;
  copy: string;
};

function money(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function numberValue(value: string) {
  return Number(value.replace(/[^0-9.-]/g, ""));
}

export function CalculatorCard({ title, copy }: CalculatorCardProps) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const helper = useMemo(() => {
    if (/lot|position|risk|drawdown|profit|compound|margin/i.test(title)) {
      return "Enter account size first, then risk %, target %, stop-loss pips or margin %.";
    }

    if (/pip/i.test(title)) {
      return "Enter lot size first, then pip movement.";
    }

    return "Enter your preferred market/session and risk note.";
  }, [title]);

  function calculate() {
    const a = numberValue(primary);
    const b = numberValue(secondary);

    if (!primary.trim() || !secondary.trim()) {
      setResult("Add both values first so FundedScope can calculate something useful.");
      return;
    }

    if (/calendar|session/i.test(title)) {
      setResult(`Saved note: ${primary.trim()} · ${secondary.trim()}. Check News Radar before trading.`);
      return;
    }

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setResult("Use numeric values for this calculator, e.g. 1000 and 0.5.");
      return;
    }

    if (/pip/i.test(title)) {
      setResult(`Estimated movement value: ${money(a * b * 10)}. Confirm exact contract size with your broker.`);
      return;
    }

    if (/compound/i.test(title)) {
      setResult(`Estimated next-step balance: ${money(a * (1 + b / 100))}.`);
      return;
    }

    if (/margin/i.test(title)) {
      setResult(`Estimated margin/risk allocation: ${money(a * (b / 100))}. Confirm leverage and contract size before execution.`);
      return;
    }

    setResult(`Estimated amount: ${money(a * (b / 100))}. Use this as planning guidance, not execution advice.`);
  }

  return (
    <GlassCard>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{copy}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-500">{helper}</p>
      <div className="mt-5 space-y-3">
        <input
          value={primary}
          onChange={(event) => setPrimary(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white outline-none transition focus:border-electric/60"
          placeholder="Account balance / symbol / value"
          inputMode="decimal"
        />
        <input
          value={secondary}
          onChange={(event) => setSecondary(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white outline-none transition focus:border-electric/60"
          placeholder="Risk %, stop loss, target or note"
          inputMode="decimal"
        />
        <button
          type="button"
          onClick={calculate}
          className="min-h-12 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Calculate
        </button>
        {result ? <p className="rounded-2xl border border-electric/20 bg-electric/10 p-3 text-sm leading-6 text-electric">{result}</p> : null}
      </div>
    </GlassCard>
  );
}
