// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import RedesignedFooter from "../RedesignedFooter.astro";

describe("RedesignedFooter", () => {
  describe("English (EN)", () => {
    it("renders the footer element", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("<footer");
    });

    it("renders the brand statement", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("AI-powered solutions for modern businesses");
    });

    it("renders the brand paragraph", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("We help startups and SMEs");
    });

    it("renders trust notes", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("Fully bilingual");
      expect(result).toContain("Typical delivery");
      expect(result).toContain("Clean code approach");
      expect(result).toContain("US &amp; LATAM clients");
    });

    it("renders social links with security attributes", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain("github.com/juanelojga");
      expect(result).toContain("linkedin.com/company/juanelojgac-tech-llc");
      expect(result).toContain("instagram.com/juanelojgactech1");
    });

    it("renders social links with aria-labels", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain('aria-label="GitHub"');
      expect(result).toContain('aria-label="LinkedIn"');
      expect(result).toContain('aria-label="Instagram"');
    });

    it("renders the copyright text", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("© 2026 JuaneloJGAC Tech. All rights reserved.");
    });

    it("renders column headings", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("Why Work With Us");
      expect(result).toContain("Social");
    });

    it("renders the logo", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });
      expect(result).toContain("/assets/logo/logo.png");
    });
  });

  describe("Spanish (ES)", () => {
    it("renders Spanish brand statement", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "es" },
      });
      expect(result).toContain("Soluciones potenciadas con IA para empresas modernas");
    });

    it("renders Spanish trust notes", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "es" },
      });
      expect(result).toContain("Totalmente bilingüe");
      expect(result).toContain("Entrega típica");
      expect(result).toContain("Enfoque de código limpio");
    });

    it("renders Spanish column headings", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "es" },
      });
      expect(result).toContain("Por Qué Trabajar Con Nosotros");
    });

    it("renders Spanish copyright", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "es" },
      });
      expect(result).toContain("© 2026 JuaneloJGAC Tech. Todos los derechos reservados.");
    });

    it("links to /es home from ES footer", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(RedesignedFooter, {
        props: { lang: "es" },
      });
      expect(result).toContain('href="/es"');
    });
  });
});
