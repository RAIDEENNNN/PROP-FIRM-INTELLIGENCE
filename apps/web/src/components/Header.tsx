import Link from "next/link";
import { routes } from "../lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-electric via-violet to-plasma text-sm font-black text-white shadow-glow">
            FS
          </span>
          <span>
            <span className="block text-sm font-bold tracking-[0.28em] text-white">FUNDEDSCOPE</span>
            <span className="block text-xs text-slate-400">Trader intelligence OS</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="transition hover:text-electric">
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 sm:inline-block">
            Sign in
          </Link>
          <Link href="/sign-up" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-void shadow-glow">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
