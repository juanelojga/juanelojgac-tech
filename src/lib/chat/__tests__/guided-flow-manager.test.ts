import { beforeEach, describe, expect, it } from "vitest";

import { StaticContentProvider } from "../content/static-content-provider";
import { GuidedFlowManagerImpl } from "../guided-flow-manager";
import type { ContentProvider, ConversationPhase } from "../types";
import { createChatMessage, createConversationState } from "./factories";

describe("GuidedFlowManagerImpl", () => {
  let contentProvider: ContentProvider;
  let manager: GuidedFlowManagerImpl;

  beforeEach(() => {
    contentProvider = new StaticContentProvider();
    manager = new GuidedFlowManagerImpl(contentProvider);
  });

  // ──────────────────────────────────────────────
  // Follow-up suggestions by phase
  // ──────────────────────────────────────────────

  describe("suggestFollowUps", () => {
    it("returns greeting/discovery follow-ups for greeting phase", () => {
      const state = createConversationState({ phase: "greeting" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeGreaterThan(0);
      result.followUps.forEach((f) => {
        expect(f.applicablePhases).toContain("greeting");
      });
    });

    it("returns discovery follow-ups for discovery phase", () => {
      const state = createConversationState({ phase: "discovery" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeGreaterThan(0);
      result.followUps.forEach((f) => {
        expect(f.applicablePhases).toContain("discovery");
      });
    });

    it("returns qualification follow-ups for qualification phase", () => {
      const state = createConversationState({ phase: "qualification" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeGreaterThan(0);
      result.followUps.forEach((f) => {
        expect(f.applicablePhases).toContain("qualification");
      });
    });

    it("returns summary follow-ups for summary phase", () => {
      const state = createConversationState({ phase: "summary" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeGreaterThan(0);
      result.followUps.forEach((f) => {
        expect(f.applicablePhases).toContain("summary");
      });
    });

    it("returns completed follow-ups for completed phase", () => {
      const state = createConversationState({ phase: "completed" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeGreaterThan(0);
      result.followUps.forEach((f) => {
        expect(f.applicablePhases).toContain("completed");
      });
    });

    it("returns Spanish follow-ups for Spanish conversations", () => {
      const state = createConversationState({ phase: "discovery", language: "es" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeGreaterThan(0);
      // Spanish follow-ups should have Spanish labels
      result.followUps.forEach((f) => {
        expect(f.label).toBeTruthy();
      });
    });
  });

  // ──────────────────────────────────────────────
  // Phase transition logic
  // ──────────────────────────────────────────────

  describe("phase transitions", () => {
    it("suggests transition from greeting to discovery after first exchange", () => {
      const state = createConversationState({
        phase: "greeting",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello! How can I help?" }),
          createChatMessage({ role: "user", content: "I need a web platform" }),
        ],
      });
      const result = manager.suggestFollowUps(state);
      expect(result.shouldTransitionPhase).toBe(true);
      expect(result.nextPhase).toBe("discovery");
    });

    it("suggests transition from discovery to qualification when enough info gathered", () => {
      const state = createConversationState({
        phase: "discovery",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "I need a web platform for e-commerce" }),
          createChatMessage({ role: "assistant", content: "Tell me about your target users" }),
          createChatMessage({
            role: "user",
            content: "Small business owners who sell handmade products",
          }),
          createChatMessage({ role: "assistant", content: "What are your main goals?" }),
          createChatMessage({ role: "user", content: "I want to increase online sales by 50%" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
          goals: "Increase online sales",
        },
      });
      const result = manager.suggestFollowUps(state);
      expect(result.shouldTransitionPhase).toBe(true);
      expect(result.nextPhase).toBe("qualification");
    });

    it("suggests transition from qualification to summary when lead is qualified", () => {
      const state = createConversationState({
        phase: "qualification",
        messages: [
          createChatMessage({ role: "user", content: "I need it within 3 months" }),
          createChatMessage({ role: "assistant", content: "What's your budget range?" }),
          createChatMessage({ role: "user", content: "Around $5000-$10000" }),
          createChatMessage({ role: "assistant", content: "Great, let me help you" }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
          goals: "Increase online sales",
          timeline: "short-term",
          budgetRange: "growth",
        },
      });
      const result = manager.suggestFollowUps(state);
      expect(result.shouldTransitionPhase).toBe(true);
      expect(result.nextPhase).toBe("summary");
    });

    it("does not suggest transition when insufficient information", () => {
      const state = createConversationState({
        phase: "discovery",
        messages: [
          createChatMessage({ role: "assistant", content: "Hello!" }),
          createChatMessage({ role: "user", content: "Hi" }),
        ],
        leadAttributes: {},
      });
      const result = manager.suggestFollowUps(state);
      expect(result.shouldTransitionPhase).toBe(false);
    });

    it("does not transition from completed phase", () => {
      const state = createConversationState({
        phase: "completed",
        messages: [createChatMessage({ role: "user", content: "Thanks!" })],
      });
      const result = manager.suggestFollowUps(state);
      expect(result.shouldTransitionPhase).toBe(false);
    });

    it("transitions from summary to completed after summary generated", () => {
      const state = createConversationState({
        phase: "summary",
        messages: [
          createChatMessage({ role: "user", content: "Generate a summary" }),
          createChatMessage({
            role: "assistant",
            content: "Here is your project summary: Web Platform - $5,000-$10,000 - 4-8 weeks",
          }),
          createChatMessage({ role: "user", content: "Thank you, that looks great!" }),
          createChatMessage({
            role: "assistant",
            content: "You're welcome! Would you like to book a consultation?",
          }),
        ],
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "SMEs",
          goals: "Online sales",
          timeline: "short-term",
          budgetRange: "growth",
        },
      });
      const result = manager.suggestFollowUps(state);
      expect(result.shouldTransitionPhase).toBe(true);
      expect(result.nextPhase).toBe("completed");
    });
  });

  // ──────────────────────────────────────────────
  // Flow progression: project type → users → goals → timeline → summary
  // ──────────────────────────────────────────────

  describe("flow progression", () => {
    it("suggests asking about project type when none is known", () => {
      const state = createConversationState({
        phase: "discovery",
        leadAttributes: {},
      });
      const result = manager.suggestFollowUps(state);
      const hasProjectTypeFollowUp = result.followUps.some((f) => f.id === "gf-project-type");
      expect(hasProjectTypeFollowUp).toBe(true);
    });

    it("suggests asking about target users when project type is known", () => {
      const state = createConversationState({
        phase: "discovery",
        leadAttributes: { projectType: "web-platform" },
      });
      const result = manager.suggestFollowUps(state);
      const hasTargetUsersFollowUp = result.followUps.some((f) => f.id === "gf-target-users");
      expect(hasTargetUsersFollowUp).toBe(true);
    });

    it("suggests asking about goals when project type and users are known", () => {
      const state = createConversationState({
        phase: "discovery",
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
        },
      });
      const result = manager.suggestFollowUps(state);
      const hasGoalsFollowUp = result.followUps.some((f) => f.id === "gf-goals");
      expect(hasGoalsFollowUp).toBe(true);
    });

    it("suggests asking about timeline in qualification phase", () => {
      const state = createConversationState({
        phase: "qualification",
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
          goals: "Increase sales",
        },
      });
      const result = manager.suggestFollowUps(state);
      const hasTimelineFollowUp = result.followUps.some((f) => f.id === "gf-timeline");
      expect(hasTimelineFollowUp).toBe(true);
    });

    it("suggests generating a summary when enough info is known", () => {
      const state = createConversationState({
        phase: "qualification",
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
          goals: "Increase sales",
          timeline: "short-term",
        },
      });
      const result = manager.suggestFollowUps(state);
      const hasSummaryFollowUp = result.followUps.some((f) => f.id === "gf-summary");
      expect(hasSummaryFollowUp).toBe(true);
    });

    it("suggests booking a call in summary phase", () => {
      const state = createConversationState({
        phase: "summary",
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
          goals: "Increase sales",
          timeline: "short-term",
          budgetRange: "growth",
        },
      });
      const result = manager.suggestFollowUps(state);
      const hasBookCallFollowUp = result.followUps.some((f) => f.id === "gf-book-call");
      expect(hasBookCallFollowUp).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // Prioritized follow-up filtering
  // ──────────────────────────────────────────────

  describe("follow-up prioritization", () => {
    it("filters out follow-ups for already-known attributes", () => {
      const state = createConversationState({
        phase: "discovery",
        leadAttributes: {
          projectType: "web-platform",
          targetUsers: "Small business owners",
          goals: "Increase sales",
        },
      });
      const result = manager.suggestFollowUps(state);
      // Should not suggest asking about project type since it's known
      const hasProjectTypeFollowUp = result.followUps.some((f) => f.id === "gf-project-type");
      expect(hasProjectTypeFollowUp).toBe(false);
    });

    it("limits follow-up count to avoid overwhelming the user", () => {
      const state = createConversationState({ phase: "discovery" });
      const result = manager.suggestFollowUps(state);
      expect(result.followUps.length).toBeLessThanOrEqual(3);
    });
  });

  // ──────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────

  describe("edge cases", () => {
    it("handles empty conversation state", () => {
      const state = createConversationState();
      const result = manager.suggestFollowUps(state);
      expect(result.followUps).toBeDefined();
      expect(Array.isArray(result.followUps)).toBe(true);
    });

    it("works with both EN and ES languages", () => {
      const phases: ConversationPhase[] = [
        "greeting",
        "discovery",
        "qualification",
        "summary",
        "completed",
      ];
      for (const phase of phases) {
        const enState = createConversationState({ phase, language: "en" });
        const esState = createConversationState({ phase, language: "es" });
        const enResult = manager.suggestFollowUps(enState);
        const esResult = manager.suggestFollowUps(esState);
        expect(enResult.followUps.length).toBe(esResult.followUps.length);
      }
    });

    it("returns consistent results for same input state", () => {
      const state = createConversationState({ phase: "discovery" });
      const result1 = manager.suggestFollowUps(state);
      const result2 = manager.suggestFollowUps(state);
      expect(result1.followUps.map((f) => f.id)).toEqual(result2.followUps.map((f) => f.id));
      expect(result1.shouldTransitionPhase).toBe(result2.shouldTransitionPhase);
    });
  });
});
