import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const newsRouter = Router();

const newsSchema = z.object({
  title: z.string().min(4),
  summary: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  affectedFirms: z.array(z.string()).default([]),
  affectedSymbols: z.array(z.string()).default([]),
  impactLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  publishedAt: z.coerce.date().default(() => new Date())
});

newsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const news = await prisma.newsEvent.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit
    });

    return sendOk(res, { news });
  })
);

newsRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const input = newsSchema.parse(req.body);
    const news = await prisma.newsEvent.create({ data: input });
    return sendOk(res, { news }, 201);
  })
);
