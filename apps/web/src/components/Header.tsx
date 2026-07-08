"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "../lib/data";

const primaryHrefs = new Set(["/dashboard", "/trader-dna", "/prop-firms", "/brokers", "/compare", "/spreads"]);

export function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryRoutes = routes.filter((route) => primaryHrefs.has(route.href));
  const moreRoutes = routes.filter((route) => !primaryHrefs.has(route.href));

  function closeMenus() {
    setOpen(false);
    setMoreOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:px-5 xl:grid-cols-[260px_1fr_auto]">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenus}>
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-glow">
            <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" width={40} height={40} decoding="async" className="h-full w-full object-cover" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-black tracking-[0.28em] text-white">FUNDEDSCOPE</span>
            <span className="block text-xs text-slate-400">Trading Intelligence</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm text-slate-300 xl:flex">
          {primaryRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
              {route.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              className="rounded-full px-4 py-2 font-semibold transition hover:bg-white/10 hover:text-white"
              aria-expanded={moreOpen}
            >
              More
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-12 w-56 rounded-3xl border border-white/10 bg-midnight/95 p-2 shadow-glow backdrop-blur-xl">
                {moreRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={closeMenus}
                    className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-electric"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/sign-in" onClick={closeMenus} className="hidden rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:border-white/30 hover:text-white sm:inline-block">
            Sign in
          </Link>
          <Link href="/sign-up" onClick={closeMenus} className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-black text-void shadow-glow transition hover:scale-[1.02] sm:inline-block">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-midnight/95 px-4 py-4 shadow-glow xl:hidden">
          <nav className="grid gap-2">
            {routes.map((route) => (
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
              Sign in
            </Link>
            <Link href="/sign-up" onClick={closeMenus} className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-void">
              Start free
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
