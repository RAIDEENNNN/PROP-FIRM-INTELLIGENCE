import { PropFirmDirectory } from "../../components/PropFirmDirectory";

export default function PropFirmsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Directory</p>
      <h1 className="mt-3 text-4xl font-black text-white">Prop firms worldwide</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        A growing global database with logos, scoring, payout rules, challenge conditions, searchable markets and spread intelligence readiness.
      </p>
      <PropFirmDirectory />
    </main>
  );
}
