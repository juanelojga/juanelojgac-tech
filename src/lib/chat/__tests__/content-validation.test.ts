import { describe, expect, it } from "vitest";

import type { Language } from "../../i18n";
import { StaticContentProvider } from "../content/static-content-provider";

/**
 * Content validation tests — ensure EN↔ES parity and data integrity
 * across all bilingual content sources.
 */
describe("Content Validation — EN/ES Parity", () => {
  const provider = new StaticContentProvider();
  const languages: Language[] = ["en", "es"];

  // ──────────────────────────────────────────────
  // Services parity
  // ──────────────────────────────────────────────

  describe("services parity", () => {
    it("every EN service ID has an ES counterpart", () => {
      const enIds = provider.getServices("en").map((s) => s.id);
      const esIds = provider.getServices("es").map((s) => s.id);
      for (const id of enIds) {
        expect(esIds).toContain(id);
      }
    });

    it("every ES service ID has an EN counterpart", () => {
      const enIds = provider.getServices("en").map((s) => s.id);
      const esIds = provider.getServices("es").map((s) => s.id);
      for (const id of esIds) {
        expect(enIds).toContain(id);
      }
    });

    it("services preserve the same order across languages", () => {
      const enIds = provider.getServices("en").map((s) => s.id);
      const esIds = provider.getServices("es").map((s) => s.id);
      expect(enIds).toEqual(esIds);
    });

    it("pricing ranges match numerically across languages", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].pricingRange.minUSD).toBe(es[i].pricingRange.minUSD);
        expect(en[i].pricingRange.maxUSD).toBe(es[i].pricingRange.maxUSD);
      }
    });

    it("delivery timelines match numerically across languages", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].deliveryTimeline.minWeeks).toBe(es[i].deliveryTimeline.minWeeks);
        expect(en[i].deliveryTimeline.maxWeeks).toBe(es[i].deliveryTimeline.maxWeeks);
      }
    });

    it("each service has the same number of examples across languages", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].examples.length).toBe(es[i].examples.length);
      }
    });
  });

  // ──────────────────────────────────────────────
  // Trust signals parity
  // ──────────────────────────────────────────────

  describe("trust signals parity", () => {
    it("every EN trust signal ID has an ES counterpart", () => {
      const enIds = provider.getTrustSignals("en").map((s) => s.id);
      const esIds = provider.getTrustSignals("es").map((s) => s.id);
      for (const id of enIds) {
        expect(esIds).toContain(id);
      }
    });

    it("trust signal types match across languages", () => {
      const en = provider.getTrustSignals("en");
      const es = provider.getTrustSignals("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].type).toBe(es[i].type);
      }
    });
  });

  // ──────────────────────────────────────────────
  // Starter prompts parity
  // ──────────────────────────────────────────────

  describe("starter prompts parity", () => {
    it("every EN starter prompt ID has an ES counterpart", () => {
      const enIds = provider.getStarterPrompts("en").map((p) => p.id);
      const esIds = provider.getStarterPrompts("es").map((p) => p.id);
      for (const id of enIds) {
        expect(esIds).toContain(id);
      }
    });

    it("starter prompt intents match across languages", () => {
      const en = provider.getStarterPrompts("en");
      const es = provider.getStarterPrompts("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].intent).toBe(es[i].intent);
      }
    });
  });

  // ──────────────────────────────────────────────
  // Guided follow-ups parity
  // ──────────────────────────────────────────────

  describe("guided follow-ups parity", () => {
    const phases = ["greeting", "discovery", "qualification", "summary", "completed"] as const;

    it("every EN guided follow-up ID has an ES counterpart for each phase", () => {
      for (const phase of phases) {
        const enIds = provider.getGuidedFollowUps("en", phase).map((f) => f.id);
        const esIds = provider.getGuidedFollowUps("es", phase).map((f) => f.id);
        for (const id of enIds) {
          expect(esIds).toContain(id);
        }
      }
    });

    it("guided follow-up applicable phases match across languages", () => {
      const enAll = provider.getGuidedFollowUps("en", "discovery");
      const esAll = provider.getGuidedFollowUps("es", "discovery");
      for (let i = 0; i < enAll.length; i++) {
        expect(enAll[i].applicablePhases).toEqual(esAll[i].applicablePhases);
      }
    });
  });

  // ──────────────────────────────────────────────
  // Out-of-scope redirect parity
  // ──────────────────────────────────────────────

  describe("out-of-scope redirect parity", () => {
    it("redirect has the same number of suggested prompts across languages", () => {
      const en = provider.getOutOfScopeRedirect("en");
      const es = provider.getOutOfScopeRedirect("es");
      expect(en.suggestedPrompts.length).toBe(es.suggestedPrompts.length);
    });

    it("redirect suggested prompt IDs match across languages", () => {
      const enIds = provider.getOutOfScopeRedirect("en").suggestedPrompts.map((p) => p.id);
      const esIds = provider.getOutOfScopeRedirect("es").suggestedPrompts.map((p) => p.id);
      expect(enIds).toEqual(esIds);
    });
  });

  // ──────────────────────────────────────────────
  // Company facts parity
  // ──────────────────────────────────────────────

  describe("company facts parity", () => {
    it("company name matches across languages", () => {
      const en = provider.getCompanyFacts("en");
      const es = provider.getCompanyFacts("es");
      expect(en.name).toBe(es.name);
    });

    it("process steps count matches across languages", () => {
      const en = provider.getCompanyFacts("en");
      const es = provider.getCompanyFacts("es");
      expect(en.processSteps.length).toBe(es.processSteps.length);
    });
  });

  // ──────────────────────────────────────────────
  // i18n chat keys parity
  // ──────────────────────────────────────────────

  describe("i18n chat keys parity", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const enI18n = require("../../../i18n/en.json");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const esI18n = require("../../../i18n/es.json");

    function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
      const keys: string[] = [];
      for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          keys.push(...flattenKeys(value as Record<string, unknown>, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }

    it("all EN chat.* keys exist in ES", () => {
      const enKeys = flattenKeys(enI18n.chat, "chat");
      const esKeys = flattenKeys(esI18n.chat, "chat");
      for (const key of enKeys) {
        expect(esKeys).toContain(key);
      }
    });

    it("all ES chat.* keys exist in EN", () => {
      const enKeys = flattenKeys(enI18n.chat, "chat");
      const esKeys = flattenKeys(esI18n.chat, "chat");
      for (const key of esKeys) {
        expect(enKeys).toContain(key);
      }
    });

    it("chat keys are symmetric (exact same set)", () => {
      const enKeys = flattenKeys(enI18n.chat, "chat").sort();
      const esKeys = flattenKeys(esI18n.chat, "chat").sort();
      expect(enKeys).toEqual(esKeys);
    });

    it("no empty chat values in EN", () => {
      const check = (obj: Record<string, unknown>, path: string) => {
        for (const [key, value] of Object.entries(obj)) {
          const fullPath = `${path}.${key}`;
          if (typeof value === "string") {
            expect(value.length, `Empty value at ${fullPath}`).toBeGreaterThan(0);
          } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            check(value as Record<string, unknown>, fullPath);
          }
        }
      };
      check(enI18n.chat, "chat");
    });

    it("no empty chat values in ES", () => {
      const check = (obj: Record<string, unknown>, path: string) => {
        for (const [key, value] of Object.entries(obj)) {
          const fullPath = `${path}.${key}`;
          if (typeof value === "string") {
            expect(value.length, `Empty value at ${fullPath}`).toBeGreaterThan(0);
          } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            check(value as Record<string, unknown>, fullPath);
          }
        }
      };
      check(esI18n.chat, "chat");
    });
  });

  // ──────────────────────────────────────────────
  // Content length and overflow safety
  // ──────────────────────────────────────────────

  describe("content length safety", () => {
    it("no service title exceeds 60 characters in any language", () => {
      for (const lang of languages) {
        for (const service of provider.getServices(lang)) {
          expect(
            service.title.length,
            `Service "${service.id}" title too long in ${lang}: "${service.title}"`
          ).toBeLessThanOrEqual(60);
        }
      }
    });

    it("no service description exceeds 500 characters in any language", () => {
      for (const lang of languages) {
        for (const service of provider.getServices(lang)) {
          expect(
            service.description.length,
            `Service "${service.id}" description too long in ${lang}`
          ).toBeLessThanOrEqual(500);
        }
      }
    });

    it("Spanish translations are within 50% length of English counterparts for services", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      for (let i = 0; i < en.length; i++) {
        const ratio = es[i].description.length / en[i].description.length;
        expect(
          ratio,
          `Service "${en[i].id}" ES description is ${Math.round(ratio * 100)}% of EN length`
        ).toBeLessThanOrEqual(1.5);
      }
    });

    it("Spanish translations are within 50% length of English counterparts for prompts", () => {
      const en = provider.getStarterPrompts("en");
      const es = provider.getStarterPrompts("es");
      for (let i = 0; i < en.length; i++) {
        const ratio = es[i].label.length / en[i].label.length;
        expect(
          ratio,
          `Prompt "${en[i].id}" ES label is ${Math.round(ratio * 100)}% of EN length`
        ).toBeLessThanOrEqual(1.5);
      }
    });

    it("welcome message is under 300 characters in both languages", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const enI18n = require("../../../i18n/en.json");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const esI18n = require("../../../i18n/es.json");

      expect(enI18n.chat.messages.welcome.length).toBeLessThanOrEqual(300);
      expect(esI18n.chat.messages.welcome.length).toBeLessThanOrEqual(300);
    });

    it("no content contains HTML tags", () => {
      const htmlRegex = /<[^>]+>/;

      for (const lang of languages) {
        for (const service of provider.getServices(lang)) {
          expect(htmlRegex.test(service.title), `HTML in title: ${service.title}`).toBe(false);
          expect(
            htmlRegex.test(service.description),
            `HTML in description: ${service.description}`
          ).toBe(false);
        }

        for (const prompt of provider.getStarterPrompts(lang)) {
          expect(htmlRegex.test(prompt.label), `HTML in prompt label: ${prompt.label}`).toBe(false);
          expect(htmlRegex.test(prompt.prompt), `HTML in prompt: ${prompt.prompt}`).toBe(false);
        }
      }
    });

    it("no content contains null bytes or control characters", () => {
      // eslint-disable-next-line no-control-regex
      const controlRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;

      for (const lang of languages) {
        for (const service of provider.getServices(lang)) {
          expect(controlRegex.test(service.title)).toBe(false);
          expect(controlRegex.test(service.description)).toBe(false);
        }

        const facts = provider.getCompanyFacts(lang);
        expect(controlRegex.test(facts.description)).toBe(false);
        expect(controlRegex.test(facts.tagline)).toBe(false);
      }
    });
  });
});
