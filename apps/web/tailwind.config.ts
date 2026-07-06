import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050711",
        midnight: "#09111f",
        panel: "rgba(13, 22, 39, 0.72)",
        electric: "#35d3ff",
        violet: "#8b5cf6",
        plasma: "#d946ef",
        success: "#2ee59d",
        danger: "#ff4d6d",
        warning: "#fbbf24"
      },
      boxShadow: {
        glow: "0 0 48px rgba(53, 211, 255, 0.18)",
        violet: "0 0 48px rgba(139, 92, 246, 0.18)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 20%, rgba(53, 211, 255, 0.16), transparent 24%), radial-gradient(circle at 80% 0%, rgba(139, 92, 246, 0.18), transparent 26%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
