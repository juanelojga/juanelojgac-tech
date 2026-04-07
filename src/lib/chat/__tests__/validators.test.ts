import { describe, expect, it } from "vitest";

import type {
  BudgetRange,
  ChatMessage,
  CompanyFacts,
  ConversationPhase,
  ConversationState,
  CTAInjectionResult,
  FollowUpSuggestion,
  GuidedFollowUp,
  InlineCTA,
  LeadAttributes,
  MessageRole,
  OutcomePrompt,
  OutOfScopeRedirect,
  PriceRange,
  ProjectSummary,
  ProjectType,
  PromptGroup,
  RecommendedSolution,
  ScopeEvaluationResult,
  ServiceContent,
  StarterPrompt,
  TimelineEstimate,
  TimelineUrgency,
  TrustSignal,
} from "../types";
import {
  isValidBudgetRange,
  isValidChatMessage,
  isValidCompanyFacts,
  isValidConversationPhase,
  isValidConversationState,
  isValidCTAInjectionResult,
  isValidFollowUpSuggestion,
  isValidGuidedFollowUp,
  isValidInlineCTA,
  isValidLeadAttributes,
  isValidMessageRole,
  isValidOutcomePrompt,
  isValidOutOfScopeRedirect,
  isValidPriceRange,
  isValidProjectSummary,
  isValidProjectType,
  isValidPromptGroup,
  isValidRecommendedSolution,
  isValidScopeEvaluationResult,
  isValidServiceContent,
  isValidStarterPrompt,
  isValidTimelineEstimate,
  isValidTimelineUrgency,
  isValidTrustSignal,
  sanitizeUserInput,
} from "../validators";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function validChatMessage(overrides?: Partial<ChatMessage>): ChatMessage {
  return {
    id: "msg-1",
    role: "user",
    content: "Hello",
    timestamp: Date.now(),
    language: "en",
    ...overrides,
  };
}

function validInlineCTA(overrides?: Partial<InlineCTA>): InlineCTA {
  return {
    label: "Book consultation",
    url: "https://calendly.com/test",
    type: "booking",
    ...overrides,
  };
}

function validLeadAttributes(overrides?: Partial<LeadAttributes>): LeadAttributes {
  return {
    projectType: "ai-integration",
    targetUsers: "Small businesses",
    goals: "Automate workflows",
    timeline: "short-term",
    budgetRange: "growth",
    companySize: "10-50",
    industry: "Technology",
    ...overrides,
  };
}

function validTimelineEstimate(overrides?: Partial<TimelineEstimate>): TimelineEstimate {
  return {
    minWeeks: 4,
    maxWeeks: 8,
    description: "4-8 weeks",
    ...overrides,
  };
}

function validPriceRange(overrides?: Partial<PriceRange>): PriceRange {
  return {
    minUSD: 5000,
    maxUSD: 15000,
    description: "$5,000 - $15,000",
    ...overrides,
  };
}

function validRecommendedSolution(overrides?: Partial<RecommendedSolution>): RecommendedSolution {
  return {
    type: "AI-powered automation",
    description: "Custom workflow automation solution",
    ...overrides,
  };
}

function validServiceContent(overrides?: Partial<ServiceContent>): ServiceContent {
  return {
    id: "svc-1",
    title: "AI Integration",
    description: "Full AI integration service",
    shortDescription: "AI integration",
    pricingRange: validPriceRange(),
    deliveryTimeline: validTimelineEstimate(),
    examples: ["Example 1", "Example 2"],
    relatedPrompt: "Tell me about AI integration",
    ...overrides,
  };
}

function validTrustSignal(overrides?: Partial<TrustSignal>): TrustSignal {
  return {
    id: "ts-1",
    type: "stat",
    label: "Projects delivered",
    value: "50+",
    ...overrides,
  };
}

function validCompanyFacts(overrides?: Partial<CompanyFacts>): CompanyFacts {
  return {
    name: "JuaneloJGAC Tech",
    tagline: "AI Consulting",
    description: "AI consulting agency",
    processSteps: ["Discovery", "Design", "Build", "Launch"],
    teamDescription: "Expert team",
    ...overrides,
  };
}

function validStarterPrompt(overrides?: Partial<StarterPrompt>): StarterPrompt {
  return {
    id: "sp-1",
    label: "Tell me about services",
    prompt: "What services do you offer?",
    intent: "general",
    ...overrides,
  };
}

