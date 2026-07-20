"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { friendlyAuthMessage } from "../lib/auth-errors";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const maxAvatarPreviewBytes = 750_000;

function initialsFromName(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

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
  const [traderType, setTraderType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [preferredMarkets, setPreferredMarkets] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState("");
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">("info");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const marketOptions = ["Forex", "Metals", "Crypto", "Indices", "Stocks", "Futures", "Commodities"];

  function toggleMarket(market: string) {
    setPreferredMarkets((current) => (current.includes(market) ? current.filter((item) => item !== market) : [...current, market]));
  }

  function savePendingSignup() {
    window.localStorage.setItem(
      "fundedscope_pending_signup",
      JSON.stringify({
        name,
        username,
        email,
        avatarPreview,
        createdAt: new Date().toISOString()
      })
    );
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setAvatarPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatusTone("error");
      setStatus("Choose an image file for your profile picture.");
      return;
    }

    if (file.size > maxAvatarPreviewBytes) {
      setStatusTone("error");
      setStatus("Choose an image under 750KB for now. You can upload a larger profile picture later.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setStatusTone("info");

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

      savePendingSignup();
      if (data.session?.access_token) {
        window.localStorage.setItem("fundedscope_access_token", data.session.access_token);
        if (data.session.refresh_token) window.localStorage.setItem("fundedscope_refresh_token", data.session.refresh_token);
        router.push("/welcome");
        return;
      }

      setStatusTone("success");
      router.push("/welcome?verify=1");
    } catch (error) {
      setStatusTone("error");
      setStatus(friendlyAuthMessage(error, "We couldn't create your account. Please check your details and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2 rounded-3xl border border-electric/20 bg-electric/10 p-4">
        <p className="text-sm font-black text-electric">Start blank</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          A new trader can create an account with only email and password. Everything else is optional and can be added later inside Trading DNA.
        </p>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl border border-electric/20 bg-electric/10 text-xl font-black text-electric">
          {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : initialsFromName(name, email || "FS")}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-white">Profile picture <span className="text-slate-600">(optional)</span></p>
          <p className="mt-1 text-sm leading-6 text-slate-400">Upload one now or skip it. If you skip, FundedScope will use your initials.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-electric/30 hover:text-white">
              Upload image
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
            </label>
            <button type="button" onClick={() => setAvatarPreview("")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-400 transition hover:border-white/20 hover:text-white">
              Skip for now
            </button>
          </div>
        </div>
      </div>
      <label className="text-sm text-slate-400">
        Full name <span className="text-slate-600">(optional)</span>
        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Add later" />
      </label>
      <label className="text-sm text-slate-400">
        Username <span className="text-slate-600">(optional)</span>
        <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Choose later" />
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
        Country <span className="text-slate-600">(optional)</span>
        <input value={country} onChange={(event) => setCountry(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Add later" />
      </label>
      <label className="text-sm text-slate-400">
        Timezone
        <input value={timezone} onChange={(event) => setTimezone(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Africa/Lagos" />
      </label>
      <label className="text-sm text-slate-400">
        Trader type <span className="text-slate-600">(optional)</span>
        <select value={traderType} onChange={(event) => setTraderType(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          <option value="">Choose later</option>
          <option>Prop Trader</option>
          <option>Live Trader</option>
          <option>Both</option>
        </select>
      </label>
      <label className="text-sm text-slate-400">
        Experience <span className="text-slate-600">(optional)</span>
        <select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          <option value="">Choose later</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Professional</option>
        </select>
      </label>
      <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-bold text-white">Markets you trade <span className="text-slate-600">(optional)</span></p>
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
        <option value="">Choose risk tolerance later</option>
        <option value="LOW">Low risk tolerance</option>
        <option value="MEDIUM">Medium risk tolerance</option>
        <option value="HIGH">High risk tolerance</option>
        <option value="EXTREME">Extreme risk tolerance</option>
      </select>
      <button disabled={loading} className="sm:col-span-2 mt-3 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void disabled:opacity-60">
        {loading ? "Creating account..." : "Create account"}
      </button>
      {status ? (
        <p
          className={`sm:col-span-2 rounded-2xl border p-3 text-sm font-bold ${
            statusTone === "success"
              ? "border-success/30 bg-success/10 text-success"
              : statusTone === "error"
                ? "border-danger/30 bg-danger/10 text-danger"
                : "border-white/10 bg-white/[0.03] text-slate-300"
          }`}
        >
          {status}
        </p>
      ) : null}
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
      if (data.session?.refresh_token) window.localStorage.setItem("fundedscope_refresh_token", data.session.refresh_token);
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch (error) {
      setStatus(friendlyAuthMessage(error, "We couldn't sign you in. Please check your details and try again."));
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
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
            if (error) throw error;
            setStatus("Password reset email sent if the address exists.");
          } catch (error) {
            setStatus(friendlyAuthMessage(error, "We couldn't send the password reset email. Please try again shortly."));
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

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      if (data.user) {
        setStatus("Password updated. Taking you back to settings.");
        router.push("/settings");
      }
    } catch (error) {
      setStatus(friendlyAuthMessage(error, "We couldn't update your password. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="New password" type="password" required minLength={10} />
      <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Confirm new password" type="password" required minLength={10} />
      <button disabled={loading} className="w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void disabled:opacity-60">
        {loading ? "Updating..." : "Reset password"}
      </button>
      {status ? <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">{status}</p> : null}
    </form>
  );
}
