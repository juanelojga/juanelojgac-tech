# Phase 3 Implementation Plan: Left Panel — Trust & Conversion

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 3
**Generated**: 2026-03-25
**Status**: Planning Complete

## Success Criteria

- [ ] `TrustPanel` React component renders identity, services, trust signals, CTAs
- [ ] `ServiceItem` sub-component is clickable and fires `onPromptInject(prompt)` correctly
- [ ] `TrustSignals` sub-component renders stats, badges from content provider
- [ ] `PanelCTA` sub-component renders Calendly booking and email CTA
- [ ] `TrustPanel.astro` wrapper fetches translations and hydrates React island with `client:load`
- [ ] Layout spacing follows design system tokens (arrange skill)
- [ ] Typography uses Sora headings, Inter body, Poppins accents (typeset skill)
- [ ] Colors use tarawera, persian-green, coral tokens (colorize skill)
- [ ] Responsive: mobile collapses to overlay drawer, tablet slide-in, desktop persistent sidebar
- [ ] All unit tests green, all sections covered, accessibility attributes verified
- [ ] `pnpm test`, `pnpm run astro:check`, `pnpm run lint:fix`, `pnpm run build` all pass

## Dependency Graph

```
Phase 2 Content (complete)
  │
  ├── Group 1: React Sub-components (parallel track)
  │   ├── ServiceItem tests → ServiceItem impl
  │   ├── TrustSignals tests → TrustSignals impl
  │   └── PanelCTA tests → PanelCTA impl
  │
  ├── Group 2: TrustPanel (depends on Group 1)
  │   └── TrustPanel tests → TrustPanel impl
  │
  └── Group 3: Astro Integration & Styling (depends on Group 2)
      ├── TrustPanel.astro wrapper
      ├── Design skills application (arrange, typeset, colorize)
      └── Responsive adapt behavior
```

## Implementation Groups

### Group 1: React Sub-components (Parallel — can be built independently)

| #   | Task                           | Files                                                  | Depends On      | Done Criteria                                                        | Est. |
| --- | ------------------------------ | ------------------------------------------------------ | --------------- | -------------------------------------------------------------------- | ---- |
| 1   | Write ServiceItem tests (TDD)  | `src/components/react/__tests__/ServiceItem.test.tsx`  | Phase 2 content | Tests verify rendering, click callback with prompt payload, a11y     | 3h   |
| 2   | Implement ServiceItem          | `src/components/react/ServiceItem.tsx`                 | #1              | Renders service name + icon, fires `onPromptInject(prompt)` on click | 3h   |
| 3   | Write TrustSignals tests (TDD) | `src/components/react/__tests__/TrustSignals.test.tsx` | Phase 2 content | Tests verify rendering of stat and badge signal types                | 2h   |
| 4   | Implement TrustSignals         | `src/components/react/TrustSignals.tsx`                | #3              | Renders badges and stats from content provider                       | 2h   |
| 5   | Write PanelCTA tests (TDD)     | `src/components/react/__tests__/PanelCTA.test.tsx`     | Phase 2 content | Tests verify Calendly link and email CTA render                      | 2h   |
| 6   | Implement PanelCTA             | `src/components/react/PanelCTA.tsx`                    | #5              | Renders primary (booking) and secondary (contact) CTAs               | 2h   |

### Group 2: TrustPanel Container (Sequential — depends on Group 1)

| #   | Task                         | Files                                                | Depends On | Done Criteria                                               | Est. |
| --- | ---------------------------- | ---------------------------------------------------- | ---------- | ----------------------------------------------------------- | ---- |
| 7   | Write TrustPanel tests (TDD) | `src/components/react/__tests__/TrustPanel.test.tsx` | Group 1    | Tests cover all sections, click handlers, accessibility     | 5h   |
| 8   | Implement TrustPanel         | `src/components/react/TrustPanel.tsx`                | #7         | All tests green, composes sub-components with correct props | 8h   |

### Group 3: Astro Integration & Styling (Sequential — depends on Group 2)

| #   | Task                              | Files                             | Depends On | Done Criteria                                                   | Est. |
| --- | --------------------------------- | --------------------------------- | ---------- | --------------------------------------------------------------- | ---- |
| 9   | Create TrustPanel.astro wrapper   | `src/components/TrustPanel.astro` | #8         | Fetches translations, shapes props, hydrates with `client:load` | 4h   |
| 10  | Apply arrange/typeset/colorize    | All panel files                   | #9         | Design tokens applied, no arbitrary values                      | 6h   |
| 11  | Apply adapt — responsive behavior | All panel files                   | #10        | Mobile: overlay drawer, Tablet: slide-in, Desktop: persistent   | 4h   |

## Prop Interfaces (Key Contracts)

### ServiceItem

```typescript
interface ServiceItemProps {
  readonly id: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly relatedPrompt: string;
  readonly onPromptInject: (prompt: string) => void;
}
```

### TrustSignals

```typescript
interface TrustSignalsProps {
  readonly signals: readonly TrustSignal[];
  readonly label: string;
}
```

### PanelCTA

```typescript
interface PanelCTAProps {
  readonly bookingLabel: string;
  readonly bookingUrl: string;
  readonly contactLabel: string;
  readonly contactEmail: string;
}
```

### TrustPanel

```typescript
interface TrustPanelProps {
  readonly companyName: string;
  readonly tagline: string;
  readonly services: readonly ServiceItemData[];
  readonly trustSignals: readonly TrustSignal[];
  readonly onPromptInject: (prompt: string) => void;
  readonly translations: TrustPanelTranslations;
}
```

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                         | Impact      | Mitigation                                     |
| -------------------------------------------- | ----------- | ---------------------------------------------- |
| Test environment lacks React + JSDOM support | Blocks TDD  | Verify vitest config has jsdom for tsx tests   |
| Responsive drawer complexity                 | Timeline    | Use simple CSS transitions first, graduate     |
| Content provider integration in Astro        | Integration | Follow existing Services.astro pattern exactly |
