/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: '#06020a',
        },
        neutral: {
          darkest: '#06020a',
          darker: '#1e1b22',
          lightest: '#f5f5f5',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '6xl': ['64px', { lineHeight: '1.1', letterSpacing: '-0.64px' }],
        xl: ['20px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};