function validGuidedFollowUp(overrides?: Partial<GuidedFollowUp>): GuidedFollowUp {
  return {
    id: "gf-1",
    label: "Tell me more",
    prompt: "Can you elaborate?",
    applicablePhases: ["discovery", "qualification"],
    ...overrides,
  };
}

function validConversationState(overrides?: Partial<ConversationState>): ConversationState {
  return {
    messages: [validChatMessage()],
    phase: "greeting",
    language: "en",
    leadAttributes: {},
    isAssistantTyping: false,
    error: null,
    ...overrides,
  };
}

function validProjectSummary(overrides?: Partial<ProjectSummary>): ProjectSummary {
  return {
    id: "ps-1",
    leadAttributes: validLeadAttributes(),
    recommendedSolution: validRecommendedSolution(),
    timeline: validTimelineEstimate(),
    priceRange: validPriceRange(),
    nextSteps: ["Book consultation", "Review proposal"],
    generatedAt: Date.now(),
    language: "en",
    ...overrides,
  };
}

// ──────────────────────────────────────────────
// Enum-like validators
// ──────────────────────────────────────────────

describe("isValidMessageRole", () => {
  it.each<MessageRole>(["user", "assistant", "system"])(
    "returns true for valid role '%s'",
    (role) => {
      expect(isValidMessageRole(role)).toBe(true);
    }
  );

  it.each(["admin", "bot", "", null, undefined, 42])(
    "returns false for invalid role '%s'",
    (role) => {
      expect(isValidMessageRole(role)).toBe(false);
    }
  );
});

describe("isValidConversationPhase", () => {
  it.each<ConversationPhase>(["greeting", "discovery", "qualification", "summary", "completed"])(
    "returns true for valid phase '%s'",
    (phase) => {
      expect(isValidConversationPhase(phase)).toBe(true);
    }
  );

  it("returns false for invalid phase", () => {
    expect(isValidConversationPhase("unknown")).toBe(false);
  });
});

describe("isValidProjectType", () => {
  it.each<ProjectType>(["ai-integration", "web-platform", "automation", "consulting", "custom"])(
    "returns true for valid type '%s'",
    (type) => {
      expect(isValidProjectType(type)).toBe(true);
    }
  );

  it("returns false for invalid type", () => {
    expect(isValidProjectType("invalid")).toBe(false);
  });
});

describe("isValidTimelineUrgency", () => {
  it.each<TimelineUrgency>(["immediate", "short-term", "flexible", "exploring"])(
    "returns true for valid urgency '%s'",
    (urgency) => {
      expect(isValidTimelineUrgency(urgency)).toBe(true);
    }
  );

  it("returns false for invalid urgency", () => {
    expect(isValidTimelineUrgency("asap")).toBe(false);
  });
});

describe("isValidBudgetRange", () => {
  it.each<BudgetRange>(["starter", "growth", "enterprise", "unknown"])(
    "returns true for valid range '%s'",
    (range) => {
      expect(isValidBudgetRange(range)).toBe(true);
    }
  );

  it("returns false for invalid range", () => {
    expect(isValidBudgetRange("cheap")).toBe(false);
  });
});

// ──────────────────────────────────────────────
// Struct validators
// ──────────────────────────────────────────────

describe("isValidInlineCTA", () => {
  it("returns true for a valid InlineCTA", () => {
    expect(isValidInlineCTA(validInlineCTA())).toBe(true);
  });

  it("returns true for all CTA types", () => {
    expect(isValidInlineCTA(validInlineCTA({ type: "booking" }))).toBe(true);
    expect(isValidInlineCTA(validInlineCTA({ type: "contact" }))).toBe(true);
    expect(isValidInlineCTA(validInlineCTA({ type: "service" }))).toBe(true);
  });

  it("returns false when label is missing", () => {
    expect(isValidInlineCTA({ ...validInlineCTA(), label: "" })).toBe(false);
  });

  it("returns false when url is missing", () => {
    expect(isValidInlineCTA({ ...validInlineCTA(), url: "" })).toBe(false);
  });

  it("returns false for invalid type", () => {
    expect(isValidInlineCTA({ ...validInlineCTA(), type: "invalid" })).toBe(false);
  });

  it("returns false for null/undefined", () => {
    expect(isValidInlineCTA(null)).toBe(false);
    expect(isValidInlineCTA(undefined)).toBe(false);
  });
});

