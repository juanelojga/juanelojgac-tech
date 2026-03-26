import React, { useCallback, useState } from "react";

import type {
  ChatMessage as ChatMessageType,
  OutcomePrompt,
  PromptGroup,
  StarterPrompt,
  TrustSignal,
} from "../../../lib/chat/types";
import TrustPanel, { type ServiceItemData, type TrustPanelTranslations } from "../TrustPanel";
import ChatContainer, { type ChatContainerTranslations } from "./ChatContainer";
import ChatErrorBoundary, { type ErrorBoundaryTranslations } from "./ChatErrorBoundary";
import HumanVerification, { type HumanVerificationTranslations } from "./HumanVerification";

// ──────────────────────────────────────────────
// ConsultantLayout — Two-panel orchestrator
// SRP: owns cross-component state (verification, messages)
// Connects TrustPanel service clicks → ChatContainer input
// ──────────────────────────────────────────────

export interface LayoutTranslations {
  readonly consultantSection: string;
  readonly panelLabel: string;
  readonly chatLabel: string;
}

export interface ConsultantLayoutProps {
  readonly companyName: string;
  readonly tagline: string;
  readonly services: readonly ServiceItemData[];
  readonly trustSignals: readonly TrustSignal[];
  readonly outcomePrompts: readonly OutcomePrompt[];
  readonly starterPrompts: readonly StarterPrompt[];
  readonly promptGroups: readonly PromptGroup[];
  readonly bookingUrl: string;
  readonly contactEmail: string;
  readonly panelTranslations: TrustPanelTranslations;
  readonly chatTranslations: ChatContainerTranslations;
  readonly layoutTranslations: LayoutTranslations;
  readonly verificationTranslations: HumanVerificationTranslations;
  readonly errorBoundaryTranslations: ErrorBoundaryTranslations;
  readonly turnstileSiteKey: string;
  readonly language: "en" | "es";
}

/** Unique message ID generator */
let layoutMessageCounter = 0;
function generateLayoutMessageId(): string {
  layoutMessageCounter += 1;
  return `cl-msg-${Date.now()}-${layoutMessageCounter}`;
}

export default function ConsultantLayout({
  companyName,
  tagline,
  services,
  trustSignals,
  outcomePrompts,
  starterPrompts,
  promptGroups,
  bookingUrl,
  contactEmail,
  panelTranslations,
  chatTranslations,
  layoutTranslations,
  verificationTranslations,
  errorBoundaryTranslations,
  turnstileSiteKey,
  language,
}: ConsultantLayoutProps) {
  const [isVerified, setIsVerified] = useState(!turnstileSiteKey);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerificationSuccess = useCallback(() => {
    setIsVerified(true);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: ChatMessageType = {
        id: generateLayoutMessageId(),
        role: "user",
        content,
        timestamp: Date.now(),
        language,
      };

      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsTyping(true);

      // API call will be wired in integration phase
      // For now, mark typing as done after state update
      setTimeout(() => {
        setIsTyping(false);
      }, 0);
    },
    [language]
  );

  const handlePromptInject = useCallback(
    (prompt: string) => {
      if (!isVerified) return;
      handleSendMessage(prompt);
    },
    [isVerified, handleSendMessage]
  );

  return (
    <section
      aria-label={layoutTranslations.consultantSection}
      data-testid="consultant-layout"
      className="flex h-[calc(100dvh-6rem)] w-full flex-col overflow-hidden rounded-xl border border-neutral-200 shadow-lg sm:h-[600px] lg:h-[700px] lg:flex-row"
    >
      {/* Left Panel — Trust & Services */}
      <TrustPanel
        companyName={companyName}
        tagline={tagline}
        services={services}
        trustSignals={trustSignals}
        outcomePrompts={outcomePrompts}
        onPromptInject={handlePromptInject}
        translations={panelTranslations}
        bookingUrl={bookingUrl}
        contactEmail={contactEmail}
      />

      {/* Right Panel — Chat or Verification */}
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatErrorBoundary translations={errorBoundaryTranslations}>
          {isVerified ? (
            <ChatContainer
              messages={messages}
              starterPrompts={starterPrompts}
              promptGroups={promptGroups}
              isTyping={isTyping}
              error={error}
              onSendMessage={handleSendMessage}
              translations={chatTranslations}
            />
          ) : (
            <HumanVerification
              siteKey={turnstileSiteKey}
              onVerified={handleVerificationSuccess}
              translations={verificationTranslations}
            />
          )}
        </ChatErrorBoundary>
      </div>
    </section>
  );
}
