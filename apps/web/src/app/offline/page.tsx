import Link from "next/link";

export const metadata = {
  title: "Offline | FundedScope",
  description: "FundedScope offline fallback for installed app sessions."
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[72vh] max-w-4xl items-center px-4 py-16 sm:px-5">
      <section className="professional-panel w-full rounded-[2rem] border p-6 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-electric">Offline mode</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">FundedScope is ready when your connection returns.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Saved static pages and app assets can still open, but live market data, authentication, bookmarks and account features need an internet connection.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="rounded-2xl bg-electric px-5 py-3 text-center font-black text-void transition hover:scale-[1.01]">
            Return home
          </Link>
          <Link href="/prop-firms" className="rounded-2xl border border-white/15 px-5 py-3 text-center font-black text-white transition hover:bg-white/10">
            View cached research
          </Link>
        </div>
      </section>
    </main>
  );
}
