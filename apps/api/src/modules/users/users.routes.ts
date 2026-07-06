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
      where: { id: req.user!.sub },
      include: {
        traderProfile: true,
        watchlists: { include: { firm: true } },
        alerts: true,
        subscriptions: true
      }
    });

    return sendOk(res, {
      user: publicUser(user),
      traderProfile: user.traderProfile,
      watchlist: user.watchlists,
      alerts: user.alerts,
      subscriptions: user.subscriptions
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
