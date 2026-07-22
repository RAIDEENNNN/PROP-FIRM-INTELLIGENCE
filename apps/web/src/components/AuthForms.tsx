"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { friendlyAuthMessage } from "../lib/auth-errors";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const oauthProviders = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" }
];

const minimumPasswordLength = 8;

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(false);

  function savePendingSignup() {
    window.localStorage.setItem(
      "fundedscope_pending_signup",
      JSON.stringify({
        email,
        createdAt: new Date().toISOString()
      })
    );
  }

  async function signUpWithProvider(provider: string) {
    setLoading(true);
    setStatus("");
    setStatusTone("info");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google" | "github",
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });
      if (error) throw error;
    } catch (error) {
      setStatusTone("error");
      setStatus(friendlyAuthMessage(error, "We couldn't start that sign-up method. Please try email instead."));
      setLoading(false);
    }
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
          emailRedirectTo: `${window.location.origin}/profile`
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
    <form onSubmit={submit} className="mt-6 space-y-3">
      <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
        {oauthProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => signUpWithProvider(provider.id)}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white transition hover:border-electric/40 disabled:opacity-60"
          >
            {provider.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        <span>Email sign up</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <label className="text-sm text-slate-400">
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="you@example.com" type="email" required />
      </label>
      <label className="text-sm text-slate-400">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white"
          placeholder="At least 8 characters"
          type="password"
          required
          minLength={minimumPasswordLength}
        />
      </label>
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold leading-5 text-slate-400">
        Use at least 8 characters. A mix of letters, numbers, or symbols is stronger. You can add your name, photo, country, markets and Trading DNA after signup under Profile.
      </p>
      <button disabled={loading} className="mt-3 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void disabled:opacity-60">
        {loading ? "Creating account..." : "Create account"}
      </button>
      {status ? (
        <p
          className={`rounded-2xl border p-3 text-sm font-bold ${
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

  async function signInWithProvider(provider: string) {
    setLoading(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google" | "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      setStatus(friendlyAuthMessage(error, "We couldn't start that sign-in method. Please try email instead."));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {oauthProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => signInWithProvider(provider.id)}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white transition hover:border-electric/40 disabled:opacity-60"
          >
            {provider.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        <span>Email sign in</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
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
