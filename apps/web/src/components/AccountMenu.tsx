"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

type AccountState = {
  email: string;
  name?: string | null;
  role?: string | null;
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

      const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
      if (!active) return;
      setAccount({
        email: user.email ?? "",
        name: profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        role: profile?.role ?? null
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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2 rounded-xl border border-electric/25 bg-electric/10 px-3 text-sm font-black text-white transition hover:border-electric/50"
        aria-expanded={open}
        aria-controls="account-menu"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-electric text-xs text-void">{(account.name || account.email || "?").slice(0, 1).toUpperCase()}</span>
        Account
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
