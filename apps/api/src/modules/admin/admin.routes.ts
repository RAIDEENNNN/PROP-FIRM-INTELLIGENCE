import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const adminRouter = Router();

adminRouter.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Admin KPIs for users, firms, revenue, alerts and reviews"));
  })
);

adminRouter.get(
  "/audit-logs",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Paginated audit log feed"));
  })
);

adminRouter.post(
  "/firms",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Create prop firm with accounts and rules"), 201);
  })
);
