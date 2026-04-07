# Phase 3 Memory: Left Panel — Trust & Conversion

**Completed**: 2026-03-25
**Status**: ✅ Complete

## What Was Built

### Files Created

- `src/components/react/ServiceItem.tsx` — Clickable service item that fires `onPromptInject(prompt)` on click/keyboard
- `src/components/react/TrustSignals.tsx` — Renders stat and badge trust signals in a grid list
- `src/components/react/PanelCTA.tsx` — Primary (Calendly booking) and secondary (email contact) call-to-action links
- `src/components/react/TrustPanel.tsx` — Container component composing identity, services, trust signals, and CTAs with responsive toggle
- `src/components/TrustPanel.astro` — Astro wrapper fetching i18n translations and content provider data, hydrating React island with `client:load`
- `src/components/react/__tests__/ServiceItem.test.tsx` — 12 tests (rendering, click behavior, keyboard a11y, different data)
- `src/components/react/__tests__/TrustSignals.test.tsx` — 9 tests (stat/badge rendering, empty state, a11y list)
- `src/components/react/__tests__/PanelCTA.test.tsx` — 9 tests (booking/contact links, new tab, mailto, i18n labels)
- `src/components/react/__tests__/TrustPanel.test.tsx` — 19 tests (identity, services, trust signals, CTAs, click interaction, a11y, toggle)

### Files Modified

- None — all Phase 3 deliverables are new files

### Key Decisions

- **`onPromptInject` made optional**: The TrustPanel can render without a chat callback (needed for standalone Astro SSG preview). When integrated with the chat panel in Phase 4+, the parent will pass the callback.
- **Flat list for TrustSignals**: Used a single `<ul>` with `grid-cols-3` layout instead of nested lists, avoiding multiple `list` role elements that complicate screen reader navigation.
- **No framer-motion in Phase 3**: Panel toggle uses CSS transitions (`transition-all duration-200`) instead of framer-motion. Animations will be refined when the full two-panel layout is built.
- **Content from StaticContentProvider**: The Astro wrapper instantiates `StaticContentProvider` directly rather than accepting pre-shaped content, keeping the pattern consistent with potential future content source changes.

### Interfaces & Types

- `ServiceItemProps` in `ServiceItem.tsx` — `{ id, title, shortDescription, relatedPrompt, onPromptInject }`
- `TrustSignalsProps` in `TrustSignals.tsx` — `{ signals: TrustSignal[], label }`
- `PanelCTAProps` in `PanelCTA.tsx` — `{ bookingLabel, bookingUrl, contactLabel, contactEmail }`
- `ServiceItemData` in `TrustPanel.tsx` — Subset of ServiceContent for panel display
- `TrustPanelTranslations` in `TrustPanel.tsx` — i18n strings for panel chrome
- `TrustPanelProps` in `TrustPanel.tsx` — Full panel props including optional `onPromptInject`

### Tests

- `ServiceItem.test.tsx` — Rendering, click fires correct prompt, Enter/Space keyboard, focus, different data
- `TrustSignals.test.tsx` — Stats, badges, mixed, empty, a11y heading, list structure
- `PanelCTA.test.tsx` — Booking link (new tab, rel), mailto link, Spanish labels
- `TrustPanel.test.tsx` — Identity section, services section, trust signals, CTAs (urls), click interaction, a11y landmark, toggle button

## Architecture Notes

- Components follow SRP: ServiceItem handles one service click, TrustSignals renders signals, PanelCTA renders CTAs, TrustPanel composes them
- All React components use typed interfaces — no `any`
- All text comes from i18n props — no hardcoded strings
- Design tokens from `tailwind.css` used throughout — no arbitrary values
- Responsive: toggle button hidden on `lg:` breakpoint, panel widths use CSS custom properties from design tokens
- The panel uses `aside` landmark with `aria-label` for accessibility

## Dependencies on Future Phases

- Phase 4 (Chat UI Shell) will compose `TrustPanel` alongside `ChatPanel` in a two-panel layout
- Phase 4+ will pass `onPromptInject` callback to wire service clicks to chat input
- Phase 8 (i18n Parity & Responsive Polish) will refine mobile drawer behavior with full slide-in animation

## Verification Results

```
=== Phase 3 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings)
  - lint:         ✅ (0 errors, 0 warnings)
  - format:       ✅ (all files use Prettier code style)
  - build:        ✅ (production build complete)

Unit Tests:
  - Total:   273 tests
  - Passed:  273
  - Failed:  0
  - New:     49 tests (12 ServiceItem + 9 TrustSignals + 9 PanelCTA + 19 TrustPanel)

Verdict: PASS
```
