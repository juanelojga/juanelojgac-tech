# JuaneloJGAC Tech

Bilingual AI consulting and development agency website for startups and SMEs seeking workflow automation, AI integration, and modern web platforms.

The site positions JuaneloJGAC Tech as a practical implementation partner for teams in the United States and Latin America. The stack is Astro (SSG), React islands, TypeScript, Tailwind CSS v4, Netlify Functions, and OpenRouter-powered AI chat.

## What The Site Represents

- **Workflow Automation** — business operations and tool integrations
- **AI Marketing Studio** — content and campaign systems
- **AI-Powered Web Development** — dashboards, e-commerce, and custom web apps
- **AI Integration & Consulting** — chatbots, document processing, and AI roadmaps
- **AI Consultant Chat** — interactive V2 chat feature backed by `/.netlify/functions/chat`

Machine-readable discovery files live in `public/llms.txt` and `public/llms-full.txt`.

## Architecture

- **Single-page SSG** — all sections on `src/pages/index.astro` (EN) and `src/pages/es.astro` (ES), anchor-based navigation
- **React islands** in `src/components/react/` — hydrated with `client:load` for the interactive navbar, mobile menu, dropdowns, and tabbed content
- **Header-based i18n** — language detected from the `Accept-Language` request header via `src/lib/i18n.ts`; translations live in `src/i18n/en.json` and `src/i18n/es.json`
- **Netlify Functions** — `netlify/functions/chat.ts` (AI chat completions) and `netlify/functions/summarize.ts`

## Requirements

- Node.js 24+
- `pnpm` (project uses `pnpm@10.33.0`)
- `netlify-cli` installed globally (`npm i -g netlify-cli`) — required only for the full-stack dev server

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create your local environment file from the template:

```bash
cp .env.example .env
```

3. Update `.env` with your real credentials and values.

## Environment Variables

Use `.env.example` as the reference. Key variables:

- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (safe for client use)
- `OPENROUTER_API_KEY` — server-side OpenRouter API key
- `OPENROUTER_MODEL` — model ID used for chat completions
- `TURNSTILE_SECRET_KEY` — server-side Turnstile secret key
- `SITE_URL` — app URL used for CORS and OpenRouter referer header
- `SITE_TITLE` — app title sent to OpenRouter
- `OPENROUTER_API_URL` — OpenRouter chat completions endpoint

Notes:

- `.env` is ignored by git.
- `.env.example` is committed as the template.

## Development

The project has two dev server modes:

| Command                | URL              | Purpose                                          |
| ---------------------- | ---------------- | ------------------------------------------------ |
| `pnpm dev`             | `localhost:4321` | Frontend only — no Netlify Functions             |
| `pnpm run dev:netlify` | `localhost:8888` | Full-stack — includes Functions and loads `.env` |

The AI consultant chat requires `pnpm run dev:netlify` because it calls `/.netlify/functions/chat`, which is only served by the Netlify CLI dev server.

## Commands

```bash
pnpm dev              # Frontend dev server (localhost:4321)
pnpm run dev:netlify  # Full-stack dev server (localhost:8888)
pnpm build            # Production build → dist/
pnpm preview          # Preview the production build locally
pnpm format           # Prettier auto-format
pnpm run format:check # Prettier format check
pnpm lint             # ESLint
pnpm run lint:fix     # ESLint auto-fix
pnpm astro:check      # Astro + TypeScript checks
pnpm test             # Vitest (watch mode)
pnpm run test:watch   # Vitest explicit watch
pnpm test:coverage    # Vitest coverage report
```

Pre-commit hooks (Husky + lint-staged) auto-format and lint staged files on every commit.

## Testing

- **Unit tests** — Vitest with `@testing-library/react` and `@testing-library/jest-dom`; tests live under `src/**/__tests__/`
- **E2E tests** — Playwright; specs in `e2e/` covering desktop, tablet, and mobile viewports (`consultant-desktop.spec.ts`, `consultant-tablet.spec.ts`, `consultant-mobile.spec.ts`)

