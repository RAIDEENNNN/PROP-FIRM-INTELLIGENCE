import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "FundedScope | Prop Firm Intelligence",
  description: "A premium command center for comparing prop firms, monitoring rules, spreads, payouts and trader risk."
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
