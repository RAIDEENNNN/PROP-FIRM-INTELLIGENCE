"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-5">
      <div className="rounded-[2rem] border border-danger/30 bg-danger/10 p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-danger">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">FundedScope hit a temporary error.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
          Try again. If it keeps happening, report the issue so it can be reviewed.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="rounded-full bg-white px-6 py-3 font-black text-void">Try again</button>
          <Link href="/report" className="rounded-full border border-white/10 px-6 py-3 font-black text-white">Report problem</Link>
        </div>
      </div>
    </main>
  );
}