describe("isValidChatMessage", () => {
  it("returns true for a valid ChatMessage", () => {
    expect(isValidChatMessage(validChatMessage())).toBe(true);
  });

  it("returns true when ctas is present and valid", () => {
    const msg = validChatMessage({
      role: "assistant",
      ctas: [validInlineCTA()],
    });
    expect(isValidChatMessage(msg)).toBe(true);
  });

  it("returns false when id is empty", () => {
    expect(isValidChatMessage(validChatMessage({ id: "" }))).toBe(false);
  });

  it("returns false when role is invalid", () => {
    expect(isValidChatMessage({ ...validChatMessage(), role: "invalid" as MessageRole })).toBe(
      false
    );
  });

  it("returns false when content is empty", () => {
    expect(isValidChatMessage(validChatMessage({ content: "" }))).toBe(false);
  });

  it("returns false when timestamp is negative", () => {
    expect(isValidChatMessage(validChatMessage({ timestamp: -1 }))).toBe(false);
  });

  it("returns false when language is invalid", () => {
    expect(isValidChatMessage({ ...validChatMessage(), language: "fr" as "en" })).toBe(false);
  });

  it("returns false for non-object", () => {
    expect(isValidChatMessage("not an object")).toBe(false);
  });
});

describe("isValidLeadAttributes", () => {
  it("returns true for valid LeadAttributes", () => {
    expect(isValidLeadAttributes(validLeadAttributes())).toBe(true);
  });

  it("returns false when projectType is invalid", () => {
    expect(
      isValidLeadAttributes({
        ...validLeadAttributes(),
        projectType: "invalid" as ProjectType,
      })
    ).toBe(false);
  });

  it("returns false when targetUsers is empty", () => {
    expect(isValidLeadAttributes(validLeadAttributes({ targetUsers: "" }))).toBe(false);
  });

  it("returns false when timeline is invalid", () => {
    expect(
      isValidLeadAttributes({
        ...validLeadAttributes(),
        timeline: "invalid" as TimelineUrgency,
      })
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidLeadAttributes(null)).toBe(false);
  });
});

describe("isValidTimelineEstimate", () => {
  it("returns true for valid TimelineEstimate", () => {
    expect(isValidTimelineEstimate(validTimelineEstimate())).toBe(true);
  });

  it("returns false when minWeeks is negative", () => {
    expect(isValidTimelineEstimate(validTimelineEstimate({ minWeeks: -1 }))).toBe(false);
  });

  it("returns false when maxWeeks < minWeeks", () => {
    expect(isValidTimelineEstimate(validTimelineEstimate({ minWeeks: 10, maxWeeks: 5 }))).toBe(
      false
    );
  });

  it("returns false when description is empty", () => {
    expect(isValidTimelineEstimate(validTimelineEstimate({ description: "" }))).toBe(false);
  });
});

describe("isValidPriceRange", () => {
  it("returns true for valid PriceRange", () => {
    expect(isValidPriceRange(validPriceRange())).toBe(true);
  });

  it("returns false when minUSD is negative", () => {
    expect(isValidPriceRange(validPriceRange({ minUSD: -100 }))).toBe(false);
  });

  it("returns false when maxUSD < minUSD", () => {
    expect(isValidPriceRange(validPriceRange({ minUSD: 20000, maxUSD: 5000 }))).toBe(false);
  });

  it("returns false when description is empty", () => {
    expect(isValidPriceRange(validPriceRange({ description: "" }))).toBe(false);
  });
});

describe("isValidRecommendedSolution", () => {
  it("returns true for valid solution", () => {
    expect(isValidRecommendedSolution(validRecommendedSolution())).toBe(true);
  });

  it("returns false when type is empty", () => {
    expect(isValidRecommendedSolution(validRecommendedSolution({ type: "" }))).toBe(false);
  });

  it("returns false when description is empty", () => {
    expect(isValidRecommendedSolution(validRecommendedSolution({ description: "" }))).toBe(false);
  });
});

describe("isValidServiceContent", () => {
  it("returns true for valid ServiceContent", () => {
    expect(isValidServiceContent(validServiceContent())).toBe(true);
  });

  it("returns false when id is empty", () => {
    expect(isValidServiceContent(validServiceContent({ id: "" }))).toBe(false);
  });

  it("returns false when title is empty", () => {
    expect(isValidServiceContent(validServiceContent({ title: "" }))).toBe(false);
  });

  it("returns false when pricingRange is invalid", () => {
    expect(
      isValidServiceContent(
        validServiceContent({
          pricingRange: validPriceRange({ minUSD: -1 }),
        })
      )
    ).toBe(false);
  });

  it("returns false when deliveryTimeline is invalid", () => {
    expect(
      isValidServiceContent(
        validServiceContent({
          deliveryTimeline: validTimelineEstimate({ minWeeks: -1 }),
        })
      )
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidServiceContent(null)).toBe(false);
  });
});

