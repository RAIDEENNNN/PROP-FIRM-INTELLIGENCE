import { GlassCard } from "../../../components/GlassCard";
import { scoreWeights } from "../../../lib/trust";

const pages: Record<string, { kicker: string; title: string; intro: string; sections: Array<{ title: string; body: string }> }> = {
  "how-we-score": {
    kicker: "Methodology",
    title: "How FundedScope scores prop firms",
    intro:
      "FundedScope scores are designed to help traders compare firms faster. A high score is not financial advice or a guarantee of payout; it is a structured comparison signal based on the data we track.",
    sections: [
      {
        title: "Core scoring inputs",
        body: "We review rule clarity, payout structure, drawdown limits, challenge pricing, market coverage, account flexibility, review volume, transparency, operational risk and recent rule-change signals."
      },
      {
        title: "Fit matters more than hype",
        body: "A firm can be strong overall and still be a poor fit for a specific trader. That is why profiles include best-fit reasons, cautions and rule notes next to the score."
      },
      {
        title: "Commercial relationships",
        body: "Affiliate relationships, featured listings and sponsorships do not automatically improve a FundedScope score. Sponsored placements should be labeled separately from editorial scoring."
      }
    ]
  },
  "editorial-policy": {
    kicker: "Editorial policy",
    title: "How FundedScope keeps comparisons useful",
    intro:
      "Our editorial standard is simple: traders should understand the trade-off before they pay for a challenge. We prioritize clarity, source labeling and correction speed.",
    sections: [
      {
        title: "Independence",
        body: "Reviews, scores and caution notes should be based on observable firm data, rule checks, user signals and editorial judgment, not commission size."
      },
      {
        title: "Updates and corrections",
        body: "Prop firm rules change often. When an error or outdated rule is found, the correction should be prioritized and the last-checked date should be updated."
      },
      {
        title: "User-submitted content",
        body: "Reviews, payout proof and complaints should be moderated for relevance, abuse and authenticity before being used as verified signals."
      }
    ]
  },
  "affiliate-disclosure": {
    kicker: "Affiliate disclosure",
    title: "How FundedScope may earn money",
    intro:
      "FundedScope may earn commissions when users click links or purchase challenges through partner links. This helps fund the platform, data checks and tools.",
    sections: [
      {
        title: "What may be affiliate-linked",
        body: "Firm visit buttons, discount-code buttons, sponsored listings and some partner offers may contain affiliate tracking."
      },
      {
        title: "What does not change",
        body: "Affiliate compensation should not override score logic, risk labels, caution notes, user reviews or editorial methodology."
      },
      {
        title: "Trader responsibility",
        body: "Always verify the latest rules, fees, restricted countries, payout terms and trading conditions directly with the firm before buying."
      }
    ]
  },
  privacy: {
    kicker: "Privacy",
    title: "Privacy summary",
    intro:
      "FundedScope accounts, alerts and dashboards may require personal data such as email, preferences, saved firms and usage analytics. Data should be collected only for clear product purposes.",
    sections: [
      {
        title: "Account data",
        body: "We may store email, profile preferences, saved firms, alert settings and subscription state so users can access their dashboard across sessions."
      },
      {
        title: "Analytics",
        body: "Analytics may be used to understand product performance, search behavior and feature usage. Sensitive trading credentials should never be requested."
      },
      {
        title: "Deletion",
        body: "Users should be able to request deletion of account data, saved preferences and non-required personal information."
      }
    ]
  },
  terms: {
    kicker: "Terms",
    title: "Terms summary",
    intro:
      "FundedScope is an information and comparison platform. It does not provide financial advice, investment advice, brokerage services or guaranteed prop firm outcomes.",
    sections: [
      {
        title: "No financial advice",
        body: "Content, scores, calculators and recommendations are educational comparison tools. Traders remain responsible for risk decisions."
      },
      {
        title: "Data accuracy",
        body: "We aim to keep information current, but prop firm rules, pricing and payout terms can change without notice. Always confirm with the firm."
      },
      {
        title: "Acceptable use",
        body: "Users should not abuse reviews, submit false payout proof, scrape restricted areas or attempt to compromise accounts or platform systems."
      }
    ]
  }
};

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = pages[params.slug] ?? {
    kicker: "Legal",
    title: params.slug.replaceAll("-", " "),
    intro: "FundedScope legal and company information.",
    sections: [
      {
        title: "Publication standard",
        body: "FundedScope legal pages should explain the policy clearly, avoid hidden commercial incentives and give traders enough context to make their own checks before choosing a firm."
      }
    ]
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">{page.kicker}</p>
      <h1 className="mt-3 text-4xl font-black capitalize text-white">{page.title}</h1>
      <GlassCard className="mt-8">
        <p className="leading-8 text-slate-300">{page.intro}</p>
      </GlassCard>
      <div className="mt-6 grid gap-4">
        {params.slug === "how-we-score" ? (
          <GlassCard>
            <h2 className="text-xl font-black text-white">Public score weights</h2>
            <p className="mt-3 leading-8 text-slate-300">
              The visible score is out of 100. We start from 100 and subtract deductions inside these weighted categories, so visitors can see why a firm scores highly or loses points.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {scoreWeights.map((item) => (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{item.label}</p>
                    <p className="font-black text-electric">{item.max}%</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.explanation}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : null}
        {page.sections.map((section) => (
          <GlassCard key={section.title}>
            <h2 className="text-xl font-black text-white">{section.title}</h2>
            <p className="mt-3 leading-8 text-slate-300">{section.body}</p>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
