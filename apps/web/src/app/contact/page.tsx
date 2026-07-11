import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { JsonLd } from "../../components/JsonLd";
import { brand } from "../../lib/brand";

export const metadata: Metadata = {
  title: "Contact MyFundedScope",
  description: "Contact MyFundedScope for support, partnerships, prop firm data corrections, broker data, sponsorships and business inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact MyFundedScope",
    description: "Support, partnerships, corrections and business inquiries.",
    url: "/contact",
    siteName: "MyFundedScope",
    type: "website",
    images: [brand.logoPath]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact MyFundedScope",
    description: "Support, partnerships, corrections and business inquiries.",
    images: [brand.logoPath]
  }
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MyFundedScope",
    url: `${brand.url}/contact`,
    about: {
      "@type": "Organization",
      name: brand.companyName,
      url: brand.url,
      email: brand.email
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <JsonLd id="contact-page-jsonld" data={contactJsonLd} />
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Contact</p>
      <h1 className="mt-3 text-4xl font-black text-white">Talk to MyFundedScope</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">
          Email {brand.email} for support, data corrections, partnerships, sponsorships, broker data, prop firm updates or business inquiries.
        </p>
      </GlassCard>
    </main>
  );
}
