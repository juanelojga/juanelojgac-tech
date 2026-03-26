import type { Language } from "../i18n";

// ──────────────────────────────────────────────
// Chat Message Types
// ──────────────────────────────────────────────

/** Roles that can participate in a chat conversation */
export type MessageRole = "user" | "assistant" | "system";

/** A CTA that can appear inline within an assistant message */
export interface InlineCTA {
  readonly label: string;
  readonly url: string;
  readonly type: "booking" | "contact" | "service";
}

/** A single message in the chat conversation */
export interface ChatMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: number;
  readonly language: Language;
  readonly ctas?: readonly InlineCTA[];
}

// ──────────────────────────────────────────────
// Conversation State
// ──────────────────────────────────────────────

/** Tracks where the user is in the guided conversation flow */
export type ConversationPhase =
  | "greeting"
  | "discovery"
  | "qualification"
  | "summary"
  | "completed";

/** Overall state of the active conversation */
export interface ConversationState {
  readonly messages: readonly ChatMessage[];
  readonly phase: ConversationPhase;
  readonly language: Language;
  readonly leadAttributes: Partial<LeadAttributes>;
  readonly isAssistantTyping: boolean;
  readonly error: string | null;
}

// ──────────────────────────────────────────────
// Lead Attributes
// ──────────────────────────────────────────────

/** Categories of projects the agency offers */
export type ProjectType =
  | "ai-integration"
  | "web-platform"
  | "automation"
  | "consulting"
  | "custom";

/** How soon the prospect needs delivery */
export type TimelineUrgency = "immediate" | "short-term" | "flexible" | "exploring";

/** Budget range tiers */
export type BudgetRange = "starter" | "growth" | "enterprise" | "unknown";

/** Extracted attributes about the prospect's needs */
export interface LeadAttributes {
  readonly projectType: ProjectType;
  readonly targetUsers: string;
  readonly goals: string;
  readonly timeline: TimelineUrgency;
  readonly budgetRange: BudgetRange;
  readonly companySize: string;
  readonly industry: string;
}

// ──────────────────────────────────────────────
// Project Summary
// ──────────────────────────────────────────────

/** A solution recommendation produced after qualification */
export interface RecommendedSolution {
  readonly type: string;
  readonly description: string;
}

/** Timeline estimate included in the project summary */
export interface TimelineEstimate {
  readonly minWeeks: number;
  readonly maxWeeks: number;
  readonly description: string;
}

/** Price range estimate included in the project summary */
export interface PriceRange {
  readonly minUSD: number;
  readonly maxUSD: number;
  readonly description: string;
}

/** Generated project summary presented to the prospect */
export interface ProjectSummary {
  readonly id: string;
  readonly leadAttributes: LeadAttributes;
  readonly recommendedSolution: RecommendedSolution;
  readonly timeline: TimelineEstimate;
  readonly priceRange: PriceRange;
  readonly nextSteps: readonly string[];
  readonly generatedAt: number;
  readonly language: Language;
}

// ──────────────────────────────────────────────
// Service Content
// ──────────────────────────────────────────────

/** A single service offered by the agency */
export interface ServiceContent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly shortDescription: string;
  readonly pricingRange: PriceRange;
  readonly deliveryTimeline: TimelineEstimate;
  readonly examples: readonly string[];
  readonly relatedPrompt: string;
}

/** Trust signal displayed in the left panel */
export interface TrustSignal {
  readonly id: string;
  readonly type: "stat" | "badge" | "testimonial" | "logo";
  readonly label: string;
  readonly value: string;
  readonly icon?: string;
}

/** Company facts for the content provider */
export interface CompanyFacts {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly processSteps: readonly string[];
  readonly teamDescription: string;
}

// ──────────────────────────────────────────────
// Starter Prompts & Guided Follow-ups
// ──────────────────────────────────────────────

/** A starter prompt chip displayed in the initial chat state */
export interface StarterPrompt {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
  readonly intent: ProjectType | "general";
}

/** A follow-up suggestion the assistant can offer */
export interface GuidedFollowUp {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
  readonly applicablePhases: readonly ConversationPhase[];
}

/** Redirect message for out-of-scope prompts */
export interface OutOfScopeRedirect {
  readonly message: string;
  readonly suggestedPrompts: readonly StarterPrompt[];
}

// ──────────────────────────────────────────────
// ChatAssistantService Interface (ISP)
// ──────────────────────────────────────────────

/** Handles sending messages and receiving responses */
export interface ChatMessageSender {
  sendMessage(message: string, conversationState: ConversationState): Promise<ChatMessage>;
}

/** Handles conversation state and history */
export interface ChatStateManager {
  getState(): ConversationState;
  resetConversation(language: Language): void;
  updateLanguage(language: Language): void;
}

/** Handles project summary generation */
export interface ChatSummaryGenerator {
  generateSummary(conversationState: ConversationState): Promise<ProjectSummary>;
  canGenerateSummary(leadAttributes: Partial<LeadAttributes>): boolean;
}

/** Full ChatAssistantService combining all ISP interfaces */
export interface ChatAssistantService
  extends ChatMessageSender, ChatStateManager, ChatSummaryGenerator {}

// ──────────────────────────────────────────────
// ContentProvider Interface (OCP)
// ──────────────────────────────────────────────

/** Content categories that can be queried */
export type ContentCategory = "services" | "company" | "prompts" | "trust-signals";

/** Bilingual content provider — open for extension via new ContentCategory values */
export interface ContentProvider {
  getServices(language: Language): readonly ServiceContent[];
  getCompanyFacts(language: Language): CompanyFacts;
  getTrustSignals(language: Language): readonly TrustSignal[];
  getStarterPrompts(language: Language): readonly StarterPrompt[];
  getGuidedFollowUps(language: Language, phase: ConversationPhase): readonly GuidedFollowUp[];
  getOutOfScopeRedirect(language: Language): OutOfScopeRedirect;
}

// ──────────────────────────────────────────────
// ConversationOrchestrator Interface (SRP)
// ──────────────────────────────────────────────

/** Result of evaluating whether user input is within scope */
export interface ScopeEvaluationResult {
  readonly isInScope: boolean;
  readonly confidence: number;
  readonly redirect?: OutOfScopeRedirect;
}

/** CTA injection decision after an assistant response */
export interface CTAInjectionResult {
  readonly shouldInject: boolean;
  readonly ctas: readonly InlineCTA[];
}

/** Determines guided follow-up suggestions after a response */
export interface FollowUpSuggestion {
  readonly followUps: readonly GuidedFollowUp[];
  readonly shouldTransitionPhase: boolean;
  readonly nextPhase?: ConversationPhase;
}

/** Enforces scope boundaries on user input */
export interface ScopeEnforcer {
  evaluateScope(userMessage: string, conversationState: ConversationState): ScopeEvaluationResult;
}

/** Decides when and which CTAs to inject */
export interface CTAInjector {
  determineCTAs(
    assistantMessage: ChatMessage,
    conversationState: ConversationState
  ): CTAInjectionResult;
}

/** Provides guided follow-up suggestions */
export interface FollowUpGuide {
  suggestFollowUps(conversationState: ConversationState): FollowUpSuggestion;
}

/** Full ConversationOrchestrator combining all SRP interfaces */
export interface ConversationOrchestrator extends ScopeEnforcer, CTAInjector, FollowUpGuide {
  extractLeadAttributes(messages: readonly ChatMessage[]): Partial<LeadAttributes>;
}
