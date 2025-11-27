/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        tarawera: "#0a3f66",
        "scheme-text-primary": "#06020a",
        "scheme-border": "rgba(6, 2, 10, 0.15)",
        neutral: {
          darkest: "#06020a",
          darker: "#1a1a1a",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
      fontSize: {
        regular: "18px",
        logo: "12px",
      },
      borderRadius: {
        small: "8px",
        "full-button": "100px",
      },
      spacing: {
        "page-padding": "64px",
      },
    },
  },
  plugins: [],
};
