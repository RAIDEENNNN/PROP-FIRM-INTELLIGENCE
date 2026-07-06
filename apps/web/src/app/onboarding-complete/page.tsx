import Link from "next/link";

export default function OnboardingCompletePage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-success">Profile saved</p>
        <h1 className="mt-3 text-4xl font-black text-white">Your command center is ready.</h1>
        <p className="mt-4 text-slate-400">Next we connect this flow to auth, trader profile storage and AI recommendations.</p>
        <Link href="/dashboard" className="mt-8 inline-block rounded-full bg-electric px-6 py-3 font-bold text-void">Open dashboard</Link>
      </div>
    </main>
  );
}
