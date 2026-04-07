import { beforeEach, describe, expect, it } from "vitest";

import { CTAInjectorImpl } from "../cta-injector";
import { createChatMessage, createConversationState, createInlineCTA } from "./factories";

describe("CTAInjectorImpl", () => {
  let injector: CTAInjectorImpl;

  beforeEach(() => {
    injector = new CTAInjectorImpl();
  });

  // ──────────────────────────────────────────────
  // No CTA injection in early phases
  // ──────────────────────────────────────────────

  describe("early phase suppression", () => {
    it("does not inject CTA during greeting phase", () => {
      const message = createChatMessage({ role: "assistant", content: "Hello!" });
      const state = createConversationState({ phase: "greeting" });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(false);
      expect(result.ctas).toHaveLength(0);
    });

    it("does not inject CTA during early discovery phase with few messages", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "Tell me more about your needs",
      });
      const state = createConversationState({
        phase: "discovery",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "Hi" }),
        ],
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(false);
    });
  });

  // ──────────────────────────────────────────────
  // CTA injection in qualified phases
  // ──────────────────────────────────────────────

  describe("qualified phase injection", () => {
    it("injects booking CTA in qualification phase with enough context", () => {
      const message = createChatMessage({
        role: "assistant",
        content:
          "Based on your needs, I'd recommend our web development service. Would you like to discuss this further?",
      });
      const state = createConversationState({
        phase: "qualification",
        messages: [
          createChatMessage({ role: "user", content: "I need a web platform" }),
          createChatMessage({ role: "assistant", content: "Tell me more" }),
          createChatMessage({ role: "user", content: "For e-commerce" }),
          createChatMessage({ role: "assistant", content: "What's your timeline?" }),
          createChatMessage({ role: "user", content: "3 months" }),
          createChatMessage({ role: "assistant", content: "Budget?" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
          timeline: "short-term",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(true);
      expect(result.ctas.length).toBeGreaterThan(0);
      expect(result.ctas.some((c) => c.type === "booking")).toBe(true);
    });

    it("injects CTA in summary phase", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "Here is your project summary with recommended next steps.",
      });
      const state = createConversationState({
        phase: "summary",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "I need web dev" }),
          createChatMessage({ role: "assistant", content: "Tell me more" }),
          createChatMessage({ role: "user", content: "E-commerce site" }),
          createChatMessage({ role: "assistant", content: "Timeline?" }),
          createChatMessage({ role: "user", content: "3 months" }),
          createChatMessage({ role: "user", content: "Generate a summary" }),
          createChatMessage({ role: "assistant", content: "Here is your summary" }),
          createChatMessage({ role: "user", content: "Looks good" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
          timeline: "short-term",
          budgetRange: "growth",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(true);
      expect(result.ctas.length).toBeGreaterThan(0);
    });

    it("injects CTA in completed phase", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "Is there anything else I can help with?",
      });
      const state = createConversationState({
        phase: "completed",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "I need help" }),
          createChatMessage({ role: "assistant", content: "Tell me more" }),
          createChatMessage({ role: "user", content: "Web platform" }),
          createChatMessage({ role: "assistant", content: "Got it" }),
          createChatMessage({ role: "user", content: "Thanks" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // CTA types
  // ──────────────────────────────────────────────

  describe("CTA types", () => {
    it("includes booking CTA", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "I'd recommend booking a consultation to discuss details.",
      });
      const state = createConversationState({
        phase: "summary",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "I need help" }),
          createChatMessage({ role: "assistant", content: "Tell me more" }),
          createChatMessage({ role: "user", content: "Web platform" }),
          createChatMessage({ role: "assistant", content: "Got it" }),
          createChatMessage({ role: "user", content: "Budget 10k" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
          timeline: "short-term",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(true);
      const bookingCTA = result.ctas.find((c) => c.type === "booking");
      expect(bookingCTA).toBeDefined();
      expect(bookingCTA!.url).toBeTruthy();
      expect(bookingCTA!.label).toBeTruthy();
    });

    it("includes contact CTA", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "You can also reach out to discuss your project.",
      });
      const state = createConversationState({
        phase: "summary",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "I need help" }),
          createChatMessage({ role: "assistant", content: "Tell me more" }),
          createChatMessage({ role: "user", content: "Web platform" }),
          createChatMessage({ role: "assistant", content: "Got it" }),
          createChatMessage({ role: "user", content: "Budget 10k" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
          timeline: "short-term",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(true);
      const contactCTA = result.ctas.find((c) => c.type === "contact");
      expect(contactCTA).toBeDefined();
      expect(contactCTA!.url).toBeTruthy();
    });
  });

  // ──────────────────────────────────────────────
  // Rate limiting — not too often
  // ──────────────────────────────────────────────

  describe("injection rate limiting", () => {
    it("does not inject CTA if last message already had CTAs", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "Sure, I can help with that.",
      });
      const state = createConversationState({
        phase: "qualification",
        messages: [
          createChatMessage({ role: "user", content: "I need more info" }),
          createChatMessage({ role: "assistant", content: "Go ahead" }),
          createChatMessage({ role: "user", content: "What about pricing?" }),
          createChatMessage({
            role: "assistant",
            content: "Here are the pricing details.",
            ctas: [createInlineCTA()], // Previous message had CTAs
          }),
          createChatMessage({ role: "user", content: "Thanks, what else?" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
          timeline: "short-term",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(false);
    });

    it("injects CTA if sufficient messages since last CTA", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "Based on everything you've shared, I'd recommend booking a call.",
      });
      const state = createConversationState({
        phase: "qualification",
        messages: [
          createChatMessage({
            role: "assistant",
            content: "Previous with CTA",
            ctas: [createInlineCTA()],
          }),
          createChatMessage({ role: "user", content: "Tell me more" }),
          createChatMessage({ role: "assistant", content: "Sure" }),
          createChatMessage({ role: "user", content: "Budget is $10k" }),
          createChatMessage({ role: "assistant", content: "Great" }),
          createChatMessage({ role: "user", content: "Timeline is 3 months" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          goals: "E-commerce",
          timeline: "short-term",
        },
      });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────

  describe("edge cases", () => {
    it("handles user messages (should never inject for user role)", () => {
      const message = createChatMessage({
        role: "user",
        content: "I want to book a consultation",
      });
      const state = createConversationState({ phase: "summary" });
      const result = injector.determineCTAs(message, state);
      expect(result.shouldInject).toBe(false);
    });

    it("returns empty CTAs array when not injecting", () => {
      const message = createChatMessage({
        role: "assistant",
        content: "Hello!",
      });
      const state = createConversationState({ phase: "greeting" });
      const result = injector.determineCTAs(message, state);
      expect(result.ctas).toEqual([]);
    });
  });
});
