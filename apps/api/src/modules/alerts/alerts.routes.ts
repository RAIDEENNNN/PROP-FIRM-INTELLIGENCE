import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const alertsRouter = Router();

const alertSchema = z.object({
  firmId: z.string().optional(),
  type: z.enum(["RULE_CHANGE", "SPREAD_SPIKE", "NEWS_EVENT", "PAYOUT_UPDATE", "PRICE_CHANGE", "CUSTOM"]),
  title: z.string().min(3).max(120),
  message: z.string().min(3).max(500),
  triggerConfig: z.record(z.unknown()).optional()
});

const alertUpdateSchema = z.object({
  enabled: z.boolean().optional(),
  title: z.string().min(3).max(120).optional(),
  message: z.string().min(3).max(500).optional(),
  triggerConfig: z.record(z.unknown()).optional()
});

const watchlistSchema = z.object({
  firmId: z.string(),
  notes: z.string().max(500).optional()
});

alertsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const alerts = await prisma.alert.findMany({
      where: { userId: req.user!.sub },
      include: { firm: true },
      orderBy: { createdAt: "desc" }
    });

    return sendOk(res, { alerts });
  })
);

alertsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = alertSchema.parse(req.body);
    const alert = await prisma.alert.create({
      data: {
        userId: req.user!.sub,
        firmId: input.firmId,
        type: input.type,
        title: input.title,
        message: input.message,
        triggerConfig: input.triggerConfig as Prisma.InputJsonValue | undefined
      },
      include: { firm: true }
    });

    return sendOk(res, { alert }, 201);
  })
);

alertsRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = alertUpdateSchema.parse(req.body);
    const id = String(req.params.id);
    const existing = await prisma.alert.findFirst({
      where: { id, userId: req.user!.sub }
    });

    if (!existing) throw new HttpError(404, "Alert not found");

    const alert = await prisma.alert.update({
      where: { id },
      data: {
        enabled: input.enabled,
        title: input.title,
        message: input.message,
        triggerConfig: input.triggerConfig as Prisma.InputJsonValue | undefined
      },
      include: { firm: true }
    });

    return sendOk(res, { alert });
  })
);

alertsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const id = String(req.params.id);
    const existing = await prisma.alert.findFirst({
      where: { id, userId: req.user!.sub }
    });

    if (!existing) throw new HttpError(404, "Alert not found");
    await prisma.alert.delete({ where: { id } });
    return sendOk(res, { deleted: true });
  })
);

alertsRouter.get(
  "/watchlist",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: req.user!.sub },
      include: { firm: true },
      orderBy: { createdAt: "desc" }
    });

    return sendOk(res, { watchlist });
  })
);

alertsRouter.post(
  "/watchlist",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = watchlistSchema.parse(req.body);
    const watchlistItem = await prisma.watchlist.upsert({
      where: { userId_firmId: { userId: req.user!.sub, firmId: input.firmId } },
      update: { notes: input.notes },
      create: { userId: req.user!.sub, firmId: input.firmId, notes: input.notes },
      include: { firm: true }
    });

    return sendOk(res, { watchlistItem }, 201);
  })
);

alertsRouter.delete(
  "/watchlist/:firmId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const firmId = String(req.params.firmId);
    await prisma.watchlist.delete({
      where: { userId_firmId: { userId: req.user!.sub, firmId } }
    });

    return sendOk(res, { deleted: true });
  })
);
