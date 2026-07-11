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
