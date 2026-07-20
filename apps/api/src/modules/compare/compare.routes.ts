import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";
import { buildScoreBreakdown } from "../../shared/scoring";

export const compareRouter = Router();

const compareSchema = z.object({
  slugs: z.array(z.string().min(1).max(160)).min(1).max(5)
});

const recommendationSchema = z.object({
  markets: z.array(z.string()).default([]),
  maxFee: z.number().positive().optional(),
  payoutPriority: z.boolean().default(false),
  riskTolerance: z.enum(["LOW", "MEDIUM", "HIGH", "EXTREME"]).default("MEDIUM"),
  accountSize: z.number().int().positive().optional()
});

type FirmRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  score: unknown;
  confidence_score: unknown;
  rating: unknown;
  review_count: number;
  payout_frequency: string | null;
  summary: string | null;
  markets: string[];
  platforms: string[];
  updated_at: Date;
};

type ChallengeRow = {
  prop_firm_id: string;
  name: string;
  challenge_type: string | null;
  account_size: unknown;
  challenge_fee: unknown;
  profit_target_phase_one: unknown;
  profit_target_phase_two: unknown;
  daily_drawdown: unknown;
  max_drawdown: unknown;
  payout_split: unknown;
  refundable_fee: boolean;
};

type RuleRow = {
  prop_firm_id: string;
  category: string;
  title: string;
  current_value: string;
  previous_value: string | null;
  impact_level: string;
  effective_at: Date | null;
};

function numeric(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function fitScore(firm: { score: unknown; confidence_score: unknown; rating: unknown; payout_frequency: string | null }, payoutPriority = false) {
  const trust = numeric(firm.confidence_score ?? firm.score);
  const rating = numeric(firm.rating) * 10;
  const payoutBoost = payoutPriority && firm.payout_frequency?.toLowerCase().includes("weekly") ? 8 : 0;
  return Math.min(100, Math.round(trust * 0.65 + rating * 0.25 + payoutBoost));
}

function publicCompareFirm(firm: FirmRow, challenges: ChallengeRow[], rules: RuleRow[], extra: Record<string, unknown> = {}) {
  const accounts = challenges.map((account) => ({
    name: account.name,
    challengeType: account.challenge_type,
    accountSize: numeric(account.account_size, 0),
    challengeFee: numeric(account.challenge_fee, 0),
    profitTargetPhaseOne: numeric(account.profit_target_phase_one, 0),
    profitTargetPhaseTwo: numeric(account.profit_target_phase_two, 0),
    dailyDrawdown: numeric(account.daily_drawdown, 0),
    maxDrawdown: numeric(account.max_drawdown, 0),
    profitSplit: numeric(account.payout_split, 0),
    refundableFee: account.refundable_fee
  }));
  const mappedRules = rules.map((rule) => ({
    category: rule.category,
    title: rule.title,
    currentValue: rule.current_value,
    previousValue: rule.previous_value,
    impactLevel: rule.impact_level.toUpperCase(),
    effectiveAt: rule.effective_at
  }));

  return {
    name: firm.name,
    slug: firm.slug,
    logoUrl: firm.logo_url,
    country: firm.country,
    trustScore: firm.score,
    confidenceScore: firm.confidence_score ?? firm.score,
    rating: firm.rating,
    reviewCount: firm.review_count,
    payoutFrequency: firm.payout_frequency,
    editorSummary: firm.summary,
    markets: firm.markets ?? [],
    platforms: firm.platforms ?? [],
    updatedAt: firm.updated_at,
    accounts,
    rules: mappedRules,
    scoreBreakdown: buildScoreBreakdown({
      trustScore: firm.confidence_score ?? firm.score,
      rating: firm.rating,
      reviewCount: firm.review_count,
      payoutFrequency: firm.payout_frequency,
      status: "active",
      updatedAt: firm.updated_at,
      accounts,
      rules: mappedRules
    }),
    ...extra
  };
}

async function loadPublicFirmData(slugs?: string[], limit = 50) {
  const normalizedSlugs = slugs?.map((slug) => slug.toLowerCase()) ?? null;
  const firms = await prisma.$queryRaw<FirmRow[]>`
    select
      id::text,
      name,
      slug,
      logo_url,
      country,
      score,
      confidence_score,
      rating,
      review_count,
      payout_frequency,
      summary,
      markets,
      platforms,
      updated_at
    from public.prop_firms
    where status = 'active'
      and content_status = 'published'
      and (${normalizedSlugs}::text[] is null or lower(slug) = any(${normalizedSlugs}))
    order by coalesce(confidence_score, score) desc, rating desc, name asc
    limit ${limit}
  `;

  const firmIds = firms.map((firm) => firm.id);
  if (!firmIds.length) return { firms, challenges: [], rules: [] };

  const [challenges, rules] = await Promise.all([
    prisma.$queryRaw<ChallengeRow[]>`
      select prop_firm_id::text, name, challenge_type, account_size, challenge_fee, profit_target_phase_one, profit_target_phase_two, daily_drawdown, max_drawdown, payout_split, refundable_fee
      from public.prop_firm_challenges
      where prop_firm_id::text = any(${firmIds})
        and status = 'active'
        and content_status = 'published'
    `,
    prisma.$queryRaw<RuleRow[]>`
      select prop_firm_id::text, category, title, current_value, previous_value, impact_level, effective_at
      from public.prop_firm_rules
      where prop_firm_id::text = any(${firmIds})
        and status = 'active'
        and content_status = 'published'
    `
  ]);

  return { firms, challenges, rules };
}

compareRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = compareSchema.parse(req.body);
    const { firms, challenges, rules } = await loadPublicFirmData(input.slugs);

    return sendOk(res, {
      firms: firms.map((firm) =>
        publicCompareFirm(
          firm,
          challenges.filter((challenge) => challenge.prop_firm_id === firm.id),
          rules.filter((rule) => rule.prop_firm_id === firm.id),
          { fitScore: fitScore(firm) }
        )
      )
    });
  })
);