describe("isValidTrustSignal", () => {
  it("returns true for valid TrustSignal", () => {
    expect(isValidTrustSignal(validTrustSignal())).toBe(true);
  });

  it.each(["stat", "badge", "testimonial", "logo"] as const)(
    "returns true for type '%s'",
    (type) => {
      expect(isValidTrustSignal(validTrustSignal({ type }))).toBe(true);
    }
  );

  it("returns false when type is invalid", () => {
    expect(isValidTrustSignal({ ...validTrustSignal(), type: "rating" })).toBe(false);
  });

  it("returns false when label is empty", () => {
    expect(isValidTrustSignal(validTrustSignal({ label: "" }))).toBe(false);
  });

  it("returns false when value is empty", () => {
    expect(isValidTrustSignal(validTrustSignal({ value: "" }))).toBe(false);
  });
});

describe("isValidCompanyFacts", () => {
  it("returns true for valid CompanyFacts", () => {
    expect(isValidCompanyFacts(validCompanyFacts())).toBe(true);
  });

  it("returns false when name is empty", () => {
    expect(isValidCompanyFacts(validCompanyFacts({ name: "" }))).toBe(false);
  });

  it("returns false when processSteps is empty", () => {
    expect(isValidCompanyFacts(validCompanyFacts({ processSteps: [] }))).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidCompanyFacts(null)).toBe(false);
  });
});

describe("isValidStarterPrompt", () => {
  it("returns true for valid StarterPrompt", () => {
    expect(isValidStarterPrompt(validStarterPrompt())).toBe(true);
  });

  it("returns true with project type intent", () => {
    expect(isValidStarterPrompt(validStarterPrompt({ intent: "ai-integration" }))).toBe(true);
  });

  it("returns false when id is empty", () => {
    expect(isValidStarterPrompt(validStarterPrompt({ id: "" }))).toBe(false);
  });

  it("returns false when label is empty", () => {
    expect(isValidStarterPrompt(validStarterPrompt({ label: "" }))).toBe(false);
  });

  it("returns false when prompt is empty", () => {
    expect(isValidStarterPrompt(validStarterPrompt({ prompt: "" }))).toBe(false);
  });
});

describe("isValidGuidedFollowUp", () => {
  it("returns true for valid GuidedFollowUp", () => {
    expect(isValidGuidedFollowUp(validGuidedFollowUp())).toBe(true);
  });

  it("returns false when applicablePhases is empty", () => {
    expect(isValidGuidedFollowUp(validGuidedFollowUp({ applicablePhases: [] }))).toBe(false);
  });

  it("returns false when applicablePhases contains invalid phase", () => {
    expect(
      isValidGuidedFollowUp({
        ...validGuidedFollowUp(),
        applicablePhases: ["invalid" as ConversationPhase],
      })
    ).toBe(false);
  });
});

describe("isValidOutOfScopeRedirect", () => {
  it("returns true for valid OutOfScopeRedirect", () => {
    const redirect: OutOfScopeRedirect = {
      message: "Let me redirect you",
      suggestedPrompts: [validStarterPrompt()],
    };
    expect(isValidOutOfScopeRedirect(redirect)).toBe(true);
  });

  it("returns false when message is empty", () => {
    expect(
      isValidOutOfScopeRedirect({
        message: "",
        suggestedPrompts: [validStarterPrompt()],
      })
    ).toBe(false);
  });

  it("returns false when suggestedPrompts is empty", () => {
    expect(
      isValidOutOfScopeRedirect({
        message: "Redirect",
        suggestedPrompts: [],
      })
    ).toBe(false);
  });

  it("returns false when suggestedPrompts contains invalid prompt", () => {
    expect(
      isValidOutOfScopeRedirect({
        message: "Redirect",
        suggestedPrompts: [validStarterPrompt({ id: "" })],
      })
    ).toBe(false);
  });
});

