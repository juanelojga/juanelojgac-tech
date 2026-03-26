import { describe, expect, it, vi } from "vitest";

import {
  isValidChatMessage,
  isValidCompanyFacts,
  isValidConversationState,
  isValidGuidedFollowUp,
  isValidInlineCTA,
  isValidLeadAttributes,
  isValidOutOfScopeRedirect,
  isValidPriceRange,
  isValidProjectSummary,
  isValidRecommendedSolution,
  isValidServiceContent,
  isValidStarterPrompt,
  isValidTimelineEstimate,
  isValidTrustSignal,
} from "../validators";
import {
  createChatMessage,
  createCompanyFacts,
  createConversationScenario,
  createConversationState,
  createGuidedFollowUp,
  createInlineCTA,
  createLeadAttributes,
  createMockChatAssistantService,
  createMockContentProvider,
  createMockConversationOrchestrator,
  createOutOfScopeRedirect,
  createPriceRange,
  createProjectSummary,
  createRecommendedSolution,
  createServiceContent,
  createStarterPrompt,
  createTimelineEstimate,
  createTrustSignal,
} from "./factories";

describe("Data factories produce valid typed instances", () => {
  it("createChatMessage → valid", () => {
    expect(isValidChatMessage(createChatMessage())).toBe(true);
  });

  it("createInlineCTA → valid", () => {
    expect(isValidInlineCTA(createInlineCTA())).toBe(true);
  });

  it("createLeadAttributes → valid", () => {
    expect(isValidLeadAttributes(createLeadAttributes())).toBe(true);
  });

  it("createTimelineEstimate → valid", () => {
    expect(isValidTimelineEstimate(createTimelineEstimate())).toBe(true);
  });

  it("createPriceRange → valid", () => {
    expect(isValidPriceRange(createPriceRange())).toBe(true);
  });

  it("createRecommendedSolution → valid", () => {
    expect(isValidRecommendedSolution(createRecommendedSolution())).toBe(true);
  });

  it("createProjectSummary → valid", () => {
    expect(isValidProjectSummary(createProjectSummary())).toBe(true);
  });

  it("createConversationState → valid", () => {
    expect(isValidConversationState(createConversationState())).toBe(true);
  });

  it("createServiceContent → valid", () => {
    expect(isValidServiceContent(createServiceContent())).toBe(true);
  });

  it("createTrustSignal → valid", () => {
    expect(isValidTrustSignal(createTrustSignal())).toBe(true);
  });

  it("createCompanyFacts → valid", () => {
    expect(isValidCompanyFacts(createCompanyFacts())).toBe(true);
  });

  it("createStarterPrompt → valid", () => {
    expect(isValidStarterPrompt(createStarterPrompt())).toBe(true);
  });

  it("createGuidedFollowUp → valid", () => {
    expect(isValidGuidedFollowUp(createGuidedFollowUp())).toBe(true);
  });

  it("createOutOfScopeRedirect → valid", () => {
    expect(isValidOutOfScopeRedirect(createOutOfScopeRedirect())).toBe(true);
  });
});

describe("Mock service factories", () => {
  it("createMockChatAssistantService returns callable mock", async () => {
    const mock = createMockChatAssistantService(vi);
    const state = mock.getState();
    expect(isValidConversationState(state)).toBe(true);

    const response = await mock.sendMessage("Hello", state);
    expect(isValidChatMessage(response)).toBe(true);
    expect(response.role).toBe("assistant");

    mock.resetConversation("en");
    expect(mock.resetConversation).toHaveBeenCalledWith("en");

    mock.updateLanguage("es");
    expect(mock.updateLanguage).toHaveBeenCalledWith("es");

    expect(mock.canGenerateSummary({})).toBe(false);

    const summary = await mock.generateSummary(state);
    expect(isValidProjectSummary(summary)).toBe(true);
  });

  it("createMockContentProvider returns callable mock", () => {
    const mock = createMockContentProvider(vi);

    const services = mock.getServices("en");
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    expect(isValidServiceContent(services[0])).toBe(true);

    const facts = mock.getCompanyFacts("en");
    expect(isValidCompanyFacts(facts)).toBe(true);

    const signals = mock.getTrustSignals("en");
    expect(Array.isArray(signals)).toBe(true);
    expect(isValidTrustSignal(signals[0])).toBe(true);

    const prompts = mock.getStarterPrompts("en");
    expect(Array.isArray(prompts)).toBe(true);
    expect(isValidStarterPrompt(prompts[0])).toBe(true);

    const followUps = mock.getGuidedFollowUps("en", "discovery");
    expect(Array.isArray(followUps)).toBe(true);
    expect(isValidGuidedFollowUp(followUps[0])).toBe(true);

    const redirect = mock.getOutOfScopeRedirect("en");
    expect(isValidOutOfScopeRedirect(redirect)).toBe(true);
  });

  it("createMockConversationOrchestrator returns callable mock", () => {
    const mock = createMockConversationOrchestrator(vi);
    const state = createConversationState();

    const scopeResult = mock.evaluateScope("Hello", state);
    expect(scopeResult.isInScope).toBe(true);

    const ctaResult = mock.determineCTAs(createChatMessage({ role: "assistant" }), state);
    expect(ctaResult.shouldInject).toBe(false);

    const followUpResult = mock.suggestFollowUps(state);
    expect(Array.isArray(followUpResult.followUps)).toBe(true);

    const leadAttrs = mock.extractLeadAttributes([]);
    expect(typeof leadAttrs).toBe("object");
  });
});

describe("Conversation scenario builder", () => {
  it("creates a valid EN conversation", () => {
    const state = createConversationScenario("en", "discovery");
    expect(isValidConversationState(state)).toBe(true);
    expect(state.messages.length).toBe(3);
    expect(state.phase).toBe("discovery");
    expect(state.language).toBe("en");
  });

  it("creates a valid ES conversation", () => {
    const state = createConversationScenario("es", "qualification");
    expect(isValidConversationState(state)).toBe(true);
    expect(state.language).toBe("es");
    expect(state.phase).toBe("qualification");
    expect(state.messages[0].language).toBe("es");
  });
});
