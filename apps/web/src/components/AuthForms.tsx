"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  });
  const [traderType, setTraderType] = useState("Prop Trader");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [preferredMarkets, setPreferredMarkets] = useState<string[]>(["Gold", "Forex"]);
  const [riskTolerance, setRiskTolerance] = useState("MEDIUM");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const marketOptions = ["Forex", "Gold", "Crypto", "Indices", "Stocks", "Futures", "Commodities"];

  function toggleMarket(market: string) {
    setPreferredMarkets((current) => (current.includes(market) ? current.filter((item) => item !== market) : [...current, market]));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
          data: {
            full_name: name,
            username,
            country,
            timezone,
            trader_type: traderType,
            experience_level: experienceLevel,
            markets: preferredMarkets,
            risk_tolerance: riskTolerance
          }
        }
      });
      if (error) throw error;

      if (data.session?.access_token) {
        window.localStorage.setItem("fundedscope_access_token", data.session.access_token);
        router.push("/profile");
        return;
      }

      setStatus("Account created. Check your email to verify your address, then sign in.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <label className="text-sm text-slate-400">
        Full name
        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="THE PĦILOSOPHER" required />
      </label>
      <label className="text-sm text-slate-400">
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="alliygold" required />
      </label>
      <label className="text-sm text-slate-400">
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="you@example.com" type="email" required />
      </label>
      <label className="text-sm text-slate-400">
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Minimum 10 characters" type="password" required minLength={10} />
      </label>
      <label className="text-sm text-slate-400">
        Country
        <input value={country} onChange={(event) => setCountry(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Nigeria" />
      </label>
      <label className="text-sm text-slate-400">
        Timezone
        <input value={timezone} onChange={(event) => setTimezone(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Africa/Lagos" />
      </label>
      <label className="text-sm text-slate-400">
        Trader type
        <select value={traderType} onChange={(event) => setTraderType(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          <option>Prop Trader</option>
          <option>Live Trader</option>
          <option>Both</option>
        </select>
      </label>
      <label className="text-sm text-slate-400">
        Experience
        <select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Professional</option>
        </select>
      </label>
      <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-bold text-white">Markets you trade</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {marketOptions.map((market) => (
            <label key={market} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-void/70 p-3 text-sm text-slate-300">
              <input checked={preferredMarkets.includes(market)} onChange={() => toggleMarket(market)} type="checkbox" />
              {market}
            </label>
          ))}
        </div>
      </div>
      <select value={riskTolerance} onChange={(event) => setRiskTolerance(event.target.value)} className="sm:col-span-2 rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
        <option value="LOW">Low risk tolerance</option>
        <option value="MEDIUM">Medium risk tolerance</option>
        <option value="HIGH">High risk tolerance</option>
        <option value="EXTREME">Extreme risk tolerance</option>
      </select>
      <button disabled={loading} className="sm:col-span-2 mt-3 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void disabled:opacity-60">
        {loading ? "Creating My Trading DNA..." : "Create My Trading DNA"}
      </button>
      {status ? <p className="sm:col-span-2 rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{status}</p> : null}
    </form>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session?.access_token) window.localStorage.setItem("fundedscope_access_token", data.session.access_token);
      router.push("/dashboard");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Email" type="email" required />
      <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Password" type="password" required />
      <button disabled={loading} className="w-full rounded-2xl bg-white px-4 py-3 font-bold text-void disabled:opacity-60">
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <button
        type="button"
        onClick={async () => {
          setStatus("");
          if (!email) {
            setStatus("Enter your email first, then request a password reset.");
            return;
          }
          try {
            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/settings` });
            if (error) throw error;
            setStatus("Password reset email sent if the address exists.");
          } catch (error) {
            setStatus(error instanceof Error ? error.message : "Unable to send password reset email");
          }
        }}
        className="w-full rounded-2xl border border-white/10 px-4 py-3 font-bold text-white"
      >
        Send password reset email
      </button>
      {status ? <p className="rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{status}</p> : null}
    </form>
  );
}
