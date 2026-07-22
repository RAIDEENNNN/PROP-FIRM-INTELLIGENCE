"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

export function PricingActionButton({ planName, guestHref, guestLabel }: { planName: string; guestHref: string; guestLabel: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState<"idle" | "opening" | "error">("idle");

  useEffect(() => {
    let active = true;
    if (!isSupabaseBrowserConfigured()) return;

    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSignedIn(Boolean(data.session));
        setAccessToken(data.session?.access_token ?? "");
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      setAccessToken(session?.access_token ?? "");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function startCheckout() {
    if (planName === "Free") return;
    setStatus("opening");

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          plan: planName.toLowerCase()
        })
      });

      const payload = (await response.json().catch(() => ({}))) as { checkoutUrl?: string };
      if (!response.ok || !payload.checkoutUrl) throw new Error("checkout_unavailable");
      window.location.href = payload.checkoutUrl;
    } catch {
      setStatus("error");
    }
  }

  if (signedIn && planName !== "Free") {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={startCheckout}
          disabled={status === "opening" || !accessToken}
          className="block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-void transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
        >
          {status === "opening" ? "Opening secure checkout..." : `Subscribe to ${planName}`}
        </button>
        {status === "error" ? <p className="mt-3 text-center text-xs text-danger">Checkout is unavailable. Please try again.</p> : null}
      </div>
    );
  }

  return (
    <Link href={signedIn ? "/dashboard" : guestHref} className="mt-8 block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-void">
      {signedIn ? "Open dashboard" : guestLabel}
    </Link>
  );
}
