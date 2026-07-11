import type { MetadataRoute } from "next";
import { brandArticles } from "../lib/articles";
import { propFirms } from "../lib/data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

const publicStaticRoutes = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/prop-firms", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/brokers", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/compare", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/decision-engine", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/spreads", priority: 0.85, changeFrequency: "daily" as const },
  { path: "/gold", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/news-radar", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/tools", priority: 0.75, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.75, changeFrequency: "weekly" as const },
  { path: "/ai", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/trader-dna", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/trader-connect", priority: 0.65, changeFrequency: "weekly" as const },
  { path: "/roadmap", priority: 0.65, changeFrequency: "weekly" as const },
  { path: "/articles", priority: 0.75, changeFrequency: "weekly" as const },
  { path: "/sources", priority: 0.65, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/company", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.45, changeFrequency: "monthly" as const },
  { path: "/partners", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/affiliate-program", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/api-access", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/status", priority: 0.45, changeFrequency: "daily" as const },
  { path: "/legal/how-we-score", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/legal/editorial-policy", priority: 0.65, changeFrequency: "monthly" as const },
  { path: "/legal/affiliate-disclosure", priority: 0.65, changeFrequency: "monthly" as const },
  { path: "/legal/privacy", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/legal/terms", priority: 0.5, changeFrequency: "yearly" as const }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...publicStaticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...propFirms.map((firm) => ({
      url: `${siteUrl}/prop-firms/${firm.slug}`,
      lastModified: new Date(`${firm.lastRuleUpdate}T00:00:00.000Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...brandArticles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: new Date(`${article.publishedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];
}
