import Link from "next/link";

const links: Array<{ label: string; href: string }> = [
  { label: "Company", href: "/about" },
  { label: "How we score", href: "/legal/how-we-score" },
  { label: "Editorial policy", href: "/legal/editorial-policy" },
  { label: "Contact", href: "/contact" },
  { label: "Affiliate disclosure", href: "/legal/affiliate-disclosure" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" }
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 text-sm text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} FundedScope. Built for traders who read the fine print.</p>
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
