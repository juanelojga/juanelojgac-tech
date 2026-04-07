import React, { useCallback, useMemo, useState } from "react";

import type { OutcomePrompt } from "../../lib/chat/types";
import OutcomePrompts from "./OutcomePrompts";
import ServiceItem from "./ServiceItem";

export interface ServiceItemData {
  readonly id: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly relatedPrompt: string;
}

export interface TrustPanelTranslations {
  readonly servicesLabel: string;
  readonly collapseLabel: string;
  readonly expandLabel: string;
  readonly outcomesLabel: string;
  readonly panelLabel: string;
}

export interface TrustPanelProps {
  readonly services: readonly ServiceItemData[];
  readonly outcomePrompts: readonly OutcomePrompt[];
  readonly onPromptInject?: (prompt: string) => void;
  readonly translations: TrustPanelTranslations;
}

export default function TrustPanel({
  services,
  outcomePrompts,
  onPromptInject,
  translations,
}: TrustPanelProps) {
  // Start collapsed on mobile to prioritize chat view
  const [isExpanded, setIsExpanded] = useState(false);
  const handlePromptInject = useMemo(() => onPromptInject ?? (() => {}), [onPromptInject]);

  // Collapse panel on mobile after injecting a prompt so the chat view is visible
  const handlePromptInjectAndCollapse = useCallback(
    (prompt: string) => {
      handlePromptInject(prompt);
      setIsExpanded(false);
    },
    [handlePromptInject]
  );

  const togglePanel = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <aside
      aria-label={translations.panelLabel}
      data-testid="trust-panel"
      className="bg-chat-panel-sidebar-bg border-white-10 flex w-full flex-col overflow-hidden border-r backdrop-blur-md lg:h-full lg:w-[var(--spacing-chat-panel-width-desktop)] xl:w-[var(--spacing-chat-panel-width-wide)]"
    >
      {/* Toggle Button — visible only on mobile/tablet */}
      <button
        type="button"
        data-testid="panel-toggle"
        onClick={togglePanel}
        className="border-white-10 text-text-muted hover:bg-white-5 focus-visible:ring-accent-cyan flex min-h-[44px] w-full items-center justify-between border-b px-5 py-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset lg:hidden"
        aria-expanded={isExpanded}
      >
        {isExpanded ? translations.expandLabel : translations.collapseLabel}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div
        className={`overflow-y-auto transition-all duration-200 ease-in-out ${isExpanded ? "flex-1 opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0 lg:pointer-events-auto lg:h-auto lg:flex-1 lg:overflow-y-auto lg:opacity-100"}`}
      >
        {/* Outcome Prompts Section — Primary focus */}
        {outcomePrompts.length > 0 && (
          <div className="border-white-10 border-b px-5 py-4">
            <OutcomePrompts
              outcomes={outcomePrompts}
              label={translations.outcomesLabel}
              onPromptInject={handlePromptInjectAndCollapse}
            />
          </div>
        )}

        {/* Services Section — De-emphasized compact list */}
        <div className="border-white-10 border-b px-5 py-4">
          <h3 className="font-sora text-text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
            {translations.servicesLabel}
          </h3>
          <div className="space-y-1">
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                id={service.id}
                title={service.title}
                shortDescription={service.shortDescription}
                relatedPrompt={service.relatedPrompt}
                onPromptInject={handlePromptInjectAndCollapse}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
