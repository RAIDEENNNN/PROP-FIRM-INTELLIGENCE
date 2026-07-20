import { PrismaClient } from "@prisma/client";
import { propFirms } from "../apps/web/src/lib/data";
import { instruments, spreadRecords } from "../apps/web/src/lib/spreads";

const prisma = new PrismaClient();

function assertSafeSeedTarget() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error("Refusing to run seed in production without ALLOW_PRODUCTION_SEED=true");
  }
}

const categoryMap = {
  Forex: "FOREX",
  Commodities: "COMMODITIES",
  Indices: "INDICES",
  Crypto: "CRYPTO",
  Synthetic: "INDICES"
} as const;

function amountFromFee(fee: string) {
  const match = fee.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function percentFromText(value: string) {
  const match = value.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

async function seedAdmin() {
  const adminUserId = process.env.ADMIN_USER_ID;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminUserId || !adminEmail) return;

  await prisma.$executeRaw`
    insert into public.profiles (id, email, full_name, account_role)
    values (${adminUserId}::uuid, ${adminEmail.toLowerCase()}, 'FundedScope Admin', 'super_admin')
    on conflict (id)
    do update set email = excluded.email, account_role = 'super_admin', updated_at = now()
  `;
}

async function seedFirms() {
  for (const firm of propFirms) {
    const saved = await prisma.propFirm.upsert({
      where: { slug: firm.slug },
      update: {
        name: firm.name,
        logoUrl: firm.logoUrl,
        websiteUrl: `https://${firm.domain}`,
        country: firm.country,
        trustScore: firm.score,
        confidenceScore: firm.score,
        rating: firm.rating,
        reviewCount: firm.reviewCount,
        payoutFrequency: firm.payoutFrequency,
        maxDrawdown: firm.maxDrawdown,
        dailyDrawdown: firm.dailyDrawdown,
        profitTarget: firm.profitTarget,
        challengeFee: firm.challengeFee,
        maxAccount: firm.maxAccount,
        editorSummary: firm.summary,
        markets: firm.markets,
        challengeTypes: firm.challengeTypes,
        verified: true,
        contentStatus: "published",
        featured: firm.score >= 88
      },
      create: {
        name: firm.name,
        slug: firm.slug,
        logoUrl: firm.logoUrl,
        websiteUrl: `https://${firm.domain}`,
        country: firm.country,
        trustScore: firm.score,
        confidenceScore: firm.score,
        rating: firm.rating,
        reviewCount: firm.reviewCount,
        payoutFrequency: firm.payoutFrequency,
        maxDrawdown: firm.maxDrawdown,
        dailyDrawdown: firm.dailyDrawdown,
        profitTarget: firm.profitTarget,
        challengeFee: firm.challengeFee,
        maxAccount: firm.maxAccount,
        editorSummary: firm.summary,
        markets: firm.markets,
        challengeTypes: firm.challengeTypes,
        verified: true,
        contentStatus: "published",
        featured: firm.score >= 88
      }
    });

    for (const [index, type] of firm.challengeTypes.entries()) {
      const data = {
          firmId: saved.id,
          name: `${firm.name} ${type}`,
          challengeType: type,
          accountSize: firm.maxAccount.includes("400") ? 400000 : firm.maxAccount.includes("300") ? 300000 : firm.maxAccount.includes("200") ? 200000 : 100000,
          challengeFee: amountFromFee(firm.challengeFee),
          profitTargetPhaseOne: percentFromText(firm.profitTarget),
          dailyDrawdown: percentFromText(firm.dailyDrawdown),
          maxDrawdown: percentFromText(firm.maxDrawdown),
          profitSplit: 80,
          minimumTradingDays: index === 0 ? 0 : 3,
          refundableFee: true,
          contentStatus: "published"
      };
      const existing = await prisma.propFirmAccount.findFirst({
        where: { firmId: saved.id, name: data.name }
      });
      if (existing) {
        await prisma.propFirmAccount.update({ where: { id: existing.id }, data });
      } else {
        await prisma.propFirmAccount.create({ data });
      }
    }

    const ruleData = [
      ["Markets", "Allowed markets", firm.markets.join(", ")],
      ["Payouts", "Payout frequency", firm.payoutFrequency],
      ["Risk", "Daily drawdown", firm.dailyDrawdown],
      ["Risk", "Max drawdown", firm.maxDrawdown],
      ["Targets", "Profit target", firm.profitTarget],
      ["Monitoring", "Last rule check", firm.lastRuleUpdate]
    ];

    for (const [category, title, currentValue] of ruleData) {
      const data = {
          firmId: saved.id,
          category,
          title,
          currentValue,
          impactLevel: category === "Risk" ? "high" : "medium",
          effectiveAt: new Date(firm.lastRuleUpdate),
          contentStatus: "published"
      };
      const existing = await prisma.propFirmRule.findFirst({
        where: { firmId: saved.id, category, title }
      });
      if (existing) {
        await prisma.propFirmRule.update({ where: { id: existing.id }, data });
      } else {
        await prisma.propFirmRule.create({ data });
      }
    }
  }
}

async function seedSpreads() {
  for (const instrument of instruments) {
    await prisma.instrument.upsert({
      where: { symbol: instrument.symbol },
      update: {
        name: instrument.name,
        category: categoryMap[instrument.category]
      },
      create: {
        symbol: instrument.symbol,
        name: instrument.name,
        category: categoryMap[instrument.category]
      }
    });
  }

  const instrumentIds = await prisma.instrument.findMany({
    select: { id: true, symbol: true }
  });
  const idBySymbol = new Map(instrumentIds.map((instrument) => [instrument.symbol, instrument.id]));

  for (const record of spreadRecords) {
    const instrumentId = idBySymbol.get(record.symbol);
    if (!instrumentId) continue;

    const recordedAt = new Date(record.updatedAt);
    const data = {
        instrumentId,
        brokerOrFirm: record.firmName,
        spreadPips: record.spread,
        recordedAt
    };
    const existing = await prisma.spreadRecord.findFirst({
      where: { instrumentId, brokerOrFirm: record.firmName, recordedAt }
    });
    if (existing) {
      await prisma.spreadRecord.update({ where: { id: existing.id }, data });
    } else {
      await prisma.spreadRecord.create({ data });
    }
  }
}

async function seedNews() {
  const news = [
    {
      title: "FundedScope launches prop firm source registry",
      summary: "Live-source plugin architecture prepared for forex, crypto, synthetic, news, rule and payment providers.",
      sourceName: "FundedScope Editorial",
      affectedFirms: ["all"],
      affectedSymbols: [],
      impactLevel: "HIGH" as const,
      publishedAt: new Date()
    },
    {
      title: "Spread matrix baseline added for forex, metals, indices, crypto and synthetic instruments",
      summary: "Every seeded prop firm now has an indicative spread record across the tracked instrument universe, including XAUUSD, XAGUSD, NAS100 and US30.",
      sourceName: "FundedScope Data",
      affectedFirms: ["all"],
      affectedSymbols: ["EURUSD", "XAUUSD", "XAGUSD", "NAS100", "BTCUSD", "VIX75"],
      impactLevel: "MEDIUM" as const,
      publishedAt: new Date()
    }
  ];

  for (const item of news) {
    const existing = await prisma.newsEvent.findFirst({
      where: { title: item.title }
    });
    if (existing) {
      await prisma.newsEvent.update({ where: { id: existing.id }, data: item });
    } else {
      await prisma.newsEvent.create({ data: item });
    }
  }
}

async function main() {
  assertSafeSeedTarget();
  await seedAdmin();
  await seedFirms();
  await seedSpreads();
  await seedNews();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("FundedScope seed complete");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
