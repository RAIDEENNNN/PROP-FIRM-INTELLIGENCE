import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError, sendOk } from "../../shared/http";
import { prisma } from "../../shared/prisma";

export const brokersRouter = Router();

const brokerQuerySchema = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  platform: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

type BrokerRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  official_url: string | null;
  source_url: string | null;
  founded_year: number | null;
  headquarters: string | null;
  countries: string[];
  platforms: string[];
  trust_score: unknown;
  public_summary: string | null;
  verification_status: string;
  public_source_name: string | null;
  last_verified_at: Date | null;
  content_status: string;
  spread_summary: string | null;
  commission_summary: string | null;
  swap_summary: string | null;
  created_at: Date;
  updated_at: Date;
};

function brokerDto(row: BrokerRow) {
  return {
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    officialUrl: row.official_url,
    sourceUrl: row.source_url,
    foundedYear: row.founded_year,
    headquarters: row.headquarters,
    countries: row.countries,
    platforms: row.platforms,
    trustScore: row.trust_score,
    publicSummary: row.public_summary,
    verificationStatus: row.verification_status,
    publicSourceName: row.public_source_name,
    lastVerifiedAt: row.last_verified_at,
    contentStatus: row.content_status,
    spreadSummary: row.spread_summary,
    commissionSummary: row.commission_summary,
    swapSummary: row.swap_summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

brokersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = brokerQuerySchema.parse(req.query);
    const search = query.q ? `%${query.q}%` : null;
    const country = query.country ? `%${query.country}%` : null;
    const platform = query.platform ? `%${query.platform}%` : null;

    const rows = await prisma.$queryRaw<BrokerRow[]>`
      select
        id::text,
        name,
        slug,
        logo_url,
        website_url,
        website_url as official_url,
        source_url,
        founded_year,
        headquarters_country as headquarters,
        supported_countries as countries,
        platforms,
        trust_score,
        description as public_summary,
        verification_status,
        public_source_name,
        last_verified_at,
        content_status::text,
        spread_summary,
        commission_summary,
        swap_summary,
        created_at,
        updated_at
      from public.brokers
      where content_status = 'published'
        and (${search}::text is null or name ilike ${search} or slug ilike ${search} or coalesce(description, '') ilike ${search})
        and (${country}::text is null or exists (select 1 from unnest(supported_countries) value where value ilike ${country}))
        and (${platform}::text is null or exists (select 1 from unnest(platforms) value where value ilike ${platform}))
      order by coalesce(trust_score, 0) desc, name asc
      limit ${query.limit}
      offset ${query.offset}
    `;

    return sendOk(res, {
      brokers: rows.map(brokerDto),
      count: rows.length,
      limit: query.limit,
      offset: query.offset
    });
  })
);

brokersRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug).toLowerCase();
    const rows = await prisma.$queryRaw<BrokerRow[]>`
      select
        id::text,
        name,
        slug,
        logo_url,
        website_url,
        website_url as official_url,
        source_url,
        founded_year,
        headquarters_country as headquarters,
        supported_countries as countries,
        platforms,
        trust_score,
        description as public_summary,
        verification_status,
        public_source_name,
        last_verified_at,
        content_status::text,
        spread_summary,
        commission_summary,
        swap_summary,
        created_at,
        updated_at
      from public.brokers
      where lower(slug) = ${slug} and content_status = 'published'
      limit 1
    `;

    const broker = rows[0];
    if (!broker) throw new HttpError(404, "Broker not found");

    const [accounts, instruments, regulations] = await Promise.all([
      prisma.$queryRaw`
        select id::text, name, minimum_deposit, commission, spread_model, leverage, platforms, base_currencies, public_source_name, last_verified_at
        from public.broker_accounts
        where broker_id = ${broker.id}::uuid and content_status = 'published'
        order by minimum_deposit nulls last, name asc
      `,
      prisma.$queryRaw`
        select id::text, symbol, display_name, asset_class, average_spread_pips, minimum_spread_pips, commission, swap_long, swap_short, max_leverage, public_source_name, last_verified_at
        from public.broker_instruments
        where broker_id = ${broker.id}::uuid and content_status = 'published'
        order by asset_class asc, symbol asc
      `,
      prisma.$queryRaw`
        select id::text, regulator, license_number, country, entity_name, license_status, verification_link, negative_balance_protection, segregated_client_funds, public_source_name, last_verified_at
        from public.broker_regulations
        where broker_id = ${broker.id}::uuid and content_status = 'published'
        order by country asc, regulator asc
      `
    ]);

    return sendOk(res, {
      broker: {
        ...brokerDto(broker),
        accounts: (accounts as any[]).map(({ id: _id, ...account }) => account),
        instruments: (instruments as any[]).map(({ id: _id, ...instrument }) => instrument),
        regulations: (regulations as any[]).map(({ id: _id, ...regulation }) => regulation)
      }
    });
  })
);
