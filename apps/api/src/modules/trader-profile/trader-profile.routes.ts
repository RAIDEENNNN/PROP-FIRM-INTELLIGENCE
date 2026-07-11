import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const traderProfileRouter = Router();

const traderProfileSchema = z.object({
  username: z.string().min(2).max(40).nullable().optional(),
  country: z.string().max(80).nullable().optional(),
  timezone: z.string().max(80).nullable().optional(),
  profilePictureUrl: z.string().url().nullable().optional(),
  traderType: z.string().max(40).nullable().optional(),
  experienceLevel: z.string().max(80).nullable().optional(),
  strategy: z.string().max(120).nullable().optional(),
  preferredMarkets: z.array(z.string()).default([]),
  brokers: z.array(z.string()).default([]),
  propFirms: z.array(z.string()).default([]),
  liveAccountSize: z.number().int().nonnegative().nullable().optional(),
  propAccountSize: z.number().int().nonnegative().nullable().optional(),
  challengeSize: z.number().int().nonnegative().nullable().optional(),
  tradingStyle: z.string().max(80).nullable().optional(),
  goals: z.array(z.string()).default([]),
  targetMonthlyPercent: z.number().nonnegative().nullable().optional(),
  targetMonthlyProfit: z.number().nonnegative().nullable().optional(),
  targetWinRate: z.number().min(0).max(100).nullable().optional(),
  maxDailyDrawdown: z.number().nonnegative().nullable().optional(),
  maxTotalDrawdown: z.number().nonnegative().nullable().optional(),
  preferredAccountSize: z.number().int().positive().nullable().optional(),
  sessions: z.array(z.string()).default([]),
  favoriteAssets: z.array(z.string()).default([]),
  yearsExperience: z.number().nonnegative().nullable().optional(),
  propChallenges: z.number().int().nonnegative().nullable().optional(),
  fundedBefore: z.boolean().optional(),
  largestAccount: z.number().int().nonnegative().nullable().optional(),
  psychologyWeaknesses: z.array(z.string()).default([]),
  personality: z.record(z.coerce.number()).nullable().optional(),
  preferences: z.record(z.union([z.string(), z.boolean(), z.array(z.string())])).nullable().optional(),
  connectedAccounts: z.record(z.union([z.string(), z.boolean()])).nullable().optional(),
  performance: z.record(z.union([z.number(), z.string(), z.boolean()])).nullable().optional(),
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
    const data = {
      ...input,
      personality: input.personality == null ? undefined : (input.personality as Prisma.InputJsonValue),
      preferences: input.preferences == null ? undefined : (input.preferences as Prisma.InputJsonValue),
      connectedAccounts: input.connectedAccounts == null ? undefined : (input.connectedAccounts as Prisma.InputJsonValue),
      performance: input.performance == null ? undefined : (input.performance as Prisma.InputJsonValue)
    };
    const profile = await prisma.traderProfile.upsert({
      where: { userId: req.user!.sub },
      update: data,
      create: {
        userId: req.user!.sub,
        ...data
      }
    });

    return sendOk(res, { profile });
  })
);
