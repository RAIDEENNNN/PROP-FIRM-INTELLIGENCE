"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";
import { GlassCard } from "./GlassCard";

type AccessState = "checking" | "signed-out" | "denied" | "allowed" | "unavailable";

type Check = {
  label: string;
  status: "ok" | "warning" | "down";
  detail: string;
};

type SourceHealth = {
  sources?: Array<{
    name: string;
    configured: boolean;
    missingKeys?: string[];
  }>;
};

function statusClass(status: Check["status"]) {
  if (status === "ok") return "border-success/30 bg-success/10 text-success";
  if (status === "warning") return "border-warning/30 bg-warning/10 text-warning";
  return "border-danger/30 bg-danger/10 text-danger";
}

function boolCheck(label: string, configured: boolean, detail: string): Check {
  return {
    label,
    status: configured ? "ok" : "warning",
    detail
  };
}

export function AdminDiagnostics() {
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [apiHealth, setApiHealth] = useState<Check>({ label: "Railway API", status: "warning", detail: "Not checked yet." });
  const [marketSources, setMarketSources] = useState<SourceHealth>({});

  const frontendChecks = useMemo(
    () => [
      boolCheck("Supabase URL", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), "Required for browser authentication."),
      boolCheck(
        "Supabase publishable key",
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        "Required for sign-up, login, reset password and session persistence."
      ),
      boolCheck("Backend API URL", Boolean(process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL), "Required for bookmarks, reports, profile proxy and saved data features."),
      boolCheck("Site URL", Boolean(process.env.NEXT_PUBLIC_SITE_URL), "Used for canonical URLs, sitemap and production metadata."),
      boolCheck("Analytics", Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID), "Optional before launch, useful after production traffic starts.")
    ],
    []
  );

  useEffect(() => {
    async function checkAccess() {
      if (!isSupabaseBrowserConfigured()) {
        setAccessState("unavailable");
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) {
          setAccessState("signed-out");
          return;
        }

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        const role = String(profile?.role ?? user.app_metadata?.role ?? user.user_metadata?.role ?? "").toLowerCase();
        setAccessState(role === "admin" || role === "super_admin" || role === "editor" ? "allowed" : "denied");
      } catch {
        setAccessState("unavailable");
      }
    }

    checkAccess();
  }, []);

  useEffect(() => {
    async function loadDiagnostics() {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        setApiHealth({
          label: "Railway API",
          status: response.ok ? "ok" : "down",
          detail: response.ok ? `Responded with ${payload.service ?? "health payload"}.` : payload.error ?? "Backend API did not respond successfully."
        });
      } catch {
        setApiHealth({ label: "Railway API", status: "down", detail: "Frontend could not reach the backend health proxy." });
      }

      try {
        const response = await fetch("/api/live/source-health", { cache: "no-store" });
        const payload = (await response.json()) as SourceHealth;
        setMarketSources(payload);
      } catch {
        setMarketSources({});
      }
    }

    loadDiagnostics();
  }, []);

  if (accessState !== "allowed") {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-danger">Diagnostics restricted</p>
          <h1 className="mt-3 text-4xl font-black text-white">Admin diagnostics are private.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {accessState === "checking"
              ? "Checking admin access..."
              : accessState === "unavailable"
                ? "Supabase account services need local env keys before admin diagnostics can verify your role."
                : accessState === "signed-out"
                  ? "Sign in with an approved admin account to view system diagnostics."
                  : "This account is signed in, but it does not have an admin role."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-in?next=/admin/diagnostics" className="rounded-full bg-white px-6 py-3 text-center font-black text-void">
              Sign in
            </Link>
            <Link href="/admin" className="rounded-full border border-white/10 px-6 py-3 text-center font-black text-white">
              Back to admin
            </Link>
          </div>
        </GlassCard>
      </main>
    );
  }

  const configuredSources = marketSources.sources?.filter((source) => source.configured).length ?? 0;
  const totalSources = marketSources.sources?.length ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-danger">Admin diagnostics</p>
          <h1 className="mt-3 text-4xl font-black text-white">System health cockpit</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Runtime checks for launch debugging. This page shows configuration presence and service health only; secret values are never displayed.
          </p>
        </div>
        <Link href="/admin" className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-black text-white hover:border-electric/40">
          Back to admin
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...frontendChecks, apiHealth].map((check) => (
          <GlassCard key={check.label}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-black text-white">{check.label}</h2>
              <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(check.status)}`}>{check.status.toUpperCase()}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{check.detail}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-electric">Build reference</p>
          <div className="mt-5 space-y-3 text-sm">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300">
              Frontend version: <span className="font-black text-white">{process.env.NEXT_PUBLIC_APP_VERSION || "local"}</span>
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300">
              Commit: <span className="font-black text-white">{process.env.NEXT_PUBLIC_COMMIT_SHA || "local-dev"}</span>
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300">
              Market sources configured: <span className="font-black text-white">{configuredSources}/{totalSources}</span>
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-violet">Market data sources</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(marketSources.sources ?? []).map((source) => (
              <div key={source.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{source.name}</p>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-black ${source.configured ? statusClass("ok") : statusClass("warning")}`}>
                    {source.configured ? "READY" : "MISSING"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {source.configured ? "Required configuration exists." : `Missing: ${(source.missingKeys ?? []).join(", ") || "configuration"}`}
                </p>
              </div>
            ))}
            {!marketSources.sources?.length ? <p className="text-sm text-slate-400">Source health is unavailable.</p> : null}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
