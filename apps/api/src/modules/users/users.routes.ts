import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const usersRouter = Router();

usersRouter.get(
  "/me",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Return authenticated user profile"));
  })
);

usersRouter.patch(
  "/me",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Update authenticated user profile"));
  })
);
