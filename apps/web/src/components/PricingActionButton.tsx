"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

export function PricingActionButton({ planName, guestHref, guestLabel }: { planName: string; guestHref: string; guestLabel: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    let active = true;
    if (!isSupabaseBrowserConfigured()) return;

    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSignedIn(Boolean(data.session));
        setEmail(data.session?.user.email ?? "");
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      setEmail(session?.user.email ?? "");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function saveInterest() {
    if (planName === "Free") return;
    setStatus("saving");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: planName.toLowerCase(),
          source: "/pricing",
          consent: true
        })
      });

      setStatus(response.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (signedIn && planName !== "Free") {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={saveInterest}
          disabled={status === "saving"}
          className="block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-void transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
        >
          {status === "saving" ? "Saving..." : status === "saved" ? "You’re on the list" : "Notify me when ready"}
        </button>
        <p className={`mt-3 text-center text-xs ${status === "error" ? "text-danger" : "text-slate-500"}`}>
          {status === "saved" ? `${planName} interest saved for your account.` : status === "error" ? "Could not save that yet. Please try again." : "No need to create another account."}
        </p>
      </div>
    );
  }

  return (
    <Link href={signedIn ? "/dashboard" : guestHref} className="mt-8 block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-void">
      {signedIn ? "Open dashboard" : guestLabel}
    </Link>
  );
}
