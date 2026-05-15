import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#070B1A",
          panel: "rgba(15, 23, 42, 0.82)",
          cyan: "#38BDF8",
          purple: "#A855F7",
          nitro: "#22D3EE",
          warning: "#F97316",
          success: "#22C55E",
          danger: "#EF4444",
          text: "#F8FAFC",
          muted: "#94A3B8"
        }
      },
      boxShadow: {
        neon: "0 0 28px rgba(56, 189, 248, 0.28)",
        magenta: "0 0 28px rgba(168, 85, 247, 0.26)"
      },
      backgroundImage: {
        "track-grid":
          "linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px)",
        "speed-lines":
          "repeating-linear-gradient(112deg, rgba(56,189,248,0.12) 0 1px, transparent 1px 28px)"
      }
    }
  },
  plugins: []
};

export default config;
