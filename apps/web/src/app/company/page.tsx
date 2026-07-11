import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Company | FundedScope",
  description: "Why FundedScope exists, how information is verified, and how companies can partner with MyFundedScope."
};

const sections = [
  ["Why FundedScope exists", "Traders need one trusted place to compare firms, brokers, rules, markets and personal risk before making decisions."],
  ["Mission", "Help traders make better research decisions with transparent data, verified updates and personal trading context."],
  ["Vision", "Become the daily intelligence layer traders open before buying challenges, choosing brokers or trading high-risk markets."],
  ["How we verify information", "Important fields should include source, last verified date and editorial review status before being treated as confirmed."],
  ["Partner with us", "Prop firms, brokers and trading services can request listing reviews, data corrections and partnership conversations without influencing editorial scores."]
];

export default function CompanyPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),rgba(255,255,255,0.03)] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Company</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black text-white sm:text-6xl">MyFundedScope is building trader intelligence infrastructure.</h1>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map(([title, copy]) => (
          <GlassCard key={title}>
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p>
          </GlassCard>
        ))}
      </section>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/contact" className="rounded-full bg-white px-6 py-3 text-center font-black text-void">Contact</Link>
        <Link href="/partners" className="rounded-full border border-white/10 px-6 py-3 text-center font-black text-white">Become a partner</Link>
      </div>
    </main>
  );
}
