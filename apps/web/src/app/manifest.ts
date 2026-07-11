import type { MetadataRoute } from "next";
import { brand } from "../lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyFundedScope",
    short_name: "FundedScope",
    description: brand.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#38bdf8",
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
    categories: ["finance", "business", "productivity"]
  };
}
