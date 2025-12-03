# SEO Component - Usage Guide

## Overview

The `Seo.astro` component provides comprehensive, bilingual SEO metadata for all pages in the JuaneloJGAC Tech website.

## What's Included

### Core Meta Tags

- **Charset**: UTF-8
- **Viewport**: Responsive viewport settings
- **Theme Color**: Brand teal (#1BC3C7)
- **Language**: Dynamic lang attribute based on user language
- **Canonical URL**: Proper canonical links for SEO
- **Alternate Links**: Bilingual alternate links (EN/ES)

### Social Media Tags

- **Open Graph (Facebook)**: Title, description, image, locale
- **Twitter Card**: Large image card with full metadata
- **Site Name**: JuaneloJGAC Tech branding

### Search Engine Optimization

- **Title**: Bilingual with site name
- **Description**: Company value proposition
- **Keywords**: AI Solutions, Software Development, Automation, etc.
- **Robots**: Index and follow directives

### Structured Data (Schema.org)

- **Organization**: Complete company information
- **Contact Point**: Email and language support
- **Service Area**: United States and Ecuador
- **Social Links**: Instagram, Twitter, LinkedIn

## Files Modified/Created

1. **`src/components/Seo.astro`** - Main SEO component
2. **`src/i18n/en.json`** - Added SEO translations (English)
3. **`src/i18n/es.json`** - Added SEO translations (Spanish)
4. **`src/layouts/Layout.astro`** - Integrated SEO component

## Default Behavior

The Layout component automatically applies default SEO to all pages using the translations:

- Default Title: "JuaneloJGAC Tech - AI-Powered Solutions for Startups & SMEs"
- Default Description: Company value proposition
- Default Image: `/og-image.jpg`

## Customizing SEO for Specific Pages

### Basic Page Example

```astro
---
import Layout from "../layouts/Layout.astro";

const lang = "en"; // or 'es'
---

<Layout lang={lang}>
  <!-- Your page content -->
</Layout>
```

### Custom Title and Description

```astro
---
import Layout from "../layouts/Layout.astro";

const lang = "en";
const pageTitle = "Our Services";
const pageDescription = "Explore our AI-powered solutions for startups and SMEs";
---

<Layout title={pageTitle} description={pageDescription} lang={lang}>
  <!-- Your page content -->
</Layout>
```

### Custom Social Image

```astro
---
import Layout from "../layouts/Layout.astro";

const lang = "en";
const pageTitle = "Blog Post Title";
const pageDescription = "Blog post description";
const socialImage = "/assets/blog/post-image.jpg";
---

<Layout title={pageTitle} description={pageDescription} image={socialImage} lang={lang}>
  <!-- Your page content -->
</Layout>
```

## SEO Checklist

When creating new pages, ensure:

- ✅ Page has unique title
- ✅ Page has unique description (150-160 characters)
- ✅ Language is set correctly (en/es)
- ✅ Custom OG image for important pages (1200x630px)
- ✅ Title is under 60 characters
- ✅ Description contains target keywords

## Testing

### View Generated SEO Tags

1. Build the project: `npm run build`
2. Check `dist/index.html` for rendered meta tags
3. Use browser dev tools to inspect `<head>` section

### SEO Validation Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## Bilingual SEO Features

The component automatically handles:

- Language-specific meta descriptions
- Proper `hreflang` tags for both EN and ES
- Locale-specific Open Graph tags
- Default language fallback (`x-default`)

## Schema.org Structured Data

The component includes Organization schema with:

- Company name and URL
- Mission description
- Contact information
- Service areas (US and Ecuador)
- Social media profiles

## Notes

- The component uses `Astro.url.pathname` to determine canonical URLs
- Default SEO values are pulled from `i18n/*.json` files
- All visible text is internationalized (never hard-coded)
- The OG image defaults to `/og-image.jpg` (ensure this file exists)

## Support

For questions or issues with the SEO component, refer to:

- `src/components/Seo.astro` - Component source
- `CLAUDE.md` - Project conventions
- Astro SEO docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/
