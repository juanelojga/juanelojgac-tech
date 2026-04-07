# V2 Phase 2 Implementation Plan: Page Shell — Header, Hero, Footer

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 2
**Generated**: 2026-03-26
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, arrange, adapt, typeset, colorize, bolder

## Success Criteria

- [ ] Sticky bilingual header with logo + EN/ES language switch renders correctly
- [ ] Short hero section with headline, subheadline, CTA renders bilingually
- [ ] Minimal footer with copyright, contact, privacy renders bilingually
- [ ] Header compresses on mobile (≤48px), logo scales, language switch accessible
- [ ] Touch targets ≥ 44px on all interactive header/footer elements
- [ ] `index.astro` and `es.astro` compose full shell: Header → Hero → ConsultantSection → Footer
- [ ] `Layout.astro` supports sticky header + full-height layout
- [ ] ConsultantSection padding adjusted for header offset
- [ ] All unit tests pass for new components
- [ ] `astro:check`, `lint:fix`, `build` all clean

## Dependency Graph

```
Phase 1 (complete) ─── i18n keys + types ready
         │
         ├── Group 1: Shell Components (sequential)
         │     ├── 1.1 ConsultantHeader.astro (tests first)
         │     ├── 1.2 ConsultantHero.astro (tests first)
         │     └── 1.3 ConsultantFooter.astro (tests first)
         │
         └── Group 2: Page Composition (depends on Group 1)
               ├── 2.1 Update index.astro + es.astro
               ├── 2.2 Update Layout.astro
               ├── 2.3 Adjust ConsultantSection spacing
               └── 2.4 Verify build + type checks
```

## Implementation Groups

### Group 1: Shell Components (Sequential — Critical Path)

| #    | Task                                  | Files                                               | Skills                                    | Depends On | Done Criteria                                                      | Est. |
| ---- | ------------------------------------- | --------------------------------------------------- | ----------------------------------------- | ---------- | ------------------------------------------------------------------ | ---- |
| 1.1a | Write unit tests for ConsultantHeader | `src/components/__tests__/ConsultantHeader.test.ts` | frontend-design, adapt                    | Phase 1    | Tests cover logo, lang switch, sticky, mobile compress, both langs |
| 1.1b | Implement ConsultantHeader.astro      | `src/components/ConsultantHeader.astro`             | frontend-design, arrange, adapt, colorize | 1.1a       | Sticky header, logo, EN/ES switch, responsive mobile compress      |
| 1.2a | Write unit tests for ConsultantHero   | `src/components/__tests__/ConsultantHero.test.ts`   | frontend-design                           | Phase 1    | Tests verify headline/subheadline/CTA, both langs                  |
| 1.2b | Implement ConsultantHero.astro        | `src/components/ConsultantHero.astro`               | frontend-design, arrange, typeset, bolder | 1.2a       | Hero renders bilingual copy, responsive spacing, brand typography  |
| 1.3a | Write unit tests for ConsultantFooter | `src/components/__tests__/ConsultantFooter.test.ts` | frontend-design                           | Phase 1    | Tests verify copyright/contact/privacy, both langs                 |
| 1.3b | Implement ConsultantFooter.astro      | `src/components/ConsultantFooter.astro`             | frontend-design, arrange, colorize        | 1.3a       | Footer renders bilingual copy, responsive, minimal                 |

### Group 2: Page Composition (Sequential — Depends on Group 1)

| #   | Task                                    | Files                                         | Skills         | Depends On | Done Criteria                                           | Est. |
| --- | --------------------------------------- | --------------------------------------------- | -------------- | ---------- | ------------------------------------------------------- | ---- |
| 2.1 | Update page files for shell composition | `src/pages/index.astro`, `src/pages/es.astro` | arrange        | Group 1    | Pages render Header → Hero → ConsultantSection → Footer |
| 2.2 | Update Layout.astro for shell support   | `src/layouts/Layout.astro`                    | arrange, adapt | 2.1        | Layout supports sticky header + full-height structure   |
| 2.3 | Adjust ConsultantSection spacing        | `src/components/ConsultantSection.astro`      | arrange        | 2.1        | Section positioned correctly below header + hero        |
| 2.4 | Verify build and type checks            | —                                             | —              | 2.1-2.3    | `astro:check` and `pnpm run build` clean                |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                            | Impact   | Mitigation                                                         |
| ----------------------------------------------- | -------- | ------------------------------------------------------------------ |
| Sticky header consumes too much mobile viewport | Medium   | Compress to ≤48px on mobile, test on 320px viewport                |
| Hero pushes content below fold on mobile        | Medium   | Keep hero compact (≤120px on mobile), consider auto-hide on scroll |
| AstroContainer tests may need special config    | Low      | Follow existing test patterns from Phase 1                         |
| Language switch navigation resets page state    | Expected | SSG limitation, documented as acceptable                           |
