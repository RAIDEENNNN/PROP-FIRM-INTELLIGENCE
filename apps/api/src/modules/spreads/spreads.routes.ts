import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const spreadsRouter = Router();

const recordsQuerySchema = z.object({
  symbol: z.string().optional(),
  firm: z.string().optional(),
  category: z.enum(["FOREX", "CRYPTO", "INDICES", "COMMODITIES", "STOCKS"]).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200)
});

const spreadImportSchema = z.object({
  symbol: z.string().min(3).transform((value) => value.toUpperCase()),
  name: z.string().min(2),
  category: z.enum(["FOREX", "CRYPTO", "INDICES", "COMMODITIES", "STOCKS"]),
  brokerOrFirm: z.string().min(2),
  bid: z.number().optional(),
  ask: z.number().optional(),
  spreadPips: z.number().nonnegative(),
  session: z.enum(["ASIA", "LONDON", "NEW_YORK", "OVERLAP"]).optional()
});

spreadsRouter.get(
  "/instruments",
  asyncHandler(async (_req, res) => {
    const instruments = await prisma.instrument.findMany({
      orderBy: [{ category: "asc" }, { symbol: "asc" }],
      include: { _count: { select: { spreadRecords: true } } }
    });

    return sendOk(res, { instruments });
  })
);

spreadsRouter.get(
  "/records",
  asyncHandler(async (req, res) => {
    const query = recordsQuerySchema.parse(req.query);
    const records = await prisma.spreadRecord.findMany({
      where: {
        brokerOrFirm: query.firm ? { contains: query.firm, mode: "insensitive" } : undefined,
        instrument: {
          symbol: query.symbol ? query.symbol.toUpperCase() : undefined,
          category: query.category
        }
      },
      include: { instrument: true },
      orderBy: { recordedAt: "desc" },
      take: query.limit
    });

    return sendOk(res, { records, count: records.length });
  })
);

spreadsRouter.post(
  "/records",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const input = spreadImportSchema.parse(req.body);
    const instrument = await prisma.instrument.upsert({
      where: { symbol: input.symbol },
      update: {
        name: input.name,
        category: input.category
      },
      create: {
        symbol: input.symbol,
        name: input.name,
        category: input.category
      }
    });

    const record = await prisma.spreadRecord.create({
      data: {
        instrumentId: instrument.id,
        brokerOrFirm: input.brokerOrFirm,
        bid: input.bid,
        ask: input.ask,
        spreadPips: input.spreadPips,
        session: input.session
      },
      include: { instrument: true }
    });

    return sendOk(res, { record }, 201);
  })
);
