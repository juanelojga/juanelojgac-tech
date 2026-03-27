// @vitest-environment node
/**
 * Tests for ServicesPreview.astro
 *
 * The section embeds ServiceCard React islands (client:visible),
 * which require the React renderer in AstroContainer. We verify
 * the section structure by reading the source template and testing
 * the i18n contract.
 *
 * The ServiceCard React component is tested separately in ServiceCard.test.tsx.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import en from "../../../i18n/en.json";
import es from "../../../i18n/es.json";

const servicesSource = readFileSync(resolve(__dirname, "../ServicesPreview.astro"), "utf-8");

describe("ServicesPreview", () => {
  describe("template structure", () => {
    it("uses a section element with services id", () => {
      expect(servicesSource).toContain("<section");
      expect(servicesSource).toContain('id="services"');
    });

    it("uses dark background", () => {
      expect(servicesSource).toContain("midnight");
    });

    it("has generous vertical padding", () => {
      expect(servicesSource).toMatch(/py-\d+/);
      expect(servicesSource).toMatch(/lg:py-\d+/);
    });

    it("has a max-width container", () => {
      expect(servicesSource).toContain("max-w-7xl");
    });

    it("contains a section micro-label", () => {
      expect(servicesSource).toContain("uppercase");
      expect(servicesSource).toContain("tracking-");
      expect(servicesSource).toContain("accent-cyan");
    });

    it("contains a heading (h2)", () => {
      expect(servicesSource).toContain("<h2");
      expect(servicesSource).toContain("font-sora");
    });

    it("contains a subheading paragraph", () => {
      expect(servicesSource).toContain("text-muted");
    });

    it("has a responsive card grid", () => {
      expect(servicesSource).toContain("grid");
      expect(servicesSource).toContain("sm:grid-cols-2");
      expect(servicesSource).toContain("lg:grid-cols-5");
    });

    it("embeds ServiceCard React island", () => {
      expect(servicesSource).toContain("ServiceCard");
      expect(servicesSource).toContain("client:");
    });

    it("passes index prop to ServiceCard", () => {
      expect(servicesSource).toContain("index");
    });

    it("passes title and description from i18n", () => {
      expect(servicesSource).toContain("title");
      expect(servicesSource).toContain("description");
    });
  });

  describe("i18n contract", () => {
    it("has all required services keys in EN", () => {
      const s = en.redesign.services;
      expect(s.sectionLabel).toBeTruthy();
      expect(s.heading).toBeTruthy();
      expect(s.subheading).toBeTruthy();
      expect(s.card1Title).toBeTruthy();
      expect(s.card1Description).toBeTruthy();
      expect(s.card2Title).toBeTruthy();
      expect(s.card2Description).toBeTruthy();
      expect(s.card3Title).toBeTruthy();
      expect(s.card3Description).toBeTruthy();
      expect(s.card4Title).toBeTruthy();
      expect(s.card4Description).toBeTruthy();
      expect(s.card5Title).toBeTruthy();
      expect(s.card5Description).toBeTruthy();
    });

    it("has all required services keys in ES", () => {
      const s = es.redesign.services;
      expect(s.sectionLabel).toBeTruthy();
      expect(s.heading).toBeTruthy();
      expect(s.subheading).toBeTruthy();
      expect(s.card1Title).toBeTruthy();
      expect(s.card1Description).toBeTruthy();
      expect(s.card2Title).toBeTruthy();
      expect(s.card2Description).toBeTruthy();
      expect(s.card3Title).toBeTruthy();
      expect(s.card3Description).toBeTruthy();
      expect(s.card4Title).toBeTruthy();
      expect(s.card4Description).toBeTruthy();
      expect(s.card5Title).toBeTruthy();
      expect(s.card5Description).toBeTruthy();
    });

    it("has symmetric keys between EN and ES", () => {
      const enKeys = Object.keys(en.redesign.services).sort();
      const esKeys = Object.keys(es.redesign.services).sort();
      expect(enKeys).toEqual(esKeys);
    });
  });

  describe("references i18n translations", () => {
    it("imports translation files", () => {
      expect(servicesSource).toContain('from "../../i18n/en.json"');
      expect(servicesSource).toContain('from "../../i18n/es.json"');
    });

    it("uses redesign.services namespace", () => {
      expect(servicesSource).toContain("redesign");
      expect(servicesSource).toContain("services");
    });
  });

  describe("accessibility", () => {
    it("has an aria-label or aria-labelledby for the section", () => {
      expect(servicesSource).toMatch(/aria-label/);
    });
  });

  describe("service cards data", () => {
    it("defines 5 service cards", () => {
      // The template should reference all 5 cards
      expect(servicesSource).toContain("card1");
      expect(servicesSource).toContain("card2");
      expect(servicesSource).toContain("card3");
      expect(servicesSource).toContain("card4");
      expect(servicesSource).toContain("card5");
    });

    it("maps service data with icon identifiers", () => {
      // Should reference icon keys for each service
      expect(servicesSource).toMatch(/icon/i);
    });
  });
});
