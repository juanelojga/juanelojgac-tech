import React, { useCallback, useMemo, useState } from "react";

import type { OutcomePrompt, TrustSignal } from "../../lib/chat/types";
import OutcomePrompts from "./OutcomePrompts";
import PanelCTA from "./PanelCTA";
import ServiceItem from "./ServiceItem";
import TrustSignals from "./TrustSignals";

export interface ServiceItemData {
  readonly id: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly relatedPrompt: string;
}

export interface TrustPanelTranslations {
  readonly servicesLabel: string;
  readonly trustLabel: string;
  readonly ctaBooking: string;
  readonly ctaContact: string;
  readonly collapseLabel: string;
  readonly expandLabel: string;
  readonly outcomesLabel: string;
}

export interface TrustPanelProps {
  readonly companyName: string;
  readonly tagline: string;
  readonly services: readonly ServiceItemData[];
  readonly trustSignals: readonly TrustSignal[];
  readonly outcomePrompts: readonly OutcomePrompt[];
  readonly onPromptInject?: (prompt: string) => void;
  readonly translations: TrustPanelTranslations;
  readonly bookingUrl: string;
  readonly contactEmail: string;
}

export default function TrustPanel({
  companyName,
  tagline,
  services,
  trustSignals,
  outcomePrompts,
  onPromptInject,
  translations,
  bookingUrl,
  contactEmail,
}: TrustPanelProps) {
  // Start collapsed on mobile to prioritize chat view
  const [isExpanded, setIsExpanded] = useState(false);
  const handlePromptInject = useMemo(() => onPromptInject ?? (() => {}), [onPromptInject]);

  const togglePanel = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <aside
      aria-label={companyName}
      data-testid="trust-panel"
      className="bg-chat-panel-sidebar-bg border-white-10 flex w-full flex-col overflow-hidden border-r backdrop-blur-md lg:h-full lg:w-[var(--spacing-chat-panel-width-desktop)] xl:w-[var(--spacing-chat-panel-width-wide)]"
    >
      {/* Identity Header */}
      <div className="border-white-10 border-b px-5 py-5">
        <h2 className="font-sora text-text-bright text-lg font-bold tracking-tight">
          {companyName}
        </h2>
        <p className="text-text-muted mt-1.5 text-xs leading-relaxed">{tagline}</p>
      </div>

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
        className={`flex-1 overflow-y-auto transition-all duration-200 ease-in-out ${isExpanded ? "opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0 lg:pointer-events-auto lg:h-auto lg:overflow-y-auto lg:opacity-100"}`}
      >
        {/* Outcome Prompts Section — Primary focus */}
        {outcomePrompts.length > 0 && (
          <div className="border-white-10 border-b px-5 py-4">
            <OutcomePrompts
              outcomes={outcomePrompts}
              label={translations.outcomesLabel}
              onPromptInject={handlePromptInject}
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
                onPromptInject={handlePromptInject}
              />
            ))}
          </div>
        </div>

        {/* Trust Signals Section */}
        <div className="border-white-10 border-b px-5 py-4">
          <TrustSignals signals={trustSignals} label={translations.trustLabel} />
        </div>
      </div>

      {/* CTA Section — Always visible */}
      <div className="border-white-10 mt-auto border-t px-5 py-4">
        <PanelCTA
          bookingLabel={translations.ctaBooking}
          bookingUrl={bookingUrl}
          contactLabel={translations.ctaContact}
          contactEmail={contactEmail}
        />
      </div>
    </aside>
  );
}
