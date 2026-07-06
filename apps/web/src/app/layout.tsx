import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fundedscope.com"),
  title: "FundedScope | Prop Firm Intelligence",
  description: "A premium command center for comparing prop firms, monitoring rules, spreads, payouts and trader risk.",
  icons: {
    icon: "/brand/fundedscope-logo.png",
    apple: "/brand/fundedscope-logo.png"
  },
  openGraph: {
    title: "FundedScope | Prop Firm Intelligence",
    description: "Compare. Choose. Fund.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="noise min-h-screen">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
