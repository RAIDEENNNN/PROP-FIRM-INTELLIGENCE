import type { Metadata } from "next";
import ToolsPage from "../tools/page";

export const metadata: Metadata = {
  title: "Trading Calculators | FundedScope",
  description: "Use FundedScope calculators for lot size, risk, pip value, drawdown, profit targets, margin and trading session planning.",
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: "Trading Calculators | FundedScope",
    description: "Risk calculators and trading tools for funded-account traders.",
    url: "/calculators",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trading Calculators | FundedScope",
    description: "Risk calculators and trading tools for funded-account traders.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default ToolsPage;
