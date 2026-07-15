import type { MetadataRoute } from "next";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { brandArticles } from "../lib/articles";
import { propFirms } from "../lib/data";
import { brokers } from "../lib/brokers";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

type SitemapFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const blockedRoutePrefixes = [
  "/_not-found",
  "/admin",
  "/api",
  "/alerts",
  "/dashboard",
  "/journal",
  "/onboarding-complete",
  "/profile",
  "/report",
  "/settings",
  "/sign-in",
  "/sign-up",
  "/welcome"
];

const routeOverrides = new Map<string, { priority: number; changeFrequency: SitemapFrequency }>([
  ["", { priority: 1, changeFrequency: "daily" }],
  ["/prop-firms", { priority: 0.9, changeFrequency: "daily" }],
  ["/brokers", { priority: 0.9, changeFrequency: "daily" }],
  ["/compare", { priority: 0.85, changeFrequency: "weekly" }],
  ["/decision-engine", { priority: 0.85, changeFrequency: "weekly" }],
  ["/spreads", { priority: 0.85, changeFrequency: "daily" }],
  ["/gold", { priority: 0.8, changeFrequency: "daily" }],
  ["/news-radar", { priority: 0.8, changeFrequency: "daily" }],
  ["/calculators", { priority: 0.75, changeFrequency: "weekly" }],
  ["/tools", { priority: 0.75, changeFrequency: "weekly" }],
  ["/pricing", { priority: 0.75, changeFrequency: "weekly" }],
  ["/articles", { priority: 0.75, changeFrequency: "weekly" }],
  ["/ai", { priority: 0.7, changeFrequency: "weekly" }],
  ["/trader-dna", { priority: 0.7, changeFrequency: "weekly" }],
  ["/about", { priority: 0.7, changeFrequency: "monthly" }],
  ["/company", { priority: 0.7, changeFrequency: "monthly" }],
  ["/sources", { priority: 0.65, changeFrequency: "weekly" }],
  ["/trader-connect", { priority: 0.65, changeFrequency: "weekly" }],
  ["/roadmap", { priority: 0.65, changeFrequency: "weekly" }],
  ["/affiliate-program", { priority: 0.6, changeFrequency: "monthly" }],
  ["/api-access", { priority: 0.6, changeFrequency: "monthly" }],
  ["/contact", { priority: 0.6, changeFrequency: "monthly" }],
  ["/partners", { priority: 0.6, changeFrequency: "monthly" }],
  ["/legal/how-we-score", { priority: 0.75, changeFrequency: "monthly" }],
  ["/legal/editorial-policy", { priority: 0.65, changeFrequency: "monthly" }],
  ["/legal/affiliate-disclosure", { priority: 0.65, changeFrequency: "monthly" }],
  ["/legal/privacy", { priority: 0.5, changeFrequency: "yearly" }],
  ["/legal/terms", { priority: 0.5, changeFrequency: "yearly" }]
]);

function appDirectory() {
  const candidates = [join(process.cwd(), "src", "app"), join(process.cwd(), "apps", "web", "src", "app")];
  return candidates.find((candidate) => existsSync(candidate));
}

function isPublicStaticRoute(path: string) {
  if (path.includes("[") || path.includes("(")) return false;
  return !blockedRoutePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function discoverPublicStaticRoutes() {
  const appDir = appDirectory();
  if (!appDir) return [""];
  const appRoot = appDir;

  const routes = new Set<string>();

  function walk(directory: string) {
    for (const entry of readdirSync(directory)) {
      const absolute = join(directory, entry);
      const stats = statSync(absolute);
      if (stats.isDirectory()) {
        walk(absolute);
        continue;
      }

      if (entry !== "page.tsx") continue;
      const routePath = relative(appRoot, directory).split(sep).filter(Boolean).join("/");
      const route = routePath ? `/${routePath}` : "";
      if (isPublicStaticRoute(route)) routes.add(route);
    }
  }

  walk(appDir);
  return [...routes].sort((a, b) => a.localeCompare(b));
}

function staticRouteConfig(path: string) {
  return routeOverrides.get(path) ?? { priority: path.startsWith("/legal/") ? 0.5 : 0.6, changeFrequency: "weekly" as const };
}

function brokerProfileRouteExists() {
  const appDir = appDirectory();
  return appDir ? existsSync(join(appDir, "brokers", "[slug]", "page.tsx")) : false;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = discoverPublicStaticRoutes();

  return [
    ...staticRoutes.map((path) => {
      const route = staticRouteConfig(path);
      return {
        url: `${siteUrl}${path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority
      };
    }),
    ...propFirms.map((firm) => ({
      url: `${siteUrl}/prop-firms/${firm.slug}`,
      lastModified: new Date(`${firm.lastRuleUpdate}T00:00:00.000Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...(brokerProfileRouteExists()
      ? brokers.map((broker) => ({
        url: `${siteUrl}/brokers/${broker.slug}`,
        lastModified: broker.lastVerified.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(`${broker.lastVerified}T00:00:00.000Z`) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8
      }))
      : []),
    ...brandArticles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: new Date(`${article.publishedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];
}
