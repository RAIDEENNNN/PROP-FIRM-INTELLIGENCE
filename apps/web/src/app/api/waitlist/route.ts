import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type WaitlistBody = {
  email?: string;
  plan?: string;
  source?: string;
  consent?: boolean;
};

const allowedPlans = new Set(["free", "pro", "elite", "newsletter"]);

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function normalizePlan(plan: unknown) {
  const value = typeof plan === "string" ? plan.trim().toLowerCase() : "newsletter";
  return allowedPlans.has(value) ? value : "newsletter";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as WaitlistBody;
  const email = normalizeEmail(body.email);
  const plan = normalizePlan(body.plan);
  const source = typeof body.source === "string" && body.source.trim() ? body.source.trim().slice(0, 120) : "website";
  const hasConsent = body.consent !== false;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (!hasConsent) {
    return NextResponse.json({ ok: false, error: "Please confirm you want to receive FundedScope updates." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { error } = await supabase.from("information_reports").insert({
    reported_page: source,
    reported_company: "FundedScope",
    category: `waitlist:${plan}`,
    explanation: `User requested FundedScope ${plan} updates.`,
    evidence: JSON.stringify({ email, plan, source, consent: hasConsent }),
    status: "new"
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "We could not save this yet. Please try again." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, persisted: true });
}
