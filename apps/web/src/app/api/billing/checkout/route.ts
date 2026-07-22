import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type CheckoutBody = {
  plan?: string;
};

const plans = {
  pro: {
    name: "FundedScope Pro",
    amount: 1900
  },
  elite: {
    name: "FundedScope Elite",
    amount: 4999
  }
};

function getOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({ ok: false, error: "Checkout is not configured yet." }, { status: 503 });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ ok: false, error: "Account verification is temporarily unavailable." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as CheckoutBody;
  const planKey = typeof body.plan === "string" ? body.plan.trim().toLowerCase() : "";
  const plan = plans[planKey as keyof typeof plans];

  if (!plan) {
    return NextResponse.json({ ok: false, error: "Choose a valid subscription plan." }, { status: 400 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Please sign in before subscribing." }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) {
    return NextResponse.json({ ok: false, error: "Please sign in again before subscribing." }, { status: 401 });
  }

  const origin = getOrigin(request);
  const params = new URLSearchParams({
    mode: "subscription",
    success_url: `${origin}/dashboard?checkout=success&plan=${planKey}`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    customer_email: data.user.email
  });

  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", "usd");
  params.append("line_items[0][price_data][unit_amount]", String(plan.amount));
  params.append("line_items[0][price_data][recurring][interval]", "month");
  params.append("line_items[0][price_data][product_data][name]", plan.name);
  params.append("metadata[user_id]", data.user.id);
  params.append("metadata[plan]", planKey);
  params.append("subscription_data[metadata][user_id]", data.user.id);
  params.append("subscription_data[metadata][plan]", planKey);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${stripeSecretKey}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };

  if (!response.ok || !payload.url) {
    return NextResponse.json({ ok: false, error: "Checkout could not be started. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, checkoutUrl: payload.url });
}
