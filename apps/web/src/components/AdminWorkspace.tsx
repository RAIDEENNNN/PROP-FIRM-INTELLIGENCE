"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "./GlassCard";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const adminModules = [
  {
    title: "Prop firms",
    endpoint: "GET/POST /api/admin/firms",
    state: "Content operations",
    fields: "draft, under-review, published, archived"
  },
  {
    title: "Challenges",
    endpoint: "Supabase: prop_firm_challenges",
    state: "Data operations",
    fields: "pricing, targets, drawdown, platform, verification"
  },
  {
    title: "Rules",
    endpoint: "Supabase: prop_firm_rules",
    state: "Data operations",
    fields: "rule category, current value, source, last verified"
  },
  {
    title: "Rule-change history",
    endpoint: "Supabase: prop_firm_rule_history",
    state: "Source history",
    fields: "previous value, new value, source, verified by"
  },
  {
    title: "Information reports",
    endpoint: "GET/PATCH /api/admin/reports",
    state: "Moderation queue ready",
    fields: "status, assigned admin, evidence, resolution notes"
  },
  {
    title: "Reviews",
    endpoint: "GET/PATCH /api/reviews + admin workflow",
    state: "Existing moderation",
    fields: "pending, verified, rejected"
  },
  {
    title: "Brokers",
    endpoint: "Supabase: brokers",
    state: "Data operations",
    fields: "accounts, instruments, regulations, availability"
  },
  {
    title: "Broker accounts",
    endpoint: "Supabase: broker_accounts",
    state: "Data operations",
    fields: "deposit, spread model, leverage, platforms"
  },
  {
    title: "Notifications",
    endpoint: "GET/PATCH /api/persistence/notifications",
    state: "User delivery ready",
    fields: "title, message, type, href, read state"
  }
];

type AccessState = "checking" | "signed-out" | "denied" | "allowed" | "unavailable";

export function AdminWorkspace() {
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const adminEmails = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    []
  );

  useEffect(() => {
    async function checkAccess() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        const user = data.user;

        if (!user) {
          setAccessState("signed-out");
          return;
        }

        const role = String(user.app_metadata?.role ?? user.user_metadata?.role ?? "").toLowerCase();
        const email = user.email?.toLowerCase() ?? "";
        const emailAllowed = adminEmails.length > 0 && adminEmails.includes(email);

        setAccessState(role === "admin" || emailAllowed ? "allowed" : "denied");
      } catch {
        setAccessState("unavailable");
      }
    }

    checkAccess();
  }, [adminEmails]);

  if (accessState !== "allowed") {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-danger">Admin restricted</p>
          <h1 className="mt-3 text-4xl font-black text-white">This workspace is not for public users.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Admin operations are separated from normal user accounts. Sign in with an approved admin account to view moderation queues, source notes and internal data tools.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-400">
            {accessState === "checking"
              ? "Checking admin access..."
              : accessState === "signed-out"
                ? "You are not signed in."
                : accessState === "denied"
                  ? "You are signed in, but this account is not an admin."
                  : "Account services are unavailable, so admin access cannot be verified."}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-in" className="rounded-full bg-white px-6 py-3 text-center font-black text-void">
              Sign in
            </Link>
            <Link href="/" className="rounded-full border border-white/10 px-6 py-3 text-center font-black text-white">
              Return home
            </Link>
          </div>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-danger">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-white">Operations cockpit</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
        Internal-only tools stay behind authenticated admin access. Public users receive published records and methodology, not database IDs, private source URLs, admin notes or scoring overrides.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {adminModules.map((item) => (
          <GlassCard key={item.title}>
            <div className="flex items-start justify-between gap-4">
              <p className="text-xl font-black text-white">{item.title}</p>
              <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-black text-electric">{item.state}</span>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{item.endpoint}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.fields}</p>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
