# Phase 1 Implementation Plan: Foundation & Architecture

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 1
**Generated**: 2026-03-25
**Status**: Planning Complete

## Success Criteria

- [ ] Core TypeScript interfaces exported from `src/lib/chat/types.ts` — no `any`, strict mode passing
- [ ] `ChatAssistantService` interface follows ISP (Interface Segregation), separates send/receive/summary
- [ ] `ContentProvider` interface allows adding new content categories without modifying existing code (OCP)
- [ ] `ConversationOrchestrator` interface separates scope enforcement, CTA injection, and follow-up guidance (SRP)
- [ ] Unit tests for all type guards and validators — TDD, all green, 100% branch coverage
- [ ] `@theme` tokens extended for chat UI: message bubbles, panel backgrounds, chip styles, input focus states
- [ ] Responsive breakpoint strategy defined for two-panel layout
- [ ] Tailwind utility compositions for chat components documented in `tailwind.css`
- [ ] Playwright configured with desktop (1280×720) and mobile (375×812) viewports
- [ ] Playwright test helpers created: page fixtures, i18n switchers, chat interaction utilities
- [ ] Vitest test utilities: mock factories for `ChatAssistantService`, `ContentProvider`, render helpers
- [ ] Existing tests still pass after scaffolding

## Dependency Graph

```
1.1a Types ──────────────────────┐
                                 ├─► 1.1b ChatAssistantService IF
                                 ├─► 1.1c ContentProvider IF
                                 ├─► 1.1d ConversationOrchestrator IF
                                 └─► 1.1e Type guards + validators
                                          │
                                          ▼
                                     1.1f Unit tests (TDD)
                                          │
1.2a Tailwind tokens ─────────┐          │
1.2b Responsive strategy ─────┤          │
1.2c Utility compositions ────┘          │
                                          │
1.3a Playwright config ───────┐          │
1.3b Playwright helpers ──────┤          │
1.3c Vitest mock factories ───┘──────────┘
                                          │
                                          ▼
                               1.3d Verify all tests
```

## Implementation Groups

### Group 1: Core Type System (Sequential — Critical Path)

| #   | Task                                                                                                                            | Files                                       | Depends On | Done Criteria                           | Est. |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------- | --------------------------------------- | ---- |
| 1   | Define core interfaces: `ChatMessage`, `ConversationState`, `LeadAttributes`, `ProjectSummary`, `ServiceContent`, `TrustSignal` | `src/lib/chat/types.ts`                     | —          | Interfaces exported, strict mode passes | 4h   |
| 2   | Define `ChatAssistantService` interface (ISP)                                                                                   | `src/lib/chat/types.ts`                     | #1         | Separate send/receive/summary concerns  | 3h   |
| 3   | Define `ContentProvider` interface (OCP)                                                                                        | `src/lib/chat/types.ts`                     | #1         | Extensible for new content categories   | 2h   |
| 4   | Define `ConversationOrchestrator` interface (SRP)                                                                               | `src/lib/chat/types.ts`                     | #1         | Separates scope/CTA/follow-up           | 3h   |
| 5   | Write type guards and validation utilities                                                                                      | `src/lib/chat/validators.ts`                | #1–4       | All type guards implemented             | 3h   |
| 6   | Write unit tests for type guards/validators (TDD)                                                                               | `src/lib/chat/__tests__/validators.test.ts` | #5         | 100% branch coverage, all green         | 4h   |

### Group 2: Design System Extension (Parallel Track A)

| #   | Task                                                       | Files                     | Depends On | Done Criteria                                            | Est. |
| --- | ---------------------------------------------------------- | ------------------------- | ---------- | -------------------------------------------------------- | ---- |
| 7   | Extend `@theme` tokens for chat UI                         | `src/styles/tailwind.css` | —          | Tokens use brand palette, no arbitrary values            | 3h   |
| 8   | Define responsive breakpoint strategy for two-panel layout | `src/styles/tailwind.css` | #7         | Mobile: full-screen chat; Desktop: persistent left panel | 2h   |
| 9   | Create Tailwind utility compositions for chat components   | `src/styles/tailwind.css` | #7–8       | DRY class groups documented in comments                  | 2h   |

### Group 3: Testing Infrastructure (Parallel Track B)

| #   | Task                                                | Files                                                                   | Depends On | Done Criteria                                | Est. |
| --- | --------------------------------------------------- | ----------------------------------------------------------------------- | ---------- | -------------------------------------------- | ---- |
| 10  | Install and configure Playwright                    | `playwright.config.ts`, `package.json`                                  | —          | Desktop + mobile viewports defined           | 4h   |
| 11  | Create Playwright test helpers                      | `e2e/helpers/fixtures.ts`, `e2e/helpers/i18n.ts`, `e2e/helpers/chat.ts` | #10        | Helpers exported, reusable                   | 4h   |
| 12  | Create Vitest mock factories for service interfaces | `src/lib/chat/__tests__/factories.ts`                                   | Group 1    | Factories produce valid typed mocks          | 5h   |
| 13  | Verify all existing tests pass                      | —                                                                       | All above  | `pnpm test` and `pnpm run astro:check` green | 1h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                        | Impact | Mitigation                                              |
| ------------------------------------------- | ------ | ------------------------------------------------------- |
| Type system too rigid for future phases     | High   | Use generics and discriminated unions for extensibility |
| Playwright install fails in CI              | Medium | Pin browser versions, add to .gitignore                 |
| Tailwind v4 `@theme` syntax incompatibility | Low    | Verify token registration with build step               |
