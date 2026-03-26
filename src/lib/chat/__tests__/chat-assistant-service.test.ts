import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import {
  createChatMessage,
  createConversationState,
  createLeadAttributes,
  createMockContentProvider,
  type MockContentProvider,
} from "./factories";

// ──────────────────────────────────────────────
// Mock dependencies
// ──────────────────────────────────────────────

const mockSendMessage = vi.fn() as Mock;

vi.mock("../chat-api-client", () => {
  return {
    ChatAPIClient: class MockChatAPIClient {
      sendMessage = mockSendMessage;
    },
  };
});

// ──────────────────────────────────────────────
// Tests for ChatAssistantServiceImpl
// ──────────────────────────────────────────────

describe("ChatAssistantServiceImpl", () => {
  let ChatAssistantServiceImpl: typeof import("../chat-assistant-service").ChatAssistantServiceImpl;
  let service: InstanceType<typeof ChatAssistantServiceImpl>;
  let mockContentProvider: MockContentProvider;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSendMessage.mockResolvedValue({
      content: "Hello! How can I help you today?",
      finishReason: "stop",
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    });

    const mod = await import("../chat-assistant-service");
    ChatAssistantServiceImpl = mod.ChatAssistantServiceImpl;
    mockContentProvider = createMockContentProvider(vi);
    service = new ChatAssistantServiceImpl(mockContentProvider);
  });

  // ── Constructor ──

  describe("constructor", () => {
    it("should create a service instance", () => {
      expect(service).toBeDefined();
    });

    it("should initialize with greeting phase", () => {
      const state = service.getState();
      expect(state.phase).toBe("greeting");
    });

    it("should initialize with empty messages", () => {
      const state = service.getState();
      expect(state.messages).toHaveLength(0);
    });

    it("should default to English language", () => {
      const state = service.getState();
      expect(state.language).toBe("en");
    });

    it("should accept initial language parameter", () => {
      const esService = new ChatAssistantServiceImpl(mockContentProvider, "es");
      const state = esService.getState();
      expect(state.language).toBe("es");
    });
  });

  // ── getState ──

  describe("getState", () => {
    it("should return the current conversation state", () => {
      const state = service.getState();

      expect(state.messages).toEqual([]);
      expect(state.phase).toBe("greeting");
      expect(state.language).toBe("en");
      expect(state.leadAttributes).toEqual({});
      expect(state.isAssistantTyping).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should return an immutable state snapshot", () => {
      const state1 = service.getState();
      const state2 = service.getState();

      expect(state1).toEqual(state2);
    });
  });

  // ── sendMessage ──

  describe("sendMessage", () => {
    it("should add user message to conversation history", async () => {
      const state = service.getState();
      await service.sendMessage("Hello", state);

      const newState = service.getState();
      expect(newState.messages.length).toBeGreaterThanOrEqual(1);

      const userMsg = newState.messages.find((m) => m.role === "user");
      expect(userMsg).toBeDefined();
      expect(userMsg!.content).toBe("Hello");
    });

    it("should call the API client with formatted messages", async () => {
      const state = service.getState();
      await service.sendMessage("What services do you offer?", state);

      expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });

    it("should add assistant response to conversation history", async () => {
      const state = service.getState();
      await service.sendMessage("What services do you offer?", state);

      const newState = service.getState();
      const assistantMsg = newState.messages.find((m) => m.role === "assistant");
      expect(assistantMsg).toBeDefined();
      expect(assistantMsg!.content).toBe("Hello! How can I help you today?");
    });

    it("should return the assistant message", async () => {
      const state = service.getState();
      const result = await service.sendMessage("Hi", state);

      expect(result.role).toBe("assistant");
      expect(result.content).toBe("Hello! How can I help you today?");
      expect(result.language).toBe("en");
    });

    it("should use the correct language for messages", async () => {
      const esService = new ChatAssistantServiceImpl(mockContentProvider, "es");
      const state = esService.getState();

      mockSendMessage.mockResolvedValueOnce({
        content: "¡Hola! ¿En qué puedo ayudarte?",
        finishReason: "stop",
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
      });

      const result = await esService.sendMessage("Hola", state);

      expect(result.language).toBe("es");
    });

    it("should set isAssistantTyping to false after response", async () => {
      const state = service.getState();
      await service.sendMessage("Hi", state);

      const newState = service.getState();
      expect(newState.isAssistantTyping).toBe(false);
    });

    it("should set error to null on successful response", async () => {
      const state = service.getState();
      await service.sendMessage("Hi", state);

      const newState = service.getState();
      expect(newState.error).toBeNull();
    });

    it("should handle API errors gracefully", async () => {
      mockSendMessage.mockRejectedValueOnce(new Error("Network error"));

      const state = service.getState();

      await expect(service.sendMessage("Hi", state)).rejects.toThrow();

      const newState = service.getState();
      expect(newState.error).toBe("chat.messages.errorGeneric");
      expect(newState.isAssistantTyping).toBe(false);
    });

    it("should transition from greeting to discovery after first exchange", async () => {
      const state = service.getState();
      expect(state.phase).toBe("greeting");

      await service.sendMessage("I need help with a project", state);

      const newState = service.getState();
      expect(newState.phase).toBe("discovery");
    });

    it("should preserve message history across multiple exchanges", async () => {
      let state = service.getState();
      await service.sendMessage("First message", state);

      mockSendMessage.mockResolvedValueOnce({
        content: "Second response",
        finishReason: "stop",
        usage: { prompt_tokens: 200, completion_tokens: 60, total_tokens: 260 },
      });

      state = service.getState();
      await service.sendMessage("Second message", state);

      const finalState = service.getState();
      // Should have 4 messages: user1, assistant1, user2, assistant2
      expect(finalState.messages).toHaveLength(4);
    });

    it("should generate unique IDs for each message", async () => {
      const state = service.getState();
      await service.sendMessage("Hi", state);

      const newState = service.getState();
      const ids = newState.messages.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  // ── resetConversation ──

  describe("resetConversation", () => {
    it("should clear all messages", async () => {
      const state = service.getState();
      await service.sendMessage("Hi", state);

      service.resetConversation("en");

      const newState = service.getState();
      expect(newState.messages).toHaveLength(0);
    });

    it("should reset to greeting phase", async () => {
      const state = service.getState();
      await service.sendMessage("Hi", state);

      service.resetConversation("en");

      const newState = service.getState();
      expect(newState.phase).toBe("greeting");
    });

    it("should set the specified language", () => {
      service.resetConversation("es");

      const state = service.getState();
      expect(state.language).toBe("es");
    });

    it("should clear lead attributes", () => {
      service.resetConversation("en");

      const state = service.getState();
      expect(state.leadAttributes).toEqual({});
    });

    it("should clear any errors", () => {
      service.resetConversation("en");

      const state = service.getState();
      expect(state.error).toBeNull();
    });
  });

  // ── updateLanguage ──

  describe("updateLanguage", () => {
    it("should update the conversation language", () => {
      service.updateLanguage("es");

      const state = service.getState();
      expect(state.language).toBe("es");
    });

    it("should preserve existing messages when changing language", async () => {
      const state = service.getState();
      await service.sendMessage("Hi", state);

      service.updateLanguage("es");

      const newState = service.getState();
      expect(newState.messages.length).toBeGreaterThan(0);
    });
  });

  // ── canGenerateSummary ──

  describe("canGenerateSummary", () => {
    it("should return false with empty lead attributes", () => {
      expect(service.canGenerateSummary({})).toBe(false);
    });

    it("should return false with only partial attributes", () => {
      expect(
        service.canGenerateSummary({
          projectType: "ai-integration",
        })
      ).toBe(false);
    });

    it("should return true when minimum required attributes are present", () => {
      expect(
        service.canGenerateSummary({
          projectType: "ai-integration",
          goals: "Automate customer support",
          timeline: "short-term",
        })
      ).toBe(true);
    });

    it("should return true with all attributes populated", () => {
      const fullAttributes = createLeadAttributes();
      expect(service.canGenerateSummary(fullAttributes)).toBe(true);
    });
  });

  // ── generateSummary ──

  describe("generateSummary", () => {
    it("should request a summary from the API", async () => {
      mockSendMessage.mockResolvedValueOnce({
        content: JSON.stringify({
          recommendedSolution: { type: "AI Chatbot", description: "Custom AI chatbot" },
          timeline: { minWeeks: 4, maxWeeks: 8, description: "4-8 weeks" },
          priceRange: { minUSD: 5000, maxUSD: 15000, description: "$5K-$15K" },
          nextSteps: ["Book a consultation"],
        }),
        finishReason: "stop",
        usage: { prompt_tokens: 500, completion_tokens: 200, total_tokens: 700 },
      });

      const state = createConversationState({
        messages: [
          createChatMessage({ role: "user", content: "I need an AI chatbot" }),
          createChatMessage({ role: "assistant", content: "Tell me more about your needs" }),
        ],
        phase: "qualification",
        leadAttributes: createLeadAttributes(),
      });

      const summary = await service.generateSummary(state);

      expect(summary).toBeDefined();
      expect(summary.id).toBeDefined();
      expect(summary.language).toBeDefined();
    });

    it("should include lead attributes in the summary", async () => {
      const leadAttributes = createLeadAttributes({
        projectType: "web-platform",
        goals: "Build an e-commerce store",
      });

      mockSendMessage.mockResolvedValueOnce({
        content: JSON.stringify({
          recommendedSolution: { type: "E-commerce", description: "Custom store" },
          timeline: { minWeeks: 6, maxWeeks: 12, description: "6-12 weeks" },
          priceRange: { minUSD: 8000, maxUSD: 20000, description: "$8K-$20K" },
          nextSteps: ["Book a consultation", "Prepare requirements"],
        }),
        finishReason: "stop",
        usage: { prompt_tokens: 500, completion_tokens: 200, total_tokens: 700 },
      });

      const state = createConversationState({
        phase: "qualification",
        leadAttributes,
      });

      const summary = await service.generateSummary(state);

      expect(summary.leadAttributes).toEqual(leadAttributes);
    });
  });
});
