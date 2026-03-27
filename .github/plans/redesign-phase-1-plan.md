# Redesign Phase 1 Implementation Plan: Design System & Content Model

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 1
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: colorize, clarify, extract

## Success Criteria

- [ ] New Tailwind tokens active (`bg-midnight`, `text-text-bright`, `border-accent-cyan`, etc.)
- [ ] All i18n keys in both EN and ES languages, symmetric and valid JSON
- [ ] TypeScript interfaces defined for all redesign components, no `any`
- [ ] CSS animation keyframes defined (`float`, `glow-pulse`, `fade-in-up`, `orb-drift`)
- [ ] `prefers-reduced-motion` media query in place
- [ ] `src/components/redesign/` directory structure created
- [ ] `pnpm run build` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm test` passes (no regressions)

## Dependency Graph

```
1.1 Tailwind tokens ─────┐
1.2 TypeScript interfaces ├──> 1.4 Directory structure (depends on 1.2)
1.3 i18n keys (EN + ES) ──┘
1.5 CSS keyframes ────────┘
```

Tasks 1.1, 1.2, 1.3, and 1.5 are independent. Task 1.4 depends on 1.2 (types.ts goes in the directory).

## Implementation Groups

### Group 1: Independent Foundation Tasks (Parallel)

| #   | Task                               | Files                                  | Skills   | Depends On | Done Criteria                            | Est. |
| --- | ---------------------------------- | -------------------------------------- | -------- | ---------- | ---------------------------------------- | ---- |
| 1.1 | Add dark premium Tailwind tokens   | `src/styles/tailwind.css`              | colorize | —          | Build passes, tokens usable in classes   | 30m  |
| 1.2 | Define TypeScript interfaces       | `src/components/redesign/types.ts`     | extract  | —          | `astro:check` passes, no `any`           | 45m  |
| 1.3 | Create all i18n keys (EN + ES)     | `src/i18n/en.json`, `src/i18n/es.json` | clarify  | —          | JSON valid, symmetric keys, build passes | 45m  |
| 1.5 | Add CSS keyframes + reduced motion | `src/styles/tailwind.css`              | colorize | —          | Keyframes defined, media query in place  | 30m  |

### Group 2: Directory Structure (Sequential — depends on Group 1)

| #   | Task                       | Files                      | Skills  | Depends On | Done Criteria                       | Est. |
| --- | -------------------------- | -------------------------- | ------- | ---------- | ----------------------------------- | ---- |
| 1.4 | Create directory structure | `src/components/redesign/` | extract | 1.2        | Directory exists, types.ts compiles | 15m  |

### Group 3: Tests

| #   | Task                 | Files                                                     | Skills | Depends On | Done Criteria                                  | Est. |
| --- | -------------------- | --------------------------------------------------------- | ------ | ---------- | ---------------------------------------------- | ---- |
| T1  | Unit tests for types | `src/components/redesign/__tests__/types.test.ts`         | —      | 1.2, 1.4   | Types compile and interface contracts verified | 30m  |
| T2  | i18n symmetry test   | `src/components/redesign/__tests__/i18n-redesign.test.ts` | —      | 1.3        | All redesign.\* keys exist in both languages   | 30m  |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                 | Impact        | Mitigation                                                   |
| ---------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| Token naming conflicts with existing Tailwind tokens | Build failure | Prefix new tokens with clear namespace (midnight, accent-\*) |
| i18n JSON syntax errors                              | Build failure | Validate JSON parsing in tests                               |
| TypeScript strict mode rejections                    | Build failure | Define explicit types, no `any`, test with `astro:check`     |
