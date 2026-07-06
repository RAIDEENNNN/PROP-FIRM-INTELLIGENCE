import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const traderProfileRouter = Router();

const traderProfileSchema = z.object({
  experienceLevel: z.string().max(80).nullable().optional(),
  strategy: z.string().max(120).nullable().optional(),
  preferredMarkets: z.array(z.string()).default([]),
  preferredAccountSize: z.number().int().positive().nullable().optional(),
  riskTolerance: z.enum(["LOW", "MEDIUM", "HIGH", "EXTREME"]).optional(),
  payoutPriority: z.boolean().optional(),
  swingTrading: z.boolean().optional(),
  newsTrading: z.boolean().optional(),
  eaTrading: z.boolean().optional()
});

traderProfileRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const profile = await prisma.traderProfile.findUnique({
      where: { userId: req.user!.sub }
    });

    return sendOk(res, { profile });
  })
);

traderProfileRouter.put(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = traderProfileSchema.parse(req.body);
    const profile = await prisma.traderProfile.upsert({
      where: { userId: req.user!.sub },
      update: input,
      create: {
        userId: req.user!.sub,
        ...input
      }
    });

    return sendOk(res, { profile });
  })
);
