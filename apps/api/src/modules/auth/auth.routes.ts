import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { publicUser, signAccessToken, signRefreshToken, type TokenPayload } from "../../shared/auth";
import { env } from "../../shared/env";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const authRouter = Router();

const signUpSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(10),
  name: z.string().min(2).max(80).optional()
});

const signInSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

function issueTokens(user: { id: string; email: string; role: string }) {
  const payload: TokenPayload = { sub: user.id, email: user.email, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
}

authRouter.post(
  "/sign-up",
  asyncHandler(async (req, res) => {
    const input = signUpSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new HttpError(409, "An account with this email already exists");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        traderProfile: {
          create: {
            preferredMarkets: []
          }
        }
      }
    });

    const tokens = issueTokens(user);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 12),
        lastLoginAt: new Date()
      }
    });

    return sendOk(res, { user: publicUser(user), ...tokens }, 201);
  })
);

authRouter.post(
  "/sign-in",
  asyncHandler(async (req, res) => {
    const input = signInSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new HttpError(401, "Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new HttpError(401, "Invalid email or password");

    const tokens = issueTokens(user);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 12),
        lastLoginAt: new Date()
      }
    });

    return sendOk(res, { user: publicUser(user), ...tokens });
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    let payload: TokenPayload;

    try {
      payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;
    } catch {
      throw new HttpError(401, "Invalid refresh token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) throw new HttpError(401, "Refresh session not found");

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new HttpError(401, "Refresh token has been rotated");

    const tokens = issueTokens(user);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 12)
      }
    });

    return sendOk(res, { user: publicUser(user), ...tokens });
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;
      await prisma.user.update({
        where: { id: payload.sub },
        data: { refreshTokenHash: null }
      });
    } catch {
      // Idempotent logout: invalid/expired refresh tokens are already logged out.
    }

    return sendOk(res, { loggedOut: true });
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (_req, res) => {
    return sendOk(res, {
      accepted: true,
      message: "Password reset email provider is ready to connect. Add SMTP/transactional email credentials before production use."
    });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (_req, res) => {
    return sendOk(res, {
      accepted: false,
      message: "Password reset token storage must be enabled before this endpoint can reset passwords."
    });
  })
);

authRouter.post(
  "/verify-email",
  asyncHandler(async (_req, res) => {
    return sendOk(res, {
      accepted: true,
      message: "Email verification flow is scaffolded. Add an email provider to send signed verification links."
    });
  })
);
