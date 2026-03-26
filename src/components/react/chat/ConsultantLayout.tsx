import React, { useCallback, useRef, useState } from "react";

import { ChatAPIClient } from "../../../lib/chat/chat-api-client";
import { StaticContentProvider } from "../../../lib/chat/content/static-content-provider";
import { CTAInjectorImpl } from "../../../lib/chat/cta-injector";
import { GuidedFlowManagerImpl } from "../../../lib/chat/guided-flow-manager";
import { getErrorMessageKey, isOpenRouterError } from "../../../lib/chat/http-utils";
import { ScopeEnforcerImpl } from "../../../lib/chat/scope-enforcer";
import { SystemPromptBuilder } from "../../../lib/chat/system-prompt-builder";
import type {
  ChatMessage as ChatMessageType,
  ContentProvider,
  ConversationPhase,
  ConversationState,
  GuidedFollowUp,
  LeadAttributes,
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
  readonly errorTranslations: ErrorTranslations;
  readonly turnstileSiteKey: string;
  readonly language: "en" | "es";
  readonly contentProvider?: ContentProvider;
}

/** Error message i18n keys resolved to display strings */
export interface ErrorTranslations {
  readonly errorGeneric: string;
  readonly errorNetwork: string;
  readonly errorRateLimit: string;
  readonly errorTimeout: string;
  readonly errorUnavailable: string;
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
  errorTranslations,
  turnstileSiteKey,
  language,
  contentProvider,
}: ConsultantLayoutProps) {
  const [isVerified, setIsVerified] = useState(!turnstileSiteKey);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<ConversationPhase>("greeting");
  const leadAttributes: Partial<LeadAttributes> = {};
  const [followUps, setFollowUps] = useState<readonly GuidedFollowUp[]>([]);
  const lastFailedMessageRef = useRef<string | null>(null);
  const turnstileTokenRef = useRef<string | null>(null);

  // Service instances — created once and persisted across renders
  const servicesRef = useRef<{
    apiClient: ChatAPIClient;
    promptBuilder: SystemPromptBuilder;
    scopeEnforcer: ScopeEnforcerImpl;
    ctaInjector: CTAInjectorImpl;
    flowManager: GuidedFlowManagerImpl;
  } | null>(null);

  // Lazy-initialize services — uses content provider prop or creates StaticContentProvider
  function getServices() {
    if (servicesRef.current) return servicesRef.current;
    const provider = contentProvider ?? new StaticContentProvider();
    servicesRef.current = {
      apiClient: new ChatAPIClient(),
      promptBuilder: new SystemPromptBuilder(provider),
      scopeEnforcer: new ScopeEnforcerImpl(provider),
      ctaInjector: new CTAInjectorImpl(),
      flowManager: new GuidedFlowManagerImpl(provider),
    };
    if (turnstileTokenRef.current) {
      servicesRef.current.apiClient.setTurnstileToken(turnstileTokenRef.current);
    }
    return servicesRef.current;
  }

  /** Build current conversation state snapshot */
  const buildConversationState = useCallback(
    (
      currentMessages: readonly ChatMessageType[],
      currentPhase: ConversationPhase
    ): ConversationState => ({
      messages: currentMessages,
      phase: currentPhase,
      language,
      leadAttributes,
      isAssistantTyping: false,
      error: null,
    }),
    [language, leadAttributes]
  );

  /** Resolve an error key to the localized display string */
  const resolveErrorMessage = useCallback(
    (errorKey: string): string => {
      const keyMap: Record<string, string> = {
        "chat.messages.errorGeneric": errorTranslations.errorGeneric,
        "chat.messages.errorNetwork": errorTranslations.errorNetwork,
        "chat.messages.errorRateLimit": errorTranslations.errorRateLimit,
        "chat.messages.errorTimeout": errorTranslations.errorTimeout,
        "chat.messages.errorUnavailable": errorTranslations.errorUnavailable,
      };
      return keyMap[errorKey] ?? errorTranslations.errorGeneric;
    },
    [errorTranslations]
  );

  const handleVerificationSuccess = useCallback((token: string) => {
    setIsVerified(true);
    turnstileTokenRef.current = token;
    if (servicesRef.current) {
      servicesRef.current.apiClient.setTurnstileToken(token);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Create user message and add to UI state
      const userMessage: ChatMessageType = {
        id: generateLayoutMessageId(),
        role: "user",
        content,
        timestamp: Date.now(),
        language,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setError(null);
      setFollowUps([]);

      // Evaluate scope before calling API
      const svc = getServices();
      const conversationState = buildConversationState(updatedMessages, phase);
      const scopeResult = svc.scopeEnforcer.evaluateScope(content, conversationState);

      if (!scopeResult.isInScope && scopeResult.redirect) {
        // Out-of-scope: inject soft redirect message without API call
        const redirectMessage: ChatMessageType = {
          id: generateLayoutMessageId(),
          role: "assistant",
          content: scopeResult.redirect.message,
          timestamp: Date.now(),
          language,
        };
        setMessages((prev) => [...prev, redirectMessage]);
        return;
      }

      // In-scope: call API
      setIsTyping(true);
      lastFailedMessageRef.current = content;

      try {
        // Format messages for API
        const apiMessages = svc.promptBuilder.formatMessagesForAPI(
          updatedMessages,
          language,
          phase
        );

        // Call API
        const result = await svc.apiClient.sendMessage(apiMessages, language);

        // Create assistant message
        let assistantMessage: ChatMessageType = {
          id: generateLayoutMessageId(),
          role: "assistant",
          content: result.content,
          timestamp: Date.now(),
          language,
        };

        // Check CTAs
        const messagesWithAssistant = [...updatedMessages, assistantMessage];
        const stateForCTA = buildConversationState(messagesWithAssistant, phase);
        const ctaResult = svc.ctaInjector.determineCTAs(assistantMessage, stateForCTA);
        if (ctaResult.shouldInject && ctaResult.ctas.length > 0) {
          assistantMessage = { ...assistantMessage, ctas: ctaResult.ctas };
        }

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        lastFailedMessageRef.current = null;

        // Check follow-ups and phase transitions
        const stateAfterResponse = buildConversationState(
          [...updatedMessages, assistantMessage],
          phase
        );
        const flowSuggestion = svc.flowManager.suggestFollowUps(stateAfterResponse);
        setFollowUps(flowSuggestion.followUps);
        if (flowSuggestion.shouldTransitionPhase && flowSuggestion.nextPhase) {
          setPhase(flowSuggestion.nextPhase);
        }
      } catch (err: unknown) {
        setIsTyping(false);
        const errorKey = isOpenRouterError(err)
          ? getErrorMessageKey(err.code)
          : "chat.messages.errorGeneric";
        setError(resolveErrorMessage(errorKey));
      }
    },
    [language, messages, phase, buildConversationState, resolveErrorMessage]
  );

  const handleRetry = useCallback(() => {
    if (lastFailedMessageRef.current) {
      setError(null);
      // Remove the last user message (which failed) to avoid duplicate
      setMessages((prev) => prev.slice(0, -1));
      handleSendMessage(lastFailedMessageRef.current);
    }
  }, [handleSendMessage]);

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
              followUps={followUps}
              isTyping={isTyping}
              error={error}
              onSendMessage={handleSendMessage}
              onRetry={handleRetry}
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
