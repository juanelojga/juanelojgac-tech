# Project Guidelines

JuaneloJGAC Tech — AI consulting agency single-page website.
See [CLAUDE.md](../CLAUDE.md) for full stack details, React integration rules, and i18n conventions.

## Architecture

- **Single-page Astro site** (SSG) — all sections on `src/pages/index.astro`, anchor-based navigation (`#services`, `#challenges`, `#who-we-help`, `#contact-cta`)
- **React islands** in `src/components/react/` — hydrated with `client:load` for interactive navbar, mobile menu, dropdowns, and tabbed content
- **Astro components** handle layout, server rendering, and i18n wiring — React components receive pre-translated strings as props (no hooks or hard-coded text)
- **Header-based i18n** — language detected from `Accept-Language` header via `src/lib/i18n.ts`, not URL-based routing

## Build and Test

```sh
pnpm run dev          # Frontend-only dev server (localhost:4321) — no Netlify functions
pnpm run dev:netlify  # Full-stack dev server (localhost:8888) — includes Netlify functions + .env
pnpm run build        # Production build → dist/
pnpm run lint:fix     # ESLint auto-fix
pnpm run format       # Prettier formatting
pnpm test             # Vitest (watch mode)
pnpm run test:coverage # Coverage report
pnpm run astro:check  # TypeScript checking
```

> **Chat feature**: The AI consultant chat requires `pnpm run dev:netlify` (needs `netlify-cli` installed globally: `npm i -g netlify-cli`). The chat calls `/.netlify/functions/chat` which is only served by the Netlify CLI dev server. Environment variables from `.env` are automatically loaded by `netlify dev`.

Pre-commit hooks (Husky + lint-staged) auto-format and lint staged files.

## Conventions

### i18n (mandatory for all UI changes)

- Translation files: `src/i18n/en.json`, `src/i18n/es.json`
- **Always update both** when adding or changing visible text
- Keys are namespaced: `navbar.links.services`, `header.headline`, `services.services[0].title`
- Astro components: `await import('../i18n/${lang}.json')`
- React components: receive translations as props from parent Astro files

### Component Organization

- Section-level Astro wrappers in `src/components/` (e.g., `Services.astro`, `Benefits.astro`)
- Sub-components in named folders: `src/components/services/`, `src/components/benefits/`
- React islands in `src/components/react/` — typed interfaces required for all props
- SEO metadata via `src/components/Seo.astro` (see [SEO_COMPONENT_GUIDE.md](../SEO_COMPONENT_GUIDE.md) and [ADVANCED_SEO_GUIDE.md](../ADVANCED_SEO_GUIDE.md))

### Styling

- **Tailwind CSS v4** with `@theme` tokens in `src/styles/tailwind.css`
- Brand colors: `tarawera` (#0a3f66), `persian-green` (#00a79d), `coral`
- Fonts: Inter (body), Sora (headings), Poppins (accents)
- Neutral scale: `neutral-darkest` (#06020a) → `neutral-lightest` (#f2f2f2)
- Use design tokens — avoid arbitrary values or inline CSS
- Mobile-first responsive: unqualified → `md:` → `lg:`

### TypeScript

- Strict mode (`astro/tsconfigs/strict`)
- Explicit prop interfaces — no `any`
- Service types defined in `src/components/services/types.ts`

### Testing

- Tests in `src/**/__tests__/` — naming: `*.test.ts`
- Uses experimental `AstroContainer` for server-side rendering tests
- `@testing-library/jest-dom` matchers available globally

## Deployment

Netlify (static) — see `netlify.toml`. Node 24 required (`.nvmrc`). Immutable 1-year caching on assets/JS/CSS.
