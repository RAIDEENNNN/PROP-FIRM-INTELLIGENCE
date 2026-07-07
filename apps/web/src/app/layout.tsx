import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LiveMarketBar } from "../components/LiveMarketBar";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fundedscope.com"),
  title: "FundedScope | Trading Intelligence Platform",
  description: "A premium trading intelligence platform for comparing prop firms, brokers, spreads, market risk, journals and trader decisions.",
  icons: {
    icon: "/brand/fundedscope-logo.png",
    apple: "/brand/fundedscope-logo.png"
  },
  openGraph: {
    title: "FundedScope | Trading Intelligence Platform",
    description: "Trade smarter. Decide faster.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="noise min-h-screen">
          <Header />
          <LiveMarketBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
