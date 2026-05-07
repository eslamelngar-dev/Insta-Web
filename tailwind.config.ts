import type { Config } from "tailwindcss";

const config: Config = {
darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: { 950: "#020617", 900: "#0f172a" },
        indigo: { 600: "#4f46e5", 500: "#6366f1" },
      },
    },
  },
  plugins: [],
};
export default config;