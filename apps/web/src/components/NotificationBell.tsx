"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase/client";
import { hasPersistenceApi, persistenceFetch } from "../lib/persistence-api";

const fallbackNotifications: Notification[] = [
  { title: "Account alerts", message: "Sign in to view personal alerts, watchlists and saved research.", href: "/sign-in" },
  { title: "Data quality", message: "Report incorrect broker or prop-firm information so FundedScope can review it.", href: "/report" },
  { title: "Market references", message: "Live figures are source-gated. Unsupported numbers are not presented as facts.", href: "/sources" }
];

type Notification = {
  id?: string;
  title: string;
  message: string;
  href?: string | null;
  readAt?: string | null;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(fallbackNotifications);
  const rootRef = useRef<HTMLDivElement>(null);
  const unreadCount = useMemo(() => notifications.filter((notification) => notification.id && !notification.readAt).length, [notifications]);

  useEffect(() => {
    let active = true;
    async function addLifecyclePrompts() {
      if (!isSupabaseBrowserConfigured()) return;
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const createdAt = data.session?.user.created_at;
      if (!active || !createdAt) return;

      const accountAgeDays = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
      if (accountAgeDays >= 3) {
        setNotifications((items) => {
          if (items.some((item) => item.title === "Unlock more intelligence")) return items;
          return [
            {
              title: "Unlock more intelligence",
              message: "Pro and Elite add saved dashboards, alerts, AI reviews and deeper Trader DNA features.",
              href: "/pricing"
            },
            ...items
          ];
        });
      }
    }

    void addLifecyclePrompts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasPersistenceApi()) return;
    persistenceFetch("/persistence/notifications")
      .then((payload) => {
        const items = payload?.data?.notifications ?? [];
        if (items.length) setNotifications(items);
      })
      .catch(() => {
        // Fallback notices are intentionally shown when the user is signed out or account services are unreachable.
      });
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !hasPersistenceApi()) return;

    const unread = notifications.filter((notification) => notification.id && !notification.readAt);
    if (!unread.length) return;

    unread.forEach((notification) => {
      persistenceFetch(`/persistence/notifications/${notification.id}/read`, { method: "PATCH" }).catch(() => {
        // The list remains usable even if read-state persistence is unavailable.
      });
    });

    setNotifications((items) =>
      items.map((notification) => (notification.id && !notification.readAt ? { ...notification, readAt: new Date().toISOString() } : notification))
    );
  }, [open, notifications]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        aria-controls="notification-menu"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-electric/40 hover:text-electric sm:h-11 sm:w-11"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
          <path d="M4 17h16" />
          <path d="M18 17v-6a6 6 0 0 0-12 0v6" />
          <path d="M9 5a3 3 0 0 1 6 0" />
        </svg>
        {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-electric" /> : null}
      </button>
      {open ? (
        <div id="notification-menu" role="menu" className="absolute right-0 top-full z-50 mt-3 w-[min(calc(100vw-1.5rem),20rem)] rounded-3xl border border-white/10 bg-midnight/95 p-3 shadow-glow backdrop-blur-xl">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-electric">Notifications</p>
          <div className="mt-3 grid gap-2">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id ?? notification.message} notification={notification} onSelect={() => setOpen(false)} />
            ))}
          </div>
          <Link href="/alerts" onClick={() => setOpen(false)} className="mt-3 block rounded-2xl border border-electric/25 px-3 py-2 text-center text-sm font-bold text-electric transition hover:bg-electric/10">
            View alerts
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function NotificationItem({
  notification,
  onSelect
}: {
  notification: Notification;
  onSelect: () => void;
}) {
  const className = "rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left text-sm leading-5 text-slate-200 transition hover:border-electric/25 hover:bg-white/[0.06]";
  const content = (
    <>
      <p className="font-bold text-white">{notification.title}</p>
      <p className="mt-1 text-slate-300">{notification.message}</p>
    </>
  );

  if (notification.href) {
    return (
      <Link href={notification.href} onClick={onSelect} role="menuitem" className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div role="menuitem" className={className}>
      {content}
    </div>
  );
}
