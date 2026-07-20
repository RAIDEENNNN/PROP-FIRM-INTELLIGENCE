import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const persistenceRouter = Router();

persistenceRouter.use(requireAuth);

const entityTypeSchema = z.enum(["prop_firm", "broker", "news", "article", "page"]);

const bookmarkSchema = z.object({
  entityType: entityTypeSchema.exclude(["page"]),
  entitySlug: z.string().min(1).max(160),
  title: z.string().min(1).max(180),
  href: z.string().min(1).max(300)
});

const recentlyViewedSchema = z.object({
  entityType: entityTypeSchema,
  entitySlug: z.string().max(160).optional(),
  title: z.string().min(1).max(180),
  href: z.string().min(1).max(300)
});

const reportSchema = z.object({
  reportedPage: z.string().min(1).max(300),
  reportedCompany: z.string().max(180).optional(),
  category: z.enum(["prop_firm", "broker", "spread", "rule", "payout", "review", "availability", "other"]),
  explanation: z.string().min(10).max(3000),
  supportingUrl: z.string().url().max(500).optional().or(z.literal("")),
  evidence: z.string().max(3000).optional()
});

const savedComparisonSchema = z.object({
  name: z.string().min(1).max(120),
  comparisonType: z.enum(["prop_firm", "broker", "mixed"]).default("prop_firm"),
  entitySlugs: z.array(z.string().min(1).max(160)).min(1).max(12),
  notes: z.string().max(1000).optional(),
  filters: z.record(z.unknown()).optional()
});

function cleanText(value: string | undefined) {
  return value?.replace(/[<>]/g, "").trim() || null;
}

persistenceRouter.get(
  "/bookmarks",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const rows = await prisma.$queryRaw<
      Array<{ entity_type: string; entity_slug: string; title: string; href: string; created_at: Date }>
    >`
      select entity_type, entity_slug, title, href, created_at
      from public.bookmarks
      where user_id::text = ${req.user!.sub}
      order by created_at desc
      limit 100
    `;

    return sendOk(res, {
      bookmarks: rows.map((row) => ({
        entityType: row.entity_type,
        entitySlug: row.entity_slug,
        title: row.title,
        href: row.href,
        createdAt: row.created_at
      }))
    });
  })
);

persistenceRouter.post(
  "/bookmarks",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = bookmarkSchema.parse(req.body);
    await prisma.$executeRaw`
      insert into public.bookmarks (user_id, entity_type, entity_slug, title, href)
      values (${req.user!.sub}::uuid, ${input.entityType}, ${input.entitySlug}, ${cleanText(input.title)}, ${input.href})
      on conflict (user_id, entity_type, entity_slug)
      do update set title = excluded.title, href = excluded.href, created_at = now()
    `;

    return sendOk(res, { saved: true }, 201);
  })
);

persistenceRouter.delete(
  "/bookmarks/:entityType/:entitySlug",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ entityType: bookmarkSchema.shape.entityType, entitySlug: z.string().min(1) }).parse(req.params);
    await prisma.$executeRaw`
      delete from public.bookmarks
      where user_id::text = ${req.user!.sub}
        and entity_type = ${params.entityType}
        and entity_slug = ${params.entitySlug}
    `;

    return sendOk(res, { removed: true });
  })
);

persistenceRouter.get(
  "/recently-viewed",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const rows = await prisma.$queryRaw<
      Array<{ entity_type: string; entity_slug: string | null; title: string; href: string; viewed_at: Date }>
    >`
      select entity_type, entity_slug, title, href, viewed_at
      from public.recently_viewed
      where user_id::text = ${req.user!.sub}
      order by viewed_at desc
      limit 20
    `;

    return sendOk(res, {
      items: rows.map((row) => ({
        entityType: row.entity_type,
        entitySlug: row.entity_slug,
        title: row.title,
        href: row.href,
        viewedAt: row.viewed_at
      }))
    });
  })
);

