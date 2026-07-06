import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { propFirms } from "../apps/web/src/lib/data";
import { instruments, spreadRecords } from "../apps/web/src/lib/spreads";

const prisma = new PrismaClient();

const challengeTypeMap = {
  "One-step": "ONE_STEP",
  "Two-step": "TWO_STEP",
  "Three-step": "THREE_STEP",
  "Instant funding": "INSTANT_FUNDING",
  Evaluation: "TWO_STEP",
  "Funded trader": "INSTANT_FUNDING",
  "Futures combine": "TWO_STEP",
  "Futures evaluation": "TWO_STEP"
} as const;

const categoryMap = {
  Forex: "FOREX",
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
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.includes("replace-with")) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { role: "SUPER_ADMIN", passwordHash },
    create: {
      email,
      name: "FundedScope Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      emailVerifiedAt: new Date(),
      traderProfile: {
        create: { preferredMarkets: [] }
      }
    }
  });
}

async function seedFirms() {
  for (const firm of propFirms) {
    const saved = await prisma.propFirm.upsert({
      where: { slug: firm.slug },
      update: {
        name: firm.name,
        logoUrl: firm.logoUrl,
        websiteUrl: `https://${firm.domain}`,
        affiliateUrl: `https://${firm.domain}`,
        country: firm.country,
        trustScore: firm.score,
        rating: firm.rating,
        reviewCount: firm.reviewCount,
        payoutFrequency: firm.payoutFrequency,
        editorSummary: firm.summary,
        seoTitle: `${firm.name} review, rules, spreads and payout intelligence | FundedScope`,
        seoDescription: firm.summary,
        featured: firm.score >= 88
      },
      create: {
        name: firm.name,
        slug: firm.slug,
        logoUrl: firm.logoUrl,
        websiteUrl: `https://${firm.domain}`,
        affiliateUrl: `https://${firm.domain}`,
        country: firm.country,
        trustScore: firm.score,
        rating: firm.rating,
        reviewCount: firm.reviewCount,
        payoutFrequency: firm.payoutFrequency,
        editorSummary: firm.summary,
        seoTitle: `${firm.name} review, rules, spreads and payout intelligence | FundedScope`,
        seoDescription: firm.summary,
        featured: firm.score >= 88
      }
    });

    await prisma.propFirmAccount.deleteMany({ where: { firmId: saved.id } });
    await prisma.propFirmRule.deleteMany({ where: { firmId: saved.id } });

    for (const [index, type] of firm.challengeTypes.entries()) {
      await prisma.propFirmAccount.create({
        data: {
          firmId: saved.id,
          name: `${firm.name} ${type}`,
          challengeType: challengeTypeMap[type as keyof typeof challengeTypeMap] ?? "TWO_STEP",
          accountSize: firm.maxAccount.includes("400") ? 400000 : firm.maxAccount.includes("300") ? 300000 : firm.maxAccount.includes("200") ? 200000 : 100000,
          challengeFee: amountFromFee(firm.challengeFee),
          profitTargetPhaseOne: percentFromText(firm.profitTarget),
          dailyDrawdown: percentFromText(firm.dailyDrawdown),
          maxDrawdown: percentFromText(firm.maxDrawdown),
          profitSplit: 80,
          minimumTradingDays: index === 0 ? 0 : 3,
          refundableFee: true
        }
      });
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
      await prisma.propFirmRule.create({
        data: {
          firmId: saved.id,
          category,
          title,
          currentValue,
          impactLevel: category === "Risk" ? "HIGH" : "MEDIUM",
          effectiveAt: new Date(firm.lastRuleUpdate)
        }
      });
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

  await prisma.spreadRecord.deleteMany({});

  const instrumentIds = await prisma.instrument.findMany({
    select: { id: true, symbol: true }
  });
  const idBySymbol = new Map(instrumentIds.map((instrument) => [instrument.symbol, instrument.id]));

  for (const record of spreadRecords.slice(0, 1500)) {
    const instrumentId = idBySymbol.get(record.symbol);
    if (!instrumentId) continue;

    await prisma.spreadRecord.create({
      data: {
        instrumentId,
        brokerOrFirm: record.firmName,
        spreadPips: record.spread,
        recordedAt: new Date(record.updatedAt)
      }
    });
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
      title: "Spread matrix baseline added for forex, crypto and synthetic instruments",
      summary: "Every seeded prop firm now has an indicative spread record across the tracked instrument universe.",
      sourceName: "FundedScope Data",
      affectedFirms: ["all"],
      affectedSymbols: ["EURUSD", "BTCUSD", "VIX75"],
      impactLevel: "MEDIUM" as const,
      publishedAt: new Date()
    }
  ];

  for (const item of news) {
    await prisma.newsEvent.create({ data: item });
  }
}

async function main() {
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
