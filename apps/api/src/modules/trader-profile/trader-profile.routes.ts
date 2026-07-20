import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../shared/auth";
import { asyncHandler, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const traderProfileRouter = Router();

const traderProfileSchema = z.object({
  username: z.string().min(2).max(40).nullable().optional(),
  country: z.string().max(80).nullable().optional(),
  timezone: z.string().max(80).nullable().optional(),
  profilePictureUrl: z.string().url().nullable().optional(),
  traderType: z.string().max(40).nullable().optional(),
  experienceLevel: z.string().max(80).nullable().optional(),
  strategy: z.string().max(120).nullable().optional(),
  preferredMarkets: z.array(z.string()).default([]),
  brokers: z.array(z.string()).default([]),
  propFirms: z.array(z.string()).default([]),
  liveAccountSize: z.number().int().nonnegative().nullable().optional(),
  propAccountSize: z.number().int().nonnegative().nullable().optional(),
  challengeSize: z.number().int().nonnegative().nullable().optional(),
  tradingStyle: z.string().max(80).nullable().optional(),
  goals: z.array(z.string()).default([]),
  targetMonthlyPercent: z.number().nonnegative().nullable().optional(),
  targetMonthlyProfit: z.number().nonnegative().nullable().optional(),
  targetWinRate: z.number().min(0).max(100).nullable().optional(),
  maxDailyDrawdown: z.number().nonnegative().nullable().optional(),
  maxTotalDrawdown: z.number().nonnegative().nullable().optional(),
  preferredAccountSize: z.number().int().positive().nullable().optional(),
  sessions: z.array(z.string()).default([]),
  favoriteAssets: z.array(z.string()).default([]),
  yearsExperience: z.number().nonnegative().nullable().optional(),
  propChallenges: z.number().int().nonnegative().nullable().optional(),
  fundedBefore: z.boolean().optional(),
  largestAccount: z.number().int().nonnegative().nullable().optional(),
  psychologyWeaknesses: z.array(z.string()).default([]),
  personality: z.record(z.coerce.number()).nullable().optional(),
  preferences: z.record(z.union([z.string(), z.boolean(), z.array(z.string())])).nullable().optional(),
  connectedAccounts: z.record(z.union([z.string(), z.boolean()])).nullable().optional(),
  performance: z.record(z.union([z.number(), z.string(), z.boolean()])).nullable().optional(),
  riskTolerance: z.enum(["LOW", "MEDIUM", "HIGH", "EXTREME"]).optional(),
  payoutPriority: z.boolean().optional(),
  swingTrading: z.boolean().optional(),
  newsTrading: z.boolean().optional(),
  eaTrading: z.boolean().optional()
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  country: string | null;
  timezone: string | null;
  avatar_url: string | null;
  trader_type: string | null;
  experience_level: string | null;
  markets: string[];
  brokers: string[];
  prop_firms: string[];
  live_account_size: unknown;
  prop_account_size: unknown;
  challenge_size: unknown;
  trading_style: string | null;
  strategy: string | null;
  max_risk_per_trade: unknown;
  goals: string[];
  target_monthly_percent: unknown;
  target_monthly_profit: unknown;
  target_win_rate: unknown;
  maximum_drawdown: unknown;
  trading_sessions: string[];
  favorite_assets: string[];
  years_experience: unknown;
  prop_challenges_count: number | null;
  funded_before: boolean;
  largest_account: unknown;
  psychology_weaknesses: string[];
  personality: Record<string, unknown>;
  preferences: Record<string, unknown>;
  connected_accounts: Record<string, unknown>;
  performance: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

function numberOrNull(value: unknown) {
  if (value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function profileDto(row: ProfileRow | undefined) {
  if (!row) return null;
  const preferences = row.preferences ?? {};

  return {
    id: row.id,
    userId: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    country: row.country,
    timezone: row.timezone,
    profilePictureUrl: row.avatar_url,
    traderType: row.trader_type,
    experienceLevel: row.experience_level,
    preferredMarkets: row.markets ?? [],
    brokers: row.brokers ?? [],
    propFirms: row.prop_firms ?? [],
    liveAccountSize: numberOrNull(row.live_account_size),
    propAccountSize: numberOrNull(row.prop_account_size),
    challengeSize: numberOrNull(row.challenge_size),
    tradingStyle: row.trading_style,
    strategy: row.strategy,
    goals: row.goals ?? [],
    targetMonthlyPercent: numberOrNull(row.target_monthly_percent),
    targetMonthlyProfit: numberOrNull(row.target_monthly_profit),
    targetWinRate: numberOrNull(row.target_win_rate),
    maxDailyDrawdown: numberOrNull(preferences.maxDailyDrawdown ?? row.max_risk_per_trade),
    maxTotalDrawdown: numberOrNull(row.maximum_drawdown),
    preferredAccountSize: numberOrNull(preferences.preferredAccountSize),
    sessions: row.trading_sessions ?? [],
    favoriteAssets: row.favorite_assets ?? [],
    yearsExperience: numberOrNull(row.years_experience),
    propChallenges: row.prop_challenges_count,
    fundedBefore: row.funded_before,
    largestAccount: numberOrNull(row.largest_account),
    psychologyWeaknesses: row.psychology_weaknesses ?? [],
    personality: row.personality ?? {},
    preferences,
    connectedAccounts: row.connected_accounts ?? {},
    performance: row.performance ?? {},
    riskTolerance: preferences.riskTolerance ?? "MEDIUM",
    payoutPriority: Boolean(preferences.payoutPriority),
    swingTrading: Boolean(preferences.swingTrading),
    newsTrading: Boolean(preferences.newsTrading),
    eaTrading: Boolean(preferences.eaTrading),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

traderProfileRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const rows = await prisma.$queryRaw<ProfileRow[]>`
      select
        id::text,
        full_name,
        username,
        email,
        country,
        timezone,
        avatar_url,
        trader_type,
        experience_level,
        markets,
        brokers,
        prop_firms,
        live_account_size,
        prop_account_size,
        challenge_size,
        trading_style,
        strategy,
        max_risk_per_trade,
        goals,
        target_monthly_percent,
        target_monthly_profit,
        target_win_rate,
        maximum_drawdown,
        trading_sessions,
        favorite_assets,
        years_experience,
        prop_challenges_count,
        funded_before,
        largest_account,
        psychology_weaknesses,
        personality,
        preferences,
        connected_accounts,
        performance,
        created_at,
        updated_at
      from public.profiles
      where id::text = ${req.user!.sub}
      limit 1
    `;

    return sendOk(res, { profile: profileDto(rows[0]) });
  })
);

traderProfileRouter.put(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = traderProfileSchema.parse(req.body);
    const preferences = {
      ...(input.preferences ?? {}),
      riskTolerance: input.riskTolerance ?? input.preferences?.riskTolerance ?? "MEDIUM",
      maxDailyDrawdown: input.maxDailyDrawdown ?? null,
      preferredAccountSize: input.preferredAccountSize ?? null,
      payoutPriority: Boolean(input.payoutPriority),
      swingTrading: Boolean(input.swingTrading),
      newsTrading: Boolean(input.newsTrading),
      eaTrading: Boolean(input.eaTrading)
    };

    const rows = await prisma.$queryRaw<ProfileRow[]>`
      insert into public.profiles (
        id,
        email,
        username,
        country,
        timezone,
        avatar_url,
        trader_type,
        experience_level,
        markets,
        brokers,
        prop_firms,
        live_account_size,
        prop_account_size,
        challenge_size,
        trading_style,
        strategy,
        max_risk_per_trade,
        goals,
        target_monthly_percent,
        target_monthly_profit,
        target_win_rate,
        maximum_drawdown,
        trading_sessions,
        favorite_assets,
        years_experience,
        prop_challenges_count,
        funded_before,
        largest_account,
        psychology_weaknesses,
        personality,
        preferences,
        connected_accounts,
        performance
      )
      values (
        ${req.user!.sub}::uuid,
        ${req.user!.email},
        ${input.username ?? null},
        ${input.country ?? null},
        ${input.timezone ?? null},
        ${input.profilePictureUrl ?? null},
        ${input.traderType ?? null},
        ${input.experienceLevel ?? null},
        ${input.preferredMarkets},
        ${input.brokers},
        ${input.propFirms},
        ${input.liveAccountSize ?? null},
        ${input.propAccountSize ?? null},
        ${input.challengeSize ?? null},
        ${input.tradingStyle ?? null},
        ${input.strategy ?? null},
        ${input.maxDailyDrawdown ?? null},
        ${input.goals},
        ${input.targetMonthlyPercent ?? null},
        ${input.targetMonthlyProfit ?? null},
        ${input.targetWinRate ?? null},
        ${input.maxTotalDrawdown ?? null},
        ${input.sessions},
        ${input.favoriteAssets},
        ${input.yearsExperience ?? null},
        ${input.propChallenges ?? null},
        ${input.fundedBefore ?? false},
        ${input.largestAccount ?? null},
        ${input.psychologyWeaknesses},
        ${(input.personality ?? {}) as any}::jsonb,
        ${preferences as any}::jsonb,
        ${(input.connectedAccounts ?? {}) as any}::jsonb,
        ${(input.performance ?? {}) as any}::jsonb
      )
      on conflict (id)
      do update set
        email = excluded.email,
        username = excluded.username,
        country = excluded.country,
        timezone = excluded.timezone,
        avatar_url = excluded.avatar_url,
        trader_type = excluded.trader_type,
        experience_level = excluded.experience_level,
        markets = excluded.markets,
        brokers = excluded.brokers,
        prop_firms = excluded.prop_firms,
        live_account_size = excluded.live_account_size,
        prop_account_size = excluded.prop_account_size,
        challenge_size = excluded.challenge_size,
        trading_style = excluded.trading_style,
        strategy = excluded.strategy,
        max_risk_per_trade = excluded.max_risk_per_trade,
        goals = excluded.goals,
        target_monthly_percent = excluded.target_monthly_percent,
        target_monthly_profit = excluded.target_monthly_profit,
        target_win_rate = excluded.target_win_rate,
        maximum_drawdown = excluded.maximum_drawdown,
        trading_sessions = excluded.trading_sessions,
        favorite_assets = excluded.favorite_assets,
        years_experience = excluded.years_experience,
        prop_challenges_count = excluded.prop_challenges_count,
        funded_before = excluded.funded_before,
        largest_account = excluded.largest_account,
        psychology_weaknesses = excluded.psychology_weaknesses,
        personality = excluded.personality,
        preferences = excluded.preferences,
        connected_accounts = excluded.connected_accounts,
        performance = excluded.performance,
        updated_at = now()
      returning
        id::text,
        full_name,
        username,
        email,
        country,
        timezone,
        avatar_url,
        trader_type,
        experience_level,
        markets,
        brokers,
        prop_firms,
        live_account_size,
        prop_account_size,
        challenge_size,
        trading_style,
        strategy,
        max_risk_per_trade,
        goals,
        target_monthly_percent,
        target_monthly_profit,
        target_win_rate,
        maximum_drawdown,
        trading_sessions,
        favorite_assets,
        years_experience,
        prop_challenges_count,
        funded_before,
        largest_account,
        psychology_weaknesses,
        personality,
        preferences,
        connected_accounts,
        performance,
        created_at,
        updated_at
    `;

    return sendOk(res, { profile: profileDto(rows[0]) });
  })
);
