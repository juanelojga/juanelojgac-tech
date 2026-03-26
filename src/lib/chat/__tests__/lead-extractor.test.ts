import { beforeEach, describe, expect, it } from "vitest";

import { LeadExtractorImpl } from "../lead-extractor";
import { createChatMessage } from "./factories";

describe("LeadExtractorImpl", () => {
  let extractor: LeadExtractorImpl;

  beforeEach(() => {
    extractor = new LeadExtractorImpl();
  });

  // ──────────────────────────────────────────────
  // Project type extraction
  // ──────────────────────────────────────────────

  describe("project type extraction", () => {
    it("extracts ai-integration from AI-related messages", () => {
      const messages = [
        createChatMessage({ role: "user", content: "I want to integrate AI into my business" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("ai-integration");
    });

    it("extracts web-platform from web-related messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I need a web platform for my e-commerce store",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("web-platform");
    });

    it("extracts automation from automation-related messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I want to automate my workflows and repetitive tasks",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("automation");
    });

    it("extracts consulting from consulting-related messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I need consulting on our technology strategy",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("consulting");
    });

    it("extracts custom for unspecific project mentions", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I have a unique project idea that doesn't fit categories",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("custom");
    });

    it("extracts project type from Spanish messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "Necesito una plataforma web para mi negocio",
          language: "es",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("web-platform");
    });
  });

  // ──────────────────────────────────────────────
  // Target users extraction
  // ──────────────────────────────────────────────

  describe("target users extraction", () => {
    it("extracts target users from explicit mention", () => {
      const messages = [
        createChatMessage({ role: "user", content: "Our target users are small business owners" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.targetUsers).toBeTruthy();
      expect(result.targetUsers!.toLowerCase()).toContain("small business");
    });

    it("extracts target users from audience mention", () => {
      const messages = [
        createChatMessage({ role: "user", content: "We serve enterprise clients in healthcare" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.targetUsers).toBeTruthy();
    });

    it("extracts target users from Spanish messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "Nuestros usuarios son dueños de pequeños negocios",
          language: "es",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.targetUsers).toBeTruthy();
    });
  });

  // ──────────────────────────────────────────────
  // Goals extraction
  // ──────────────────────────────────────────────

  describe("goals extraction", () => {
    it("extracts goals from explicit goal statement", () => {
      const messages = [
        createChatMessage({ role: "user", content: "My goal is to increase online sales by 50%" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.goals).toBeTruthy();
      expect(result.goals!.toLowerCase()).toContain("increase");
    });

    it("extracts goals from want/need statement", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I want to reduce manual data entry and save time",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.goals).toBeTruthy();
    });

    it("extracts goals from Spanish messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "Mi objetivo es aumentar las ventas en línea",
          language: "es",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.goals).toBeTruthy();
    });
  });

  // ──────────────────────────────────────────────
  // Timeline extraction
  // ──────────────────────────────────────────────

  describe("timeline extraction", () => {
    it("extracts immediate timeline", () => {
      const messages = [
        createChatMessage({ role: "user", content: "I need this done ASAP, it's urgent" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.timeline).toBe("immediate");
    });

    it("extracts short-term timeline", () => {
      const messages = [
        createChatMessage({ role: "user", content: "We'd like to launch in 2-3 months" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.timeline).toBe("short-term");
    });

    it("extracts flexible timeline", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "We're flexible on timing, maybe 6 months or more",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.timeline).toBe("flexible");
    });

    it("extracts exploring timeline", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I'm just exploring options right now, no rush",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.timeline).toBe("exploring");
    });

    it("extracts timeline from Spanish messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "Lo necesitamos urgente, lo antes posible",
          language: "es",
        }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.timeline).toBe("immediate");
    });
  });

  // ──────────────────────────────────────────────
  // Budget range extraction
  // ──────────────────────────────────────────────

  describe("budget range extraction", () => {
    it("extracts starter budget", () => {
      const messages = [
        createChatMessage({ role: "user", content: "Our budget is around $2,000" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.budgetRange).toBe("starter");
    });

    it("extracts growth budget", () => {
      const messages = [
        createChatMessage({ role: "user", content: "We can spend about $8,000 to $10,000" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.budgetRange).toBe("growth");
    });

    it("extracts enterprise budget", () => {
      const messages = [createChatMessage({ role: "user", content: "Budget is $20,000 or more" })];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.budgetRange).toBe("enterprise");
    });
  });

  // ──────────────────────────────────────────────
  // Multi-message extraction
  // ──────────────────────────────────────────────

  describe("multi-message extraction", () => {
    it("combines attributes from multiple messages", () => {
      const messages = [
        createChatMessage({
          role: "user",
          content: "I need a web platform for my e-commerce store",
        }),
        createChatMessage({ role: "assistant", content: "Who are your target users?" }),
        createChatMessage({ role: "user", content: "Small business owners who sell online" }),
        createChatMessage({ role: "assistant", content: "What's your main goal?" }),
        createChatMessage({ role: "user", content: "I want to increase sales by 50%" }),
        createChatMessage({ role: "assistant", content: "When do you need it?" }),
        createChatMessage({ role: "user", content: "Within 3 months" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("web-platform");
      expect(result.targetUsers).toBeTruthy();
      expect(result.goals).toBeTruthy();
      expect(result.timeline).toBe("short-term");
    });

    it("only extracts from user messages, ignoring assistant messages", () => {
      const messages = [
        createChatMessage({
          role: "assistant",
          content: "We offer AI integration services for businesses",
        }),
        createChatMessage({ role: "user", content: "I need a web platform" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("web-platform");
    });
  });

  // ──────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────

  describe("edge cases", () => {
    it("returns empty attributes for empty message list", () => {
      const result = extractor.extractLeadAttributes([]);
      expect(result).toEqual({});
    });

    it("returns empty attributes for messages with no extractable info", () => {
      const messages = [
        createChatMessage({ role: "user", content: "Hello" }),
        createChatMessage({ role: "user", content: "How are you?" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBeUndefined();
    });

    it("handles multiple project types by choosing the most recent", () => {
      const messages = [
        createChatMessage({ role: "user", content: "I was thinking about AI integration" }),
        createChatMessage({ role: "user", content: "Actually, I need a web platform instead" }),
      ];
      const result = extractor.extractLeadAttributes(messages);
      expect(result.projectType).toBe("web-platform");
    });
  });
});
