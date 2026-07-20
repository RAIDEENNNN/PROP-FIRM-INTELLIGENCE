"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { friendlyAuthMessage } from "../lib/auth-errors";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

type PendingSignup = {
  name?: string;
  username?: string;
  email?: string;
  avatarPreview?: string;
  createdAt?: string;
};

type WelcomeState = PendingSignup & {
  verified: boolean;
  loading: boolean;
};

function initials(name?: string, email?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "FS";
}

function firstName(name?: string, email?: string) {
  if (name?.trim()) return name.trim().split(/\s+/)[0];
  if (email) return email.split("@")[0];
  return "trader";
}

function readPendingSignup(): PendingSignup {
  try {
    return JSON.parse(window.localStorage.getItem("fundedscope_pending_signup") ?? "{}") as PendingSignup;
  } catch {
    return {};
  }
}

export function WelcomeExperience() {
  const router = useRouter();
  const [state, setState] = useState<WelcomeState>({ verified: false, loading: true });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      const pending = readPendingSignup();
      if (!isSupabaseBrowserConfigured()) {
        if (active) setState({ ...pending, verified: false, loading: false });
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      const verified = Boolean(user?.email_confirmed_at);

      const nextState: WelcomeState = {
        name: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? pending.name,
        username: user?.user_metadata?.username ?? pending.username,
        email: user?.email ?? pending.email,
        avatarPreview: pending.avatarPreview,
        createdAt: pending.createdAt,
        verified,
        loading: false
      };

      if (!active) return;
      setState(nextState);

      if (verified) {
        window.localStorage.removeItem("fundedscope_pending_signup");
        const timer = window.setTimeout(() => router.push("/dashboard"), 1100);
        return () => window.clearTimeout(timer);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  const displayName = firstName(state.name, state.email);
  const progress = useMemo(
    () => [
      { label: "Account", done: true },
      { label: "Email", done: state.verified },
      { label: "Profile", done: false },
      { label: "Dashboard", done: false }
    ],
    [state.verified]
  );

  async function resendEmail() {
    setNotice("");
    if (!state.email) {
      setNotice("Add your email on the sign-up page first.");
      return;
    }
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: state.email,
        options: { emailRedirectTo: `${window.location.origin}/profile` }
      });
      if (error) throw error;
      setNotice("Verification email sent again.");
    } catch (error) {
      setNotice(friendlyAuthMessage(error, "We couldn't resend the verification email. Please try again shortly."));
    }
  }

  async function signOut() {
    if (isSupabaseBrowserConfigured()) {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    }
    window.localStorage.removeItem("fundedscope_pending_signup");
    window.localStorage.removeItem("fundedscope_access_token");
    window.localStorage.removeItem("fundedscope_refresh_token");
    router.push("/sign-in");
  }

  if (state.loading) {
    return (
      <main className="grid min-h-[80vh] place-items-center px-5 text-center">
        <div className="grid gap-4">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-3xl border border-electric/30 bg-electric/15 shadow-glow" />
          <p className="text-sm font-black uppercase tracking-[0.28em] text-electric">Preparing account</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[80vh] max-w-6xl px-4 py-10 sm:px-5 sm:py-14">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.20),transparent_28%),#080912] shadow-glow">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div>
            <div className="relative grid h-32 w-32 place-items-center overflow-hidden rounded-[2rem] border border-electric/25 bg-electric/10 text-4xl font-black text-electric shadow-[0_0_50px_rgba(34,211,238,0.18)]">
              {state.avatarPreview ? <img src={state.avatarPreview} alt="" className="h-full w-full object-cover" /> : initials(state.name, state.email)}
              <span className="absolute inset-x-4 bottom-3 h-1 rounded-full bg-electric/60" />
            </div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.28em] text-electric">{state.verified ? "Welcome back" : "Verify your email"}</p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">Welcome to FundedScope, {displayName}.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              {state.verified
                ? "Your account is verified. Taking you to your dashboard."
                : "Your account has been created. Verify your email to unlock protected features, saved research and your personal Trader DNA."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="mailto:" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-void transition hover:scale-[1.02]">
                Verify Email
              </a>
              <button type="button" onClick={resendEmail} className="rounded-2xl border border-electric/30 px-5 py-3 text-sm font-black text-electric transition hover:bg-electric/10">
                Resend Email
              </button>
              <Link href={state.verified ? "/dashboard" : "/sign-in"} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-white/25">
                Continue
              </Link>
              <button type="button" onClick={signOut} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-300 transition hover:border-danger/40 hover:text-danger">
                Sign Out
              </button>
            </div>
            {notice ? <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm font-bold text-slate-200">{notice}</p> : null}
          </div>

          <div className="grid content-start gap-4 rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Account</p>
              <p className="mt-3 truncate text-xl font-black text-white">{state.name || "FundedScope trader"}</p>
              <p className="mt-1 truncate text-sm text-slate-400">{state.email || "Email pending"}</p>
              {state.username ? <p className="mt-3 text-sm font-bold text-electric">@{state.username}</p> : null}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="grid gap-3">
                {progress.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${item.done ? "bg-success text-void" : "bg-white/10 text-slate-400"}`}>
                      {item.done ? "✓" : index + 1}
                    </span>
                    <span className={item.done ? "font-bold text-white" : "font-bold text-slate-500"}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gold/20 bg-gold/10 p-5">
              <p className="text-sm font-black text-gold">Next step</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Open the verification email from FundedScope, confirm your account, then return to continue setup.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
