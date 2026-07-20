import { Router } from "express";
import { z } from "zod";
import { publicUser, requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const usersRouter = Router();

const updateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  avatarUrl: z.string().url().nullable().optional()
});

usersRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub }
    });
    const [watchlist, alerts, subscriptions] = await Promise.all([
      prisma.$queryRaw`
        select id::text, entity_type, entity_slug, title, href, notes, created_at, updated_at
        from public.watchlists
        where user_id::text = ${req.user!.sub}
        order by created_at desc
        limit 100
      `,
      prisma.alert.findMany({ where: { userId: req.user!.sub }, orderBy: { createdAt: "desc" } }).catch(() => []),
      prisma.subscription.findMany({ where: { userId: req.user!.sub }, orderBy: { createdAt: "desc" } }).catch(() => [])
    ]);

    return sendOk(res, {
      user: publicUser(user),
      traderProfile: user,
      watchlist,
      alerts,
      subscriptions
    });
  })
);

usersRouter.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = updateUserSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: input
    });

    return sendOk(res, { user: publicUser(user) });
  })
);
