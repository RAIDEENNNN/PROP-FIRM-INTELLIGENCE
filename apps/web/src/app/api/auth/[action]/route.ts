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
        code: "BACKEND_API_NOT_CONFIGURED",
        error: "Backend API is not configured",
        details: "Set API_URL in Netlify environment variables to the deployed Express API base URL. It must include /api, for example: https://your-backend-domain.com/api."
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
