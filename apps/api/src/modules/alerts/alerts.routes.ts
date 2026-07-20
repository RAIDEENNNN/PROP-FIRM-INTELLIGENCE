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
  entityType: z.enum(["prop_firm", "broker", "news", "article"]).default("prop_firm"),
  entitySlug: z.string().min(1).max(160).optional(),
  firmId: z.string().min(1).max(160).optional(),
  title: z.string().max(180).optional(),
  href: z.string().max(300).optional(),
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
    const rows = await prisma.$queryRaw<
      Array<{ id: string; entity_type: string; entity_slug: string; title: string | null; href: string | null; notes: string | null; created_at: Date; updated_at: Date }>
    >`
      select id::text, entity_type, entity_slug, title, href, notes, created_at, updated_at
      from public.watchlists
      where user_id::text = ${req.user!.sub}
      order by created_at desc
      limit 100
    `;

    return sendOk(res, {
      watchlist: rows.map((row) => ({
        id: row.id,
        entityType: row.entity_type,
        entitySlug: row.entity_slug,
        title: row.title,
        href: row.href,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    });
  })
);

alertsRouter.post(
  "/watchlist",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = watchlistSchema.parse(req.body);
    const entitySlug = input.entitySlug ?? input.firmId;
    if (!entitySlug) throw new HttpError(400, "entitySlug is required");
    const rows = await prisma.$queryRaw<Array<{ id: string; entity_type: string; entity_slug: string; updated_at: Date }>>`
      insert into public.watchlists (user_id, entity_type, entity_slug, title, href, notes)
      values (${req.user!.sub}::uuid, ${input.entityType}, ${entitySlug}, ${input.title ?? null}, ${input.href ?? null}, ${input.notes ?? null})
      on conflict (user_id, entity_type, entity_slug)
      do update set
        title = excluded.title,
        href = excluded.href,
        notes = excluded.notes,
        updated_at = now()
      returning id::text, entity_type, entity_slug, updated_at
    `;

    return sendOk(res, { watchlistItem: rows[0] }, 201);
  })
);

alertsRouter.delete(
  "/watchlist/:entityType/:entitySlug",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({
      entityType: z.enum(["prop_firm", "broker", "news", "article"]),
      entitySlug: z.string().min(1)
    }).parse(req.params);
    await prisma.$executeRaw`
      delete from public.watchlists
      where user_id::text = ${req.user!.sub}
        and entity_type = ${params.entityType}
        and entity_slug = ${params.entitySlug}
    `;

    return sendOk(res, { deleted: true });
  })
);

alertsRouter.delete(
  "/watchlist/:firmId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const firmId = String(req.params.firmId);
    await prisma.$executeRaw`
      delete from public.watchlists
      where user_id::text = ${req.user!.sub}
        and entity_type = 'prop_firm'
        and entity_slug = ${firmId}
    `;

    return sendOk(res, { deleted: true });
  })
);
