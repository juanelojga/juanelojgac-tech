import type { Mock, vi } from "vitest";

import type { Language } from "../../i18n";
import type {
  ChatAssistantService,
  ChatMessage,
  ChatMessageSender,
  ChatStateManager,
  ChatSummaryGenerator,
  CompanyFacts,
  ContentProvider,
  ConversationOrchestrator,
  ConversationPhase,
  ConversationState,
  CTAInjectionResult,
  CTAInjector,
  FollowUpGuide,
  FollowUpSuggestion,
  GuidedFollowUp,
  InlineCTA,
  LeadAttributes,
  OutOfScopeRedirect,
  PriceRange,
  ProjectSummary,
  RecommendedSolution,
  ScopeEnforcer,
  ScopeEvaluationResult,
  ServiceContent,
  StarterPrompt,
  TimelineEstimate,
  TrustSignal,
} from "../types";

// ──────────────────────────────────────────────
// Data factories — produce valid typed instances
// ──────────────────────────────────────────────

export function createChatMessage(overrides?: Partial<ChatMessage>): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: "user",
    content: "Hello, I need help with a project",
    timestamp: Date.now(),
    language: "en",
    ...overrides,
  };
}

export function createInlineCTA(overrides?: Partial<InlineCTA>): InlineCTA {
  return {
    label: "Book a consultation",
    url: "https://calendly.com/juanelojgac",
    type: "booking",
    ...overrides,
  };
}

export function createLeadAttributes(overrides?: Partial<LeadAttributes>): LeadAttributes {
  return {
    projectType: "ai-integration",
    targetUsers: "Small business owners",
    goals: "Automate customer support with AI",
    timeline: "short-term",
    budgetRange: "growth",
    companySize: "10-50 employees",
    industry: "Technology",
    ...overrides,
  };
}

export function createTimelineEstimate(overrides?: Partial<TimelineEstimate>): TimelineEstimate {
  return {
    minWeeks: 4,
    maxWeeks: 8,
    description: "4-8 weeks",
    ...overrides,
  };
}

export function createPriceRange(overrides?: Partial<PriceRange>): PriceRange {
  return {
    minUSD: 5000,
    maxUSD: 15000,
    description: "$5,000 - $15,000",
    ...overrides,
  };
}

export function createRecommendedSolution(
  overrides?: Partial<RecommendedSolution>
): RecommendedSolution {
  return {
    type: "AI-powered customer support chatbot",
    description: "Custom chatbot trained on your business data",
    ...overrides,
  };
}

export function createProjectSummary(overrides?: Partial<ProjectSummary>): ProjectSummary {
  return {
    id: `ps-${Date.now()}`,
    leadAttributes: createLeadAttributes(),
    recommendedSolution: createRecommendedSolution(),
    timeline: createTimelineEstimate(),
    priceRange: createPriceRange(),
    nextSteps: [
      "Book a free consultation call",
      "Review detailed proposal",
      "Approve project scope",
    ],
    generatedAt: Date.now(),
    language: "en",
    ...overrides,
  };
}

export function createConversationState(overrides?: Partial<ConversationState>): ConversationState {
  return {
    messages: [],
    phase: "greeting",
    language: "en",
    leadAttributes: {},
    isAssistantTyping: false,
    error: null,
    ...overrides,
  };
}

export function createServiceContent(overrides?: Partial<ServiceContent>): ServiceContent {
  return {
    id: "svc-ai-integration",
    title: "AI Integration",
    description: "End-to-end AI integration for your business",
    shortDescription: "Integrate AI into your workflows",
    pricingRange: createPriceRange(),
    deliveryTimeline: createTimelineEstimate(),
    examples: [
      "Customer support chatbot",
      "Document processing automation",
      "Recommendation engine",
    ],
    relatedPrompt: "Tell me about AI integration services",
    ...overrides,
  };
}

export function createTrustSignal(overrides?: Partial<TrustSignal>): TrustSignal {
  return {
    id: "ts-projects",
    type: "stat",
    label: "Projects delivered",
    value: "50+",
    ...overrides,
  };
}

export function createCompanyFacts(overrides?: Partial<CompanyFacts>): CompanyFacts {
  return {
    name: "JuaneloJGAC Tech",
    tagline: "Your AI Consulting Partner",
    description: "We help businesses leverage AI for growth and efficiency",
    processSteps: [
      "Discovery & Strategy",
      "Design & Architecture",
      "Build & Iterate",
      "Launch & Support",
    ],
    teamDescription: "Expert team of AI engineers and consultants",
    ...overrides,
  };
}

