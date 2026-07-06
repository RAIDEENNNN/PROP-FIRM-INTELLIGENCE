import { PropFirmDirectory } from "../../components/PropFirmDirectory";

export default function PropFirmsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Directory</p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Prop firms worldwide</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
        A growing global database with logos, scoring, payout rules, challenge conditions, searchable markets and spread intelligence readiness.
      </p>
      <PropFirmDirectory />
    </main>
  );
}
