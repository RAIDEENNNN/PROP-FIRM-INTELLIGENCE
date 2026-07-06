import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const alertsRouter = Router();

alertsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("List saved alerts for current user"));
  })
);

alertsRouter.post(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Create rule, spread, news or payout alert"), 201);
  })
);

alertsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    return sendOk(res, { id: req.params.id, ...notImplemented("Update alert settings") });
  })
);
