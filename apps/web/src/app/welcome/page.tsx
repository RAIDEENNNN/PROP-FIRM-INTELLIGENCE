import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-5 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-electric">FundedScope</p>
        <h1 className="mt-5 text-6xl font-black text-white md:text-8xl">Trade the rules.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-slate-300">A prop firm intelligence OS for funded traders, affiliates and serious operators.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-bold text-void">Enter platform</Link>
      </div>
    </main>
  );
}