compareRouter.post(
  "/recommendations",
  asyncHandler(async (req, res) => {
    const input = recommendationSchema.parse(req.body);
    const { firms, challenges, rules } = await loadPublicFirmData(undefined, 50);

    const ranked = firms
      .map((firm) => {
        const firmChallenges = challenges.filter((challenge) => challenge.prop_firm_id === firm.id);
        const firmRules = rules.filter((rule) => rule.prop_firm_id === firm.id);
        const feeMatch = input.maxFee ? firmChallenges.some((account) => numeric(account.challenge_fee) <= input.maxFee!) : true;
        const sizeMatch = input.accountSize ? firmChallenges.some((account) => numeric(account.account_size) >= input.accountSize!) : true;
        const marketMatch = input.markets.length
          ? input.markets.some((market) =>
              [...(firm.markets ?? []), ...(firm.platforms ?? []), ...firmRules.map((rule) => `${rule.category} ${rule.current_value}`)]
                .join(" ")
                .toLowerCase()
                .includes(market.toLowerCase())
            )
          : true;

        const penalty = feeMatch && sizeMatch && marketMatch ? 0 : 12;
        return publicCompareFirm(firm, firmChallenges, firmRules, {
          recommendationScore: Math.max(0, fitScore(firm, input.payoutPriority) - penalty),
          recommendationLabel: "Option worth researching based on your preferences",
          limitations: [
            "Country availability must be confirmed from structured availability records.",
            "This is research guidance, not financial advice or a guarantee."
          ],
          reasons: [
            feeMatch ? "Fee preference matched" : "Fee may be above preference",
            sizeMatch ? "Account size preference matched" : "Account size may need review",
            marketMatch ? "Market preference matched" : "Market coverage needs manual check"
          ]
        });
      })
      .sort((a: any, b: any) => b.recommendationScore - a.recommendationScore)
      .slice(0, 10);

    return sendOk(res, { recommendations: ranked });
  })
);
