import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

const firmSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  affiliateUrl: z.string().url().optional(),
  country: z.string().optional(),
  trustScore: z.number().min(0).max(100).default(70),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  payoutFrequency: z.string().optional(),
  editorSummary: z.string().optional(),
  featured: z.boolean().default(false)
});

adminRouter.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const [users, firms, reviewsPending, alerts, subscriptions, newsEvents, spreadRecords] = await Promise.all([
      prisma.user.count(),
      prisma.propFirm.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.alert.count({ where: { enabled: true } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.newsEvent.count(),
      prisma.spreadRecord.count()
    ]);

    return sendOk(res, {
      users,
      firms,
      reviewsPending,
      activeAlerts: alerts,
      activeSubscriptions: subscriptions,
      newsEvents,
      spreadRecords
    });
  })
);

adminRouter.get(
  "/audit-logs",
  asyncHandler(async (_req, res) => {
    const logs = await prisma.auditLog.findMany({
      include: { actor: { select: { id: true, email: true, name: true } }, firm: true },
      orderBy: { createdAt: "desc" },
      take: 200
    });

    return sendOk(res, { logs });
  })
);

adminRouter.post(
  "/firms",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = firmSchema.parse(req.body);
    const firm = await prisma.propFirm.upsert({
      where: { slug: input.slug },
      update: input,
      create: input
    });

    await prisma.auditLog.create({
      data: {
        actorUserId: req.user!.sub,
        firmId: firm.id,
        action: "UPSERT_FIRM",
        entityType: "PropFirm",
        entityId: firm.id,
        metadata: { slug: firm.slug }
      }
    });

    return sendOk(res, { firm }, 201);
  })
);
