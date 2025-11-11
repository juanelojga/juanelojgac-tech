# juanelojgac-webpage

## Project Overview

A fast, SEO-optimized, bilingual personal website built with modern web technologies.

**Tech Stack:**
- **Framework:** Astro v5+ (Static Site Generation)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS (utility-first CSS)
- **Interactivity:** React (only when needed)
- **Deployment:** Netlify
- **Languages:** English (EN) + Spanish (ES)

## Project Structure

```
juanelojgac-tech/
├── src/
│   ├── assets/          # Images, SVGs, static assets
│   ├── components/      # Reusable .astro and .tsx components
│   ├── layouts/         # Page layouts (base templates)
│   ├── pages/           # File-based routing (*.astro)
│   ├── styles/          # Global CSS, Tailwind config
│   └── i18n/            # Translation files (en.json, es.json)
├── public/              # Static files (robots.txt, favicon, etc.)
├── .claude/             # Claude AI configuration
└── astro.config.mjs     # Astro configuration
```

## Key Features

- **SEO-First:** Semantic HTML, meta tags, Open Graph support
- **Performance:** Static generation, optimized assets, minimal JS
- **Accessibility:** WCAG 2.1 AA compliance, ARIA labels, keyboard navigation
- **Responsive:** Mobile-first design, tested across devices
- **Bilingual:** English/Spanish with proper i18n routing

## Integrations to Configure

- [ ] @astrojs/tailwind
- [ ] @astrojs/react (islands architecture)
- [ ] @astrojs/sitemap
- [ ] astro-i18n-aut or similar
- [ ] @astrojs/netlify (adapter)
- [ ] Analytics (optional: Vercel Analytics, Google Analytics)

## Development Commands

```bash
npm run dev      # Start dev server (port 4321)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment

- **Platform:** Netlify
- **Build Command:** `npm run build`
- **Publish Directory:** `dist/`
- **Environment Variables:** (TBD)

## Design System

- **Colors:** TBD (define primary, secondary, accent in Tailwind config)
- **Typography:** System fonts or custom web fonts
- **Spacing:** Tailwind default scale (4px base)
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

## Content Strategy

- Homepage: Hero, About, Skills, Projects, Contact
- Blog: (optional) Tech articles in EN/ES
- Projects: Portfolio showcase with live demos
- About: Personal bio, career timeline
