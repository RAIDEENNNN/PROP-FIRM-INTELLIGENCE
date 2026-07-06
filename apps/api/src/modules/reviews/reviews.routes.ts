import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const reviewsRouter = Router();

reviewsRouter.get(
  "/firm/:firmId",
  asyncHandler(async (req, res) => {
    return sendOk(res, { firmId: req.params.firmId, ...notImplemented("List verified reviews for firm") });
  })
);

reviewsRouter.post(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Submit review with optional payout proof"), 201);
  })
);
