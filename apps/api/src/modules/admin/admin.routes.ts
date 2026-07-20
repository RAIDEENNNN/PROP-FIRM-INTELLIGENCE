import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin, requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

const firmSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).max(120),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  officialUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  affiliateUrl: z.string().url().optional(),
  country: z.string().optional(),
  trustScore: z.number().min(0).max(100).default(70),
  confidenceScore: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  payoutFrequency: z.string().optional(),
  editorSummary: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  markets: z.array(z.string()).default([]),
  challengeTypes: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  publicSourceName: z.string().max(160).optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  contentStatus: z.enum(["draft", "under_review", "published", "archived"]).default("draft"),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  featured: z.boolean().default(false)
});

const brokerSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).max(120),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  officialUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  foundedYear: z.number().int().min(1800).max(2100).optional(),
  headquarters: z.string().max(160).optional(),
  countries: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  fundingMethods: z.array(z.string()).default([]),
  withdrawalMethods: z.array(z.string()).default([]),
  minimumDeposit: z.number().nonnegative().optional(),
  trustScore: z.number().min(0).max(100).optional(),
  publicSummary: z.string().max(2000).optional(),
  spreadSummary: z.string().max(500).optional(),
  commissionSummary: z.string().max(500).optional(),
  swapSummary: z.string().max(500).optional(),
  verificationStatus: z.enum(["unverified", "pending_review", "verified", "needs_update"]).default("unverified"),
  publicSourceName: z.string().max(160).optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  contentStatus: z.enum(["draft", "under_review", "published", "archived"]).default("draft")
});

const reportStatusSchema = z.enum(["new", "under_review", "resolved", "rejected", "archived"]);

const reportUpdateSchema = z.object({
  status: reportStatusSchema.optional(),
  assignedAdmin: z.string().uuid().nullable().optional(),
  resolutionNotes: z.string().max(3000).nullable().optional()
});

const contentStatusSchema = z.enum(["draft", "under_review", "published", "archived"]);

const moderationQueueSchema = z.object({
  status: reportStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

const adminListSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  contentStatus: contentStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(value: string | undefined) {
  return value?.replace(/[<>]/g, "").trim() || null;
}

async function recordAuditLog(data: {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  firmId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        firmId: data.firmId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId ?? undefined,
        metadata: data.metadata as Prisma.InputJsonValue | undefined
      }
    });
  } catch {
    // Audit logging must never make an already-authorized content operation fail.
  }
}

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
  "/reports",
  asyncHandler(async (req, res) => {
    const query = moderationQueueSchema.parse(req.query);
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        reporter_user_id: string | null;
        reported_page: string;
        reported_company: string | null;
        category: string;
        explanation: string;
        supporting_url: string | null;
        evidence: string | null;
        status: string;
        assigned_admin: string | null;
        resolution_notes: string | null;
        created_at: Date;
        resolved_at: Date | null;
      }>
    >`
      select
        id::text,
        reporter_user_id::text,
        reported_page,
        reported_company,
        category,
        explanation,
        supporting_url,
        evidence,
        status,
        assigned_admin::text,
        resolution_notes,
        created_at,
        resolved_at
      from public.information_reports
      where (${query.status ?? null}::text is null or status = ${query.status ?? null})
      order by created_at desc
      limit ${query.limit}
      offset ${query.offset}
    `;

    return sendOk(res, {
      reports: rows.map((row) => ({
        id: row.id,
        reporterUserId: row.reporter_user_id,
        reportedPage: row.reported_page,
        reportedCompany: row.reported_company,
        category: row.category,
        explanation: row.explanation,
        supportingUrl: row.supporting_url,
        evidence: row.evidence,
        status: row.status,
        assignedAdmin: row.assigned_admin,
        resolutionNotes: row.resolution_notes,
        createdAt: row.created_at,
        resolvedAt: row.resolved_at
      }))
    });
  })
);

