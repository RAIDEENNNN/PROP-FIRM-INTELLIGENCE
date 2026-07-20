import { brand } from "./brand";

export type BrandArticle = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  sections: Array<{ heading: string; body: string }>;
};

export const brandArticles: BrandArticle[] = [
  {
    slug: "introducing-myfundedscope",
    title: "Introducing MyFundedScope: The Company Behind FundedScope",
    description:
      "Meet MyFundedScope, the company building FundedScope as a trading intelligence platform for prop firm, broker, market and trader decision-making.",
    publishedAt: "2026-07-10",
    readingTime: "4 min read",
    sections: [
      {
        heading: "Why MyFundedScope exists",
        body: "MyFundedScope exists because traders need a clearer way to make decisions before buying challenges, choosing brokers, trading high-volatility markets or risking funded accounts. FundedScope brings comparison data, market context and personal trading intelligence into one platform."
      },
      {
        heading: "What FundedScope does",
        body: "FundedScope helps traders compare prop firms, review rules, evaluate brokers, understand spreads, track market risk, use trading calculators and build a personal Trading DNA that can improve recommendations over time."
      },
      {
        heading: "The bigger mission",
        body: "The goal is not to become another comparison website. MyFundedScope is building the place traders open before they make decisions: compare, check risk, review news, understand rules and learn from their own trading behavior."
      }
    ]
  },
  {
    slug: "why-myfundedscope-exists",
    title: "Why MyFundedScope Exists",
    description:
      "MyFundedScope was created to make prop firm research, broker comparison, risk planning and trading intelligence clearer for modern traders.",
    publishedAt: "2026-07-10",
    readingTime: "5 min read",
    sections: [
      {
        heading: "Trading research is too scattered",
        body: "A trader may need one website for prop firm rules, another for broker spreads, another for news, another for calculators and another for journaling. MyFundedScope exists to reduce that friction."
      },
      {
        heading: "Trust matters",
        body: "FundedScope is designed to make scores explainable. Traders should see the categories behind a rating, the source status behind data and the commercial disclosures behind outbound links."
      },
      {
        heading: "Personalization is the moat",
        body: "The long-term advantage is Trading DNA. As FundedScope learns a trader's markets, risk tolerance, psychology, sessions and goals, the product becomes harder to replace."
      }
    ]
  },
  {
    slug: "how-myfundedscope-helps-traders",
    title: "How MyFundedScope Helps Traders Make Better Decisions",
    description:
      "See how MyFundedScope helps traders compare firms, evaluate brokers, understand market risk and build daily decision habits inside FundedScope.",
    publishedAt: "2026-07-10",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Compare before committing",
        body: "FundedScope gives traders a structured way to compare challenge fees, payout frequency, daily drawdown, max drawdown, market access, score breakdowns and firm fit."
      },
      {
        heading: "Understand market risk",
        body: "The platform is built around daily decision context: Gold risk, major news, spread conditions, prop firm restrictions and personal risk limits."
      },
      {
        heading: "Build a better routine",
        body: "The product vision is simple: traders should start with FundedScope, check market intelligence, review risk, update their journal and only then decide whether trading makes sense."
      }
    ]
  },
  {
    slug: "future-of-trading-intelligence",
    title: "The Future of Trading Intelligence Is Personal",
    description:
      "MyFundedScope believes trading intelligence should adapt to the trader through journals, behavior, psychology, risk patterns and long-term memory.",
    publishedAt: "2026-07-10",
    readingTime: "5 min read",
    sections: [
      {
        heading: "Information is not enough",
        body: "Traders do not only need more data. They need better decisions. The future of trading intelligence is about turning data into personal context."
      },
      {
        heading: "Trading DNA",
        body: "FundedScope's Trading DNA concept is built around the trader's own history: markets, sessions, psychology, weaknesses, goals, prop accounts, brokers and performance patterns."
      },
      {
        heading: "A platform that grows with the trader",
        body: "The more a trader uses FundedScope, the more the system should understand what helps them improve. That is how MyFundedScope becomes more than a website."
      }
    ]
  }
];

export function getArticle(slug: string) {
  return brandArticles.find((article) => article.slug === slug);
}

export function articleUrl(slug: string) {
  return `${brand.url}/articles/${slug}`;
}
