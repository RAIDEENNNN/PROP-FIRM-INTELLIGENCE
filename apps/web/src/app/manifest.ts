import type { MetadataRoute } from "next";
import { brand } from "../lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "FundedScope - Prop Firm & Broker Intelligence",
    short_name: "FundedScope",
    description: brand.description,
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen", "minimal-ui"],
    background_color: "#020617",
    theme_color: "#0b1020",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/pwa/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: brand.logoPath,
        sizes: "512x512",
        type: "image/png"
      }
    ],
    shortcuts: [
      {
        name: "Compare firms",
        short_name: "Compare",
        description: "Open the FundedScope prop firm comparison desk.",
        url: "/compare?source=pwa-shortcut",
        icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Market Intelligence",
        short_name: "Intel",
        description: "Open market risk, sessions and news context.",
        url: "/market-intelligence?source=pwa-shortcut",
        icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Broker research",
        short_name: "Brokers",
        description: "Open the FundedScope broker research directory.",
        url: "/brokers?source=pwa-shortcut",
        icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" }]
      }
    ],
    categories: ["finance", "business", "productivity"],
    lang: "en",
    dir: "ltr"
  };
}