adminRouter.patch(
  "/reports/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const input = reportUpdateSchema.parse(req.body);
    const rows = await prisma.$queryRaw<Array<{ id: string; status: string; resolved_at: Date | null }>>`
      update public.information_reports
      set
        status = coalesce(${input.status ?? null}, status),
        assigned_admin = coalesce(${input.assignedAdmin ?? null}::uuid, assigned_admin, ${req.user!.sub}::uuid),
        resolution_notes = coalesce(${input.resolutionNotes ?? null}, resolution_notes),
        resolved_at = case
          when coalesce(${input.status ?? null}, status) in ('resolved', 'rejected', 'archived') then coalesce(resolved_at, now())
          else resolved_at
        end
      where id = ${params.id}::uuid
      returning id::text, status, resolved_at
    `;

    return sendOk(res, { report: rows[0] ?? null });
  })
);

adminRouter.get(
  "/content-states",
  asyncHandler(async (_req, res) => {
    return sendOk(res, {
      states: contentStatusSchema.options,
      entities: ["prop_firms", "challenges", "rules", "rule_change_history", "reports", "reviews", "brokers", "broker_accounts", "notifications"]
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
    const slug = normalizeSlug(input.slug);
    if (!slug) throw new HttpError(400, "Valid slug required");

    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string; name: string }>>`
      insert into public.prop_firms (
        name,
        slug,
        logo_url,
        website_url,
        official_url,
        source_url,
        country,
        score,
        confidence_score,
        rating,
        review_count,
        payout_frequency,
        summary,
        platforms,
        markets,
        challenge_types,
        tags,
        public_source_name,
        last_verified_at,
        content_status,
        status,
        featured,
        published_at
      )
      values (
        ${cleanText(input.name)},
        ${slug},
        ${input.logoUrl ?? null},
        ${input.websiteUrl ?? input.officialUrl ?? null},
        ${input.officialUrl ?? input.websiteUrl ?? null},
        ${input.sourceUrl ?? null},
        ${cleanText(input.country)},
        ${input.trustScore},
        ${input.confidenceScore ?? input.trustScore},
        ${input.rating},
        ${input.reviewCount},
        ${cleanText(input.payoutFrequency)},
        ${cleanText(input.editorSummary)},
        ${input.platforms},
        ${input.markets},
        ${input.challengeTypes},
        ${input.tags},
        ${cleanText(input.publicSourceName)},
        ${input.lastVerifiedAt ? new Date(input.lastVerifiedAt) : null},
        ${input.contentStatus}::public.content_status,
        ${input.status},
        ${input.featured},
        case when ${input.contentStatus}::public.content_status = 'published' then now() else null end
      )
      on conflict (slug)
      do update set
        name = excluded.name,
        logo_url = excluded.logo_url,
        website_url = excluded.website_url,
        official_url = excluded.official_url,
        source_url = excluded.source_url,
        country = excluded.country,
        score = excluded.score,
        confidence_score = excluded.confidence_score,
        rating = excluded.rating,
        review_count = excluded.review_count,
        payout_frequency = excluded.payout_frequency,
        summary = excluded.summary,
        platforms = excluded.platforms,
        markets = excluded.markets,
        challenge_types = excluded.challenge_types,
        tags = excluded.tags,
        public_source_name = excluded.public_source_name,
        last_verified_at = excluded.last_verified_at,
        content_status = excluded.content_status,
        status = excluded.status,
        featured = excluded.featured,
        published_at = case when excluded.content_status = 'published' then coalesce(public.prop_firms.published_at, now()) else public.prop_firms.published_at end,
        updated_at = now()
      returning id::text, slug, name
    `;

    await recordAuditLog({
      actorUserId: req.user!.sub,
      action: "UPSERT_FIRM",
      entityType: "prop_firms",
      entityId: rows[0]?.id,
      metadata: { slug }
    });

    return sendOk(res, { firm: rows[0] }, 201);
  })
);

adminRouter.get(
  "/firms",
  asyncHandler(async (req, res) => {
    const query = adminListSchema.parse(req.query);
    const search = query.q ? `%${query.q}%` : null;
    const rows = await prisma.$queryRaw`
      select id::text, name, slug, status, content_status::text, score, rating, featured, public_source_name, last_verified_at, updated_at
      from public.prop_firms
      where (${search}::text is null or name ilike ${search} or slug ilike ${search})
        and (${query.status ?? null}::text is null or status = ${query.status ?? null})
        and (${query.contentStatus ?? null}::text is null or content_status::text = ${query.contentStatus ?? null})
      order by updated_at desc
      limit ${query.limit}
      offset ${query.offset}
    `;

    return sendOk(res, { firms: rows, limit: query.limit, offset: query.offset });
  })
);

adminRouter.patch(
  "/firms/:slug/publication",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ slug: z.string().min(1) }).parse(req.params);
    const input = z.object({ contentStatus: contentStatusSchema, status: z.enum(["active", "inactive", "archived"]).optional() }).parse(req.body);
    const slug = normalizeSlug(params.slug);
    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string; content_status: string; status: string }>>`
      update public.prop_firms
      set
        content_status = ${input.contentStatus}::public.content_status,
        status = coalesce(${input.status ?? null}, status),
        published_at = case when ${input.contentStatus}::public.content_status = 'published' then coalesce(published_at, now()) else published_at end,
        updated_at = now()
      where slug = ${slug}
      returning id::text, slug, content_status::text, status
    `;
    if (!rows[0]) throw new HttpError(404, "Prop firm not found");

    await recordAuditLog({
      actorUserId: req.user!.sub,
      action: "UPDATE_FIRM_PUBLICATION",
      entityType: "prop_firms",
      entityId: rows[0].id,
      metadata: { slug, contentStatus: input.contentStatus, status: input.status }
    });

    return sendOk(res, { firm: rows[0] });
  })
);