export function createStarterPrompt(overrides?: Partial<StarterPrompt>): StarterPrompt {
  return {
    id: "sp-general",
    label: "What services do you offer?",
    prompt: "What services does JuaneloJGAC Tech offer?",
    intent: "general",
    ...overrides,
  };
}

export function createGuidedFollowUp(overrides?: Partial<GuidedFollowUp>): GuidedFollowUp {
  return {
    id: "gf-timeline",
    label: "What's the typical timeline?",
    prompt: "What's the typical timeline for this type of project?",
    applicablePhases: ["discovery", "qualification"],
    ...overrides,
  };
}

export function createOutOfScopeRedirect(
  overrides?: Partial<OutOfScopeRedirect>
): OutOfScopeRedirect {
  return {
    message: "I'm focused on helping you with our services. Here are some things I can help with:",
    suggestedPrompts: [
      createStarterPrompt({ id: "sp-1", label: "Our AI services" }),
      createStarterPrompt({ id: "sp-2", label: "Pricing information" }),
    ],
    ...overrides,
  };
}

export function createScopeEvaluationResult(
  overrides?: Partial<ScopeEvaluationResult>
): ScopeEvaluationResult {
  return {
    isInScope: true,
    confidence: 0.95,
    ...overrides,
  };
}

export function createCTAInjectionResult(
  overrides?: Partial<CTAInjectionResult>
): CTAInjectionResult {
  return {
    shouldInject: false,
    ctas: [],
    ...overrides,
  };
}

export function createFollowUpSuggestion(
  overrides?: Partial<FollowUpSuggestion>
): FollowUpSuggestion {
  return {
    followUps: [createGuidedFollowUp()],
    shouldTransitionPhase: false,
    ...overrides,
  };
}

// ──────────────────────────────────────────────
// Mock service factories — produce mock implementations
// ──────────────────────────────────────────────

export interface MockChatMessageSender extends ChatMessageSender {
  sendMessage: Mock<ChatMessageSender["sendMessage"]>;
}

export interface MockChatStateManager extends ChatStateManager {
  getState: Mock<ChatStateManager["getState"]>;
  resetConversation: Mock<ChatStateManager["resetConversation"]>;
  updateLanguage: Mock<ChatStateManager["updateLanguage"]>;
}

export interface MockChatSummaryGenerator extends ChatSummaryGenerator {
  generateSummary: Mock<ChatSummaryGenerator["generateSummary"]>;
  canGenerateSummary: Mock<ChatSummaryGenerator["canGenerateSummary"]>;
}

export interface MockChatAssistantService extends ChatAssistantService {
  sendMessage: Mock<ChatAssistantService["sendMessage"]>;
  getState: Mock<ChatAssistantService["getState"]>;
  resetConversation: Mock<ChatAssistantService["resetConversation"]>;
  updateLanguage: Mock<ChatAssistantService["updateLanguage"]>;
  generateSummary: Mock<ChatAssistantService["generateSummary"]>;
  canGenerateSummary: Mock<ChatAssistantService["canGenerateSummary"]>;
}

export function createMockChatAssistantService(vitest: typeof vi): MockChatAssistantService {
  const state = createConversationState();
  return {
    sendMessage: vitest.fn<ChatAssistantService["sendMessage"]>().mockResolvedValue(
      createChatMessage({
        role: "assistant",
        content: "Hello! How can I help you today?",
      })
    ),
    getState: vitest.fn<ChatAssistantService["getState"]>().mockReturnValue(state),
    resetConversation: vitest.fn<ChatAssistantService["resetConversation"]>(),
    updateLanguage: vitest.fn<ChatAssistantService["updateLanguage"]>(),
    generateSummary: vitest
      .fn<ChatAssistantService["generateSummary"]>()
      .mockResolvedValue(createProjectSummary()),
    canGenerateSummary: vitest
      .fn<ChatAssistantService["canGenerateSummary"]>()
      .mockReturnValue(false),
  };
}

export interface MockContentProvider extends ContentProvider {
  getServices: Mock<ContentProvider["getServices"]>;
  getCompanyFacts: Mock<ContentProvider["getCompanyFacts"]>;
  getTrustSignals: Mock<ContentProvider["getTrustSignals"]>;
  getStarterPrompts: Mock<ContentProvider["getStarterPrompts"]>;
  getGuidedFollowUps: Mock<ContentProvider["getGuidedFollowUps"]>;
  getOutOfScopeRedirect: Mock<ContentProvider["getOutOfScopeRedirect"]>;
  getOutcomePrompts: Mock<ContentProvider["getOutcomePrompts"]>;
  getPromptGroups: Mock<ContentProvider["getPromptGroups"]>;
}

