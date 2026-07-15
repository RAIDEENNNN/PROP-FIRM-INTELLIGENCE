"use client";

import Link from "next/link";
import { useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { UniversalSearch } from "./UniversalSearch";

const navRoutes = [
  { href: "/prop-firms", label: "Prop Firms" },
  { href: "/brokers", label: "Brokers" },
  { href: "/compare", label: "Compare" },
  { href: "/news-radar", label: "News" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Education" },
  { href: "/about", label: "About" }
];

const mobileRoutes = [
  ...navRoutes,
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trader-dna", label: "Trader DNA" },
  { href: "/spreads", label: "Spreads" },
  { href: "/pricing", label: "Pricing" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function closeMenus() {
    setOpen(false);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05050a]/92 backdrop-blur-2xl">
      <div className="border-b border-white/10 bg-violet/25">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-center text-xs font-bold text-purple-100 sm:px-5">
          <span className="rounded-full bg-fuchsia-400 px-3 py-1 text-white shadow-[0_0_20px_rgba(217,70,239,0.35)]">● TODAY</span>
          <span>FundedScope market intelligence desk</span>
          <span className="hidden text-slate-300 sm:inline">| London & New York session focus</span>
          <Link href="/gold" className="rounded-full border border-fuchsia-300/40 px-3 py-1 text-white transition hover:bg-white/10">
            View Today’s Edge →
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:px-5 xl:grid-cols-[230px_1fr_auto]">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenus}>
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-purple-400/30 bg-black shadow-[0_0_28px_rgba(124,58,237,0.35)]">
            <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" width={48} height={48} decoding="async" className="h-full w-full object-contain p-0.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black tracking-tight text-white">FundedScope</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-8 text-sm font-semibold text-slate-300 xl:flex">
          {navRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="transition hover:text-white">
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition hover:text-white md:inline-block"
            aria-expanded={searchOpen}
          >
            Search
          </button>
          <NotificationBell />
          <Link href="/sign-in" onClick={closeMenus} className="hidden rounded-xl border border-white/10 bg-[#0d0d16] px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:border-purple-400/40 hover:text-white sm:inline-block">
            Login
          </Link>
          <Link href="/sign-up" onClick={closeMenus} className="hidden rounded-xl bg-violet px-5 py-2.5 text-sm font-black text-white shadow-[0_0_28px_rgba(124,58,237,0.45)] transition hover:scale-[1.02] sm:inline-block">
            Sign Up
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 sm:px-5">
          {["Forex", "Futures", "Crypto"].map((item, index) => (
            <Link
              key={item}
              href={index === 0 ? "/prop-firms" : index === 1 ? "/prop-firms?market=Futures" : "/brokers"}
              className={`rounded-full border px-4 py-1.5 transition ${
                index === 0 ? "border-violet bg-violet text-white" : "border-white/10 bg-white/[0.03] hover:border-violet/50 hover:text-white"
              }`}
            >
              {item}
            </Link>
          ))}
          <span className="hidden h-6 w-px bg-white/10 md:block" />
          <Link href="/decision-engine" className="rounded-full border border-fuchsia-400/35 px-4 py-1.5 font-black text-fuchsia-200 hover:bg-fuchsia-400/10">
            Decision Engine™
          </Link>
          <Link href="/spreads" className="rounded-full border border-white/10 px-4 py-1.5 hover:border-electric/40 hover:text-electric">
            Spreads
          </Link>
          <Link href="/pricing" className="rounded-full border border-white/10 px-4 py-1.5 hover:border-gold/40 hover:text-gold">
            Pricing
          </Link>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-white/10 bg-midnight/95 px-4 py-4 shadow-glow">
          <div className="mx-auto max-w-3xl">
            <UniversalSearch compact />
          </div>
        </div>
      ) : null}

      {open ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-midnight/95 px-4 py-4 shadow-glow xl:hidden">
          <nav className="grid gap-2">
            {mobileRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeMenus}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200"
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/sign-in" onClick={closeMenus} className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-bold text-white">
              Login
            </Link>
            <Link href="/sign-up" onClick={closeMenus} className="rounded-2xl bg-violet px-4 py-3 text-center text-sm font-bold text-white">
              Sign Up
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
