"use client";

import { getSupabaseBrowserClient } from "./supabase/client";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export async function getAccessToken() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? window.localStorage.getItem("fundedscope_access_token");
}

export function hasPersistenceApi() {
  return Boolean(apiBaseUrl);
}

export async function persistenceFetch(path: string, init: RequestInit = {}) {
  if (!apiBaseUrl) throw new Error("Account services are temporarily unavailable");
  const token = await getAccessToken();
  if (!token) throw new Error("Sign in required");

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error ?? "Request failed");
  }

  return payload;
}
