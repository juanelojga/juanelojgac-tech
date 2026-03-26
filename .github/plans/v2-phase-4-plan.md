# V2 Phase 4 Implementation Plan: Chat UX Redesign

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 4
**Generated**: 2026-03-26
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, arrange, adapt, typeset, colorize, harden, clarify, onboard, distill

## Success Criteria

- [ ] ChatHeader redesigned with branded copy, scope description, consultant identity styling
- [ ] GroupedPromptChips component implemented — renders prompts in labeled groups, fires onSendMessage on click
- [ ] ChatContainer welcome state updated — branded welcome message, grouped prompt chips, helper text below prompts
- [ ] ChatInput updated — helper text below input area (scope guidance), new placeholder copy
- [ ] Scope-redirect messaging updated — softer language, empathetic redirect
- [ ] ChatPanel.astro updated to pass new translations and grouped prompt data
- [ ] ConsultantLayout.tsx updated to pass grouped prompts and new translations
- [ ] All chat-related unit tests updated and passing
- [ ] Both EN and ES i18n files updated symmetrically
- [ ] `pnpm test`, `pnpm run astro:check`, `pnpm run lint:fix`, `pnpm run build` all pass

## Dependency Graph

```
Phase 1 (complete) ──> Phase 4 Tasks

Task 1: GroupedPromptChips tests (TDD)
  └──> Task 2: GroupedPromptChips implementation
        └──> Task 5: ChatContainer welcome state update
              └──> Task 7: ConsultantLayout prop threading
                    └──> Task 8: ChatPanel.astro update
                          └──> Task 9: Verification

Task 3: ChatHeader redesign (parallel with 1-2)
Task 4: ChatInput helper text (parallel with 1-2)
Task 6: Scope-redirect messaging (parallel with 1-2)
```

## Implementation Groups

### Group 1: New Component — GroupedPromptChips (Sequential — Critical Path)

| # | Task | Files | Skills | Depends On | Done Criteria | Est. |
|---|------|-------|--------|------------|---------------|------|
| 1.1 | Write TDD tests for GroupedPromptChips | `src/components/react/chat/__tests__/GroupedPromptChips.test.tsx` | harden, clarify | Phase 1 types | Tests cover group rendering, click behavior, empty groups, accessibility |  3h |
| 1.2 | Implement GroupedPromptChips component | `src/components/react/chat/GroupedPromptChips.tsx` | frontend-design, arrange, typeset | 1.1 | Renders prompt groups from content provider, styled with brand tokens | 4h |

### Group 2: Chat Header Redesign (Parallel Track A)

| # | Task | Files | Skills | Depends On | Done Criteria | Est. |
|---|------|-------|--------|------------|---------------|------|
| 2.1 | Redesign ChatHeader with branded copy + scope description | `src/components/react/chat/ChatHeader.tsx` | frontend-design, typeset, colorize | Phase 1 i18n | Header feels branded, communicates consultant scope clearly | 3h |
| 2.2 | Update ChatHeader tests | `src/components/react/chat/__tests__/ChatHeader.test.tsx` | harden | 2.1 | Tests verify new copy, scope description, structure | 2h |

### Group 3: ChatInput Helper Text (Parallel Track B)

| # | Task | Files | Skills | Depends On | Done Criteria | Est. |
|---|------|-------|--------|------------|---------------|------|
| 3.1 | Update ChatInput with helper text + scope guidance | `src/components/react/chat/ChatInput.tsx` | clarify, harden | Phase 1 i18n | Input shows helper text, placeholder uses new bilingual copy | 2h |
| 3.2 | Update ChatInput tests | `src/components/react/chat/__tests__/ChatInput.test.tsx` | harden | 3.1 | Tests verify helper text rendering, both languages | 2h |

### Group 4: Welcome State & Integration (Sequential — After Groups 1-3)

| # | Task | Files | Skills | Depends On | Done Criteria | Est. |
|---|------|-------|--------|------------|---------------|------|
| 4.1 | Update ChatContainer welcome state with grouped prompts + helper text | `src/components/react/chat/ChatContainer.tsx` | onboard, arrange, distill | Groups 1-3 | Welcome state feels polished and guided | 4h |
| 4.2 | Update ChatContainer tests | `src/components/react/chat/__tests__/ChatContainer.test.tsx` | harden | 4.1 | Tests verify new welcome state composition | 3h |
| 4.3 | Update ConsultantLayout to pass prompt groups | `src/components/react/chat/ConsultantLayout.tsx` | — | 4.1 | Layout correctly threads new props | 2h |
| 4.4 | Update ConsultantLayout tests | `src/components/react/chat/__tests__/ConsultantLayout.test.tsx` | — | 4.3 | Tests verify new prop passing | 1h |
| 4.5 | Update ChatPanel.astro + ConsultantSection.astro | `src/components/ChatPanel.astro`, `src/components/ConsultantSection.astro` | — | 4.3 | Astro wrappers pass all new props correctly | 2h |
| 4.6 | Final verification — all tests, astro:check, lint, build | — | — | All above | All checks pass | 1h |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GroupedPromptChips increases ChatContainer complexity | Medium | Extract as isolated component with own tests |
| Prompt group resolution requires starter prompt lookup | Medium | Pass resolved prompts (not IDs) to avoid runtime lookup in React |
| ChatHeader scope description may overflow on mobile | Low | Use truncation with responsive text sizing |
| i18n key additions must be symmetric | Medium | Update both files in same commit, run parity check |
