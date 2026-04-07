# V2 Phase 3 Memory: Left Rail Redesign

**Completed**: 2026-03-26
**Status**: ✅ Complete

## What Was Built

### Files Created

- `src/components/react/OutcomePrompts.tsx` — Business-outcome-first prompt component with icon mapping (chart-up, cog, globe, megaphone, lightbulb → inline SVGs), click handling, keyboard a11y (Enter/Space), Sora font heading
- `src/components/react/__tests__/OutcomePrompts.test.tsx` — 14 tests covering rendering, click behavior, keyboard navigation, accessibility, bilingual support, and empty state

### Files Modified

- `src/i18n/en.json` — Added `"outcomesLabel": "How can we help?"` to `chat.panel`
- `src/i18n/es.json` — Added `"outcomesLabel": "¿Cómo podemos ayudarte?"` to `chat.panel`
- `src/components/react/TrustPanel.tsx` — Added `outcomePrompts` prop, `outcomesLabel` in TrustPanelTranslations interface, OutcomePrompts import; reordered sections: Identity → Toggle → OutcomePrompts → Services → TrustSignals → PanelCTA
- `src/components/react/ServiceItem.tsx` — De-emphasized to compact list style: removed card borders, smaller text (text-xs/text-[11px]), reduced padding, no background, subtle hover
- `src/components/react/__tests__/TrustPanel.test.tsx` — Added outcome fixtures, outcome section tests (4 tests), section ordering tests (2 tests)
- `src/components/react/chat/ConsultantLayout.tsx` — Added OutcomePrompt import, `outcomePrompts` prop, passes to TrustPanel
- `src/components/react/chat/__tests__/ConsultantLayout.test.tsx` — Added outcomePrompts fixtures and outcomesLabel
- `src/components/ConsultantSection.astro` — Fetches outcomePrompts from content provider, passes outcomesLabel and outcomePrompts to ConsultantLayout
- `src/components/TrustPanel.astro` — Added outcomePrompts fetch, outcomesLabel translation, outcomePrompts prop to TrustPanelReact

### Impeccable Skills Applied

- `frontend-design` on OutcomePrompts — production-grade component with distinctive icon-led design, persian-green accent colors
- `arrange` on TrustPanel — outcome-first visual hierarchy (outcomes above services)
- `colorize` on OutcomePrompts — persian-green-lightest hover bg, persian-green-lighter border, tarawera text
- `harden` on OutcomePrompts — empty state handling, keyboard navigation (Enter/Space), proper ARIA roles

### Key Decisions

- **Outcome-first ordering**: Outcomes appear above services to guide users toward business outcomes before specific services
- **Compact service items**: De-emphasized ServiceItem styling (no borders, smaller text) to create visual contrast with bolder OutcomePrompts
- **Icon mapping via switch**: Used simple switch statement in OutcomeIcon component mapping icon IDs to inline SVG paths — avoids external icon library dependency
- **Conditional rendering**: OutcomePrompts section only renders when array is non-empty, preventing empty heading/container

### Interfaces & Types

- `OutcomePrompt` in `src/lib/chat/content/types.ts` — `{ id, icon, label, prompt }` (created in Phase 1)
- `OutcomePromptsProps` in `OutcomePrompts.tsx` — `{ prompts, label, onPromptClick }`
- `TrustPanelTranslations` updated — added `outcomesLabel: string`
- `TrustPanelProps` updated — added `outcomePrompts: readonly OutcomePrompt[]`

### Tests

- `src/components/react/__tests__/OutcomePrompts.test.tsx` — 14 tests: rendering (label, items, testids, empty state, icons), click (click, Enter, Space, non-matching keys), accessibility (heading, buttons, focusable), bilingual
- `src/components/react/__tests__/TrustPanel.test.tsx` — 6 new tests: outcome section rendering (label, items, empty array, click), section ordering (outcomes before services, services before trust)
- Updated: `src/components/react/chat/__tests__/ConsultantLayout.test.tsx` — fixtures include outcomePrompts

## Architecture Notes

- OutcomePrompts follows the same pattern as ServiceItem — receives data as props from parent, fires callbacks on interaction
- TrustPanel.astro and ConsultantSection.astro both wire outcome prompts from StaticContentProvider, maintaining dual entry point compatibility
- The `onPromptClick` callback propagates up through TrustPanel → ConsultantLayout for chat injection

## Dependencies on Future Phases

- Phase 4 (Chat UX) will use the `onPromptClick` callback to inject outcome prompts into the chat flow
- Phase 6 (Integration) may need responsive adjustments to OutcomePrompts for mobile views

## Verification Results

```
=== Phase 3 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings, 10 hints)
  - lint:         ✅ (no warnings/errors)
  - format:       ✅
  - build:        ✅ (2 pages built in 1.03s)

Unit Tests:
  - Total:   883 tests
  - Passed:  883
  - Failed:  0
  - Test Files: 40

Verdict: PASS
```

### Test Count Progression

- Phase 1 (V2): 831 tests
- Phase 2 (V2): 863 tests (+32)
- Phase 3 (V2): 883 tests (+20: 14 OutcomePrompts + 6 TrustPanel)
