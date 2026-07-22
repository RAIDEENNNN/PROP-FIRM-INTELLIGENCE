"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";

type ProfileRow = {
  full_name: string | null;
  username: string | null;
  country: string | null;
  trader_type: string | null;
  experience_level: string | null;
  markets: string[] | null;
  trading_style: string | null;
  strategy: string | null;
  goals: string[] | null;
  trading_sessions: string[] | null;
  favorite_assets: string[] | null;
  preferences: Record<string, unknown> | null;
};

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function DashboardProfileCard() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isSupabaseBrowserConfigured()) {
      setLoaded(true);
      return;
    }

    async function loadProfile() {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        if (active) setLoaded(true);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, username, country, trader_type, experience_level, markets, trading_style, strategy, goals, trading_sessions, favorite_assets, preferences")
        .eq("id", userId)
        .maybeSingle();

      if (active) {
        setProfile((data as ProfileRow | null) ?? null);
        setLoaded(true);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.full_name,
      profile.username,
      profile.country,
      profile.trader_type,
      profile.experience_level,
      profile.markets,
      profile.trading_style,
      profile.strategy,
      profile.goals,
      profile.trading_sessions,
      profile.favorite_assets,
      profile.preferences
    ];

    return Math.round((fields.filter(hasValue).length / fields.length) * 100);
  }, [profile]);

  const displayName = profile?.full_name || profile?.username || "Your Trader DNA";
  const bestSession = profile?.trading_sessions?.[0] ?? null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Trader DNA</p>
      <h2 className="mt-2 text-3xl font-black text-white">{loaded && completion > 0 ? displayName : "Your Trader DNA starts empty"}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300">
        {completion > 0
          ? "FundedScope will personalize recommendations from the profile details you have actually saved."
          : "No trading assumptions yet. Add your markets, style, risk tolerance and goals before FundedScope shows personal scores."}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm text-slate-500">DNA completion</p>
          <p className="mt-1 text-3xl font-black text-electric">{loaded ? `${completion}%` : "..."}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm text-slate-500">Best session</p>
          <p className="mt-1 font-black text-white">{bestSession ?? "Not set"}</p>
        </div>
      </div>
      <Link href="/profile#trading-dna-form" className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-bold text-void">
        {completion > 0 ? "Update Trader DNA" : "Complete Trader DNA"}
      </Link>
    </div>
  );
}
