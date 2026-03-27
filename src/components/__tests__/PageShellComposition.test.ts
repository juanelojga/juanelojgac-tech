// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

import ConsultantFooter from "../ConsultantFooter.astro";
import ConsultantHeader from "../ConsultantHeader.astro";
import ConsultantHero from "../ConsultantHero.astro";
import RedesignedFooter from "../redesign/RedesignedFooter.astro";

describe("Page Shell Composition", () => {
  describe("legacy components (still compile)", () => {
    it("header renders before hero in EN", async () => {
      const container = await AstroContainer.create();
      const headerHtml = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });
      const heroHtml = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      expect(headerHtml).toContain("<header");
      expect(heroHtml).toContain("<section");
    });

    it("all three legacy components render in ES", async () => {
      const container = await AstroContainer.create();
      const headerHtml = await container.renderToString(ConsultantHeader, {
        props: { lang: "es" },
      });
      const heroHtml = await container.renderToString(ConsultantHero, {
        props: { lang: "es" },
      });
      const footerHtml = await container.renderToString(ConsultantFooter, {
        props: { lang: "es" },
      });

      expect(headerHtml).toContain("Logo de JuaneloJGAC Tech");
      expect(heroHtml).toContain("Consultoría con IA para Tu Negocio");
      expect(footerHtml).toContain("Todos los derechos reservados");
    });

    it("footer renders with the correct structure", async () => {
      const container = await AstroContainer.create();
      const footerHtml = await container.renderToString(ConsultantFooter, {
        props: { lang: "en" },
      });

      expect(footerHtml).toContain("<footer");
      expect(footerHtml).toContain("<nav");
    });
  });

  describe("redesigned page composition", () => {
    const pagesDir = resolve(__dirname, "../../pages");

    it("index.astro imports redesigned components", () => {
      const indexSource = readFileSync(resolve(pagesDir, "index.astro"), "utf-8");

      expect(indexSource).toContain("RedesignedHeader");
      expect(indexSource).toContain("HeroSection");
      expect(indexSource).toContain("ServicesPreview");
      expect(indexSource).toContain("RedesignedFooter");
    });

    it("es.astro imports redesigned components", () => {
      const esSource = readFileSync(resolve(pagesDir, "es.astro"), "utf-8");

      expect(esSource).toContain("RedesignedHeader");
      expect(esSource).toContain("HeroSection");
      expect(esSource).toContain("ServicesPreview");
      expect(esSource).toContain("RedesignedFooter");
    });

    it("index.astro passes lang='en' to all components", () => {
      const indexSource = readFileSync(resolve(pagesDir, "index.astro"), "utf-8");

      expect(indexSource).toContain('<RedesignedHeader lang="en"');
      expect(indexSource).toContain('<HeroSection lang="en"');
      expect(indexSource).toContain('<ServicesPreview lang="en"');
      expect(indexSource).toContain('<RedesignedFooter lang="en"');
    });

    it("es.astro passes lang='es' to all components", () => {
      const esSource = readFileSync(resolve(pagesDir, "es.astro"), "utf-8");

      expect(esSource).toContain('<RedesignedHeader lang="es"');
      expect(esSource).toContain('<HeroSection lang="es"');
      expect(esSource).toContain('<ServicesPreview lang="es"');
      expect(esSource).toContain('<RedesignedFooter lang="es"');
    });

    it("RedesignedFooter renders EN content", async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(RedesignedFooter, {
        props: { lang: "en" },
      });

      expect(html).toContain("<footer");
      expect(html).toContain("AI-powered solutions for modern businesses");
      expect(html).toContain("Navigation");
      expect(html).toContain("Why Work With Us");
      expect(html).toContain("© 2026 JuaneloJGAC Tech. All rights reserved.");
    });

    it("RedesignedFooter renders ES content", async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(RedesignedFooter, {
        props: { lang: "es" },
      });

      expect(html).toContain("<footer");
      expect(html).toContain("Soluciones potenciadas con IA para empresas modernas");
      expect(html).toContain("Navegación");
      expect(html).toContain("Por Qué Trabajar Con Nosotros");
      expect(html).toContain("© 2026 JuaneloJGAC Tech. Todos los derechos reservados.");
    });
  });
});
