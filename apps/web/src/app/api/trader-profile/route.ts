import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function proxy(request: Request, method: "GET" | "PUT") {
  const apiBase = process.env.API_URL?.replace(/\/$/, "");
  if (!apiBase) {
    return NextResponse.json(
      {
        ok: false,
        code: "BACKEND_API_NOT_CONFIGURED",
        error: "Backend API is not configured",
        details: "Set API_URL in Netlify environment variables to the deployed Express API base URL. It must include /api so profiles can be stored in the database."
      },
      { status: 503 }
    );
  }

  const response = await fetch(`${apiBase}/trader-profile`, {
    method,
    headers: {
      "content-type": "application/json",
      authorization: request.headers.get("authorization") ?? ""
    },
    body: method === "PUT" ? await request.text() : undefined,
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({ ok: false, error: "Invalid API response" }));
  return NextResponse.json(payload, { status: response.status });
}

export async function GET(request: Request) {
  return proxy(request, "GET");
}

export async function PUT(request: Request) {
  return proxy(request, "PUT");
}
