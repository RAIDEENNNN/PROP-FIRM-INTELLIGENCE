import { Router } from "express";
import { z } from "zod";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const authRouter = Router();

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  name: z.string().min(2).optional()
});

authRouter.post(
  "/sign-up",
  asyncHandler(async (req, res) => {
    const input = signUpSchema.parse(req.body);
    return sendOk(res, { input, ...notImplemented("Create account, hash password, issue JWTs") }, 201);
  })
);

authRouter.post(
  "/sign-in",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Validate credentials and create access/refresh token pair"));
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Rotate refresh token"));
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Send password reset email"));
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Reset password with one-time token"));
  })
);

authRouter.post(
  "/verify-email",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Verify email address"));
  })
);
