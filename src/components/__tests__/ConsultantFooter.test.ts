// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import ConsultantFooter from "../ConsultantFooter.astro";

describe("ConsultantFooter", () => {
  // ── English rendering ──
  describe("English (EN)", () => {
    it("renders the copyright text", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      expect(result).toContain("© 2026 JuaneloJGAC Tech. All rights reserved.");
    });

    it("renders the contact link", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      expect(result).toContain("Contact Us");
      expect(result).toContain("hello@juanelojgac.tech");
    });

    it("renders the privacy link", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      expect(result).toContain("Privacy Policy");
    });
  });

  // ── Spanish rendering ──
  describe("Spanish (ES)", () => {
    it("renders the Spanish copyright text", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "es" },
      });

      expect(result).toContain("© 2026 JuaneloJGAC Tech. Todos los derechos reservados.");
    });

    it("renders the Spanish contact link", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "es" },
      });

      expect(result).toContain("Contáctanos");
    });

    it("renders the Spanish privacy link", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "es" },
      });

      expect(result).toContain("Política de Privacidad");
    });
  });

  // ── Structure ──
  describe("structure", () => {
    it("renders a footer element", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      expect(result).toContain("<footer");
    });

    it("has a mailto link for contact", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      expect(result).toContain("mailto:hello@juanelojgac.tech");
    });

    it("footer links have mobile touch target sizing", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      // Should have min-h-[44px] for mobile touch targets
      expect(result).toContain("min-h-[44px]");
    });
  });
});
