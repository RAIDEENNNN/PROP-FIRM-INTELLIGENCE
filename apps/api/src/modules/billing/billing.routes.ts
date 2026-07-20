import { Router } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { env } from "../../shared/env";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const billingRouter = Router();

const checkoutSchema = z.object({
  priceId: z.string().min(3),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

function stripeClient() {
  if (!env.STRIPE_SECRET_KEY) throw new HttpError(503, "Stripe is not configured. Add STRIPE_SECRET_KEY.");
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
}

billingRouter.post(
  "/checkout",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = checkoutSchema.parse(req.body);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } });
    const customerEmail = user.email ?? req.user!.email;
    const stripe = stripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: customerEmail,
      line_items: [{ price: input.priceId, quantity: 1 }],
      success_url: input.successUrl ?? `${env.FRONTEND_URL}/dashboard?checkout=success`,
      cancel_url: input.cancelUrl ?? `${env.FRONTEND_URL}/pricing?checkout=cancelled`,
      metadata: { userId: user.id }
    });

    return sendOk(res, { checkoutUrl: session.url, sessionId: session.id });
  })
);

billingRouter.post(
  "/portal",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const stripe = stripeClient();
    const subscription = await prisma.subscription.findFirst({
      where: { userId: req.user!.sub, stripeCustomerId: { not: null } },
      orderBy: { createdAt: "desc" }
    });

    if (!subscription?.stripeCustomerId) throw new HttpError(404, "No Stripe customer found for this user");

    const portal = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${env.FRONTEND_URL}/settings`
    });

    return sendOk(res, { portalUrl: portal.url });
  })
);

billingRouter.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new HttpError(503, "Stripe webhook secret is not configured");
    }

    return sendOk(res, {
      received: true,
      message: "Webhook endpoint is present. Configure raw-body handling at deployment edge before enabling signature verification."
    });
  })
);
