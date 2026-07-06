import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const reviewsRouter = Router();

const reviewSchema = z.object({
  firmId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  body: z.string().min(10).max(2000),
  payoutProofUrl: z.string().url().optional()
});

reviewsRouter.get(
  "/firm/:firmId",
  asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
      where: { firmId: req.params.firmId, status: "VERIFIED" },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return sendOk(res, { firmId: req.params.firmId, reviews });
  })
);

reviewsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = reviewSchema.parse(req.body);
    const firm = await prisma.propFirm.findUnique({ where: { id: input.firmId } });
    if (!firm) throw new HttpError(404, "Prop firm not found");

    const review = await prisma.review.create({
      data: {
        userId: req.user!.sub,
        ...input
      }
    });

    return sendOk(res, { review, message: "Review submitted for verification" }, 201);
  })
);

reviewsRouter.patch(
  "/:id/moderate",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const input = z.object({ status: z.enum(["PENDING", "VERIFIED", "REJECTED"]) }).parse(req.body);
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status: input.status }
    });

    return sendOk(res, { review });
  })
);
