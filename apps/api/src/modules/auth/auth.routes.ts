import { Router } from "express";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";

export const authRouter = Router();

function supabaseAuthOnly() {
  throw new HttpError(
    410,
    "Password authentication is handled by Supabase Auth. Use the frontend Supabase client for sign up, sign in, password reset and logout."
  );
}

authRouter.post(
  "/sign-up",
  asyncHandler(async () => {
    supabaseAuthOnly();
  })
);

authRouter.post(
  "/sign-in",
  asyncHandler(async () => {
    supabaseAuthOnly();
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async () => {
    supabaseAuthOnly();
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    return sendOk(res, {
      loggedOut: true,
      message: "Clear the Supabase browser session with supabase.auth.signOut()."
    });
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async () => {
    supabaseAuthOnly();
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async () => {
    supabaseAuthOnly();
  })
);

authRouter.post(
  "/verify-email",
  asyncHandler(async () => {
    supabaseAuthOnly();
  })
);
