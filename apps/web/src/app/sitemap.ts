import type { MetadataRoute } from "next";
import { propFirms, routes } from "../lib/data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    ...routes.map((route) => route.href),
    "/about",
    "/contact",
    "/sign-in",
    "/sign-up",
    "/legal/how-we-score",
    "/legal/editorial-policy",
    "/legal/affiliate-disclosure",
    "/legal/privacy",
    "/legal/terms"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" as const : "weekly" as const,
      priority: path === "" ? 1 : 0.7
    })),
    ...propFirms.map((firm) => ({
      url: `${siteUrl}/prop-firms/${firm.slug}`,
      lastModified: new Date(`${firm.lastRuleUpdate}T00:00:00.000Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
