/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: "#06020a",
        },
        neutral: {
          darkest: "#06020a",
          darker: "#1e1b22",
          lightest: "#f5f5f5",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        sora: ["Sora", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "6xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.64px" }],
        xl: ["20px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};
