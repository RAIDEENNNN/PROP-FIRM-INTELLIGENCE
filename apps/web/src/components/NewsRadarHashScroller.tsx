"use client";

import { useEffect } from "react";

export function NewsRadarHashScroller() {
  useEffect(() => {
    function syncHashTarget() {
      const id = decodeURIComponent(window.location.hash.replace("#", ""));
      const targets = Array.from(document.querySelectorAll<HTMLElement>(".radar-target"));

      targets.forEach((target) => target.removeAttribute("data-active"));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      target.setAttribute("data-active", "true");

      window.requestAnimationFrame(() => {
        const header = document.querySelector("header");
        const offset = (header?.getBoundingClientRect().height ?? 128) + 24;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    }

    syncHashTarget();
    window.addEventListener("hashchange", syncHashTarget);

    return () => {
      window.removeEventListener("hashchange", syncHashTarget);
    };
  }, []);

  return null;
}
