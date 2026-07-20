"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClientConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, publishableKey };
}

export function isSupabaseBrowserConfigured() {
  const { supabaseUrl, publishableKey } = getSupabaseBrowserClientConfig();
  return Boolean(supabaseUrl && publishableKey);
}

export function getSupabaseBrowserClient() {
  const { supabaseUrl, publishableKey } = getSupabaseBrowserClientConfig();

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Account sign-in is temporarily unavailable. Please try again shortly.");
  }

  browserClient ??= createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return browserClient;
}