persistenceRouter.post(
  "/recently-viewed",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = recentlyViewedSchema.parse(req.body);
    await prisma.$executeRaw`
      insert into public.recently_viewed (user_id, entity_type, entity_slug, title, href)
      values (${req.user!.sub}::uuid, ${input.entityType}, ${input.entitySlug ?? null}, ${cleanText(input.title)}, ${input.href})
      on conflict (user_id, href)
      do update set entity_type = excluded.entity_type, entity_slug = excluded.entity_slug, title = excluded.title, viewed_at = now()
    `;

    return sendOk(res, { saved: true }, 201);
  })
);

persistenceRouter.get(
  "/notifications",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const rows = await prisma.$queryRaw<
      Array<{ id: string; title: string; message: string; notification_type: string; href: string | null; read_at: Date | null; created_at: Date }>
    >`
      select id::text, title, message, notification_type, href, read_at, created_at
      from public.notifications
      where user_id::text = ${req.user!.sub}
      order by created_at desc
      limit 50
    `;

    return sendOk(res, {
      notifications: rows.map((row) => ({
        id: row.id,
        title: row.title,
        message: row.message,
        type: row.notification_type,
        href: row.href,
        readAt: row.read_at,
        createdAt: row.created_at
      }))
    });
  })
);

persistenceRouter.patch(
  "/notifications/:id/read",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    await prisma.$executeRaw`
      update public.notifications
      set read_at = coalesce(read_at, now())
      where id = ${params.id}::uuid and user_id::text = ${req.user!.sub}
    `;

    return sendOk(res, { read: true });
  })
);

persistenceRouter.post(
  "/information-reports",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = reportSchema.parse(req.body);
    const rows = await prisma.$queryRaw<Array<{ id: string; created_at: Date }>>`
      insert into public.information_reports (
        reporter_user_id,
        reported_page,
        reported_company,
        category,
        explanation,
        supporting_url,
        evidence
      )
      values (
        ${req.user!.sub}::uuid,
        ${input.reportedPage},
        ${cleanText(input.reportedCompany)},
        ${input.category},
        ${cleanText(input.explanation)},
        ${input.supportingUrl || null},
        ${cleanText(input.evidence)}
      )
      returning id::text, created_at
    `;

    return sendOk(res, {
      report: {
        id: rows[0]?.id,
        status: "new",
        createdAt: rows[0]?.created_at
      }
    }, 201);
  })
);

persistenceRouter.get(
  "/saved-comparisons",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        comparison_type: string;
        entity_slugs: string[];
        notes: string | null;
        filters: unknown;
        created_at: Date;
        updated_at: Date;
      }>
    >`
      select id::text, name, comparison_type, entity_slugs, notes, filters, created_at, updated_at
      from public.saved_comparisons
      where user_id::text = ${req.user!.sub}
      order by updated_at desc
      limit 100
    `;

    return sendOk(res, {
      savedComparisons: rows.map((row) => ({
        id: row.id,
        name: row.name,
        comparisonType: row.comparison_type,
        entitySlugs: row.entity_slugs,
        notes: row.notes,
        filters: row.filters,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    });
  })
);

persistenceRouter.post(
  "/saved-comparisons",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = savedComparisonSchema.parse(req.body);
    const rows = await prisma.$queryRaw<Array<{ id: string; updated_at: Date }>>`
      insert into public.saved_comparisons (
        user_id,
        name,
        comparison_type,
        entity_slugs,
        notes,
        filters
      )
      values (
        ${req.user!.sub}::uuid,
        ${cleanText(input.name)},
        ${input.comparisonType},
        ${input.entitySlugs},
        ${cleanText(input.notes)},
        ${(input.filters ?? {}) as any}::jsonb
      )
      on conflict (user_id, name)
      do update set
        comparison_type = excluded.comparison_type,
        entity_slugs = excluded.entity_slugs,
        notes = excluded.notes,
        filters = excluded.filters,
        updated_at = now()
      returning id::text, updated_at
    `;

    return sendOk(res, { saved: true, id: rows[0]?.id, updatedAt: rows[0]?.updated_at }, 201);
  })
);

persistenceRouter.delete(
  "/saved-comparisons/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    await prisma.$executeRaw`
      delete from public.saved_comparisons
      where id = ${params.id}::uuid and user_id::text = ${req.user!.sub}
    `;

    return sendOk(res, { removed: true });
  })
);
