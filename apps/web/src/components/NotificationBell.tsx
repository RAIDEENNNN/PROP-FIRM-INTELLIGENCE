"use client";

import { useEffect, useState } from "react";
import { hasPersistenceApi, persistenceFetch } from "../lib/persistence-api";

const fallbackNotifications = [
  "Sign in to view personal alerts, watchlists and saved research.",
  "Report moderation helps FundedScope keep broker and prop-firm data accurate.",
  "Market and broker figures are source-gated so unsupported numbers are not presented as facts."
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id?: string; title: string; message: string; readAt?: string | null }>>(
    fallbackNotifications.map((message) => ({ title: "FundedScope", message }))
  );

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

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 text-lg text-white transition hover:border-electric/40"
      >
        🔔
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-electric" />
      </button>
      {open ? (
        <div className="absolute right-0 top-13 z-50 w-[min(calc(100vw-2rem),20rem)] rounded-3xl border border-white/10 bg-midnight/95 p-3 shadow-glow backdrop-blur-xl">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-electric">Notifications</p>
          <div className="mt-3 grid gap-2">
            {notifications.map((notification) => (
              <div key={notification.id ?? notification.message} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-5 text-slate-200">
                <p className="font-bold text-white">{notification.title}</p>
                <p className="mt-1 text-slate-300">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
