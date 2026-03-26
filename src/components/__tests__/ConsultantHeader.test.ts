// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import ConsultantHeader from "../ConsultantHeader.astro";

describe("ConsultantHeader", () => {
  // ── English rendering ──
  describe("English (EN)", () => {
    it("renders the logo image with correct alt text", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      expect(result).toContain('alt="JuaneloJGAC Tech logo"');
      expect(result).toContain("/assets/logo/logo.png");
    });

    it("renders the language switch with ES link", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      expect(result).toContain('href="/es"');
      expect(result).toContain("ES");
    });

    it("highlights the current language (EN)", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      // Current language should be indicated via aria-current
      expect(result).toContain('aria-current="page"');
      // EN should appear as current
      expect(result).toMatch(/aria-current="page"[^>]*>.*EN/s);
    });

    it("has sticky positioning", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      expect(result).toContain("sticky");
      expect(result).toContain("top-0");
    });

    it("contains an accessible header landmark", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      expect(result).toContain("<header");
    });

    it("has a skip-to-consultant link target (navigation element)", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      expect(result).toContain("<nav");
    });
  });

  // ── Spanish rendering ──
  describe("Spanish (ES)", () => {
    it("renders the logo with Spanish alt text", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "es" },
      });

      expect(result).toContain('alt="Logo de JuaneloJGAC Tech"');
    });

    it("renders the language switch with EN link", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "es" },
      });

      expect(result).toContain('href="/"');
      expect(result).toContain("EN");
    });

    it("highlights the current language (ES)", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "es" },
      });

      expect(result).toContain('aria-current="page"');
    });

    it("renders the language switch label in Spanish", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "es" },
      });

      expect(result).toContain("Idioma");
    });
  });

  // ── Responsive / accessibility ──
  describe("responsive and accessibility", () => {
    it("renders with z-index for sticky stacking context", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      expect(result).toContain("z-");
    });

    it("logo links to the current language home page", async () => {
      const container = await AstroContainer.create();
      const enResult = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });

      // Logo should link to home
      expect(enResult).toContain('href="/"');
    });
  });
});
