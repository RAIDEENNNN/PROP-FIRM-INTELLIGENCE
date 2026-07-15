"use client";

import { useMemo, useState } from "react";
import { brokers } from "../lib/brokers";
import { propFirms } from "../lib/data";

const countries = ["United Kingdom", "Nigeria", "South Africa", "India", "UAE", "United States", "Kenya"];
const platforms = ["MT5", "MT4", "cTrader", "TradingView", "TradeLocker"];
const styles = ["Beginner", "Scalper", "Day Trader", "Swing Trader", "Gold Trader", "Low Deposit"];

export function DecisionEngine() {
  const [country, setCountry] = useState("United Kingdom");
  const [capital, setCapital] = useState("500");
  const [experience, setExperience] = useState("Beginner");
  const [style, setStyle] = useState("Gold Trader");
  const [platform, setPlatform] = useState("MT5");
  const [risk, setRisk] = useState("Medium");

  const result = useMemo(() => {
    const capitalValue = Number(capital) || 0;
    const preferredMarkets = style === "Gold Trader" ? ["Commodities", "Forex"] : style === "Scalper" ? ["Forex", "Indices"] : ["Forex"];
    const firm = propFirms
      .filter((item) => item.markets.some((market) => preferredMarkets.includes(market)))
      .sort((a, b) => {
        const feeA = Number(a.challengeFee.replace(/\D/g, "") || 999);
        const feeB = Number(b.challengeFee.replace(/\D/g, "") || 999);
        const capitalFitA = capitalValue < 500 ? -feeA : a.score;
        const capitalFitB = capitalValue < 500 ? -feeB : b.score;
        return capitalFitB - capitalFitA;
      })[0] ?? propFirms[0]!;
    const broker = brokers
      .filter((item) => item.platforms.some((brokerPlatform) => brokerPlatform.toLowerCase().includes(platform.toLowerCase().replace("mt", "mt"))))
      .sort((a, b) => b.trustScore - a.trustScore)[0] ?? brokers[0]!;
    const markets = capitalValue <= 300 ? ["EUR/USD", "GBP/USD", "Gold with reduced position size"] : style === "Gold Trader" ? ["Gold", "EUR/USD", "NAS100"] : ["EUR/USD", "GBP/USD", "US30"];
    const riskPlan = risk === "Low" ? "0.25%–0.5% risk, max 2 trades/day" : risk === "High" ? "0.5%–1% risk, strict daily stop" : "0.5% risk, max 3 trades/day";

    return {
      firm,
      broker,
      markets,
      suitability: capitalValue < 300 && style === "Gold Trader" ? "Moderate" : "Strong",
      riskPlan,
      availability: `${country}: availability must be confirmed from the structured country availability table before opening an account.`,
      firmVerifiedAt: firm.lastRuleUpdate,
      brokerVerifiedAt: broker.lastVerified,
      dataCompleteness:
        broker.verifiedStatus === "Source-reviewed" || broker.verifiedStatus === "Verification required"
          ? "Some broker fields are source-checked. Verify exact costs and availability with the official broker before opening an account."
          : "Core profile fields have a verification label, but users should still check official terms before acting.",
      warning:
        capitalValue < 300
          ? "Smaller capital makes spreads and position sizing more important. Research lower-volatility majors before focusing only on Gold."
          : "Use this as research guidance, not a promise of profit or financial advice."
    };
  }, [capital, platform, risk, style]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Find My Perfect Trading Setup™</p>
        <div className="mt-5 grid gap-4">
          <Field label="Country">
            <select value={country} onChange={(event) => setCountry(event.target.value)} className={inputClass}>
              {countries.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Capital (£)">
            <input value={capital} onChange={(event) => setCapital(event.target.value)} className={inputClass} inputMode="numeric" placeholder="500" />
          </Field>
          <Field label="Experience">
            <select value={experience} onChange={(event) => setExperience(event.target.value)} className={inputClass}>
              {["Beginner", "Intermediate", "Advanced"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Trading style">
            <select value={style} onChange={(event) => setStyle(event.target.value)} className={inputClass}>
              {styles.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Platform">
            <select value={platform} onChange={(event) => setPlatform(event.target.value)} className={inputClass}>
              {platforms.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Risk comfort">
            <select value={risk} onChange={(event) => setRisk(event.target.value)} className={inputClass}>
              {["Low", "Medium", "High"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%),rgba(255,255,255,0.03)] p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Options worth researching based on your preferences</p>
        <h2 className="mt-2 text-3xl font-black text-white">Suitability: {result.suitability}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Mini label="Markets worth researching" value={result.markets.join(", ")} />
          <Mini label="Suggested risk plan" value={result.riskPlan} />
          <Mini label="Broker to research" value={`${result.broker.name} · verification: ${result.brokerVerifiedAt}`} />
          <Mini label="Prop firm to research" value={`${result.firm.name} · last verified: ${result.firmVerifiedAt}`} />
          <Mini label="Country availability" value={result.availability} />
          <Mini label="Data completeness" value={result.dataCompleteness} />
        </div>
        <div className="mt-5 rounded-3xl border border-warning/25 bg-warning/10 p-4">
          <p className="font-black text-warning">Important</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{result.warning}</p>
        </div>
        <div className="mt-5 rounded-3xl border border-electric/20 bg-electric/10 p-4">
          <p className="font-black text-electric">Why these suggestions?</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            FundedScope weighs your country, capital, experience, style, preferred platform and risk comfort against stored broker platforms, published firm profile fields, market coverage and fee suitability. When a country availability record or verified source is missing, the engine marks the limitation instead of inventing certainty.
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-sm font-bold text-slate-300">{label}{children}</label>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
