import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const traderProfileRouter = Router();

traderProfileRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Load trader profile and recommendation inputs"));
  })
);

traderProfileRouter.put(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Create or update onboarding trader profile"));
  })
);
