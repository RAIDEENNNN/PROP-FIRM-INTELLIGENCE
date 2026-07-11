import Link from "next/link";

const links: Array<{ label: string; href: string }> = [
  { label: "About", href: "/about" },
  { label: "Company", href: "/company" },
  { label: "Careers", href: "/careers" },
  { label: "How we score", href: "/legal/how-we-score" },
  { label: "Editorial policy", href: "/legal/editorial-policy" },
  { label: "Contact", href: "/contact" },
  { label: "Become a Partner", href: "/partners" },
  { label: "Affiliate Program", href: "/affiliate-program" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "API", href: "/api-access" },
  { label: "Status", href: "/status" },
  { label: "Report a Problem", href: "/report" },
  { label: "Affiliate disclosure", href: "/legal/affiliate-disclosure" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" }
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 text-sm text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MyFundedScope. FundedScope is built for traders who read the fine print.</p>
          <p className="text-xs text-slate-500">Educational comparison tools, not financial advice.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {links.map(({ label, href }) => (
            <Link key={href} href={href} className="hover:text-electric">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
