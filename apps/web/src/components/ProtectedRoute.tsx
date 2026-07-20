"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

export function ProtectedRoute({ children, label = "private workspace" }: { children: ReactNode; label?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"checking" | "allowed" | "blocked" | "unavailable">("checking");

  useEffect(() => {
    let active = true;
    if (!isSupabaseBrowserConfigured()) {
      setState("unavailable");
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setState(data.session ? "allowed" : "blocked");
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? "allowed" : "blocked");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state === "blocked") {
      router.prefetch(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, state]);

  if (state === "allowed") return <>{children}</>;

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-12">
      <section className="w-full rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-center shadow-2xl shadow-electric/10">
        <p className="text-xs uppercase tracking-[0.24em] text-electric">Sign in required</p>
        <h1 className="mt-3 text-3xl font-black text-white">
          {state === "checking" ? "Checking your session..." : state === "unavailable" ? "Account services need setup." : `Open your ${label}.`}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {state === "checking"
            ? "FundedScope is confirming whether this browser has an active account session."
            : state === "unavailable"
              ? "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable local sign-in."
              : "Private dashboards, profiles, settings and saved research only load after you sign in."}
        </p>
        {state === "blocked" ? (
          <Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} className="mt-6 inline-flex rounded-2xl bg-electric px-5 py-3 font-black text-void">
            Sign in
          </Link>
        ) : null}
      </section>
    </main>
  );
}
