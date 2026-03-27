# Phase 4 Code Review

**Reviewer**: Claude Opus 4.6 (self-review)
**Date**: 2026-03-27
**Files Reviewed**: 4 (+ 2 page modifications)

## Critical Issues 🔴

None

## High Priority 🟠

1. **ServiceCard.tsx — Stagger delay doesn't work**
   - **File**: `src/components/redesign/react/ServiceCard.tsx`, lines 135-139
   - **Problem**: `animationDelay` is set but the visibility transition uses inline `transition` property (not CSS `@keyframes` animation). CSS `animation-delay` has no effect on CSS transitions. All cards that become visible at the same time will animate simultaneously without stagger.
   - **Impact**: The intended 0ms, 100ms, 200ms, 300ms, 400ms stagger effect between cards doesn't happen.
   - **Fix**: Use `transitionDelay` instead of `animationDelay`, and separate the stagger delay from the transition duration in the inline style.

## Medium Priority 🟡

1. **ServiceCard.tsx — Observer not unobserved after triggering**
   - **File**: `src/components/redesign/react/ServiceCard.tsx`, lines 112-115
   - **Problem**: After the card becomes visible, the observer continues watching the element. While not harmful (state only sets to true once), it's a minor cleanup that could be done by calling `observer.unobserve(el)` in the intersection callback.
   - **Impact**: Minor memory — observer runs unnecessarily after card is revealed.
   - **Fix**: Unobserve the target in the callback after `isIntersecting`.

## Low Priority 🔵

None

## Positive Observations ✅

- Clean type-safe implementation with explicit `ServiceCardProps` from types.ts
- Inline SVG icons avoid external dependencies — consistent stroke-based style
- `client:visible` directive on ServiceCard is optimal (only hydrates when in viewport)
- Proper cleanup with `observer.disconnect()` on unmount
- Accessibility: `aria-hidden` on decorative icons and arrows, `aria-label` on section
- All text sourced from i18n keys — no hard-coded strings
- Responsive grid uses proper Tailwind breakpoints: 1→2→3→5 columns
- Tests cover rendering, styling, scroll reveal, accessibility, and stagger delay

## Summary

- Critical: 0 issues
- High: 1 issue (stagger delay mechanism)
- Medium: 1 issue (observer cleanup)
- Low: 0 issues
- **Verdict**: NEEDS FIXES

## Fix Plan

**Model**: Claude Opus 4.6
**Date**: 2026-03-27

### High Priority Fixes (mandatory)

| #   | Issue         | File            | Fix Description                                                                                                    | Test Update                                                        |
| --- | ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | Stagger delay | ServiceCard.tsx | Change `animationDelay` to `transitionDelay` in inline styles so delay applies to the opacity/transform transition | Update test to check `transitionDelay` instead of `animationDelay` |

### Medium Priority Fixes (if time permits)

| #   | Issue            | File            | Fix Description                                                     | Test Update                                  |
| --- | ---------------- | --------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| 2   | Observer cleanup | ServiceCard.tsx | Add `observer.unobserve(entry.target)` after detecting intersection | Updated test mock to verify unobserve called |

## Resolution Summary

- Critical: 0/0 resolved ✅
- High: 1/1 resolved ✅ (stagger delay fixed: `animationDelay` → `transitionDelay`)
- Medium: 1/1 resolved ✅ (observer now unobserves after intersection)
- Low: 0 deferred
