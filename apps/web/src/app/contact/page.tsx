import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Contact FundedScope",
  description: "Contact FundedScope for support, partnerships, prop firm data corrections, broker data, sponsorships and business inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact FundedScope",
    description: "Support, partnerships, corrections and business inquiries.",
    url: "/contact",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact FundedScope",
    description: "Support, partnerships, corrections and business inquiries.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Contact</p>
      <h1 className="mt-3 text-4xl font-black text-white">Talk to FundedScope</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">Add your real support email, creator socials and business inquiry form here.</p>
      </GlassCard>
    </main>
  );
}
