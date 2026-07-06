import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const spreadsRouter = Router();

spreadsRouter.get(
  "/instruments",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Return tradable symbols for spread intelligence"));
  })
);

spreadsRouter.get(
  "/records",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Return spread records by symbol, session and firm"));
  })
);

spreadsRouter.post(
  "/records",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Admin/manual import spread snapshots"), 201);
  })
);
