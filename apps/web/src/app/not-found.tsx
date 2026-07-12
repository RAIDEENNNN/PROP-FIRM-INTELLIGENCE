import Link from "next/link";
import { BackButton } from "../components/BackButton";

const recoveryLinks = [
  { label: "Search Prop Firms", href: "/prop-firms", description: "Compare rules, payouts, drawdown and verification status." },
  { label: "Search Brokers", href: "/brokers", description: "Research broker regulation, platforms, spreads and support." },
  { label: "Search Articles", href: "/articles", description: "Read FundedScope guides and company updates." },
  { label: "Search Rules", href: "/compare", description: "Compare firm rules and see why rankings differ." }
];

export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-5">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_34%),rgba(255,255,255,0.03)] p-6 shadow-glow sm:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">404</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">This page is outside the trading range.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
          The page may have moved, the URL may be combined incorrectly, or the information has not been published yet. Use one of the discovery paths below to continue researching.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          {recoveryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-electric/40 hover:bg-white/[0.06]">
              <p className="font-black text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <BackButton />
          <Link href="/" className="rounded-full bg-white px-6 py-3 font-black text-void">Go home</Link>
        </div>
      </div>
    </main>
  );
}
