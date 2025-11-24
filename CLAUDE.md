# CLAUDE.md

**Astro Project – Core Context & AI Collaboration Guide**

This document provides Claude (and any AI assistants) the essential context needed to generate consistent, maintainable,
and project-aligned code. It must always remain up to date as workflows evolve.

---

## 1. Tech Stack

- **Astro** v4+
- **TypeScript** v5+
- **Tailwind CSS** v3+
- **Node.js** ≥ 20
- **npm** (primary package manager)
- **ESLint + Prettier** (already installed and configured)
- **Astro i18n** (supports English + Spanish)
- Optional:
  - **Vitest** for unit tests
  - **Playwright** for E2E tests

---

## 2. Project Structure

```
/
├─ src/
│  ├─ components/       → Reusable UI components
│  ├─ layouts/          → Layout components
│  ├─ pages/            → Route pages (EN + ES)
│  ├─ content/          → Markdown/MDX collections
│  ├─ i18n/             → Translation JSON files (en.json, es.json)
│  ├─ lib/              → Helpers, utilities, business logic
│  └─ styles/           → Global/Tailwind styles
├─ public/              → Static assets
├─ tests/               → Unit + E2E tests
├─ astro.config.mjs     → Astro configuration
└─ tailwind.config.js   → Tailwind configuration
```

---

## 3. Internationalization (i18n)

The project supports **English (EN)** and **Spanish (ES)**.

### Translation File Structure

- `src/i18n/en.json`
- `src/i18n/es.json`

### Rules

- Never hard-code UI text inside components or pages.
- All visible strings must come from the translation dictionaries.
- Claude must always produce **both EN + ES translations** when creating UI.
- Use namespaced keys such as:  
  `hero.title`, `hero.subtitle`, `footer.links.contact`

### Example

```json
{
  "hero.title": "Build modern experiences",
  "hero.subtitle": "Fast, accessible, multilingual Astro applications"
}
```

## 4. Key Commands (npm)

- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview
- Format: npm run format
- Lint: npm run lint
- Lint (fix): npm run lint:fix
- Unit tests: npm test
- E2E tests: npm run test:e2e

⸻

## 5. Code Style & Conventions

### Formatting & Linting

- Prettier controls all formatting.
- ESLint enforces code quality, TS rules, and import cleanup.
- Lint and format must pass before committing.

### TypeScript Rules

- All components must be typed.
- Props interfaces must be explicit.
- Avoid any unless strictly necessary.

### Astro Conventions

- Keep components small and reusable.
- .astro files handle HTML structure and templating.
- .ts/.tsx handle logic-intensive functionality.
- Every piece of visible UI text must use i18n keys.

### Tailwind

- Use utility classes.
- Use theme tokens defined in tailwind.config.js.
- Avoid inline CSS unless required.

⸻

## 6. Testing Instructions

### Unit Testing (Vitest)

- Store under tests/unit
- Name format: ComponentName.test.ts

⸻

## 7. Environment Setup

### Requirements:

- Node.js ≥ 20
- npm ≥ 9

### Recommended VS Code Extensions:

- Astro
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- i18n Ally

### Environment Variables:

- Stored in .env (not committed)
- Must be documented in ENVIRONMENT.md if necessary

⸻

## 8. Known Constraints & Notes

- Astro SSR requires Node 20+
- Avoid deprecated Astro APIs
- Do not hard-code colors or strings
- i18n is mandatory for all UI changes
- Prettier is the single source of truth for formatting

⸻

## 9. AI Collaboration Rules (Important)

When Claude or any AI assistant generates code:

1. Respect existing file structure and naming conventions.
2. Localize all visible text (update en.json and es.json).
3. Ensure code follows ESLint + Prettier rules.
4. Do not add dependencies unless explicitly instructed.
5. Request missing files if context is unclear.
6. When generating code, output code blocks only unless documentation is requested.

⸻

## 10. Maintenance of This Document

This file must be updated when:

- The stack changes
- The project structure changes
- New workflows or tools are added
- i18n behavior evolves
- Testing standards change
