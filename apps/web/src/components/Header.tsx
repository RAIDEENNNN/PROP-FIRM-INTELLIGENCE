"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "../lib/data";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-glow">
            <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold tracking-[0.22em] text-white sm:text-sm sm:tracking-[0.28em]">FUNDEDSCOPE</span>
            <span className="block truncate text-[11px] text-slate-400 sm:text-xs">Compare · Choose · Fund</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="transition hover:text-electric">
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/sign-in" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 sm:inline-block">
            Sign in
          </Link>
          <Link href="/sign-up" className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-void shadow-glow sm:inline-block">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-midnight/95 px-4 py-4 shadow-glow lg:hidden">
          <nav className="grid gap-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200"
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/sign-in" onClick={() => setOpen(false)} className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-bold text-white">
              Sign in
            </Link>
            <Link href="/sign-up" onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-void">
              Start free
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
