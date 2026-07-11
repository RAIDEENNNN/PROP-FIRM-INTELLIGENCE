"use client";

import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const marketOptions = ["Forex", "Gold", "Crypto", "Indices", "Stocks", "Futures", "Commodities"];
const brokerOptions = ["Exness", "IC Markets", "Pepperstone", "Vantage", "JustMarkets", "Other"];
const firmOptions = ["FTMO", "FundingPips", "The5ers", "E8 Markets", "FundedNext", "None"];
const goalOptions = ["Pass Prop Challenge", "Consistency", "Full-time Income", "Grow Capital", "Learn", "Build Wealth"];
const sessionOptions = ["London", "New York", "Asian", "Overlap"];
const assetOptions = ["Gold", "BTC", "EURUSD", "GBPUSD", "NAS100", "US30", "XAGUSD", "ETHUSD"];
const weaknessOptions = ["Fear", "Greed", "Overtrading", "Revenge Trading", "FOMO", "Holding losers", "Closing winners too early"];

type ApiResponse = {
  ok: boolean;
  code?: string;
  error?: string;
  details?: string;
};

type Personality = {
  patience: number;
  emotionalControl: number;
  planDiscipline: number;
  confidence: number;
};

const personalityQuestions: Array<[keyof Personality, string]> = [
  ["patience", "How patient are you?"],
  ["emotionalControl", "How emotional are you?"],
  ["planDiscipline", "Do you follow plans?"],
  ["confidence", "How confident are you?"]
];

