import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedActions = new Set(["sign-up", "sign-in", "refresh", "logout", "forgot-password", "reset-password", "verify-email"]);

export async function POST(request: Request, { params }: { params: { action: string } }) {
  if (!allowedActions.has(params.action)) {
    return NextResponse.json({ ok: false, error: "Unknown auth action" }, { status: 404 });
  }

  const apiBase = process.env.API_URL?.replace(/\/$/, "");
  if (!apiBase) {
    return NextResponse.json(
      {
        ok: false,
        code: "ACCOUNT_SERVICE_UNAVAILABLE",
        error: "Account services are temporarily unavailable.",
        details: "Please try again shortly or contact FundedScope support if the issue continues."
      },
      { status: 503 }
    );
  }

  const response = await fetch(`${apiBase}/auth/${params.action}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: await request.text(),
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({ ok: false, error: "Invalid API response" }));
  return NextResponse.json(payload, { status: response.status });
}
