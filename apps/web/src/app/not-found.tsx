import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-5">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_34%),rgba(255,255,255,0.03)] p-8 shadow-glow">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">404</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">This page is outside the trading range.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
          The page may have moved, or the information has not been published yet. Search FundedScope or return to the dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-white px-6 py-3 font-black text-void">Go home</Link>
          <Link href="/prop-firms" className="rounded-full border border-white/10 px-6 py-3 font-black text-white">Compare firms</Link>
        </div>
      </div>
    </main>
  );
}
