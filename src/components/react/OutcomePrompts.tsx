import React, { useCallback } from "react";

import type { OutcomePrompt } from "../../lib/chat/types";

export interface OutcomePromptsProps {
  readonly outcomes: readonly OutcomePrompt[];
  readonly label: string;
  readonly onPromptInject: (prompt: string) => void;
}

/** Maps icon string identifiers to inline SVG paths */
function OutcomeIcon({ icon, id }: { icon: string; id: string }) {
  const iconPaths: Record<string, React.ReactNode> = {
    "chart-up": (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      />
    ),
    cog: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
      />
    ),
    globe: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
      />
    ),
    megaphone: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.718.718 0 0 1-.936-.259l-1.71-2.96a22.02 22.02 0 0 1 2.78-1.455Zm0-9.18a22.088 22.088 0 0 1 4.91-1.418c2.09-.345 3.75 1.172 3.75 3.258v.17c0 2.086-1.66 3.603-3.75 3.258a22.088 22.088 0 0 1-4.91-1.418"
      />
    ),
    lightbulb: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    ),
  };

  return (
    <svg
      data-testid={`outcome-icon-${id}`}
      className="text-persian-green h-5 w-5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      {iconPaths[icon] ?? iconPaths["lightbulb"]}
    </svg>
  );
}

function OutcomeItem({
  outcome,
  onPromptInject,
}: {
  outcome: OutcomePrompt;
  onPromptInject: (prompt: string) => void;
}) {
  const handleClick = useCallback(() => {
    onPromptInject(outcome.prompt);
  }, [onPromptInject, outcome.prompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPromptInject(outcome.prompt);
      }
    },
    [onPromptInject, outcome.prompt]
  );

  return (
    <button
      type="button"
      data-testid={`outcome-prompt-${outcome.id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group bg-chat-panel-bg hover:bg-persian-green-lightest border-persian-green-lighter hover:border-persian-green focus-visible:ring-chat-input-focus-border flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <OutcomeIcon icon={outcome.icon} id={outcome.id} />
      <span className="font-sora text-tarawera group-hover:text-tarawera-dark text-sm leading-snug font-semibold">
        {outcome.label}
      </span>
    </button>
  );
}

export default function OutcomePrompts({ outcomes, label, onPromptInject }: OutcomePromptsProps) {
  return (
    <div className="space-y-2.5">
      <h3 className="font-sora text-tarawera text-xs font-semibold tracking-wider uppercase">
        {label}
      </h3>
      <div className="space-y-1.5">
        {outcomes.map((outcome) => (
          <OutcomeItem key={outcome.id} outcome={outcome} onPromptInject={onPromptInject} />
        ))}
      </div>
    </div>
  );
}
