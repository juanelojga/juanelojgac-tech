// @vitest-environment node
import { describe, expect, it } from "vitest";

import en from "../../../i18n/en.json";
import es from "../../../i18n/es.json";

type NestedKeys = Record<string, unknown>;

/** Recursively collect all leaf-level dot-notation keys from a nested object */
function getKeys(obj: NestedKeys, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...getKeys(value as NestedKeys, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("Redesign i18n key symmetry", () => {
  const enRedesign = (en as NestedKeys).redesign as NestedKeys;
  const esRedesign = (es as NestedKeys).redesign as NestedKeys;

  it("redesign namespace exists in EN", () => {
    expect(enRedesign).toBeDefined();
    expect(typeof enRedesign).toBe("object");
  });

  it("redesign namespace exists in ES", () => {
    expect(esRedesign).toBeDefined();
    expect(typeof esRedesign).toBe("object");
  });

  it("EN and ES have identical redesign key sets", () => {
    const enKeys = getKeys(enRedesign).sort();
    const esKeys = getKeys(esRedesign).sort();
    expect(enKeys).toEqual(esKeys);
  });

  it("no empty string values in EN redesign keys", () => {
    const enKeys = getKeys(enRedesign);
    for (const key of enKeys) {
      const parts = key.split(".");
      let value: unknown = enRedesign;
      for (const part of parts) {
        value = (value as NestedKeys)[part];
      }
      expect(value, `EN key redesign.${key} should not be empty`).not.toBe("");
    }
  });

  it("no empty string values in ES redesign keys", () => {
    const esKeys = getKeys(esRedesign);
    for (const key of esKeys) {
      const parts = key.split(".");
      let value: unknown = esRedesign;
      for (const part of parts) {
        value = (value as NestedKeys)[part];
      }
      expect(value, `ES key redesign.${key} should not be empty`).not.toBe("");
    }
  });

  describe("redesign.header", () => {
    const expectedKeys = [
      "navServices",
      "navProcess",
      "navAbout",
      "navContact",
      "ctaLabel",
      "logoAlt",
      "languageSwitchLabel",
      "menuLabel",
      "closeMenuLabel",
      "socialGithubLabel",
      "socialLinkedinLabel",
      "socialInstagramLabel",
    ];

    it.each(expectedKeys)("has header key '%s' in both languages", (key) => {
      const enHeader = enRedesign.header as NestedKeys;
      const esHeader = esRedesign.header as NestedKeys;
      expect(enHeader[key], `EN redesign.header.${key}`).toBeDefined();
      expect(esHeader[key], `ES redesign.header.${key}`).toBeDefined();
    });
  });

  describe("redesign.hero", () => {
    const expectedKeys = [
      "microLabel",
      "headline",
      "subheadline",
      "ctaPrimary",
      "ctaSecondary",
      "trustProjects",
      "trustSatisfaction",
      "trustMarkets",
    ];

    it.each(expectedKeys)("has hero key '%s' in both languages", (key) => {
      const enHero = enRedesign.hero as NestedKeys;
      const esHero = esRedesign.hero as NestedKeys;
      expect(enHero[key], `EN redesign.hero.${key}`).toBeDefined();
      expect(esHero[key], `ES redesign.hero.${key}`).toBeDefined();
    });
  });

  describe("redesign.process", () => {
    const expectedKeys = [
      "sectionLabel",
      "heading",
      "subheading",
      "step1Title",
      "step1Description",
      "step2Title",
      "step2Description",
      "step3Title",
      "step3Description",
      "step4Title",
      "step4Description",
    ];

    it.each(expectedKeys)("has process key '%s' in both languages", (key) => {
      const enProcess = enRedesign.process as NestedKeys;
      const esProcess = esRedesign.process as NestedKeys;
      expect(enProcess[key], `EN redesign.process.${key}`).toBeDefined();
      expect(esProcess[key], `ES redesign.process.${key}`).toBeDefined();
    });
  });

  describe("redesign.finalCta", () => {
    const expectedKeys = ["heading", "subheading", "ctaPrimary", "ctaSecondary", "note"];

    it.each(expectedKeys)("has finalCta key '%s' in both languages", (key) => {
      const enCta = enRedesign.finalCta as NestedKeys;
      const esCta = esRedesign.finalCta as NestedKeys;
      expect(enCta[key], `EN redesign.finalCta.${key}`).toBeDefined();
      expect(esCta[key], `ES redesign.finalCta.${key}`).toBeDefined();
    });
  });

  describe("redesign.footer", () => {
    const expectedKeys = [
      "brandStatement",
      "brandParagraph",
      "trustLabel",
      "trustBilingual",
      "trustDelivery",
      "trustCode",
      "trustMarkets",
      "socialLabel",
      "copyright",
    ];

    it.each(expectedKeys)("has footer key '%s' in both languages", (key) => {
      const enFooter = enRedesign.footer as NestedKeys;
      const esFooter = esRedesign.footer as NestedKeys;
      expect(enFooter[key], `EN redesign.footer.${key}`).toBeDefined();
      expect(esFooter[key], `ES redesign.footer.${key}`).toBeDefined();
    });
  });
});
