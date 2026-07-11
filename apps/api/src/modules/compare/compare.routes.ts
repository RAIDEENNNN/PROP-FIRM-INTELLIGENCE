import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";
import { buildScoreBreakdown } from "../../shared/scoring";

export const compareRouter = Router();

const compareSchema = z.object({
  slugs: z.array(z.string()).min(1).max(5)
});

const recommendationSchema = z.object({
  markets: z.array(z.string()).default([]),
  maxFee: z.number().positive().optional(),
  payoutPriority: z.boolean().default(false),
  riskTolerance: z.enum(["LOW", "MEDIUM", "HIGH", "EXTREME"]).default("MEDIUM"),
  accountSize: z.number().int().positive().optional()
});

function fitScore(firm: { trustScore: unknown; rating: unknown; payoutFrequency: string | null }, payoutPriority = false) {
  const trust = Number(firm.trustScore ?? 0);
  const rating = Number(firm.rating ?? 0) * 10;
  const payoutBoost = payoutPriority && firm.payoutFrequency?.toLowerCase().includes("weekly") ? 8 : 0;
  return Math.min(100, Math.round(trust * 0.65 + rating * 0.25 + payoutBoost));
}

function publicCompareFirm(firm: any, extra: Record<string, unknown> = {}) {
  return {
    name: firm.name,
    slug: firm.slug,
    logoUrl: firm.logoUrl,
    country: firm.country,
    trustScore: firm.trustScore,
    rating: firm.rating,
    reviewCount: firm.reviewCount,
    payoutFrequency: firm.payoutFrequency,
    editorSummary: firm.editorSummary,
    updatedAt: firm.updatedAt,
    accounts: firm.accounts?.map((account: any) => ({
      name: account.name,
      challengeType: account.challengeType,
      accountSize: account.accountSize,
      challengeFee: account.challengeFee,
      profitTargetPhaseOne: account.profitTargetPhaseOne,
      profitTargetPhaseTwo: account.profitTargetPhaseTwo,
      dailyDrawdown: account.dailyDrawdown,
      maxDrawdown: account.maxDrawdown,
      profitSplit: account.profitSplit,
      refundableFee: account.refundableFee
    })),
    rules: firm.rules?.map((rule: any) => ({
      category: rule.category,
      title: rule.title,
      currentValue: rule.currentValue,
      previousValue: rule.previousValue,
      impactLevel: rule.impactLevel,
      effectiveAt: rule.effectiveAt
    })),
    scoreBreakdown: buildScoreBreakdown(firm),
    ...extra
  };
}

compareRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = compareSchema.parse(req.body);
    const firms = await prisma.propFirm.findMany({
      where: { slug: { in: input.slugs } },
      include: { accounts: true, rules: true }
    });

    return sendOk(res, {
      firms: firms.map((firm: any) => publicCompareFirm(firm, { fitScore: fitScore(firm) }))
    });
  })
);

compareRouter.post(
  "/recommendations",
  asyncHandler(async (req, res) => {
    const input = recommendationSchema.parse(req.body);
    const firms = await prisma.propFirm.findMany({
      include: { accounts: true, rules: true },
      orderBy: [{ trustScore: "desc" }, { rating: "desc" }],
      take: 50
    });

    const ranked = firms
      .map((firm: any) => {
        const feeMatch = input.maxFee ? firm.accounts.some((account: any) => Number(account.challengeFee) <= input.maxFee!) : true;
        const sizeMatch = input.accountSize ? firm.accounts.some((account: any) => account.accountSize >= input.accountSize!) : true;
        const marketMatch = input.markets.length
          ? firm.rules.some((rule: any) => input.markets.some((market) => `${rule.category} ${rule.currentValue}`.toLowerCase().includes(market.toLowerCase())))
          : true;

        const penalty = feeMatch && sizeMatch && marketMatch ? 0 : 12;
        return publicCompareFirm(firm, {
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
