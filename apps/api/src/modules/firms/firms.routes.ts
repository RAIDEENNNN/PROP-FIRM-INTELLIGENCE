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
      firms: filtered.map((firm: any) => ({
        ...firm,
        scoreBreakdown: buildScoreBreakdown(firm)
      })),
      count: filtered.length,
      limit: query.limit,
      offset: query.offset
    });
  })
);

firmsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const firm = await prisma.propFirm.findUnique({
      where: { slug: req.params.slug },
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
    return sendOk(res, { firm: { ...firm, scoreBreakdown: buildScoreBreakdown(firm) } });
  })
);

firmsRouter.get(
  "/:slug/score",
  asyncHandler(async (req, res) => {
    const firm = await prisma.propFirm.findUnique({
      where: { slug: req.params.slug },
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
    const firm = await prisma.propFirm.findUnique({
      where: { slug: req.params.slug },
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
    return sendOk(res, { firmId: firm.id, slug: firm.slug, rules: firm.rules, auditLogs: firm.auditLogs });
  })
);
