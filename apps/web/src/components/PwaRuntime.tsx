"use client";

import { useEffect } from "react";

export function PwaRuntime() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Service worker registration failed.";
        console.error("FundedScope PWA registration error", { message });
      }
    };

    void register();
  }, []);

  return null;
}
