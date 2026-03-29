import type {
  ChatMessage,
  ConversationState,
  CTAInjectionResult,
  CTAInjector,
  InlineCTA,
} from "./types";

// ──────────────────────────────────────────────
// CTAInjectorImpl — SRP: only CTA placement logic
// Determines when and which CTA to insert in responses
// ──────────────────────────────────────────────

/** Minimum number of messages before first CTA injection */
const MIN_MESSAGES_FOR_CTA = 6;

/** Minimum messages between CTA injections */
const MIN_MESSAGES_BETWEEN_CTAS = 4;

/** Phases where CTA injection is allowed */
const CTA_ELIGIBLE_PHASES = new Set(["qualification", "summary", "completed"]);

/** Standard booking CTA */
const BOOKING_CTA: InlineCTA = {
  label: "Book a Free Consultation",
  url: "https://calendly.com/juanelojga/one-on-one-meeting",
  type: "booking",
};

/** Standard contact CTA */
const CONTACT_CTA: InlineCTA = {
  label: "Contact Us",
  url: "mailto:hello@juanelojgac.com",
  type: "contact",
};

export class CTAInjectorImpl implements CTAInjector {
  determineCTAs(
    assistantMessage: ChatMessage,
    conversationState: ConversationState
  ): CTAInjectionResult {
    // Only inject for assistant messages
    if (assistantMessage.role !== "assistant") {
      return { shouldInject: false, ctas: [] };
    }

    // Only inject in eligible phases
    if (!CTA_ELIGIBLE_PHASES.has(conversationState.phase)) {
      return { shouldInject: false, ctas: [] };
    }

    // Check minimum message count
    if (conversationState.messages.length < MIN_MESSAGES_FOR_CTA) {
      return { shouldInject: false, ctas: [] };
    }

    // Check rate: don't inject if recent messages already have CTAs
    if (this.hasRecentCTA(conversationState.messages)) {
      return { shouldInject: false, ctas: [] };
    }

    // Build CTA list based on phase
    const ctas = this.buildCTAs(conversationState);

    return {
      shouldInject: ctas.length > 0,
      ctas,
    };
  }

  private hasRecentCTA(messages: readonly ChatMessage[]): boolean {
    // Look at the last few assistant messages for existing CTAs
    const recentMessages = messages.slice(-MIN_MESSAGES_BETWEEN_CTAS);
    return recentMessages.some(
      (msg) => msg.role === "assistant" && msg.ctas && msg.ctas.length > 0
    );
  }

  private buildCTAs(_conversationState: ConversationState): InlineCTA[] {
    const ctas: InlineCTA[] = [];

    // Always include booking CTA in eligible phases
    ctas.push(BOOKING_CTA);

    // Include contact CTA as secondary option
    ctas.push(CONTACT_CTA);

    return ctas;
  }
}
