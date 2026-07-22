"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function EntryOfferModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("fundedscope_offer_closed") === "true") return;
    const timer = window.setTimeout(() => setOpen(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.localStorage.setItem("fundedscope_offer_closed", "true");
    setOpen(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: "newsletter",
          source: "entry-offer-modal",
          consent: true
        })
      });

      if (!response.ok) throw new Error("waitlist failed");
      window.localStorage.setItem("fundedscope_waitlist_email", email);
      setSaved(true);
    } catch {
      setError("We could not save this yet. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-30 w-[min(calc(100vw-2rem),28rem)]">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-violet/25 bg-[linear-gradient(180deg,#1a1130_0%,#070710_100%)] shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/10 text-xl text-white transition hover:border-electric/40"
          aria-label="Close offer"
        >
          ×
        </button>
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.35),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(53,211,255,0.18),transparent_30%)] px-5 py-4">
          <div className="flex items-center gap-3 pr-10">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img src="/brand/fundedscope-logo.png" alt="" className="h-full w-full object-contain p-1" />
            </span>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-electric">FundedScope Edge</p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-electric">Trader intelligence briefing</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white">
            Get the weekly <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">FundedScope Edge</span>.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Join the member list for prop-firm rule alerts, broker research, market briefings and premium decision tools.
          </p>
          {saved ? (
            <div className="mt-5 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-success">
              You’re on the list. Create an account next so your profile can be saved.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="Enter your email"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-400 focus:border-electric/60"
              />
              <label className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left text-xs leading-5 text-slate-300">
                <input type="checkbox" defaultChecked className="mt-1 accent-violet" />
                <span>I want FundedScope research, offers, product updates and trading-intelligence emails.</span>
              </label>
              {error ? <p className="mt-3 text-sm font-bold text-danger">{error}</p> : null}
              <button type="submit" disabled={saving} className="mt-4 min-h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70">
                {saving ? "Saving..." : "Enter"}
              </button>
            </form>
          )}
          <div className="mt-4 text-center">
            <Link href="/sign-up" onClick={close} className="text-sm font-bold text-electric">
              Create account instead →
            </Link>
          </div>
        </div>
      </section>
    </aside>
  );
}
