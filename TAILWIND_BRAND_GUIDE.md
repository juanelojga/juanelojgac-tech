# TailwindCSS Brand Configuration Guide

## Overview

This document describes the TailwindCSS configuration for the JuaneloJGAC Tech website, following the official brand guidelines and business plan.

## Brand Color Palette

### Primary - Deep Tech Blue

- **Main**: `#0066cc` (primary-500)
- **Usage**: 60% of UI elements, headings, primary buttons, links
- **Tailwind classes**: `bg-primary`, `text-primary`, `border-primary`

### Accent - Teal Cyan

- **Main**: `#00d9cc` (accent-500)
- **Usage**: 10% of UI elements, highlights, call-to-action elements
- **Tailwind classes**: `bg-accent`, `text-accent`, `border-accent`

### Secondary - Silver Gray

- **Main**: `#8a8a8a` (secondary-500)
- **Usage**: 30% of UI elements, secondary buttons, neutral content
- **Tailwind classes**: `bg-secondary`, `text-secondary`, `border-secondary`

### Light Neutral - Off-White

- **Main**: `#f8f8f8` (light-500)
- **Usage**: Background color, light sections
- **Tailwind classes**: `bg-light`, `text-light`

### Dark Neutral - Charcoal

- **Main**: `#2d2d2d` (dark-500)
- **Usage**: Body text, dark backgrounds
- **Tailwind classes**: `bg-dark`, `text-dark`, `border-dark`

## Brand Typography

### Poppins (Headings)

- **Weight**: 400, 500, 600, 700, 800
- **Usage**: All headings (h1-h6)
- **Tailwind class**: `font-heading`

### Inter (Body Text)

- **Weight**: 300, 400, 500, 600, 700
- **Usage**: Body text, paragraphs, general content
- **Tailwind class**: `font-body` (default)

### Space Grotesk (Accents)

- **Weight**: 400, 500, 600, 700
- **Usage**: Special accents, code-like elements
- **Tailwind class**: `font-accent`

## Spacing System

Based on an **8-pixel grid system**:

- `spacing-1` = 8px
- `spacing-2` = 16px
- `spacing-3` = 24px
- etc.

## Border Radius

- **Buttons**: 6px (default) - `rounded` or `rounded-md`
- **Cards**: 8px - `rounded-lg`

## Custom Component Classes

### Buttons

```html
<!-- Primary Button -->
<button class="brand-button">Click Me</button>

<!-- Secondary Button -->
<button class="brand-button-secondary">Click Me</button>

<!-- Outline Button -->
<button class="brand-button-outline">Click Me</button>

<!-- Accent Button -->
<button class="brand-button-accent">Click Me</button>
```

### Cards

```html
<div class="brand-card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

### Layout

```html
<!-- Responsive Container -->
<div class="brand-container">
  <!-- Content -->
</div>

<!-- Section with Proper Spacing -->
<section class="brand-section">
  <!-- Content -->
</section>

<!-- 12-Column Grid -->
<div class="brand-grid-12">
  <!-- Grid items -->
</div>
```

## Animations

Minimal, professional animations are available:

- `animate-fade-in` - Fade in effect
- `animate-fade-out` - Fade out effect
- `animate-slide-in-up` - Slide in from bottom
- `animate-slide-in-down` - Slide in from top
- `animate-slide-in-left` - Slide in from left
- `animate-slide-in-right` - Slide in from right

All animations use a 0.3s duration with appropriate easing.

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Contrast Ratio**: Minimum 4.5:1 for normal text
- **Focus Indicators**: 2px outline with 2px offset
- **Touch Targets**: Minimum 44x44px for mobile
- **Skip Links**: Keyboard navigation support

### Responsive Design

Mobile-first approach with breakpoints:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Reduced Motion Support

Respects user's motion preferences via `prefers-reduced-motion`.

## Usage Examples

### Creating a Hero Section

```html
<section class="brand-section bg-primary text-white">
  <div class="brand-container">
    <h1 class="font-heading text-white">Welcome to JuaneloJGAC Tech</h1>
    <p class="font-body text-lg">Building innovative solutions</p>
    <button class="brand-button-accent">Get Started</button>
  </div>
</section>
```

### Creating a Card Grid

```html
<div class="brand-container brand-section">
  <div class="brand-grid">
    <div class="brand-card">
      <h3>Feature 1</h3>
      <p>Description...</p>
    </div>
    <div class="brand-card">
      <h3>Feature 2</h3>
      <p>Description...</p>
    </div>
    <div class="brand-card">
      <h3>Feature 3</h3>
      <p>Description...</p>
    </div>
  </div>
</div>
```

## Files Modified

1. `tailwind.config.mjs` - Complete Tailwind configuration
2. `src/styles/global.css` - Global styles and custom components
3. `src/layouts/Layout.astro` - Import global styles and accessibility features
4. `astro.config.mjs` - Added Tailwind integration

## Further Customization

To extend the configuration, edit:

- `tailwind.config.mjs` for theme extensions
- `src/styles/global.css` for custom component styles

## Resources

- [TailwindCSS Documentation](https://tailwindcss.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Astro Documentation](https://docs.astro.build)
