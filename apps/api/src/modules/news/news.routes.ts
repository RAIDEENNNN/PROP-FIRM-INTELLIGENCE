import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const newsRouter = Router();

newsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Return live prop firm news radar feed"));
  })
);

newsRouter.post(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Admin/manual create news event"), 201);
  })
);