adminRouter.delete(
  "/firms/:slug",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ slug: z.string().min(1) }).parse(req.params);
    const slug = normalizeSlug(params.slug);
    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string }>>`
      update public.prop_firms
      set status = 'archived', content_status = 'archived', updated_at = now()
      where slug = ${slug}
      returning id::text, slug
    `;
    if (!rows[0]) throw new HttpError(404, "Prop firm not found");

    await recordAuditLog({
      actorUserId: req.user!.sub,
      action: "ARCHIVE_FIRM",
      entityType: "prop_firms",
      entityId: rows[0].id,
      metadata: { slug }
    });

    return sendOk(res, { archived: true, firm: rows[0] });
  })
);

adminRouter.get(
  "/brokers",
  asyncHandler(async (req, res) => {
    const query = adminListSchema.parse(req.query);
    const search = query.q ? `%${query.q}%` : null;
    const rows = await prisma.$queryRaw`
      select id::text, name, slug, content_status::text, trust_score, verification_status, public_source_name, last_verified_at, updated_at
      from public.brokers
      where (${search}::text is null or name ilike ${search} or slug ilike ${search})
        and (${query.contentStatus ?? null}::text is null or content_status::text = ${query.contentStatus ?? null})
      order by updated_at desc
      limit ${query.limit}
      offset ${query.offset}
    `;

    return sendOk(res, { brokers: rows, limit: query.limit, offset: query.offset });
  })
);

