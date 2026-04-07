import { describe, expect, it } from "vitest";

import type { Language } from "../../i18n";
import { StaticContentProvider } from "../content/static-content-provider";
import type { ConversationPhase } from "../types";
import {
  isValidCompanyFacts,
  isValidGuidedFollowUp,
  isValidOutcomePrompt,
  isValidOutOfScopeRedirect,
  isValidPromptGroup,
  isValidServiceContent,
  isValidStarterPrompt,
  isValidTrustSignal,
} from "../validators";

describe("StaticContentProvider", () => {
  const provider = new StaticContentProvider();
  const languages: Language[] = ["en", "es"];

  // ──────────────────────────────────────────────
  // getServices
  // ──────────────────────────────────────────────

  describe("getServices", () => {
    it.each(languages)("returns non-empty array for %s", (lang) => {
      const services = provider.getServices(lang);
      expect(services.length).toBeGreaterThan(0);
    });

    it.each(languages)("returns valid ServiceContent objects for %s", (lang) => {
      const services = provider.getServices(lang);
      for (const service of services) {
        expect(isValidServiceContent(service)).toBe(true);
      }
    });

    it("returns the same number of services for both languages", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      expect(en.length).toBe(es.length);
    });

    it("returns services with matching IDs across languages", () => {
      const enIds = provider.getServices("en").map((s) => s.id);
      const esIds = provider.getServices("es").map((s) => s.id);
      expect(enIds).toEqual(esIds);
    });

    it.each(languages)("returns services with non-empty examples for %s", (lang) => {
      const services = provider.getServices(lang);
      for (const service of services) {
        expect(service.examples.length).toBeGreaterThan(0);
        for (const example of service.examples) {
          expect(example.length).toBeGreaterThan(0);
        }
      }
    });

    it.each(languages)("returns services with valid pricing ranges for %s", (lang) => {
      const services = provider.getServices(lang);
      for (const service of services) {
        expect(service.pricingRange.minUSD).toBeGreaterThanOrEqual(0);
        expect(service.pricingRange.maxUSD).toBeGreaterThanOrEqual(service.pricingRange.minUSD);
      }
    });

    it.each(languages)("returns services with valid delivery timelines for %s", (lang) => {
      const services = provider.getServices(lang);
      for (const service of services) {
        expect(service.deliveryTimeline.minWeeks).toBeGreaterThanOrEqual(0);
        expect(service.deliveryTimeline.maxWeeks).toBeGreaterThanOrEqual(
          service.deliveryTimeline.minWeeks
        );
      }
    });

    it("returns readonly arrays", () => {
      const services = provider.getServices("en");
      expect(Object.isFrozen(services)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // getCompanyFacts
  // ──────────────────────────────────────────────

  describe("getCompanyFacts", () => {
    it.each(languages)("returns valid CompanyFacts for %s", (lang) => {
      const facts = provider.getCompanyFacts(lang);
      expect(isValidCompanyFacts(facts)).toBe(true);
    });

    it("uses the same company name across languages", () => {
      const en = provider.getCompanyFacts("en");
      const es = provider.getCompanyFacts("es");
      expect(en.name).toBe(es.name);
    });

    it.each(languages)("returns non-empty process steps for %s", (lang) => {
      const facts = provider.getCompanyFacts(lang);
      expect(facts.processSteps.length).toBeGreaterThan(0);
      for (const step of facts.processSteps) {
        expect(step.length).toBeGreaterThan(0);
      }
    });

    it("returns the same number of process steps across languages", () => {
      const en = provider.getCompanyFacts("en");
      const es = provider.getCompanyFacts("es");
      expect(en.processSteps.length).toBe(es.processSteps.length);
    });
  });

  // ──────────────────────────────────────────────
  // getTrustSignals
  // ──────────────────────────────────────────────

  describe("getTrustSignals", () => {
    it.each(languages)("returns non-empty array for %s", (lang) => {
      const signals = provider.getTrustSignals(lang);
      expect(signals.length).toBeGreaterThan(0);
    });

    it.each(languages)("returns valid TrustSignal objects for %s", (lang) => {
      const signals = provider.getTrustSignals(lang);
      for (const signal of signals) {
        expect(isValidTrustSignal(signal)).toBe(true);
      }
    });

    it("returns trust signals with matching IDs across languages", () => {
      const enIds = provider.getTrustSignals("en").map((s) => s.id);
      const esIds = provider.getTrustSignals("es").map((s) => s.id);
      expect(enIds).toEqual(esIds);
    });

    it("returns the same number of trust signals across languages", () => {
      const en = provider.getTrustSignals("en");
      const es = provider.getTrustSignals("es");
      expect(en.length).toBe(es.length);
    });

    it("returns readonly arrays", () => {
      const signals = provider.getTrustSignals("en");
      expect(Object.isFrozen(signals)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // getStarterPrompts
  // ──────────────────────────────────────────────

  describe("getStarterPrompts", () => {
    it.each(languages)("returns non-empty array for %s", (lang) => {
      const prompts = provider.getStarterPrompts(lang);
      expect(prompts.length).toBeGreaterThan(0);
    });

    it.each(languages)("returns valid StarterPrompt objects for %s", (lang) => {
      const prompts = provider.getStarterPrompts(lang);
      for (const prompt of prompts) {
        expect(isValidStarterPrompt(prompt)).toBe(true);
      }
    });

    it("returns starter prompts with matching IDs across languages", () => {
      const enIds = provider.getStarterPrompts("en").map((p) => p.id);
      const esIds = provider.getStarterPrompts("es").map((p) => p.id);
      expect(enIds).toEqual(esIds);
    });

    it("covers multiple business intents", () => {
      const prompts = provider.getStarterPrompts("en");
      const intents = new Set(prompts.map((p) => p.intent));
      expect(intents.size).toBeGreaterThanOrEqual(3);
    });

    it("returns readonly arrays", () => {
      const prompts = provider.getStarterPrompts("en");
      expect(Object.isFrozen(prompts)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // getGuidedFollowUps
  // ──────────────────────────────────────────────

  describe("getGuidedFollowUps", () => {
    const phases: ConversationPhase[] = [
      "greeting",
      "discovery",
      "qualification",
      "summary",
      "completed",
    ];

    it.each(languages)("returns valid GuidedFollowUp objects for %s", (lang) => {
      for (const phase of phases) {
        const followUps = provider.getGuidedFollowUps(lang, phase);
        for (const followUp of followUps) {
          expect(isValidGuidedFollowUp(followUp)).toBe(true);
        }
      }
    });

    it("returns follow-ups filtered by applicable phase", () => {
      const greetingFollowUps = provider.getGuidedFollowUps("en", "greeting");
      for (const followUp of greetingFollowUps) {
        expect(followUp.applicablePhases).toContain("greeting");
      }
    });

    it("returns different follow-ups for different phases", () => {
      const discovery = provider.getGuidedFollowUps("en", "discovery");
      const qualification = provider.getGuidedFollowUps("en", "qualification");
      const discoveryIds = discovery.map((f) => f.id);
      const qualificationIds = qualification.map((f) => f.id);
      // They should not be identical sets (some overlap is fine)
      expect(discoveryIds).not.toEqual(qualificationIds);
    });

    it("returns matching follow-up IDs across languages for the same phase", () => {
      for (const phase of phases) {
        const enIds = provider.getGuidedFollowUps("en", phase).map((f) => f.id);
        const esIds = provider.getGuidedFollowUps("es", phase).map((f) => f.id);
        expect(enIds).toEqual(esIds);
      }
    });

    it("returns readonly arrays", () => {
      const followUps = provider.getGuidedFollowUps("en", "discovery");
      expect(Object.isFrozen(followUps)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // getOutOfScopeRedirect
  // ──────────────────────────────────────────────

  describe("getOutOfScopeRedirect", () => {
    it.each(languages)("returns valid OutOfScopeRedirect for %s", (lang) => {
      const redirect = provider.getOutOfScopeRedirect(lang);
      expect(isValidOutOfScopeRedirect(redirect)).toBe(true);
    });

    it.each(languages)("returns redirect with non-empty suggested prompts for %s", (lang) => {
      const redirect = provider.getOutOfScopeRedirect(lang);
      expect(redirect.suggestedPrompts.length).toBeGreaterThan(0);
    });

    it("returns the same number of suggested prompts across languages", () => {
      const en = provider.getOutOfScopeRedirect("en");
      const es = provider.getOutOfScopeRedirect("es");
      expect(en.suggestedPrompts.length).toBe(es.suggestedPrompts.length);
    });
  });

  // ──────────────────────────────────────────────
  // getOutcomePrompts (V2)
  // ──────────────────────────────────────────────

  describe("getOutcomePrompts", () => {
    it.each(languages)("returns non-empty array for %s", (lang) => {
      const prompts = provider.getOutcomePrompts(lang);
      expect(prompts.length).toBeGreaterThan(0);
    });

    it.each(languages)("returns valid OutcomePrompt objects for %s", (lang) => {
      const prompts = provider.getOutcomePrompts(lang);
      for (const prompt of prompts) {
        expect(isValidOutcomePrompt(prompt)).toBe(true);
      }
    });

    it("returns outcome prompts with matching IDs across languages", () => {
      const enIds = provider.getOutcomePrompts("en").map((p) => p.id);
      const esIds = provider.getOutcomePrompts("es").map((p) => p.id);
      expect(enIds).toEqual(esIds);
    });

    it("returns the same number of outcome prompts across languages", () => {
      const en = provider.getOutcomePrompts("en");
      const es = provider.getOutcomePrompts("es");
      expect(en.length).toBe(es.length);
    });

    it("returns outcome prompts with matching icons across languages", () => {
      const en = provider.getOutcomePrompts("en");
      const es = provider.getOutcomePrompts("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].icon).toBe(es[i].icon);
      }
    });

    it("returns at least 4 outcome prompts", () => {
      const prompts = provider.getOutcomePrompts("en");
      expect(prompts.length).toBeGreaterThanOrEqual(4);
    });

    it("returns readonly arrays", () => {
      const prompts = provider.getOutcomePrompts("en");
      expect(Object.isFrozen(prompts)).toBe(true);
    });

    it("returns the same instance for repeated calls (caching)", () => {
      const first = provider.getOutcomePrompts("en");
      const second = provider.getOutcomePrompts("en");
      expect(first).toBe(second);
    });
  });

  // ──────────────────────────────────────────────
  // getPromptGroups (V2)
  // ──────────────────────────────────────────────

  describe("getPromptGroups", () => {
    it.each(languages)("returns non-empty array for %s", (lang) => {
      const groups = provider.getPromptGroups(lang);
      expect(groups.length).toBeGreaterThan(0);
    });

    it.each(languages)("returns valid PromptGroup objects for %s", (lang) => {
      const groups = provider.getPromptGroups(lang);
      for (const group of groups) {
        expect(isValidPromptGroup(group)).toBe(true);
      }
    });

    it("returns the same number of groups across languages", () => {
      const en = provider.getPromptGroups("en");
      const es = provider.getPromptGroups("es");
      expect(en.length).toBe(es.length);
    });

    it("returns groups with matching promptIds across languages", () => {
      const en = provider.getPromptGroups("en");
      const es = provider.getPromptGroups("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].promptIds).toEqual(es[i].promptIds);
      }
    });

    it("all prompt group promptIds reference existing starter prompts", () => {
      for (const lang of languages) {
        const groups = provider.getPromptGroups(lang);
        const starterIds = new Set(provider.getStarterPrompts(lang).map((p) => p.id));
        for (const group of groups) {
          for (const id of group.promptIds) {
            expect(starterIds.has(id), `Prompt ID "${id}" not found in starter prompts`).toBe(true);
          }
        }
      }
    });

    it("returns at least 2 prompt groups", () => {
      const groups = provider.getPromptGroups("en");
      expect(groups.length).toBeGreaterThanOrEqual(2);
    });

    it("returns readonly arrays", () => {
      const groups = provider.getPromptGroups("en");
      expect(Object.isFrozen(groups)).toBe(true);
    });

    it("returns the same instance for repeated calls (caching)", () => {
      const first = provider.getPromptGroups("en");
      const second = provider.getPromptGroups("en");
      expect(first).toBe(second);
    });
  });

  // ──────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────

  describe("edge cases", () => {
    it("returns the same instance for repeated calls (caching)", () => {
      const first = provider.getServices("en");
      const second = provider.getServices("en");
      expect(first).toBe(second);
    });

    it("returns different instances for different languages", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      expect(en).not.toBe(es);
    });

    it("all service descriptions are under 500 characters", () => {
      for (const lang of languages) {
        const services = provider.getServices(lang);
        for (const service of services) {
          expect(service.description.length).toBeLessThanOrEqual(500);
        }
      }
    });

    it("all service short descriptions are under 100 characters", () => {
      for (const lang of languages) {
        const services = provider.getServices(lang);
        for (const service of services) {
          expect(service.shortDescription.length).toBeLessThanOrEqual(100);
        }
      }
    });

    it("all starter prompt labels are under 50 characters", () => {
      for (const lang of languages) {
        const prompts = provider.getStarterPrompts(lang);
        for (const prompt of prompts) {
          expect(prompt.label.length).toBeLessThanOrEqual(50);
        }
      }
    });

    it("all trust signal values are under 30 characters", () => {
      for (const lang of languages) {
        const signals = provider.getTrustSignals(lang);
        for (const signal of signals) {
          expect(signal.value.length).toBeLessThanOrEqual(30);
        }
      }
    });
  });
});