export function ProfileDetailsForm() {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [traderType, setTraderType] = useState("Both");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [preferredMarkets, setPreferredMarkets] = useState<string[]>(["Gold", "Forex"]);
  const [brokers, setBrokers] = useState<string[]>(["Exness"]);
  const [propFirms, setPropFirms] = useState<string[]>(["FTMO"]);
  const [liveAccountSize, setLiveAccountSize] = useState("");
  const [propAccountSize, setPropAccountSize] = useState("");
  const [challengeSize, setChallengeSize] = useState("");
  const [tradingStyle, setTradingStyle] = useState("Day Trader");
  const [strategy, setStrategy] = useState("Gold London session");
  const [riskTolerance, setRiskTolerance] = useState("MEDIUM");
  const [goals, setGoals] = useState<string[]>(["Pass Prop Challenge", "Consistency"]);
  const [targetMonthlyPercent, setTargetMonthlyPercent] = useState("");
  const [targetMonthlyProfit, setTargetMonthlyProfit] = useState("");
  const [targetWinRate, setTargetWinRate] = useState("");
  const [maxDailyDrawdown, setMaxDailyDrawdown] = useState("");
  const [maxTotalDrawdown, setMaxTotalDrawdown] = useState("");
  const [sessions, setSessions] = useState<string[]>(["London", "New York"]);
  const [favoriteAssets, setFavoriteAssets] = useState<string[]>(["Gold", "NAS100"]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [propChallenges, setPropChallenges] = useState("");
  const [fundedBefore, setFundedBefore] = useState(false);
  const [largestAccount, setLargestAccount] = useState("");
  const [psychologyWeaknesses, setPsychologyWeaknesses] = useState<string[]>(["FOMO"]);
  const [personality, setPersonality] = useState<Personality>({ patience: 6, emotionalControl: 5, planDiscipline: 6, confidence: 6 });
  const [notifications, setNotifications] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(true);
  const [spreadAlerts, setSpreadAlerts] = useState(true);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTimezone("Africa/Lagos");
    }
  }, []);

  const dnaScore = useMemo(() => {
    const sections = [
      username,
      country,
      traderType,
      experienceLevel,
      preferredMarkets.length,
      brokers.length,
      propFirms.length,
      tradingStyle,
      strategy,
      goals.length,
      sessions.length,
      favoriteAssets.length,
      psychologyWeaknesses.length,
      Object.values(personality).reduce((sum, value) => sum + value, 0)
    ];
    const filled = sections.filter(Boolean).length;
    return Math.min(100, Math.round((filled / sections.length) * 100));
  }, [brokers.length, country, experienceLevel, favoriteAssets.length, goals.length, personality, preferredMarkets.length, propFirms.length, psychologyWeaknesses.length, sessions.length, strategy, traderType, tradingStyle, username]);

  function toggle(setter: Dispatch<SetStateAction<string[]>>, value: string) {
    setter((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  function numberOrNull(value: string) {
    const number = Number(value);
    return Number.isFinite(number) && value.trim() !== "" ? number : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token ?? window.localStorage.getItem("fundedscope_access_token");
    if (!token) {
      setStatus("Sign in first so FundedScope can save My Trading DNA to the database.");
      return;
    }

    setLoading(true);
    setStatus("Saving My Trading DNA...");
    try {
      const response = await fetch("/api/trader-profile", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          country,
          timezone,
          profilePictureUrl: profilePictureUrl || null,
          traderType,
          experienceLevel,
          preferredMarkets,
          brokers,
          propFirms,
          liveAccountSize: numberOrNull(liveAccountSize),
          propAccountSize: numberOrNull(propAccountSize),
          challengeSize: numberOrNull(challengeSize),
          tradingStyle,
          strategy,
          goals,
          targetMonthlyPercent: numberOrNull(targetMonthlyPercent),
          targetMonthlyProfit: numberOrNull(targetMonthlyProfit),
          targetWinRate: numberOrNull(targetWinRate),
          maxDailyDrawdown: numberOrNull(maxDailyDrawdown),
          maxTotalDrawdown: numberOrNull(maxTotalDrawdown),
          preferredAccountSize: numberOrNull(propAccountSize || liveAccountSize),
          sessions,
          favoriteAssets,
          yearsExperience: numberOrNull(yearsExperience),
          propChallenges: numberOrNull(propChallenges),
          fundedBefore,
          largestAccount: numberOrNull(largestAccount),
          psychologyWeaknesses,
          personality,
          preferences: {
            darkMode: true,
            notifications,
            newsAlerts,
            spreadAlerts,
            pairs: favoriteAssets
          },
          connectedAccounts: {
            metatrader: false,
            tradingView: false,
            telegram: telegramConnected,
            discord: discordConnected
          },
          performance: {
            currentWinRate: numberOrNull(targetWinRate),
            currentProfit: 0,
            currentDrawdown: numberOrNull(maxTotalDrawdown) ?? 0
          },
          riskTolerance,
          payoutPriority: goals.includes("Full-time Income"),
          swingTrading: tradingStyle === "Swing Trader" || tradingStyle === "Position Trader",
          newsTrading: newsAlerts
        })
      });
      const payload = (await response.json()) as ApiResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.code === "BACKEND_API_NOT_CONFIGURED"
            ? "Profile saving is temporarily unavailable while FundedScope connects the production API. Please try again shortly."
            : payload.error ?? payload.details ?? "My Trading DNA could not be saved"
        );
      }
      setStatus("Saved. FundedScope can now personalize dashboards, AI summaries, alerts and Trade Readiness from your Trading DNA.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "My Trading DNA could not be saved");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="rounded-[2rem] border border-electric/20 bg-electric/10 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-electric">My Trading DNA™</p>
            <h2 className="mt-2 text-2xl font-black text-white">Your trading identity grows with you.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">The more complete this is, the more personal FundedScope becomes.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-void/70 p-4 text-center">
            <p className="text-4xl font-black text-electric">{dnaScore}%</p>
            <p className="text-xs text-slate-400">DNA complete</p>
          </div>
        </div>
      </div>

      <Section title="Personal information" subtitle="Who owns this Trading DNA?">
        <Field label="Username"><input value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} placeholder="alliygold" /></Field>
        <Field label="Country"><input value={country} onChange={(event) => setCountry(event.target.value)} className={inputClass} placeholder="Nigeria" /></Field>
        <Field label="Timezone"><input value={timezone} onChange={(event) => setTimezone(event.target.value)} className={inputClass} placeholder="Africa/Lagos" /></Field>
        <Field label="Profile picture URL"><input value={profilePictureUrl} onChange={(event) => setProfilePictureUrl(event.target.value)} className={inputClass} placeholder="https://..." /></Field>
      </Section>

      <Section title="Trader information" subtitle="FundedScope uses this to personalize firms, brokers and dashboards.">
        <Field label="Trader type">
          <select value={traderType} onChange={(event) => setTraderType(event.target.value)} className={inputClass}>
            <option>Prop Trader</option>
            <option>Live Trader</option>
            <option>Both</option>
          </select>
        </Field>
        <Field label="Experience">
          <select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className={inputClass}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Professional</option>
          </select>
        </Field>
        <Field label="Trading style">
          <select value={tradingStyle} onChange={(event) => setTradingStyle(event.target.value)} className={inputClass}>
            <option>Scalper</option>
            <option>Day Trader</option>
            <option>Swing Trader</option>
            <option>Position Trader</option>
          </select>
        </Field>
        <Field label="Main strategy"><input value={strategy} onChange={(event) => setStrategy(event.target.value)} className={inputClass} placeholder="SMC, ICT, Price Action..." /></Field>
      </Section>

      <ChoiceSection title="Markets" options={marketOptions} values={preferredMarkets} onToggle={(value) => toggle(setPreferredMarkets, value)} />
      <ChoiceSection title="Brokers" options={brokerOptions} values={brokers} onToggle={(value) => toggle(setBrokers, value)} />
      <ChoiceSection title="Prop firms" options={firmOptions} values={propFirms} onToggle={(value) => toggle(setPropFirms, value)} />

      <Section title="Account information" subtitle="Used for risk limits, payout analytics and Trade Readiness.">
        <Field label="Live account size"><input value={liveAccountSize} onChange={(event) => setLiveAccountSize(event.target.value)} className={inputClass} inputMode="numeric" placeholder="10000" /></Field>
        <Field label="Prop account size"><input value={propAccountSize} onChange={(event) => setPropAccountSize(event.target.value)} className={inputClass} inputMode="numeric" placeholder="100000" /></Field>
        <Field label="Challenge size"><input value={challengeSize} onChange={(event) => setChallengeSize(event.target.value)} className={inputClass} inputMode="numeric" placeholder="50000" /></Field>
        <Field label="Largest account"><input value={largestAccount} onChange={(event) => setLargestAccount(event.target.value)} className={inputClass} inputMode="numeric" placeholder="200000" /></Field>
      </Section>

      <ChoiceSection title="Goals" options={goalOptions} values={goals} onToggle={(value) => toggle(setGoals, value)} />

      <Section title="Personal goals" subtitle="The AI coach needs targets, not vibes.">
        <Field label="Target monthly %"><input value={targetMonthlyPercent} onChange={(event) => setTargetMonthlyPercent(event.target.value)} className={inputClass} inputMode="decimal" placeholder="8" /></Field>
        <Field label="Target monthly profit"><input value={targetMonthlyProfit} onChange={(event) => setTargetMonthlyProfit(event.target.value)} className={inputClass} inputMode="numeric" placeholder="2000" /></Field>
        <Field label="Target win rate"><input value={targetWinRate} onChange={(event) => setTargetWinRate(event.target.value)} className={inputClass} inputMode="decimal" placeholder="55" /></Field>
        <Field label="Maximum drawdown"><input value={maxTotalDrawdown} onChange={(event) => setMaxTotalDrawdown(event.target.value)} className={inputClass} inputMode="decimal" placeholder="6" /></Field>
        <Field label="Max daily drawdown"><input value={maxDailyDrawdown} onChange={(event) => setMaxDailyDrawdown(event.target.value)} className={inputClass} inputMode="decimal" placeholder="2" /></Field>
        <Field label="Risk per trade">
          <select value={riskTolerance} onChange={(event) => setRiskTolerance(event.target.value)} className={inputClass}>
            <option value="LOW">0.25% / Low</option>
            <option value="MEDIUM">0.5% / Medium</option>
            <option value="HIGH">1% / High</option>
            <option value="EXTREME">2%+ / Extreme</option>
          </select>
        </Field>
      </Section>

      <ChoiceSection title="Trading sessions" options={sessionOptions} values={sessions} onToggle={(value) => toggle(setSessions, value)} />
      <ChoiceSection title="Favourite assets" options={assetOptions} values={favoriteAssets} onToggle={(value) => toggle(setFavoriteAssets, value)} />

      <Section title="Experience history" subtitle="This separates a beginner dashboard from a serious funded trader dashboard.">
        <Field label="Years trading"><input value={yearsExperience} onChange={(event) => setYearsExperience(event.target.value)} className={inputClass} inputMode="decimal" placeholder="2" /></Field>
        <Field label="Prop challenges taken"><input value={propChallenges} onChange={(event) => setPropChallenges(event.target.value)} className={inputClass} inputMode="numeric" placeholder="5" /></Field>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-void/70 p-4 text-sm font-bold text-white sm:col-span-2">
          <input checked={fundedBefore} onChange={(event) => setFundedBefore(event.target.checked)} type="checkbox" />
          I have been funded before
        </label>
      </Section>

      <ChoiceSection title="Psychology weaknesses" options={weaknessOptions} values={psychologyWeaknesses} onToggle={(value) => toggle(setPsychologyWeaknesses, value)} />

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-electric">Personality test</p>
        <h3 className="mt-2 text-xl font-black text-white">Trader DNA behavior profile</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {personalityQuestions.map(([key, label]) => (
            <label key={key} className="rounded-2xl border border-white/10 bg-void/70 p-4 text-sm text-slate-300">
              <span className="flex items-center justify-between gap-3">
                {label}
                <strong className="text-electric">{personality[key as keyof Personality]}/10</strong>
              </span>
              <input
                className="mt-4 w-full"
                type="range"
                min={1}
                max={10}
                value={personality[key as keyof Personality]}
                onChange={(event) => setPersonality((current) => ({ ...current, [key]: Number(event.target.value) }))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-electric">Preferences and future connections</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Notifications", notifications, setNotifications],
            ["News alerts", newsAlerts, setNewsAlerts],
            ["Spread alerts", spreadAlerts, setSpreadAlerts],
            ["Telegram connected", telegramConnected, setTelegramConnected],
            ["Discord connected", discordConnected, setDiscordConnected]
          ].map(([label, value, setter]) => (
            <label key={label as string} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-void/70 p-4 text-sm font-bold text-white">
              <input checked={value as boolean} onChange={(event) => (setter as Dispatch<SetStateAction<boolean>>)(event.target.checked)} type="checkbox" />
              {label as string}
            </label>
          ))}
        </div>
      </section>

      <button disabled={loading} className="sticky bottom-4 z-20 w-full rounded-2xl bg-electric px-5 py-4 text-base font-black text-void shadow-glow disabled:opacity-60 sm:static">
        {loading ? "Saving..." : "Save My Trading DNA"}
      </button>
      {status ? <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">{status}</p> : null}
    </form>
  );
}

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white outline-none transition focus:border-electric";

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-electric">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-sm text-slate-400">
      {label}
      {children}
    </label>
  );
}

function ChoiceSection({ title, options, values, onToggle }: { title: string; options: string[]; values: string[]; onToggle: (value: string) => void }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-electric">{title}</p>
          <p className="mt-2 text-sm text-slate-400">{values.length} selected</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((option) => {
          const active = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-2xl border px-3 py-3 text-left text-sm font-bold transition ${
                active ? "border-electric bg-electric/15 text-electric" : "border-white/10 bg-void/70 text-slate-300"
              }`}
            >
              {active ? "✓ " : ""}
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
