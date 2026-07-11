export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export const brand = {
  companyName: "MyFundedScope",
  productName: "FundedScope",
  legalName: "MyFundedScope",
  domain: "myfundedscope.com",
  url: siteUrl,
  logoPath: "/brand/fundedscope-logo.png",
  logoUrl: `${siteUrl}/brand/fundedscope-logo.png`,
  email: "hello@myfundedscope.com",
  tagline: "Trade smarter. Decide faster.",
  description:
    "MyFundedScope is the company behind FundedScope, a trading intelligence platform that helps traders compare prop firms, evaluate brokers, analyze markets and build a personal Trading DNA."
};

export function brandSameAs() {
  return (process.env.NEXT_PUBLIC_BRAND_SAME_AS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