export function createMockContentProvider(vitest: typeof vi): MockContentProvider {
  return {
    getServices: vitest
      .fn<ContentProvider["getServices"]>()
      .mockReturnValue([createServiceContent()]),
    getCompanyFacts: vitest
      .fn<ContentProvider["getCompanyFacts"]>()
      .mockReturnValue(createCompanyFacts()),
    getTrustSignals: vitest
      .fn<ContentProvider["getTrustSignals"]>()
      .mockReturnValue([createTrustSignal()]),
    getStarterPrompts: vitest
      .fn<ContentProvider["getStarterPrompts"]>()
      .mockReturnValue([createStarterPrompt()]),
    getGuidedFollowUps: vitest
      .fn<ContentProvider["getGuidedFollowUps"]>()
      .mockReturnValue([createGuidedFollowUp()]),
    getOutOfScopeRedirect: vitest
      .fn<ContentProvider["getOutOfScopeRedirect"]>()
      .mockReturnValue(createOutOfScopeRedirect()),
    getOutcomePrompts: vitest.fn<ContentProvider["getOutcomePrompts"]>().mockReturnValue([]),
    getPromptGroups: vitest.fn<ContentProvider["getPromptGroups"]>().mockReturnValue([]),
  };
}

export interface MockScopeEnforcer extends ScopeEnforcer {
  evaluateScope: Mock<ScopeEnforcer["evaluateScope"]>;
}

export interface MockCTAInjector extends CTAInjector {
  determineCTAs: Mock<CTAInjector["determineCTAs"]>;
}

export interface MockFollowUpGuide extends FollowUpGuide {
  suggestFollowUps: Mock<FollowUpGuide["suggestFollowUps"]>;
}

export interface MockConversationOrchestrator extends ConversationOrchestrator {
  evaluateScope: Mock<ConversationOrchestrator["evaluateScope"]>;
  determineCTAs: Mock<ConversationOrchestrator["determineCTAs"]>;
  suggestFollowUps: Mock<ConversationOrchestrator["suggestFollowUps"]>;
  extractLeadAttributes: Mock<ConversationOrchestrator["extractLeadAttributes"]>;
}

export function createMockConversationOrchestrator(
  vitest: typeof vi
): MockConversationOrchestrator {
  return {
    evaluateScope: vitest
      .fn<ConversationOrchestrator["evaluateScope"]>()
      .mockReturnValue(createScopeEvaluationResult()),
    determineCTAs: vitest
      .fn<ConversationOrchestrator["determineCTAs"]>()
      .mockReturnValue(createCTAInjectionResult()),
    suggestFollowUps: vitest
      .fn<ConversationOrchestrator["suggestFollowUps"]>()
      .mockReturnValue(createFollowUpSuggestion()),
    extractLeadAttributes: vitest
      .fn<ConversationOrchestrator["extractLeadAttributes"]>()
      .mockReturnValue({}),
  };
}

// ──────────────────────────────────────────────
// Conversation scenario builders
// ──────────────────────────────────────────────

/**
 * Creates a realistic multi-turn conversation for testing.
 */
export function createConversationScenario(
  language: Language = "en",
  phase: ConversationPhase = "discovery"
): ConversationState {
  const messages: ChatMessage[] = [
    createChatMessage({
      id: "msg-1",
      role: "assistant",
      content:
        language === "en"
          ? "Hello! I'm the JuaneloJGAC Tech assistant. How can I help you today?"
          : "¡Hola! Soy el asistente de JuaneloJGAC Tech. ¿En qué puedo ayudarte?",
      timestamp: Date.now() - 60000,
      language,
    }),
    createChatMessage({
      id: "msg-2",
      role: "user",
      content:
        language === "en"
          ? "I need help automating my business processes"
          : "Necesito ayuda para automatizar mis procesos de negocio",
      timestamp: Date.now() - 50000,
      language,
    }),
    createChatMessage({
      id: "msg-3",
      role: "assistant",
      content:
        language === "en"
          ? "I'd love to help with business automation! Can you tell me more about which processes you'd like to automate?"
          : "¡Me encantaría ayudarte con la automatización! ¿Puedes contarme más sobre qué procesos te gustaría automatizar?",
      timestamp: Date.now() - 40000,
      language,
    }),
  ];

  return createConversationState({
    messages,
    phase,
    language,
    leadAttributes: {
      projectType: "automation",
    },
  });
}
