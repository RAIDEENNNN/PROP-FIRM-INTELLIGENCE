import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const billingRouter = Router();

billingRouter.post(
  "/checkout",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Create Stripe checkout session for Pro plan"));
  })
);

billingRouter.post(
  "/portal",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Create Stripe billing portal session"));
  })
);

billingRouter.post(
  "/webhook",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Handle Stripe subscription webhooks"));
  })
);
