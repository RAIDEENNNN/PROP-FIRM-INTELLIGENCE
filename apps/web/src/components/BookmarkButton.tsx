"use client";

import { useEffect, useState } from "react";
import { hasPersistenceApi, persistenceFetch } from "../lib/persistence-api";

type Bookmark = {
  type: string;
  slug: string;
  title: string;
  href: string;
};

const storageKey = "fundedscope:bookmarks";

function readBookmarks(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as Bookmark[];
  } catch {
    return [];
  }
}

function toApiEntityType(type: string) {
  const normalized = type.toLowerCase().replace(/\s+/g, "_");
  if (normalized === "prop_firm" || normalized === "broker" || normalized === "news" || normalized === "article") return normalized;
  return "article";
}

export function BookmarkButton({ bookmark }: { bookmark: Bookmark }) {
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!hasPersistenceApi()) {
        setSaved(readBookmarks().some((item) => item.href === bookmark.href));
        return;
      }

      try {
        const payload = await persistenceFetch("/persistence/bookmarks");
        const bookmarks = payload?.data?.bookmarks ?? [];
        if (active) setSaved(bookmarks.some((item: { href: string }) => item.href === bookmark.href));
      } catch {
        if (active) setSaved(readBookmarks().some((item) => item.href === bookmark.href));
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [bookmark.href]);

  async function toggle() {
    const current = readBookmarks();
    const exists = current.some((item) => item.href === bookmark.href);
    const next = exists ? current.filter((item) => item.href !== bookmark.href) : [bookmark, ...current].slice(0, 30);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setSaved(!exists);

    if (!hasPersistenceApi()) return;

    try {
      setSyncing(true);
      if (exists) {
        await persistenceFetch(`/persistence/bookmarks/${encodeURIComponent(toApiEntityType(bookmark.type))}/${encodeURIComponent(bookmark.slug)}`, {
          method: "DELETE"
        });
      } else {
        await persistenceFetch("/persistence/bookmarks", {
            method: "POST",
            body: JSON.stringify({
            entityType: toApiEntityType(bookmark.type),
            entitySlug: bookmark.slug,
            title: bookmark.title,
            href: bookmark.href
          })
        });
      }
    } catch {
      // Keep the local optimistic state. The profile can resync on next login.
    } finally {
      setSyncing(false);
    }
  }

  return (
    <button type="button" disabled={syncing} onClick={toggle} className="mt-3 w-full rounded-2xl border border-white/10 px-5 py-3 font-bold text-white transition hover:border-electric/40 disabled:opacity-60">
      {syncing ? "Saving..." : saved ? "Bookmarked ✓" : "Bookmark"}
    </button>
  );
}
