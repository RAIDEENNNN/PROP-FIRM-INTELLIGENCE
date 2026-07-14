import Link from "next/link";

const footerGroups = [
  {
    title: "Prop Firms",
    links: [
      { label: "All Prop Firms", href: "/prop-firms" },
      { label: "Compare Firms", href: "/compare" },
      { label: "How We Score", href: "/legal/how-we-score" },
      { label: "Rule Changes", href: "/news-radar" },
      { label: "Report Incorrect Data", href: "/report" }
    ]
  },
  {
    title: "Brokers",
    links: [
      { label: "All Brokers", href: "/brokers" },
      { label: "Spreads", href: "/spreads" },
      { label: "Gold Dashboard", href: "/gold" },
      { label: "Decision Engine", href: "/decision-engine" },
      { label: "Data Sources", href: "/sources" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Company", href: "/company" },
      { label: "Careers", href: "/careers" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Editorial Policy", href: "/legal/editorial-policy" },
      { label: "Affiliate Disclosure", href: "/legal/affiliate-disclosure" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Status", href: "/status" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-12 text-sm text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_18%_20%,rgba(124,58,237,0.30),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-electric">FundedScope intelligence</p>
              <h2 className="mt-3 text-3xl font-black text-white">Get weekly trader research, rule updates and broker intelligence.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Educational market and comparison research for traders who want cleaner decisions before choosing a firm, broker or challenge.
              </p>
            </div>
            <form action="/sign-up" method="get" className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Email address"
                className="min-h-14 rounded-2xl border border-white/10 bg-black/35 px-5 text-white outline-none placeholder:text-slate-500 focus:border-violet/60"
              />
              <button type="submit" className="min-h-14 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet px-6 font-black text-white">
                Subscribe
              </button>
              <p className="text-xs leading-5 text-slate-500 sm:col-span-2">No financial advice. No spam. Unsubscribe anytime.</p>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-[1.15fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-purple-400/30 bg-black">
                <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" className="h-full w-full object-contain p-1" />
              </span>
              <span className="text-xl font-black text-white">FundedScope</span>
            </Link>
            <p className="mt-4 max-w-sm leading-7">
              Built by THE PĦILOSOPHER for traders who read the fine print before risking capital.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-black uppercase tracking-[0.18em] text-white">{group.title}</h3>
              <div className="mt-4 grid gap-3">
                {group.links.map(({ label, href }) => (
                  <Link key={href} href={href} className="hover:text-electric">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MyFundedScope. All rights reserved.</p>
          <p className="text-xs text-slate-500">Educational comparison tools, not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
