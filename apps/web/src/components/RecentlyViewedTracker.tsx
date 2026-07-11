"use client";

import { useEffect } from "react";
import { hasPersistenceApi, persistenceFetch } from "../lib/persistence-api";

type ViewedItem = {
  title: string;
  href: string;
  type: string;
};

function toApiEntityType(type: string) {
  const normalized = type.toLowerCase().replace(/\s+/g, "_");
  if (normalized === "prop_firm" || normalized === "broker" || normalized === "news" || normalized === "article" || normalized === "page") return normalized;
  return "page";
}

export function RecentlyViewedTracker({ item }: { item: ViewedItem }) {
  useEffect(() => {
    try {
      const key = "fundedscope:recently-viewed";
      const current = JSON.parse(localStorage.getItem(key) ?? "[]") as ViewedItem[];
      const next = [item, ...current.filter((entry) => entry.href !== item.href)].slice(0, 8);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Local storage is optional; never block page rendering.
    }

    if (hasPersistenceApi()) {
      persistenceFetch("/persistence/recently-viewed", {
        method: "POST",
        body: JSON.stringify({
          entityType: toApiEntityType(item.type),
          entitySlug: item.href.split("/").filter(Boolean).pop(),
          title: item.title,
          href: item.href
        })
      }).catch(() => {
        // Persistence should not block content pages.
      });
    }
  }, [item]);

  return null;
}
