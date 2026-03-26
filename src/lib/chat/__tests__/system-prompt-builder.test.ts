import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Language } from "../../i18n";
import {
  createCompanyFacts,
  createMockContentProvider,
  createServiceContent,
  type MockContentProvider,
} from "./factories";

// ──────────────────────────────────────────────
// Tests for SystemPromptBuilder
// ──────────────────────────────────────────────

describe("SystemPromptBuilder", () => {
  let SystemPromptBuilder: typeof import("../system-prompt-builder").SystemPromptBuilder;
  let builder: InstanceType<typeof SystemPromptBuilder>;
  let mockContentProvider: MockContentProvider;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../system-prompt-builder");
    SystemPromptBuilder = mod.SystemPromptBuilder;
    mockContentProvider = createMockContentProvider(vi);
    builder = new SystemPromptBuilder(mockContentProvider);
  });

  // ── Construction ──

  describe("constructor", () => {
    it("should create a builder with a content provider", () => {
      expect(builder).toBeDefined();
    });
  });

  // ── System prompt generation ──

  describe("buildSystemPrompt", () => {
    it("should include company identity in the system prompt", () => {
      const prompt = builder.buildSystemPrompt("en", "greeting");

      expect(prompt).toContain("JuaneloJGAC Tech");
      expect(prompt).toContain("Your AI Consulting Partner");
    });

    it("should include service descriptions in the system prompt", () => {
      mockContentProvider.getServices.mockReturnValue([
        createServiceContent({ title: "AI Integration", id: "svc-ai" }),
        createServiceContent({ title: "Web Development", id: "svc-web" }),
      ]);

      const prompt = builder.buildSystemPrompt("en", "greeting");

      expect(prompt).toContain("AI Integration");
      expect(prompt).toContain("Web Development");
    });

    it("should include pricing ranges for services", () => {
      mockContentProvider.getServices.mockReturnValue([
        createServiceContent({
          id: "svc-test",
          title: "Test Service",
          pricingRange: {
            minUSD: 3000,
            maxUSD: 15000,
            description: "$3,000 – $15,000",
          },
        }),
      ]);

      const prompt = builder.buildSystemPrompt("en", "greeting");

      expect(prompt).toContain("$3,000");
      expect(prompt).toContain("$15,000");
    });

    it("should include company process steps", () => {
      const facts = createCompanyFacts({
        processSteps: ["Discovery", "Strategy", "Build", "Launch"],
      });
      mockContentProvider.getCompanyFacts.mockReturnValue(facts);

      const prompt = builder.buildSystemPrompt("en", "greeting");

      expect(prompt).toContain("Discovery");
      expect(prompt).toContain("Launch");
    });

    it("should build a prompt in English when language is 'en'", () => {
      const prompt = builder.buildSystemPrompt("en", "greeting");

      expect(mockContentProvider.getServices).toHaveBeenCalledWith("en");
      expect(mockContentProvider.getCompanyFacts).toHaveBeenCalledWith("en");
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it("should build a prompt in Spanish when language is 'es'", () => {
      const prompt = builder.buildSystemPrompt("es", "greeting");

      expect(mockContentProvider.getServices).toHaveBeenCalledWith("es");
      expect(mockContentProvider.getCompanyFacts).toHaveBeenCalledWith("es");
      expect(prompt).toBeDefined();
    });

    it("should include scope boundary instructions", () => {
      const prompt = builder.buildSystemPrompt("en", "greeting");

      // The prompt should contain instructions about staying in scope
      expect(prompt.toLowerCase()).toMatch(/scope|boundary|allowed|restricted|focus/);
    });

    it("should include anti-injection instructions", () => {
      const prompt = builder.buildSystemPrompt("en", "greeting");

      // The prompt should warn about injection attempts
      expect(prompt.toLowerCase()).toMatch(
        /inject|ignore|override|system prompt|previous instructions/
      );
    });

    it("should adapt tone for different conversation phases", () => {
      const greetingPrompt = builder.buildSystemPrompt("en", "greeting");
      const qualificationPrompt = builder.buildSystemPrompt("en", "qualification");

      // Both should be valid but may differ in guidance
      expect(greetingPrompt.length).toBeGreaterThan(0);
      expect(qualificationPrompt.length).toBeGreaterThan(0);
    });

    it("should include guided flow instructions for discovery phase", () => {
      const prompt = builder.buildSystemPrompt("en", "discovery");

      // Should guide the assistant to ask qualifying questions
      expect(prompt.toLowerCase()).toMatch(/question|discover|understand|learn|need/);
    });

    it("should include summary generation guidance for summary phase", () => {
      const prompt = builder.buildSystemPrompt("en", "summary");

      expect(prompt.toLowerCase()).toMatch(/summary|recommend|solution|timeline|price/);
    });

    it("should never contain the raw API key or sensitive config", () => {
      const prompt = builder.buildSystemPrompt("en", "greeting");

      expect(prompt).not.toContain("api_key");
      expect(prompt).not.toContain("openrouter");
      expect(prompt).not.toContain("Bearer");
    });

    it("should include language-specific response instructions", () => {
      const enPrompt = builder.buildSystemPrompt("en", "greeting");
      const esPrompt = builder.buildSystemPrompt("es", "greeting");

      expect(enPrompt.toLowerCase()).toContain("english");
      expect(esPrompt.toLowerCase()).toContain("español");
    });
  });

  // ── Message formatting ──

  describe("formatMessagesForAPI", () => {
    it("should prepend system prompt to the message list", () => {
      const messages = [
        {
          role: "user" as const,
          content: "Hello",
          id: "1",
          timestamp: 1,
          language: "en" as Language,
        },
      ];

      const formatted = builder.formatMessagesForAPI(messages, "en", "greeting");

      expect(formatted[0].role).toBe("system");
      expect(formatted[0].content.length).toBeGreaterThan(0);
      expect(formatted[1].role).toBe("user");
      expect(formatted[1].content).toBe("Hello");
    });

    it("should filter out system messages from chat history", () => {
      const messages = [
        {
          role: "system" as const,
          content: "old system",
          id: "0",
          timestamp: 0,
          language: "en" as Language,
        },
        {
          role: "user" as const,
          content: "Hello",
          id: "1",
          timestamp: 1,
          language: "en" as Language,
        },
        {
          role: "assistant" as const,
          content: "Hi!",
          id: "2",
          timestamp: 2,
          language: "en" as Language,
        },
      ];

      const formatted = builder.formatMessagesForAPI(messages, "en", "greeting");

      // Should have: new system prompt + user + assistant (old system filtered)
      expect(formatted).toHaveLength(3);
      expect(formatted[0].role).toBe("system");
      expect(formatted[0].content).not.toBe("old system");
      expect(formatted[1].role).toBe("user");
      expect(formatted[2].role).toBe("assistant");
    });

    it("should only include role and content fields in formatted messages", () => {
      const messages = [
        {
          role: "user" as const,
          content: "test",
          id: "1",
          timestamp: 1,
          language: "en" as Language,
        },
      ];

      const formatted = builder.formatMessagesForAPI(messages, "en", "greeting");

      for (const msg of formatted) {
        expect(Object.keys(msg)).toEqual(["role", "content"]);
      }
    });

    it("should limit conversation history to prevent excessive token usage", () => {
      // Create many messages
      const messages = Array.from({ length: 100 }, (_, i) => ({
        role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
        content: `Message ${i}`,
        id: `msg-${i}`,
        timestamp: i,
        language: "en" as Language,
      }));

      const formatted = builder.formatMessagesForAPI(messages, "en", "greeting");

      // Should cap to a reasonable number (system + last N messages)
      expect(formatted.length).toBeLessThan(messages.length + 1);
      // The last message should always be preserved
      expect(formatted[formatted.length - 1].content).toBe("Message 99");
    });
  });
});
