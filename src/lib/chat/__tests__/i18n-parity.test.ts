import { describe, expect, it } from "vitest";

import { detectLanguageFromHeader, type Language } from "../../i18n";
import { StaticContentProvider } from "../content/static-content-provider";

/**
 * Comprehensive i18n parity tests — Phase 8
 * Verifies EN↔ES symmetry for all chat content, i18n keys,
 * placeholder patterns, and structural consistency.
 */
describe("i18n Parity — Phase 8", () => {
  const provider = new StaticContentProvider();
  const languages: Language[] = ["en", "es"];

  // ──────────────────────────────────────────────
  // Helper: recursively flatten keys
  // ──────────────────────────────────────────────

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

  function flattenValues(obj: Record<string, unknown>, prefix = ""): Map<string, string> {
    const values = new Map<string, string>();
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === "string") {
        values.set(fullKey, value);
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        for (const [k, v] of flattenValues(value as Record<string, unknown>, fullKey)) {
          values.set(k, v);
        }
      }
    }
    return values;
  }

  // ──────────────────────────────────────────────
  // Full i18n JSON parity (all top-level sections)
  // ──────────────────────────────────────────────

  describe("full i18n JSON key parity", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const enI18n = require("../../../i18n/en.json");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const esI18n = require("../../../i18n/es.json");

    it("EN and ES have the same top-level sections", () => {
      const enSections = Object.keys(enI18n).sort();
      const esSections = Object.keys(esI18n).sort();
      expect(enSections).toEqual(esSections);
    });

    it("all EN keys exist in ES (full tree)", () => {
      const enKeys = flattenKeys(enI18n);
      const esKeys = new Set(flattenKeys(esI18n));
      const missing = enKeys.filter((k) => !esKeys.has(k));
      expect(missing, `EN keys missing in ES: ${missing.join(", ")}`).toEqual([]);
    });

    it("all ES keys exist in EN (full tree)", () => {
      const esKeys = flattenKeys(esI18n);
      const enKeys = new Set(flattenKeys(enI18n));
      const missing = esKeys.filter((k) => !enKeys.has(k));
      expect(missing, `ES keys missing in EN: ${missing.join(", ")}`).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────
  // Placeholder pattern parity
  // ──────────────────────────────────────────────

  describe("placeholder pattern parity", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const enI18n = require("../../../i18n/en.json");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const esI18n = require("../../../i18n/es.json");

    const placeholderRegex = /\{\{(\w+)\}\}/g;

    function extractPlaceholders(value: string): string[] {
      const matches: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = placeholderRegex.exec(value)) !== null) {
        matches.push(match[1]);
      }
      return matches.sort();
    }

    it("EN and ES have the same placeholders in each key", () => {
      const enValues = flattenValues(enI18n);
      const esValues = flattenValues(esI18n);

      for (const [key, enValue] of enValues) {
        const enPlaceholders = extractPlaceholders(enValue);
        if (enPlaceholders.length === 0) continue;

        const esValue = esValues.get(key);
        expect(esValue, `Key "${key}" missing in ES`).toBeDefined();

        const esPlaceholders = extractPlaceholders(esValue!);
        expect(
          esPlaceholders,
          `Placeholder mismatch at "${key}": EN has {{${enPlaceholders.join(", ")}}}, ES has {{${esPlaceholders.join(", ")}}}`
        ).toEqual(enPlaceholders);
      }
    });
  });

  // ──────────────────────────────────────────────
  // Content JSON structural parity
  // ──────────────────────────────────────────────

  describe("content JSON structural parity", () => {
    it("services have identical IDs in the same order", () => {
      const enIds = provider.getServices("en").map((s) => s.id);
      const esIds = provider.getServices("es").map((s) => s.id);
      expect(enIds).toEqual(esIds);
    });

    it("services have identical example counts per service", () => {
      const en = provider.getServices("en");
      const es = provider.getServices("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].examples.length, `Service "${en[i].id}" example count mismatch`).toBe(
          es[i].examples.length
        );
      }
    });

    it("starter prompts have identical IDs in the same order", () => {
      const enIds = provider.getStarterPrompts("en").map((p) => p.id);
      const esIds = provider.getStarterPrompts("es").map((p) => p.id);
      expect(enIds).toEqual(esIds);
    });

    it("starter prompts have identical intents", () => {
      const en = provider.getStarterPrompts("en");
      const es = provider.getStarterPrompts("es");
      for (let i = 0; i < en.length; i++) {
        expect(en[i].intent).toBe(es[i].intent);
      }
    });

    it("trust signals have identical IDs and types", () => {
      const en = provider.getTrustSignals("en");
      const es = provider.getTrustSignals("es");
      expect(en.map((s) => s.id)).toEqual(es.map((s) => s.id));
      expect(en.map((s) => s.type)).toEqual(es.map((s) => s.type));
    });

    it("guided follow-ups have identical IDs and applicable phases", () => {
      const phases = ["greeting", "discovery", "qualification", "summary", "completed"] as const;
      for (const phase of phases) {
        const en = provider.getGuidedFollowUps("en", phase);
        const es = provider.getGuidedFollowUps("es", phase);
        expect(en.map((f) => f.id)).toEqual(es.map((f) => f.id));
        for (let i = 0; i < en.length; i++) {
          expect(en[i].applicablePhases).toEqual(es[i].applicablePhases);
        }
      }
    });

    it("out-of-scope redirect has identical suggested prompt IDs and intents", () => {
      const en = provider.getOutOfScopeRedirect("en");
      const es = provider.getOutOfScopeRedirect("es");
      expect(en.suggestedPrompts.map((p) => p.id)).toEqual(es.suggestedPrompts.map((p) => p.id));
      expect(en.suggestedPrompts.map((p) => p.intent)).toEqual(
        es.suggestedPrompts.map((p) => p.intent)
      );
    });
  });

  // ──────────────────────────────────────────────
  // No raw keys rendered — values differ from keys
  // ──────────────────────────────────────────────

  describe("translation values are actual content, not raw keys", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const enI18n = require("../../../i18n/en.json");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const esI18n = require("../../../i18n/es.json");

    it("EN values differ from ES values for text content (not identical)", () => {
      const enValues = flattenValues(enI18n.chat as Record<string, unknown>, "chat");
      const esValues = flattenValues(esI18n.chat as Record<string, unknown>, "chat");

      // Most keys should have different values between languages
      // Allow some keys to be identical (e.g., brand names, numbers)
      const allowedIdentical = new Set([
        "chat.panel.title", // brand name
      ]);

      let identicalCount = 0;
      let totalKeys = 0;
      for (const [key, enValue] of enValues) {
        const esValue = esValues.get(key);
        if (esValue === enValue && !allowedIdentical.has(key)) {
          identicalCount++;
        }
        totalKeys++;
      }

      // At most 10% of keys should be identical (graceful threshold)
      const identicalPercent = (identicalCount / totalKeys) * 100;
      expect(
        identicalPercent,
        `${identicalCount}/${totalKeys} keys are identical across EN/ES (${identicalPercent.toFixed(1)}%)`
      ).toBeLessThan(10);
    });

    it("no value looks like a raw key path (e.g., 'chat.header.title')", () => {
      const rawKeyPattern = /^[a-z]+(\.[a-z]+){2,}$/;

      for (const lang of languages) {
        const services = provider.getServices(lang);
        for (const svc of services) {
          expect(rawKeyPattern.test(svc.title), `Raw key in service title: ${svc.title}`).toBe(
            false
          );
          expect(
            rawKeyPattern.test(svc.shortDescription),
            `Raw key in service desc: ${svc.shortDescription}`
          ).toBe(false);
        }

        const prompts = provider.getStarterPrompts(lang);
        for (const p of prompts) {
          expect(rawKeyPattern.test(p.label), `Raw key in prompt label: ${p.label}`).toBe(false);
        }
      }
    });
  });

  // ──────────────────────────────────────────────
  // Length safety checks for overflow prevention
  // ──────────────────────────────────────────────

  describe("translation length safety for responsive layouts", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const enI18n = require("../../../i18n/en.json");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const esI18n = require("../../../i18n/es.json");

    it("panel labels fit mobile widths (≤ 40 chars)", () => {
      const panelKeys = ["servicesLabel", "ctaBooking", "ctaContact"] as const;
      for (const key of panelKeys) {
        expect(
          enI18n.chat.panel[key].length,
          `EN panel.${key} too long: "${enI18n.chat.panel[key]}"`
        ).toBeLessThanOrEqual(40);
        expect(
          esI18n.chat.panel[key].length,
          `ES panel.${key} too long: "${esI18n.chat.panel[key]}"`
        ).toBeLessThanOrEqual(40);
      }
    });

    it("header title and subtitle fit compact header (≤ 60 chars each)", () => {
      expect(enI18n.chat.header.title.length).toBeLessThanOrEqual(60);
      expect(esI18n.chat.header.title.length).toBeLessThanOrEqual(60);
      expect(enI18n.chat.header.subtitle.length).toBeLessThanOrEqual(60);
      expect(esI18n.chat.header.subtitle.length).toBeLessThanOrEqual(60);
    });

    it("error messages fit single-line toast (≤ 120 chars)", () => {
      const errorKeys = [
        "errorGeneric",
        "errorNetwork",
        "errorRateLimit",
        "errorTimeout",
        "errorUnavailable",
      ] as const;
      for (const key of errorKeys) {
        expect(enI18n.chat.messages[key].length, `EN messages.${key} too long`).toBeLessThanOrEqual(
          120
        );
        expect(esI18n.chat.messages[key].length, `ES messages.${key} too long`).toBeLessThanOrEqual(
          120
        );
      }
    });

    it("chip labels fit mobile chips (≤ 50 chars)", () => {
      for (const lang of languages) {
        const prompts = provider.getStarterPrompts(lang);
        for (const p of prompts) {
          expect(
            p.label.length,
            `${lang} chip "${p.id}" label too long: "${p.label}"`
          ).toBeLessThanOrEqual(50);
        }
      }
    });

    it("ES translations do not exceed 60% longer than EN equivalents for critical UI elements", () => {
      const criticalKeys = [
        "chat.header.title",
        "chat.header.subtitle",
        "chat.panel.ctaBooking",
        "chat.panel.ctaContact",
        "chat.input.send",
        "chat.cta.booking",
        "chat.cta.contact",
      ];

      const enValues = flattenValues(enI18n);
      const esValues = flattenValues(esI18n);

      for (const key of criticalKeys) {
        const enLen = enValues.get(key)?.length ?? 0;
        const esLen = esValues.get(key)?.length ?? 0;
        if (enLen === 0) continue;
        const ratio = esLen / enLen;
        expect(
          ratio,
          `"${key}" ES is ${Math.round(ratio * 100)}% of EN length — may overflow`
        ).toBeLessThanOrEqual(1.6);
      }
    });
  });

  // ──────────────────────────────────────────────
  // Accept-Language detection for chat content
  // ──────────────────────────────────────────────

  describe("Accept-Language header detection", () => {
    it("returns 'en' for English Accept-Language", () => {
      expect(detectLanguageFromHeader("en-US,en;q=0.9")).toBe("en");
    });

    it("returns 'es' for Spanish Accept-Language", () => {
      expect(detectLanguageFromHeader("es-ES,es;q=0.9")).toBe("es");
    });

    it("returns 'es' for Spanish variants", () => {
      expect(detectLanguageFromHeader("es-MX,es;q=0.9,en;q=0.8")).toBe("es");
      expect(detectLanguageFromHeader("es-AR")).toBe("es");
      expect(detectLanguageFromHeader("es")).toBe("es");
    });

    it("returns 'en' when no header is provided", () => {
      expect(detectLanguageFromHeader(null)).toBe("en");
    });

    it("returns 'en' for non-Spanish, non-English languages", () => {
      expect(detectLanguageFromHeader("fr-FR,fr;q=0.9")).toBe("en");
      expect(detectLanguageFromHeader("de-DE")).toBe("en");
    });

    it("returns 'es' when Spanish is present among multiple languages", () => {
      expect(detectLanguageFromHeader("en-US,en;q=0.9,es;q=0.8")).toBe("es");
    });

    it("loading correct chat translations for detected language", () => {
      // Verify that StaticContentProvider returns different content per language
      const enWelcome = provider.getCompanyFacts("en").tagline;
      const esWelcome = provider.getCompanyFacts("es").tagline;
      expect(enWelcome).not.toBe(esWelcome);

      const enServices = provider.getServices("en");
      const esServices = provider.getServices("es");
      expect(enServices[0].title).not.toBe(esServices[0].title);
    });
  });
});
