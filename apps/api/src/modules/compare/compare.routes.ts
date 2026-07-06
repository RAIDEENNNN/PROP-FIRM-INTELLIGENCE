import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const compareRouter = Router();

compareRouter.post(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Compare any five firms and compute fit/risk scores"));
  })
);

compareRouter.post(
  "/recommendations",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("AI-powered prop firm recommendation ranking"));
  })
);
