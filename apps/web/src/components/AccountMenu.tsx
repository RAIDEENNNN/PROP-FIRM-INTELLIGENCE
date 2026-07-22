"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

type AccountState = {
  email: string;
  name?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
};

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "super_admin" || role === "editor";
}

export function AccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    if (!isSupabaseBrowserConfigured()) {
      setAccount(null);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    async function load() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!active) return;

      if (!user) {
        setAccount(null);
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("full_name, account_role, avatar_url").eq("id", user.id).maybeSingle();
      if (!active) return;
      setAccount({
        email: user.email ?? "",
        name: profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        role: profile?.account_role ?? null,
        avatarUrl: profile?.avatar_url ?? null
      });
    }

    load();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  async function signOut() {
    if (!isSupabaseBrowserConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.localStorage.removeItem("fundedscope_access_token");
    window.localStorage.removeItem("fundedscope_refresh_token");
    window.localStorage.removeItem("fundedscope_user");
    setOpen(false);
    setAccount(null);
    onNavigate?.();
  }

  if (!account) {
    return (
      <>
        <Link href="/sign-in" onClick={onNavigate} className="hidden rounded-xl border border-white/10 bg-[#0d0d16] px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:border-purple-400/40 hover:text-white sm:inline-block">
          Login
        </Link>
        <Link href="/sign-up" onClick={onNavigate} className="hidden rounded-xl bg-violet px-5 py-2.5 text-sm font-black text-white shadow-[0_0_28px_rgba(124,58,237,0.45)] transition hover:scale-[1.02] sm:inline-block">
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <Link href="/dashboard" onClick={onNavigate} className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-electric/30 hover:text-white lg:inline-block">
        Dashboard
      </Link>
      <Link
        href="/settings"
        onClick={onNavigate}
        className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 text-slate-200 transition hover:border-electric/30 hover:text-white lg:grid"
        aria-label="Account settings"
        title="Account settings"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.36a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.55-1a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      </Link>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2 rounded-xl border border-electric/25 bg-electric/10 px-2 text-sm font-black text-white transition hover:border-electric/50 sm:px-3"
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label="Open account menu"
      >
        <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-electric text-xs text-void">
          {account.avatarUrl ? <img src={account.avatarUrl} alt="" className="h-full w-full object-cover" /> : (account.name || account.email || "?").slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:inline">Profile</span>
      </button>
      {open ? (
        <div id="account-menu" className="absolute right-0 top-full z-50 mt-3 w-64 rounded-3xl border border-white/10 bg-midnight/95 p-3 shadow-glow backdrop-blur-xl">
          <p className="truncate px-2 text-sm font-black text-white">{account.name || "FundedScope trader"}</p>
          <p className="truncate px-2 text-xs text-slate-500">{account.email}</p>
          <div className="mt-3 grid gap-2 text-sm font-bold">
            <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 px-3 py-2 text-slate-200 hover:border-electric/30">
              Dashboard
            </Link>
            <Link href="/profile" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 px-3 py-2 text-slate-200 hover:border-electric/30">
              Profile
            </Link>
            <Link href="/settings" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 px-3 py-2 text-slate-200 hover:border-electric/30">
              Settings
            </Link>
            {isAdminRole(account.role) ? (
              <Link href="/admin" onClick={() => setOpen(false)} className="rounded-2xl border border-fuchsia-400/30 px-3 py-2 text-fuchsia-200 hover:bg-fuchsia-400/10">
                Admin
              </Link>
            ) : null}
            <button type="button" onClick={signOut} className="rounded-2xl border border-white/10 px-3 py-2 text-left text-slate-200 hover:border-danger/40 hover:text-danger">
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
