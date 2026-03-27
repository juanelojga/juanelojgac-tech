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
      className="group hover:bg-white-5 focus-visible:ring-accent-cyan flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-sora text-text-bright group-hover:text-accent-cyan text-xs font-medium">
          {title}
        </span>
        <span className="text-text-muted mt-0.5 text-[11px] leading-relaxed">{shortDescription}</span>
      </div>
      <svg
        className="text-text-muted group-hover:text-accent-cyan mt-0.5 h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
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
