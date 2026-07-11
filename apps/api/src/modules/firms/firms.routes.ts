import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";
import { buildScoreBreakdown } from "../../shared/scoring";

export const firmsRouter = Router();

const firmQuerySchema = z.object({
  q: z.string().optional(),
  market: z.string().optional(),
  country: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

function publicFirmDto(firm: any) {
  return {
    name: firm.name,
    slug: firm.slug,
    logoUrl: firm.logoUrl,
    websiteUrl: firm.websiteUrl,
    country: firm.country,
    trustScore: firm.trustScore,
    rating: firm.rating,
    reviewCount: firm.reviewCount,
    foundedYear: firm.foundedYear,
    payoutFrequency: firm.payoutFrequency,
    status: firm.status,
    editorSummary: firm.editorSummary,
    seoTitle: firm.seoTitle,
    seoDescription: firm.seoDescription,
    featured: firm.featured,
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
      minimumTradingDays: account.minimumTradingDays,
      maxTradingDays: account.maxTradingDays,
      refundableFee: account.refundableFee
    })),
    rules: firm.rules?.map((rule: any) => ({
      category: rule.category,
      title: rule.title,
      currentValue: rule.currentValue,
      previousValue: rule.previousValue,
      impactLevel: rule.impactLevel,
      effectiveAt: rule.effectiveAt,
      updatedAt: rule.updatedAt
    })),
    reviews: firm.reviews?.map((review: any) => ({
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt,
      user: review.user ? { name: review.user.name, avatarUrl: review.user.avatarUrl } : null
    })),
    counts: firm._count,
    scoreBreakdown: buildScoreBreakdown(firm)
  };
}

firmsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = firmQuerySchema.parse(req.query);
    const firms = await prisma.propFirm.findMany({
      where: {
        featured: query.featured,
        country: query.country ? { contains: query.country, mode: "insensitive" } : undefined,
        OR: query.q
          ? [
              { name: { contains: query.q, mode: "insensitive" } },
              { country: { contains: query.q, mode: "insensitive" } },
              { editorSummary: { contains: query.q, mode: "insensitive" } },
              { accounts: { some: { name: { contains: query.q, mode: "insensitive" } } } },
              { rules: { some: { currentValue: { contains: query.q, mode: "insensitive" } } } }
            ]
          : undefined
      },
      include: {
        accounts: true,
        rules: true,
        _count: { select: { reviews: true, watchlists: true, alerts: true } }
      },
      orderBy: [{ featured: "desc" }, { trustScore: "desc" }, { rating: "desc" }],
      take: query.limit,
      skip: query.offset
    });

    const filtered = query.market
      ? firms.filter((firm: any) =>
          firm.accounts.some((account: any) => account.name.toLowerCase().includes(query.market!.toLowerCase())) ||
          firm.rules.some((rule: any) => `${rule.category} ${rule.currentValue}`.toLowerCase().includes(query.market!.toLowerCase()))
        )
      : firms;

    return sendOk(res, {
      firms: filtered.map((firm: any) => publicFirmDto(firm)),
      count: filtered.length,
      limit: query.limit,
      offset: query.offset
    });
  })
);

firmsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const firm = await prisma.propFirm.findUnique({
      where: { slug },
      include: {
        accounts: { orderBy: [{ accountSize: "asc" }] },
        rules: { orderBy: [{ updatedAt: "desc" }] },
        reviews: {
          where: { status: "VERIFIED" },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { user: { select: { id: true, name: true, avatarUrl: true } } }
        }
      }
    });

    if (!firm) throw new HttpError(404, "Prop firm not found");
    return sendOk(res, { firm: publicFirmDto(firm) });
  })
);

firmsRouter.get(
  "/:slug/score",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const firm = await prisma.propFirm.findUnique({
      where: { slug },
      include: {
        accounts: true,
        rules: true
      }
    });

    if (!firm) throw new HttpError(404, "Prop firm not found");
    return sendOk(res, {
      slug: firm.slug,
      name: firm.name,
      trustScore: firm.trustScore,
      scoreBreakdown: buildScoreBreakdown(firm)
    });
  })
);

firmsRouter.get(
  "/:slug/rules/history",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const firm = await prisma.propFirm.findUnique({
      where: { slug },
      include: {
        rules: { orderBy: { updatedAt: "desc" } },
        auditLogs: {
          where: { entityType: "PropFirmRule" },
          orderBy: { createdAt: "desc" },
          take: 100
        }
      }
    });

    if (!firm) throw new HttpError(404, "Prop firm not found");
    const firmWithHistory = firm as typeof firm & { rules: any[]; auditLogs: any[] };
    return sendOk(res, {
      slug: firm.slug,
      rules: firmWithHistory.rules.map((rule) => ({
        category: rule.category,
        title: rule.title,
        currentValue: rule.currentValue,
        previousValue: rule.previousValue,
        impactLevel: rule.impactLevel,
        effectiveAt: rule.effectiveAt,
        updatedAt: rule.updatedAt
      })),
      auditLogs: []
    });
  })
);
