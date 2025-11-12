# Hero Section Image Assets

This directory contains the image assets for the Hero section component.

## Required Images

Place the following images in this directory for the Hero section to display correctly:

### 1. Background Gradient Image
**Filename:** `5d1debaf8ff7220711ed40b9cdce6f19.png`
**Description:** Full-width gradient background in dusty pink to purple
**Usage:** Main background image for the entire Hero section
**Fallback:** CSS gradient `linear-gradient(135deg, #e34d88 0%, #8b5cf6 100%)` is used if image is not available

### 2. Concentric Circles Graphic
**Filename:** `ac63c33783ef1f1c4af1d0f1eca78e23.png`
**Description:** Decorative concentric circles graphic
**Usage:** Positioned absolutely behind the logo/brand graphic (right side)
**Accessibility:** Marked as decorative with `aria-hidden="true"` and empty alt text

### 3. Logo/Brand Graphic
**Filename:** `1f41f103a7320a047cbd28e601e0fb1e.png`
**Description:** Company logo and brand graphic
**Usage:** Displayed on the right side of the Hero section (center-right on desktop)
**Accessibility:** Has descriptive alt text from i18n translations

## Image Specifications

- **Format:** PNG (supports transparency for layering effects)
- **Optimization:** Use optimized images for web (compressed, properly sized)
- **Loading:** Images are set to `loading="eager"` and `fetchpriority="high"` for above-the-fold content
- **Responsive:** Images scale appropriately across mobile, tablet, and desktop viewports

## Current Status

⚠️ **Images are not yet in the repository**

The Hero component is fully functional and will display CSS gradient fallbacks until the actual images are placed in this directory.

To add the images:
1. Obtain the three image files from the design team
2. Rename them to match the filenames above (or update the paths in `/src/components/sections/Hero.astro`)
3. Place them in `/public/images/hero/`
4. The component will automatically detect and display the images

## Testing

After adding images:
- Run `npm run dev` to see the Hero section with images locally
- Run `npm run test:e2e -- tests/sections/Hero.spec.ts` to validate the Hero component with images
- Check all three viewport sizes (mobile, tablet, desktop) for proper image rendering

## Design System

The Hero section follows the brand's dusty pink → purple gradient design:
- **Primary Color (Dusty Pink):** `#e34d88`
- **Accent Color (Purple):** `#8b5cf6`
- **Gradient Direction:** 135deg (diagonal from top-left to bottom-right)
- **Text Color:** White (`#ffffff`) for maximum contrast on gradient background

For questions about the design or assets, refer to:
- Design file: "Tech Website in Dusty Pink Purple White Gradients Style"
- Component: `/src/components/sections/Hero.astro`
- i18n: `/src/i18n/en.json` and `/src/i18n/es.json`
