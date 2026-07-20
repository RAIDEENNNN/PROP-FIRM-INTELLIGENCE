import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";
import { buildScoreBreakdown } from "../../shared/scoring";

export const firmsRouter = Router();

const firmQuerySchema = z.object({
  q: z.string().optional(),
  market: z.string().optional(),
  country: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

type FirmRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  official_url: string | null;
  country: string | null;
  summary: string | null;
  score: unknown;
  confidence_score: unknown;
  rating: unknown;
  review_count: number;
  payout_frequency: string | null;
  markets: string[];
  challenge_types: string[];
  platforms: string[];
  verified: boolean;
  featured: boolean;
  status: string;
  verification_status: string;
  public_source_name: string | null;
  last_verified_at: Date | null;
  content_status: string;
  updated_at: Date;
};

type ChallengeRow = {
  id: string;
  prop_firm_id: string;
  name: string;
  challenge_type: string | null;
  account_size: unknown;
  challenge_fee: unknown;
  currency: string;
  profit_target_phase_one: unknown;
  profit_target_phase_two: unknown;
  daily_drawdown: unknown;
  max_drawdown: unknown;
  payout_split: unknown;
  minimum_trading_days: number | null;
  max_trading_days: number | null;
  refundable_fee: boolean;
  platforms: string[];
  payout_details: unknown;
  restrictions: unknown;
  fee_notes: string | null;
};

type RuleRow = {
  id: string;
  prop_firm_id: string;
  category: string;
  title: string;
  current_value: string;
  previous_value: string | null;
  impact_level: string;
  source_url: string | null;
  official_url: string | null;
  effective_at: Date | null;
  updated_at: Date;
};

function numberOrNull(value: unknown) {
  if (value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function challengeDto(row: ChallengeRow) {
  return {
    name: row.name,
    challengeType: row.challenge_type,
    accountSize: numberOrNull(row.account_size),
    challengeFee: numberOrNull(row.challenge_fee),
    currency: row.currency,
    profitTargetPhaseOne: numberOrNull(row.profit_target_phase_one),
    profitTargetPhaseTwo: numberOrNull(row.profit_target_phase_two),
    dailyDrawdown: numberOrNull(row.daily_drawdown),
    maxDrawdown: numberOrNull(row.max_drawdown),
    profitSplit: numberOrNull(row.payout_split),
    minimumTradingDays: row.minimum_trading_days,
    maxTradingDays: row.max_trading_days,
    refundableFee: row.refundable_fee,
    platforms: row.platforms ?? [],
    payoutDetails: row.payout_details,
    restrictions: row.restrictions,
    feeNotes: row.fee_notes
  };
}

function ruleDto(row: RuleRow) {
  return {
    category: row.category,
    title: row.title,
    currentValue: row.current_value,
    previousValue: row.previous_value,
    impactLevel: row.impact_level.toUpperCase(),
    sourceUrl: row.source_url,
    officialUrl: row.official_url,
    effectiveAt: row.effective_at,
    updatedAt: row.updated_at
  };
}

function firmDto(firm: FirmRow, challenges: ChallengeRow[] = [], rules: RuleRow[] = []) {
  const accounts = challenges.map(challengeDto);
  const mappedRules = rules.map(ruleDto);
  const scoreFirm = {
    trustScore: firm.confidence_score ?? firm.score,
    rating: firm.rating,
    reviewCount: firm.review_count,
    payoutFrequency: firm.payout_frequency,
    status: firm.status,
    updatedAt: firm.updated_at,
    accounts,
    rules: mappedRules
  };

  return {
    name: firm.name,
    slug: firm.slug,
    logoUrl: firm.logo_url,
    websiteUrl: firm.website_url ?? firm.official_url,
    officialUrl: firm.official_url ?? firm.website_url,
    country: firm.country,
    trustScore: firm.score,
    confidenceScore: firm.confidence_score ?? firm.score,
    rating: firm.rating,
    reviewCount: firm.review_count,
    payoutFrequency: firm.payout_frequency,
    editorSummary: firm.summary,
    markets: firm.markets ?? [],
    challengeTypes: firm.challenge_types ?? [],
    platforms: firm.platforms ?? [],
    verified: firm.verified,
    featured: firm.featured,
    status: firm.status,
    verificationStatus: firm.verification_status,
    publicSourceName: firm.public_source_name,
    lastVerifiedAt: firm.last_verified_at,
    contentStatus: firm.content_status,
    updatedAt: firm.updated_at,
    accounts,
    rules: mappedRules,
    counts: {
      accounts: accounts.length,
      rules: mappedRules.length
    },
    scoreBreakdown: buildScoreBreakdown(scoreFirm)
  };
}

async function publishedChallenges(firmIds: string[]) {
  if (!firmIds.length) return [];
  return prisma.$queryRaw<ChallengeRow[]>`
    select
      id::text,
      prop_firm_id::text,
      name,
      challenge_type,
      account_size,
      challenge_fee,
      currency,
      profit_target_phase_one,
      profit_target_phase_two,
      daily_drawdown,
      max_drawdown,
      payout_split,
      minimum_trading_days,
      max_trading_days,
      refundable_fee,
      platforms,
      payout_details,
      restrictions,
      fee_notes
    from public.prop_firm_challenges
    where prop_firm_id::text = any(${firmIds})
      and status = 'active'
      and content_status = 'published'
    order by account_size asc nulls last, challenge_fee asc nulls last
  `;
}

async function publishedRules(firmIds: string[]) {
  if (!firmIds.length) return [];
  return prisma.$queryRaw<RuleRow[]>`
    select
      id::text,
      prop_firm_id::text,
      category,
      title,
      current_value,
      previous_value,
      impact_level,
      source_url,
      official_url,
      effective_at,
      updated_at
    from public.prop_firm_rules
    where prop_firm_id::text = any(${firmIds})
      and status = 'active'
      and content_status = 'published'
    order by updated_at desc
  `;
}

firmsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = firmQuerySchema.parse(req.query);
    const search = query.q ? `%${query.q}%` : null;
    const country = query.country ? `%${query.country}%` : null;
    const market = query.market ? `%${query.market}%` : null;

    const firms = await prisma.$queryRaw<FirmRow[]>`
      select
        id::text,
        name,
        slug,
        logo_url,
        website_url,
        official_url,
        country,
        summary,
        score,
        confidence_score,
        rating,
        review_count,
        payout_frequency,
        markets,
        challenge_types,
        platforms,
        verified,
        featured,
        status,
        verification_status,
        public_source_name,
        last_verified_at,
        content_status::text,
        updated_at
      from public.prop_firms
      where status = 'active'
        and content_status = 'published'
        and (${query.featured ?? null}::boolean is null or featured = ${query.featured ?? null})
        and (${country}::text is null or country ilike ${country})
        and (${search}::text is null or name ilike ${search} or slug ilike ${search} or coalesce(summary, '') ilike ${search})
        and (
          ${market}::text is null
          or exists (select 1 from unnest(markets) value where value ilike ${market})
          or exists (select 1 from unnest(platforms) value where value ilike ${market})
          or exists (
            select 1
            from public.prop_firm_rules r
            where r.prop_firm_id = public.prop_firms.id
              and r.status = 'active'
              and r.content_status = 'published'
              and (r.category ilike ${market} or r.current_value ilike ${market})
          )
        )
      order by featured desc, coalesce(confidence_score, score) desc, rating desc, name asc
      limit ${query.limit}
      offset ${query.offset}
    `;

    const firmIds = firms.map((firm) => firm.id);
    const [challenges, rules] = await Promise.all([publishedChallenges(firmIds), publishedRules(firmIds)]);

    return sendOk(res, {
      firms: firms.map((firm) =>
        firmDto(
          firm,
          challenges.filter((challenge) => challenge.prop_firm_id === firm.id),
          rules.filter((rule) => rule.prop_firm_id === firm.id)
        )
      ),
      count: firms.length,
      limit: query.limit,
      offset: query.offset
    });
  })
);

firmsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug).toLowerCase();
    const firms = await prisma.$queryRaw<FirmRow[]>`
      select
        id::text,
        name,
        slug,
        logo_url,
        website_url,
        official_url,
        country,
        summary,
        score,
        confidence_score,
        rating,
        review_count,
        payout_frequency,
        markets,
        challenge_types,
        platforms,
        verified,
        featured,
        status,
        verification_status,
        public_source_name,
        last_verified_at,
        content_status::text,
        updated_at
      from public.prop_firms
      where lower(slug) = ${slug}
        and status = 'active'
        and content_status = 'published'
      limit 1
    `;

    const firm = firms[0];
    if (!firm) throw new HttpError(404, "Prop firm not found");

    const [challenges, rules] = await Promise.all([publishedChallenges([firm.id]), publishedRules([firm.id])]);
    return sendOk(res, { firm: firmDto(firm, challenges, rules) });
  })
);

firmsRouter.get(
  "/:slug/score",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug).toLowerCase();
    const firms = await prisma.$queryRaw<FirmRow[]>`
      select
        id::text,
        name,
        slug,
        logo_url,
        website_url,
        official_url,
        country,
        summary,
        score,
        confidence_score,
        rating,
        review_count,
        payout_frequency,
        markets,
        challenge_types,
        platforms,
        verified,
        featured,
        status,
        verification_status,
        public_source_name,
        last_verified_at,
        content_status::text,
        updated_at
      from public.prop_firms
      where lower(slug) = ${slug}
        and status = 'active'
        and content_status = 'published'
      limit 1
    `;

    const firm = firms[0];
    if (!firm) throw new HttpError(404, "Prop firm not found");
    const [challenges, rules] = await Promise.all([publishedChallenges([firm.id]), publishedRules([firm.id])]);
    const dto = firmDto(firm, challenges, rules);

    return sendOk(res, {
      slug: firm.slug,
      name: firm.name,
      trustScore: firm.score,
      confidenceScore: firm.confidence_score ?? firm.score,
      scoreBreakdown: dto.scoreBreakdown
    });
  })
);

firmsRouter.get(
  "/:slug/rules/history",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug).toLowerCase();
    const firms = await prisma.$queryRaw<Array<{ id: string; slug: string }>>`
      select id::text, slug
      from public.prop_firms
      where lower(slug) = ${slug}
        and status = 'active'
        and content_status = 'published'
      limit 1
    `;
    const firm = firms[0];
    if (!firm) throw new HttpError(404, "Prop firm not found");

    const [rules, history] = await Promise.all([
      publishedRules([firm.id]),
      prisma.$queryRaw`
        select
          id::text,
          rule_category,
          rule_title,
          previous_value,
          new_value,
          change_summary,
          public_source_name,
          source_url,
          verified_at,
          created_at
        from public.prop_firm_rule_history
        where prop_firm_id::text = ${firm.id}
          and content_status = 'published'
        order by created_at desc
        limit 100
      `
    ]);

    return sendOk(res, {
      slug: firm.slug,
      rules: rules.map(ruleDto),
      auditLogs: history
    });
  })
);
