import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ff6b2d",
          red: "#b91c1c",
          dark: "#3d1f1f",
          "dark-deep": "#1a0f0f",
          yellow: "#f59e0b",
          green: "#10b981",
        },
      },
    },
  },
};

export default config;