adminRouter.post(
  "/brokers",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = brokerSchema.parse(req.body);
    const slug = normalizeSlug(input.slug);
    if (!slug) throw new HttpError(400, "Valid slug required");

    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string; name: string }>>`
      insert into public.brokers (
        name,
        slug,
        logo_url,
        website_url,
        official_url,
        source_url,
        founded_year,
        headquarters,
        countries,
        platforms,
        funding_methods,
        withdrawal_methods,
        minimum_deposit,
        trust_score,
        public_summary,
        spread_summary,
        commission_summary,
        swap_summary,
        verification_status,
        public_source_name,
        last_verified_at,
        content_status,
        published_at
      )
      values (
        ${cleanText(input.name)},
        ${slug},
        ${input.logoUrl ?? null},
        ${input.websiteUrl ?? input.officialUrl ?? null},
        ${input.officialUrl ?? input.websiteUrl ?? null},
        ${input.sourceUrl ?? null},
        ${input.foundedYear ?? null},
        ${cleanText(input.headquarters)},
        ${input.countries},
        ${input.platforms},
        ${input.fundingMethods},
        ${input.withdrawalMethods},
        ${input.minimumDeposit ?? null},
        ${input.trustScore ?? null},
        ${cleanText(input.publicSummary)},
        ${cleanText(input.spreadSummary)},
        ${cleanText(input.commissionSummary)},
        ${cleanText(input.swapSummary)},
        ${input.verificationStatus},
        ${cleanText(input.publicSourceName)},
        ${input.lastVerifiedAt ? new Date(input.lastVerifiedAt) : null},
        ${input.contentStatus}::public.content_status,
        case when ${input.contentStatus}::public.content_status = 'published' then now() else null end
      )
      on conflict (slug)
      do update set
        name = excluded.name,
        logo_url = excluded.logo_url,
        website_url = excluded.website_url,
        official_url = excluded.official_url,
        source_url = excluded.source_url,
        founded_year = excluded.founded_year,
        headquarters = excluded.headquarters,
        countries = excluded.countries,
        platforms = excluded.platforms,
        funding_methods = excluded.funding_methods,
        withdrawal_methods = excluded.withdrawal_methods,
        minimum_deposit = excluded.minimum_deposit,
        trust_score = excluded.trust_score,
        public_summary = excluded.public_summary,
        spread_summary = excluded.spread_summary,
        commission_summary = excluded.commission_summary,
        swap_summary = excluded.swap_summary,
        verification_status = excluded.verification_status,
        public_source_name = excluded.public_source_name,
        last_verified_at = excluded.last_verified_at,
        content_status = excluded.content_status,
        published_at = case when excluded.content_status = 'published' then coalesce(public.brokers.published_at, now()) else public.brokers.published_at end,
        updated_at = now()
      returning id::text, slug, name
    `;

    await recordAuditLog({
      actorUserId: req.user!.sub,
      action: "UPSERT_BROKER",
      entityType: "brokers",
      entityId: rows[0]?.id,
      metadata: { slug }
    });

    return sendOk(res, { broker: rows[0] }, 201);
  })
);

adminRouter.patch(
  "/brokers/:slug/publication",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ slug: z.string().min(1) }).parse(req.params);
    const input = z.object({ contentStatus: contentStatusSchema }).parse(req.body);
    const slug = normalizeSlug(params.slug);
    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string; content_status: string }>>`
      update public.brokers
      set
        content_status = ${input.contentStatus}::public.content_status,
        published_at = case when ${input.contentStatus}::public.content_status = 'published' then coalesce(published_at, now()) else published_at end,
        updated_at = now()
      where slug = ${slug}
      returning id::text, slug, content_status::text
    `;
    if (!rows[0]) throw new HttpError(404, "Broker not found");

    await recordAuditLog({
      actorUserId: req.user!.sub,
      action: "UPDATE_BROKER_PUBLICATION",
      entityType: "brokers",
      entityId: rows[0].id,
      metadata: { slug, contentStatus: input.contentStatus }
    });

    return sendOk(res, { broker: rows[0] });
  })
);

adminRouter.delete(
  "/brokers/:slug",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = z.object({ slug: z.string().min(1) }).parse(req.params);
    const slug = normalizeSlug(params.slug);
    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string }>>`
      update public.brokers
      set content_status = 'archived', updated_at = now()
      where slug = ${slug}
      returning id::text, slug
    `;
    if (!rows[0]) throw new HttpError(404, "Broker not found");

    await recordAuditLog({
      actorUserId: req.user!.sub,
      action: "ARCHIVE_BROKER",
      entityType: "brokers",
      entityId: rows[0].id,
      metadata: { slug }
    });

    return sendOk(res, { archived: true, broker: rows[0] });
  })
);
