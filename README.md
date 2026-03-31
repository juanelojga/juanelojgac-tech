# JuaneloJGAC Tech

Bilingual AI consulting and development agency website focused on discoverability for startups and SMEs looking for workflow automation, AI integration, and modern web platforms.

The public site and AI consultant chat position JuaneloJGAC Tech as a practical implementation partner for teams in the United States and Latin America. The technical stack centers on Astro, React, TypeScript, Tailwind CSS, Netlify Functions, and OpenRouter-powered chat.

## What The Site Represents

- Workflow Automation for business operations and tool integrations
- AI Marketing Studio for content and campaign systems
- AI-Powered Web Development for dashboards, e-commerce, and custom web apps
- AI Integration & Consulting for chatbots, document processing, and AI roadmaps

Machine-readable discovery files live in `public/llms.txt` and `public/llms-full.txt`.

## Requirements

- Node.js 20+
- `pnpm` (project uses `pnpm@10.33.0`)

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

- `PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key (safe for client use).
- `OPENROUTER_API_KEY`: Server-side OpenRouter API key.
- `OPENROUTER_MODEL`: Model ID used for chat completions.
- `TURNSTILE_SECRET_KEY`: Server-side Turnstile secret key.
- `SITE_URL`: App URL used for CORS and OpenRouter referer header.
- `SITE_TITLE`: App title sent to OpenRouter.
- `OPENROUTER_API_URL`: OpenRouter chat completions endpoint.

Notes:

- `.env` is ignored by git.
- `.env.example` is committed as the template.

## Local Usage

Run the dev server:

```bash
pnpm dev
```

Useful commands:

- `pnpm build`: Build production output.
- `pnpm preview`: Preview the production build locally.
- `pnpm lint`: Run ESLint.
- `pnpm astro:check`: Run Astro type/content checks.
- `pnpm test`: Run unit tests.
- `pnpm test:coverage`: Run tests with coverage.

## Deployment

For Netlify deployment, set the same server-side environment variables (`OPENROUTER_API_KEY`, `TURNSTILE_SECRET_KEY`, and related settings) in Netlify project environment settings.
