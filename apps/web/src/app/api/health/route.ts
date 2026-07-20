import { NextResponse } from "next/server";
import { getServerApiBase } from "../../../lib/api-base";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiBase = getServerApiBase();
  if (!apiBase) {
    return NextResponse.json(
      {
        ok: false,
        code: "BACKEND_API_NOT_CONFIGURED",
        error: "NEXT_PUBLIC_API_URL or API_URL is not configured for this deployment."
      },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${apiBase}/health`, {
      headers: { accept: "application/json" },
      cache: "no-store"
    });
    const payload = await response.json().catch(() => ({ ok: false, error: "Invalid API response" }));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "BACKEND_API_UNREACHABLE",
        error: "Configured backend API could not be reached."
      },
      { status: 502 }
    );
  }
}
