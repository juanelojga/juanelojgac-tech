# CLAUDE.md

**Astro Project – Core Context & AI Collaboration Guide**

This document provides Claude (and any AI assistants) the essential context needed to generate consistent, maintainable,
and project-aligned code. It must always remain up to date as workflows evolve.

---

## 1. Tech Stack

- **Astro** v5+
- **TypeScript** v5+
- **React** v18+ (for interactive islands)
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

## 3. React Integration

### When to Use React vs Astro

- **Use Astro** for:
  - Static content and layouts
  - Server-side rendering
  - SEO-optimized pages
  - Simple interactive components

- **Use React** for:
  - Complex interactive UI
  - Stateful components
  - Components requiring client-side logic
  - Third-party React libraries integration

### React Component Guidelines

- Store React components in `src/components/react/`
- All React components must be fully typed with TypeScript
- Use explicit interfaces for props
- Accept i18n strings as props from Astro (never hard-code text)
- Use Tailwind for styling

### Client Directives

- **Primary**: `client:load` - Hydrates immediately on page load
- **Performance**: `client:visible` - Hydrates when component enters viewport
- **Conditional**: `client:media` - Hydrates based on media query
- **Avoid**: `client:only` unless absolutely necessary

---

## 4. Internationalization (i18n)

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

## 5. Key Commands (npm)

- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview
- Format: npm run format
- Lint: npm run lint
- Lint (fix): npm run lint:fix
- Unit tests: npm test

⸻

## 6. Code Style & Conventions

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

### React Conventions

- Use functional components with hooks.
- Prefer composition over inheritance.
- Keep components pure when possible.
- Use TypeScript interfaces for all props.

⸻

## 7. Testing Instructions

### Unit Testing (Vitest)

- Store under tests/unit
- Name format: ComponentName.test.ts

⸻

## 8. Environment Setup

### Requirements:

- Node.js ≥ 20
- npm ≥ 9

### Recommended VS Code Extensions:

- Astro
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- i18n Ally

### Environment Variables:

- Stored in .env (not committed)
- Must be documented in ENVIRONMENT.md if necessary

⸻

## 9. Known Constraints & Notes

- Astro SSR requires Node 20+
- Avoid deprecated Astro APIs
- Do not hard-code colors or strings
- i18n is mandatory for all UI changes
- Prettier is the single source of truth for formatting
- React components should be island-based, not full SPA
- Prefer Astro for static content, React for interactivity

⸻

## 10. AI Collaboration Rules (Important)

When Claude or any AI assistant generates code:

1. Respect existing file structure and naming conventions.
2. Localize all visible text (update en.json and es.json).
3. Ensure code follows ESLint + Prettier rules.
4. Do not add dependencies unless explicitly instructed.
5. Request missing files if context is unclear.
6. When generating code, output code blocks only unless documentation is requested.
7. React-specific: Always create typed interfaces for props, never hard-code text in React components.
8. Integration: Use appropriate client directives when embedding React in Astro.

⸻

## 11. Maintenance of This Document

This file must be updated when:

- The stack changes
- The project structure changes
- New workflows or tools are added
- i18n behavior evolves
- Testing standards change
- React integration patterns evolve