## Deployment

Production is designed for **Netlify** using the configuration in `netlify.toml`.

### Production Prerequisites

- Netlify site connected to this repository
- **Node 24** runtime (`.nvmrc` and `netlify.toml` both target Node 24)
- `pnpm` available in the Netlify build image
- Production domain ready for `SITE_URL` (for example `https://juanelojgac-tech.com`)
- Valid OpenRouter and Cloudflare Turnstile credentials

### Netlify Build Configuration

These values should match the repository configuration exactly:

- **Build command**: `pnpm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Node version**: `24`

The repo already sets the following production environment behavior in `netlify.toml`:

- `NODE_ENV=production`
- `ASTRO_TELEMETRY_DISABLED=1`
- Husky disabled during production builds (`HUSKY=0`, `HUSKY_SKIP_INSTALL=1`)
- Deploy previews and branch deploys skipped by default

### Netlify Production Setup

1. Create a new site in Netlify and connect this GitHub repository.
2. In **Site configuration → Build & deploy**, confirm these settings:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. In **Site configuration → Environment variables**, add the values from your production environment.
4. Set your production domain and use that exact origin for `SITE_URL`.
5. Trigger a deploy from the connected branch.

### Required Production Environment Variables

Use `.env.example` as the source of truth.

Public variable:

- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key exposed to the browser

Server-only variables:

- `OPENROUTER_API_KEY` — required by `/.netlify/functions/chat`
- `OPENROUTER_MODEL` — OpenRouter model ID used for completions
- `TURNSTILE_SECRET_KEY` — required for Turnstile verification in production
- `SITE_URL` — canonical production origin used for CORS and OpenRouter headers
- `SITE_TITLE` — title sent in OpenRouter request headers
- `OPENROUTER_API_URL` — defaults to the official chat completions endpoint unless overridden

Recommended production values:

- `SITE_URL=https://your-production-domain.com`
- `SITE_TITLE=JuaneloJGAC Tech AI Consultant`
- `OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions`

### What Happens In Production

- Astro builds the static site into `dist/`
- Netlify serves the generated site as static assets
- Netlify Functions serves `/.netlify/functions/chat` and `/.netlify/functions/summarize`
- The chat function keeps the OpenRouter API key server-side
- Turnstile verification is enforced in production when `TURNSTILE_SECRET_KEY` is set
- CORS for the chat function is validated against `SITE_URL`, its `www` variant, localhost dev origins, and optional `ALLOWED_ORIGINS`

### Post-Deploy Validation Checklist

After the production deploy completes, verify:

1. The Netlify build succeeds with Node 24 and publishes `dist/`.
2. The live site loads from the correct production domain.
3. The chat feature can successfully call `/.netlify/functions/chat`.
4. Browser requests originate from the same domain configured in `SITE_URL`.
5. Turnstile verification succeeds in production.
6. SEO output reflects the production site URL and sitemap settings.
7. Static assets under `/_astro/` and `/assets/` return long-lived cache headers.

### Common Production Issues

- **Chat returns 500 / "Chat service is not configured"**
  `OPENROUTER_API_KEY` is missing in Netlify environment settings.
- **Chat returns 403 / verification failed**
  `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` do not match the deployed domain, or the token is not being sent.
- **Chat CORS issues**
  `SITE_URL` does not match the real production origin, including protocol.
- **Unexpected origin blocked**
  Add additional trusted origins with `ALLOWED_ORIGINS` as a comma-separated list.
- **Build/runtime mismatch**
  Netlify is not using Node 24.

### Recommended Release Flow

Before promoting a change to production, run:

```bash
pnpm install
pnpm run build
pnpm astro:check
pnpm lint
```

If the AI consultant chat is part of the release, also validate it locally with:

```bash
pnpm run dev:netlify
```

Assets, JS, and CSS are served with immutable 1-year caching headers, while HTML uses a shorter cache window, as configured in `netlify.toml`.
