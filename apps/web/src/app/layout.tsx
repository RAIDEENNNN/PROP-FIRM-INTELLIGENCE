import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LiveMarketBar } from "../components/LiveMarketBar";
import { EntryOfferModal } from "../components/EntryOfferModal";
import { PwaRuntime } from "../components/PwaRuntime";
import { brand, brandSameAs } from "../lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: "FundedScope – Compare Prop Firms, Brokers, Spreads & Trading Tools",
  description: "Compare prop firms, forex brokers, spreads, payout rules, trading conditions and platform features. Research before you buy a challenge or open a broker account with FundedScope.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.png", sizes: "256x256", type: "image/png" },
      { url: brand.logoPath, type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.webmanifest",
  applicationName: brand.companyName,
  appleWebApp: {
    capable: true,
    title: "FundedScope",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#020617",
    "msapplication-config": "none"
  },
  keywords: ["MyFundedScope", "FundedScope", "prop firm comparison", "trading intelligence", "prop firms", "broker comparison", "Trader DNA"],
  openGraph: {
    title: "FundedScope – Compare Prop Firms, Brokers, Spreads & Trading Tools",
    description: "Compare prop firms, forex brokers, spreads, payout rules, trading conditions and platform features before you buy a challenge or open a broker account.",
    url: "/",
    siteName: "MyFundedScope",
    type: "website",
    images: [brand.logoPath]
  },
  twitter: {
    card: "summary_large_image",
    title: "FundedScope – Compare Prop Firms, Brokers, Spreads & Trading Tools",
    description: "Compare prop firms, forex brokers, spreads, payout rules, trading conditions and platform features.",
    images: [brand.logoPath]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#020617" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRuntime />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? (
          <Script id="clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
            `}
          </Script>
        ) : null}
        <Script id="organization-jsonld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: brand.companyName,
            alternateName: brand.productName,
            legalName: brand.legalName,
            url: brand.url,
            logo: brand.logoUrl,
            image: brand.logoUrl,
            description: brand.description,
            sameAs: brandSameAs(),
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: brand.email,
              url: `${brand.url}/contact`
            }
          })}
        </Script>
        <Script id="website-jsonld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: brand.companyName,
            alternateName: brand.productName,
            url: brand.url,
            potentialAction: {
              "@type": "SearchAction",
              target: `${brand.url}/prop-firms?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>
        <div className="noise min-h-screen">
          <Header />
          <LiveMarketBar />
          {children}
          <Footer />
          <EntryOfferModal />
        </div>
      </body>
    </html>
  );
}
