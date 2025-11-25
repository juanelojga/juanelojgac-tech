/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Existing colors
        brand: {
          darkest: "#06020a",
        },
        // Primitives
        white: "var(--Color-White)",
        neutral: {
          lightest: "var(--Color-Neutral-Lightest)",
          lighter: "var(--Color-Neutral-Lighter)",
          light: "var(--Color-Neutral-Light)",
          DEFAULT: "var(--Color-Neutral)",
          dark: "var(--Color-Neutral-Dark)",
          darker: "var(--Color-Neutral-Darker)",
          darkest: "var(--Color-Neutral-Darkest)",
        },
        // Opacity Values - White
        transparent: "var(--Opacity-Transparent)",
        "white-5": "var(--Opacity-White-5)",
        "white-10": "var(--Opacity-White-10)",
        "white-15": "var(--Opacity-White-15)",
        "white-20": "var(--Opacity-White-20)",
        "white-30": "var(--Opacity-White-30)",
        "white-40": "var(--Opacity-White-40)",
        "white-50": "var(--Opacity-White-50)",
        "white-60": "var(--Opacity-White-60)",
        // Opacity Values - Neutral Darkest
        "neutral-darkest-5": "var(--Opacity-Neutral-Darkest-5)",
        "neutral-darkest-10": "var(--Opacity-Neutral-Darkest-10)",
        "neutral-darkest-15": "var(--Opacity-Neutral-Darkest-15)",
        "neutral-darkest-20": "var(--Opacity-Neutral-Darkest-20)",
        "neutral-darkest-30": "var(--Opacity-Neutral-Darkest-30)",
        "neutral-darkest-40": "var(--Opacity-Neutral-Darkest-40)",
        "neutral-darkest-50": "var(--Opacity-Neutral-Darkest-50)",
        "neutral-darkest-60": "var(--Opacity-Neutral-Darkest-60)",
        // Tarawera
        tarawera: {
          lightest: "var(--Color-Tarawera-Lightest)",
          lighter: "var(--Color-Tarawera-Lighter)",
          light: "var(--Color-Tarawera-Light)",
          DEFAULT: "var(--Color-Tarawera)",
          dark: "var(--Color-Tarawera-Dark)",
          darker: "var(--Color-Tarawera-Darker)",
          darkest: "var(--Color-Tarawera-Darkest)",
        },
        // Persian Green
        "persian-green": {
          lightest: "var(--Color-Persian-Green-Lightest)",
          lighter: "var(--Color-Persian-Green-Lighter)",
          light: "var(--Color-Persian-Green-Light)",
          DEFAULT: "var(--Color-Persian-Green)",
          dark: "var(--Color-Persian-Green-Dark)",
          darker: "var(--Color-Persian-Green-Darker)",
          darkest: "var(--Color-Persian-Green-Darkest)",
        },
        // Coral
        coral: {
          lightest: "var(--Color-Coral-Lightest)",
          lighter: "var(--Color-Coral-Lighter)",
          light: "var(--Color-Coral-Light)",
          DEFAULT: "var(--Color-Coral)",
          dark: "var(--Color-Coral-Dark)",
          darker: "var(--Color-Coral-Darker)",
          darkest: "var(--Color-Coral-Darkest)",
        },
        // Purple Heart
        "purple-heart": {
          lightest: "var(--Color-Purple-Heart-Lightest)",
          lighter: "var(--Color-Purple-Heart-Lighter)",
          light: "var(--Color-Purple-Heart-Light)",
          DEFAULT: "var(--Color-Purple-Heart)",
          dark: "var(--Color-Purple-Heart-Dark)",
          darker: "var(--Color-Purple-Heart-Darker)",
          darkest: "var(--Color-Purple-Heart-Darkest)",
        },
        // Color Scheme 1
        "color-scheme-1-text": "var(--Color-Scheme-1-Text)",
        "color-scheme-1-foreground": "var(--Color-Scheme-1-Foreground)",
        "color-scheme-1-background": "var(--Color-Scheme-1-Background)",
        "color-scheme-1-border": "var(--Color-Scheme-1-Border)",
        "color-scheme-1-accent": "var(--Color-Scheme-1-Accent)",
        // Color Scheme 2
        "color-scheme-2-text": "var(--Color-Scheme-2-Text)",
        "color-scheme-2-background": "var(--Color-Scheme-2-Background)",
        "color-scheme-2-border": "var(--Color-Scheme-2-Border)",
        "color-scheme-2-accent": "var(--Color-Scheme-2-Accent)",
        "color-scheme-2-foreground": "var(--Color-Scheme-2-Foreground)",
        // Color Scheme 3
        "color-scheme-3-text": "var(--Color-Scheme-3-Text)",
        "color-scheme-3-background": "var(--Color-Scheme-3-Background)",
        "color-scheme-3-border": "var(--Color-Scheme-3-Border)",
        "color-scheme-3-accent": "var(--Color-Scheme-3-Accent)",
        "color-scheme-3-foreground": "var(--Color-Scheme-3-Foreground)",
        // Color Scheme 4
        "color-scheme-4-text": "var(--Color-Scheme-4-Text)",
        "color-scheme-4-background": "var(--Color-Scheme-4-Background)",
        "color-scheme-4-border": "var(--Color-Scheme-4-Border)",
        "color-scheme-4-accent": "var(--Color-Scheme-4-Accent)",
        "color-scheme-4-foreground": "var(--Color-Scheme-4-Foreground)",
        // Color Scheme 5
        "color-scheme-5-text": "var(--Color-Scheme-5-Text)",
        "color-scheme-5-background": "var(--Color-Scheme-5-Background)",
        "color-scheme-5-border": "var(--Color-Scheme-5-Border)",
        "color-scheme-5-accent": "var(--Color-Scheme-5-Accent)",
        "color-scheme-5-foreground": "var(--Color-Scheme-5-Foreground)",
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
