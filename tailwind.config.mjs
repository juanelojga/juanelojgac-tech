/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Brand Color Palette
      colors: {
        // Primary - Dusty Pink to Purple Gradient
        primary: {
          50: '#fdf4f7',
          100: '#fbe8ef',
          200: '#f7d1df',
          300: '#f3a9c7',
          400: '#ed76a6',
          500: '#e34d88', // Main Dusty Pink
          600: '#d1346f',
          700: '#b52558',
          800: '#97214a',
          900: '#7e1f40',
          950: '#4d0d22',
        },
        // Accent - Deep Purple
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Main Purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Secondary - Silver Gray
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#8a8a8a', // Main Silver Gray
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
          950: '#171717',
        },
        // Light Neutral - Off-White
        light: {
          DEFAULT: '#f8f8f8',
          50: '#ffffff',
          100: '#fefefe',
          200: '#fcfcfc',
          300: '#fafafa',
          400: '#f9f9f9',
          500: '#f8f8f8', // Main Off-White
        },
        // Dark Neutral - Charcoal
        dark: {
          DEFAULT: '#2d2d2d',
          50: '#a8a8a8',
          100: '#8f8f8f',
          200: '#6e6e6e',
          300: '#4d4d4d',
          400: '#3d3d3d',
          500: '#2d2d2d', // Main Charcoal
          600: '#242424',
          700: '#1a1a1a',
          800: '#111111',
          900: '#080808',
          950: '#000000',
        },
        // shadcn/ui CSS Variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      // Brand Typography
      fontFamily: {
        // Headings - Poppins
        heading: [
          'Poppins',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        // Body - Inter
        body: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        // Accents - Space Grotesk
        accent: [
          'Space Grotesk',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'monospace',
        ],
        // Default to body font
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      // 8px Grid System
      spacing: {
        0: '0px',
        0.5: '4px', // 0.5 * 8px
        1: '8px', // 1 * 8px
        1.5: '12px', // 1.5 * 8px
        2: '16px', // 2 * 8px
        2.5: '20px', // 2.5 * 8px
        3: '24px', // 3 * 8px
        3.5: '28px', // 3.5 * 8px
        4: '32px', // 4 * 8px
        5: '40px', // 5 * 8px
        6: '48px', // 6 * 8px
        7: '56px', // 7 * 8px
        8: '64px', // 8 * 8px
        9: '72px', // 9 * 8px
        10: '80px', // 10 * 8px
        11: '88px', // 11 * 8px
        12: '96px', // 12 * 8px
        14: '112px', // 14 * 8px
        16: '128px', // 16 * 8px
        20: '160px', // 20 * 8px
        24: '192px', // 24 * 8px
        28: '224px', // 28 * 8px
        32: '256px', // 32 * 8px
        36: '288px', // 36 * 8px
        40: '320px', // 40 * 8px
        44: '352px', // 44 * 8px
        48: '384px', // 48 * 8px
        52: '416px', // 52 * 8px
        56: '448px', // 56 * 8px
        60: '480px', // 60 * 8px
        64: '512px', // 64 * 8px
        72: '576px', // 72 * 8px
        80: '640px', // 80 * 8px
        96: '768px', // 96 * 8px
      },
      // Border Radius for Buttons and Cards (6-8px)
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '6px', // Standard for buttons
        md: '6px',
        lg: '8px', // Standard for cards
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
      // Minimal Professional Animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      // 12-Column Grid
      gridTemplateColumns: {
        12: 'repeat(12, minmax(0, 1fr))',
      },
      // Contrast Ratio Utilities (4.5:1 minimum for WCAG 2.1 AA)
      // Defined in base styles
    },
  },
  plugins: [
    // Custom plugin for brand-specific utilities
    function ({ addUtilities, addBase }) {
      // Add base styles for accessibility and brand defaults
      addBase({
        // Smooth scrolling
        html: {
          scrollBehavior: 'smooth',
          fontSize: '16px', // Base font size for accessibility
        },
        body: {
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#2d2d2d', // Charcoal
          backgroundColor: '#f8f8f8', // Off-White
          lineHeight: '1.6',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        // Headings default to Poppins
        'h1, h2, h3, h4, h5, h6': {
          fontFamily:
            'Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '600',
          lineHeight: '1.2',
          color: '#0066cc', // Deep Tech Blue
        },
        // Focus styles for accessibility
        '*:focus-visible': {
          outline: '2px solid #0066cc',
          outlineOffset: '2px',
        },
        // Link styles
        a: {
          color: '#0066cc',
          textDecoration: 'underline',
          transition: 'color 0.2s ease-in-out',
        },
        'a:hover': {
          color: '#003d7a',
        },
        'a:focus': {
          outline: '2px solid #0066cc',
          outlineOffset: '2px',
        },
      });

      // Add custom utilities for brand color balance and gradients
      addUtilities({
        '.brand-primary-bg': {
          backgroundColor: '#e34d88', // 60% - Dusty Pink
        },
        '.brand-neutral-bg': {
          backgroundColor: '#8a8a8a', // 30% - Neutral
        },
        '.brand-accent-bg': {
          backgroundColor: '#8b5cf6', // 10% - Purple
        },
        '.brand-text-primary': {
          color: '#e34d88',
        },
        '.brand-text-accent': {
          color: '#8b5cf6',
        },
        '.brand-text-dark': {
          color: '#2d2d2d',
        },
        // Gradient utilities for dusty pink to purple
        '.bg-gradient-primary': {
          backgroundImage: 'linear-gradient(135deg, #e34d88 0%, #8b5cf6 100%)',
        },
        '.bg-gradient-primary-hover': {
          backgroundImage: 'linear-gradient(135deg, #d1346f 0%, #7c3aed 100%)',
        },
        '.bg-gradient-primary-active': {
          backgroundImage: 'linear-gradient(135deg, #b52558 0%, #6d28d9 100%)',
        },
        '.shadow-glow-primary': {
          boxShadow: '0 0 20px rgba(227, 77, 136, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        },
        '.shadow-glow-primary-hover': {
          boxShadow: '0 0 25px rgba(227, 77, 136, 0.5), 0 0 50px rgba(139, 92, 246, 0.3)',
        },
        // Card styles with proper spacing and contrast
        '.brand-card': {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e5e5',
        },
        // Button styles with proper contrast and gradients
        '.brand-button': {
          backgroundImage: 'linear-gradient(135deg, #e34d88 0%, #8b5cf6 100%)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: '500',
          transition: 'all 0.3s ease-in-out',
          border: 'none',
          cursor: 'pointer',
        },
        '.brand-button:hover': {
          backgroundImage: 'linear-gradient(135deg, #d1346f 0%, #7c3aed 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 0 20px rgba(227, 77, 136, 0.4), 0 4px 12px rgba(139, 92, 246, 0.3)',
        },
        '.brand-button:focus': {
          outline: '2px solid #e34d88',
          outlineOffset: '2px',
        },
        '.brand-button:active': {
          backgroundImage: 'linear-gradient(135deg, #b52558 0%, #6d28d9 100%)',
          transform: 'translateY(0)',
        },
        '.brand-button-secondary': {
          backgroundColor: 'transparent',
          color: '#e34d88',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: '500',
          transition: 'all 0.3s ease-in-out',
          border: '2px solid #e34d88',
          cursor: 'pointer',
        },
        '.brand-button-secondary:hover': {
          backgroundColor: '#fdf4f7',
          borderColor: '#8b5cf6',
          color: '#8b5cf6',
        },
      });
    },
  ],
};
