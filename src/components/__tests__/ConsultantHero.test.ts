// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import ConsultantHero from "../ConsultantHero.astro";

describe("ConsultantHero", () => {
  // ── English rendering ──
  describe("English (EN)", () => {
    it("renders the headline", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain("AI-Powered Consulting for Your Business");
    });

    it("renders the subheadline", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain(
        "Get expert guidance on AI integration, automation, and digital transformation"
      );
    });

    it("renders the CTA label", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain("Start a Conversation");
    });

    it("uses Sora font for the headline", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain("font-sora");
    });
  });

  // ── Spanish rendering ──
  describe("Spanish (ES)", () => {
    it("renders the Spanish headline", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "es" },
      });

      expect(result).toContain("Consultoría con IA para Tu Negocio");
    });

    it("renders the Spanish subheadline", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "es" },
      });

      expect(result).toContain(
        "Obtén orientación experta en integración de IA, automatización y transformación digital"
      );
    });

    it("renders the Spanish CTA label", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "es" },
      });

      expect(result).toContain("Iniciar una Conversación");
    });
  });

  // ── Structure ──
  describe("structure", () => {
    it("renders a section element", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain("<section");
    });

    it("CTA links to the consultant section", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain('href="#consultant"');
    });

    it("uses compressed padding on mobile", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      // Mobile should use py-6 (reduced), scaling to sm:py-10 and lg:py-14
      expect(result).toContain("py-6");
      expect(result).toContain("sm:py-10");
    });

    it("CTA meets minimum touch target size", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(result).toContain("min-h-[44px]");
    });
  });
});
