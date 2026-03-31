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

| Command | URL | Purpose |
|---|---|---|
| `pnpm dev` | `localhost:4321` | Frontend only — no Netlify Functions |
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

Deployed on Netlify (static). Set the server-side environment variables (`OPENROUTER_API_KEY`, `TURNSTILE_SECRET_KEY`, and related settings) in Netlify project environment settings. Requires **Node 24**; see `.nvmrc`. Assets, JS, and CSS are served with immutable 1-year caching headers.