describe("isValidConversationState", () => {
  it("returns true for valid ConversationState", () => {
    expect(isValidConversationState(validConversationState())).toBe(true);
  });

  it("returns true with empty messages", () => {
    expect(isValidConversationState(validConversationState({ messages: [] }))).toBe(true);
  });

  it("returns false when phase is invalid", () => {
    expect(
      isValidConversationState({
        ...validConversationState(),
        phase: "invalid" as ConversationPhase,
      })
    ).toBe(false);
  });

  it("returns false when language is invalid", () => {
    expect(
      isValidConversationState({
        ...validConversationState(),
        language: "fr" as "en",
      })
    ).toBe(false);
  });

  it("returns false when messages contain invalid message", () => {
    expect(
      isValidConversationState({
        ...validConversationState(),
        messages: [validChatMessage({ id: "" })],
      })
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidConversationState(null)).toBe(false);
  });
});

describe("isValidProjectSummary", () => {
  it("returns true for valid ProjectSummary", () => {
    expect(isValidProjectSummary(validProjectSummary())).toBe(true);
  });

  it("returns false when id is empty", () => {
    expect(isValidProjectSummary(validProjectSummary({ id: "" }))).toBe(false);
  });

  it("returns false when nextSteps is empty", () => {
    expect(isValidProjectSummary(validProjectSummary({ nextSteps: [] }))).toBe(false);
  });

  it("returns false when generatedAt is negative", () => {
    expect(isValidProjectSummary(validProjectSummary({ generatedAt: -1 }))).toBe(false);
  });

  it("returns false when language is invalid", () => {
    expect(isValidProjectSummary({ ...validProjectSummary(), language: "fr" as "en" })).toBe(false);
  });

  it("returns false when leadAttributes is invalid", () => {
    expect(
      isValidProjectSummary(
        validProjectSummary({
          leadAttributes: { ...validLeadAttributes(), targetUsers: "" },
        })
      )
    ).toBe(false);
  });

  it("returns false when recommendedSolution is invalid", () => {
    expect(
      isValidProjectSummary(
        validProjectSummary({
          recommendedSolution: validRecommendedSolution({ type: "" }),
        })
      )
    ).toBe(false);
  });
});

describe("isValidScopeEvaluationResult", () => {
  it("returns true for valid in-scope result", () => {
    const result: ScopeEvaluationResult = {
      isInScope: true,
      confidence: 0.95,
    };
    expect(isValidScopeEvaluationResult(result)).toBe(true);
  });

  it("returns true for valid out-of-scope result with redirect", () => {
    const result: ScopeEvaluationResult = {
      isInScope: false,
      confidence: 0.8,
      redirect: {
        message: "Let me redirect you",
        suggestedPrompts: [validStarterPrompt()],
      },
    };
    expect(isValidScopeEvaluationResult(result)).toBe(true);
  });

  it("returns false when confidence is out of range", () => {
    expect(isValidScopeEvaluationResult({ isInScope: true, confidence: 1.5 })).toBe(false);
    expect(isValidScopeEvaluationResult({ isInScope: true, confidence: -0.1 })).toBe(false);
  });

  it("returns false when redirect is present but invalid", () => {
    expect(
      isValidScopeEvaluationResult({
        isInScope: false,
        confidence: 0.5,
        redirect: { message: "", suggestedPrompts: [] },
      })
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidScopeEvaluationResult(null)).toBe(false);
  });
});

describe("isValidCTAInjectionResult", () => {
  it("returns true for valid result with CTAs", () => {
    const result: CTAInjectionResult = {
      shouldInject: true,
      ctas: [validInlineCTA()],
    };
    expect(isValidCTAInjectionResult(result)).toBe(true);
  });

  it("returns true for valid result without CTAs", () => {
    const result: CTAInjectionResult = {
      shouldInject: false,
      ctas: [],
    };
    expect(isValidCTAInjectionResult(result)).toBe(true);
  });

  it("returns false when ctas contains invalid CTA", () => {
    expect(
      isValidCTAInjectionResult({
        shouldInject: true,
        ctas: [{ ...validInlineCTA(), label: "" }],
      })
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidCTAInjectionResult(null)).toBe(false);
  });
});

