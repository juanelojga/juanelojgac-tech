import React, { useCallback } from "react";

import type { StarterPrompt } from "../../../lib/chat/types";

export interface PromptChipsProps {
  readonly chips: readonly StarterPrompt[];
  readonly onChipClick: (prompt: string) => void;
  readonly label: string;
  readonly visible: boolean;
}

export default function PromptChips({ chips, onChipClick, label, visible }: PromptChipsProps) {
  const handleClick = useCallback(
    (prompt: string) => () => {
      onChipClick(prompt);
    },
    [onChipClick]
  );

  if (!visible || chips.length === 0) return null;

  return (
    <div className="px-4 py-3">
      <p className="text-neutral mb-2.5 text-xs font-medium">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={handleClick(chip.prompt)}
            className="bg-chat-chip-bg text-chat-chip-text border-chat-chip-border hover:bg-chat-chip-hover-bg hover:border-chat-chip-hover-border rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
