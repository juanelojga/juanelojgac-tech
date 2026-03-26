import React, { useCallback, useMemo } from "react";

import type { PromptGroup, StarterPrompt } from "../../../lib/chat/types";

export interface GroupedPromptChipsProps {
  readonly promptGroups: readonly PromptGroup[];
  readonly starterPrompts: readonly StarterPrompt[];
  readonly onChipClick: (prompt: string) => void;
  readonly sectionLabel: string;
  readonly visible: boolean;
}

export default function GroupedPromptChips({
  promptGroups,
  starterPrompts,
  onChipClick,
  sectionLabel,
  visible,
}: GroupedPromptChipsProps) {
  const handleClick = useCallback(
    (prompt: string) => () => {
      onChipClick(prompt);
    },
    [onChipClick]
  );

  // Resolve prompt IDs to full StarterPrompt objects, skipping unresolvable IDs
  const resolvedGroups = useMemo(() => {
    const promptMap = new Map(starterPrompts.map((p) => [p.id, p]));
    return promptGroups
      .map((group) => ({
        groupLabel: group.groupLabel,
        prompts: group.promptIds
          .map((id) => promptMap.get(id))
          .filter((p): p is StarterPrompt => p !== undefined),
      }))
      .filter((group) => group.prompts.length > 0);
  }, [promptGroups, starterPrompts]);

  if (!visible || resolvedGroups.length === 0) return null;

  return (
    <div
      data-testid="grouped-prompt-chips"
      aria-label={sectionLabel}
      className="px-3 py-3 sm:px-4"
    >
      <p className="text-neutral mb-3 text-xs font-medium">{sectionLabel}</p>

      <div className="space-y-3">
        {resolvedGroups.map((group) => (
          <div key={group.groupLabel} role="group" aria-label={group.groupLabel}>
            <h4 className="text-tarawera mb-1.5 text-xs font-semibold uppercase tracking-wide opacity-70">
              {group.groupLabel}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.prompts.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={handleClick(chip.prompt)}
                  data-testid="grouped-prompt-chip"
                  className="bg-chat-chip-bg text-chat-chip-text border-chat-chip-border hover:bg-chat-chip-hover-bg hover:border-chat-chip-hover-border min-h-[44px] rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