describe("isValidFollowUpSuggestion", () => {
  it("returns true for valid suggestion without phase transition", () => {
    const suggestion: FollowUpSuggestion = {
      followUps: [validGuidedFollowUp()],
      shouldTransitionPhase: false,
    };
    expect(isValidFollowUpSuggestion(suggestion)).toBe(true);
  });

  it("returns true for valid suggestion with phase transition", () => {
    const suggestion: FollowUpSuggestion = {
      followUps: [validGuidedFollowUp()],
      shouldTransitionPhase: true,
      nextPhase: "qualification",
    };
    expect(isValidFollowUpSuggestion(suggestion)).toBe(true);
  });

  it("returns false when shouldTransitionPhase is true but nextPhase is missing", () => {
    const suggestion: FollowUpSuggestion = {
      followUps: [validGuidedFollowUp()],
      shouldTransitionPhase: true,
    };
    expect(isValidFollowUpSuggestion(suggestion)).toBe(false);
  });

  it("returns false when followUps contains invalid follow-up", () => {
    expect(
      isValidFollowUpSuggestion({
        followUps: [validGuidedFollowUp({ id: "" })],
        shouldTransitionPhase: false,
      })
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidFollowUpSuggestion(null)).toBe(false);
  });
});

// ──────────────────────────────────────────────
// V2 Validators
// ──────────────────────────────────────────────

function validOutcomePrompt(overrides: Partial<OutcomePrompt> = {}): OutcomePrompt {
  return {
    id: "outcome-test",
    label: "Test outcome",
    prompt: "Test prompt for outcome",
    icon: "chart-up",
    ...overrides,
  };
}

function validPromptGroup(overrides: Partial<PromptGroup> = {}): PromptGroup {
  return {
    groupLabel: "Test Group",
    promptIds: ["sp-services", "sp-pricing"],
    ...overrides,
  };
}

describe("isValidOutcomePrompt", () => {
  it("returns true for valid OutcomePrompt", () => {
    expect(isValidOutcomePrompt(validOutcomePrompt())).toBe(true);
  });

  it("returns false when id is empty", () => {
    expect(isValidOutcomePrompt(validOutcomePrompt({ id: "" }))).toBe(false);
  });

  it("returns false when label is empty", () => {
    expect(isValidOutcomePrompt(validOutcomePrompt({ label: "" }))).toBe(false);
  });

  it("returns false when prompt is empty", () => {
    expect(isValidOutcomePrompt(validOutcomePrompt({ prompt: "" }))).toBe(false);
  });

  it("returns false when icon is empty", () => {
    expect(isValidOutcomePrompt(validOutcomePrompt({ icon: "" }))).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidOutcomePrompt(null)).toBe(false);
  });

  it("returns false for non-object", () => {
    expect(isValidOutcomePrompt("string")).toBe(false);
  });
});

describe("isValidPromptGroup", () => {
  it("returns true for valid PromptGroup", () => {
    expect(isValidPromptGroup(validPromptGroup())).toBe(true);
  });

  it("returns false when groupLabel is empty", () => {
    expect(isValidPromptGroup(validPromptGroup({ groupLabel: "" }))).toBe(false);
  });

  it("returns false when promptIds is empty", () => {
    expect(isValidPromptGroup(validPromptGroup({ promptIds: [] }))).toBe(false);
  });

  it("returns false when promptIds contains empty string", () => {
    expect(isValidPromptGroup(validPromptGroup({ promptIds: ["valid", ""] }))).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidPromptGroup(null)).toBe(false);
  });

  it("returns false for non-object", () => {
    expect(isValidPromptGroup(42)).toBe(false);
  });
});

// ──────────────────────────────────────────────
// Input sanitization
// ──────────────────────────────────────────────

describe("sanitizeUserInput", () => {
  it("trims whitespace", () => {
    expect(sanitizeUserInput("  hello  ")).toBe("hello");
  });

  it("strips HTML tags", () => {
    expect(sanitizeUserInput("<script>alert('xss')</script>hello")).toBe("hello");
  });

  it("strips nested HTML tags", () => {
    expect(sanitizeUserInput("<div><b>bold</b></div>")).toBe("bold");
  });

  it("preserves normal text", () => {
    expect(sanitizeUserInput("I need help with my project")).toBe("I need help with my project");
  });

  it("handles empty string", () => {
    expect(sanitizeUserInput("")).toBe("");
  });

  it("truncates input exceeding max length", () => {
    const longInput = "a".repeat(5001);
    const result = sanitizeUserInput(longInput);
    expect(result.length).toBe(5000);
  });

  it("strips null bytes", () => {
    expect(sanitizeUserInput("hello\0world")).toBe("helloworld");
  });
});
