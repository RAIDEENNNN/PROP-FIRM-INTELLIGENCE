"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function EntryOfferModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("fundedscope_offer_closed") === "true") return;
    const timer = window.setTimeout(() => setOpen(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.localStorage.setItem("fundedscope_offer_closed", "true");
    setOpen(false);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    window.localStorage.setItem("fundedscope_waitlist_email", email);
    setSaved(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md">
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-midnight shadow-glow lg:grid-cols-[0.42fr_0.58fr]">
        <button
          type="button"
          onClick={close}
          className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-2xl text-white"
          aria-label="Close offer"
        >
          ×
        </button>
        <div className="hidden min-h-[520px] bg-[radial-gradient(circle_at_20%_20%,rgba(53,211,255,0.35),transparent_28%),linear-gradient(135deg,rgba(10,16,32,1),rgba(18,8,38,1))] p-8 lg:block">
          <div className="grid h-full content-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-electric">FundedScope launch access</p>
              <h2 className="mt-4 text-4xl font-black text-white">Open FundedScope before your first trade.</h2>
            </div>
            <div className="grid rotate-[-6deg] gap-4">
              {["Trader DNA", "Gold Risk", "Prop Firm Score"].map((item) => (
                <div key={item} className="rounded-3xl border border-electric/30 bg-black/40 p-5 shadow-glow">
                  <p className="text-sm text-slate-400">{item}</p>
                  <p className="mt-1 text-2xl font-black text-white">Decision intelligence</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 text-center sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-electric">Last step before you go</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">Get early access to FundedScope Pro.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Join the launch list for Trader DNA, market briefings, prop firm alerts and premium decision tools. No fake urgency — just early access.
          </p>
          {saved ? (
            <div className="mt-8 rounded-3xl border border-success/30 bg-success/10 p-5 text-success">
              You’re on the list. Create an account next so your profile can be saved.
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 max-w-xl">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-3xl border border-white/10 bg-white/10 px-5 py-5 text-lg font-bold text-white outline-none placeholder:text-slate-400"
              />
              <p className="mt-4 text-xs leading-5 text-slate-500">By signing up, you agree to receive FundedScope launch updates. You can unsubscribe anytime.</p>
              <button className="mt-6 rounded-2xl bg-white px-8 py-4 text-lg font-black text-void">Start FundedScope Journey</button>
            </form>
          )}
          <div className="mt-6">
            <Link href="/sign-up" onClick={close} className="text-sm font-bold text-electric">
              Create account instead →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
