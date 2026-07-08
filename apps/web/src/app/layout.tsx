import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LiveMarketBar } from "../components/LiveMarketBar";
import { EntryOfferModal } from "../components/EntryOfferModal";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com"),
  title: "FundedScope | Trading Intelligence Platform",
  description: "A premium trading intelligence platform for comparing prop firms, brokers, spreads, market risk, journals and trader decisions.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/brand/fundedscope-logo.png",
    apple: "/brand/fundedscope-logo.png"
  },
  openGraph: {
    title: "FundedScope | Trading Intelligence Platform",
    description: "Trade smarter. Decide faster.",
    url: "/",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "FundedScope | Trading Intelligence Platform",
    description: "Trade smarter. Decide faster.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
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
            name: "FundedScope",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com",
            logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com"}/brand/fundedscope-logo.png`,
            sameAs: [
              "https://myfundedscope.com"
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "hello@myfundedscope.com"
            }
          })}
        </Script>
        <Script id="website-jsonld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FundedScope",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com",
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com"}/prop-firms?q={search_term_string}`,
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
