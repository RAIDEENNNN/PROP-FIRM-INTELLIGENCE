"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

export function PricingActionButton({ planName, guestHref, guestLabel }: { planName: string; guestHref: string; guestLabel: string }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isSupabaseBrowserConfigured()) return;

    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signedInHref = planName === "Free" ? "/dashboard" : "/settings";
  const signedInLabel = planName === "Free" ? "Open dashboard" : "Manage upgrade interest";

  return (
    <Link href={signedIn ? signedInHref : guestHref} className="mt-8 block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-void">
      {signedIn ? signedInLabel : guestLabel}
    </Link>
  );
}
