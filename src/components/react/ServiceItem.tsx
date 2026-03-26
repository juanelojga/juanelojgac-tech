import React, { useCallback } from "react";

export interface ServiceItemProps {
  readonly id: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly relatedPrompt: string;
  readonly onPromptInject: (prompt: string) => void;
}

export default function ServiceItem({
  id,
  title,
  shortDescription,
  relatedPrompt,
  onPromptInject,
}: ServiceItemProps) {
  const handleClick = useCallback(() => {
    onPromptInject(relatedPrompt);
  }, [onPromptInject, relatedPrompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPromptInject(relatedPrompt);
      }
    },
    [onPromptInject, relatedPrompt]
  );

  return (
    <button
      type="button"
      data-testid={`service-item-${id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group border-chat-chip-border bg-chat-panel-bg hover:border-tarawera hover:bg-chat-chip-hover-bg focus-visible:ring-chat-input-focus-border flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-sora text-tarawera group-hover:text-tarawera-dark text-sm font-semibold">
          {title}
        </span>
        <span className="text-neutral-dark mt-0.5 text-xs leading-relaxed">{shortDescription}</span>
      </div>
      <svg
        className="text-neutral group-hover:text-tarawera mt-0.5 h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
