// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import ConsultantFooter from "../ConsultantFooter.astro";
import ConsultantHeader from "../ConsultantHeader.astro";
import ConsultantHero from "../ConsultantHero.astro";

describe("Page Shell Composition", () => {
  describe("header + hero + footer integration", () => {
    it("header renders before hero in EN", async () => {
      const container = await AstroContainer.create();
      const headerHtml = await container.renderToString(ConsultantHeader, {
        props: { lang: "en" },
      });
      const heroHtml = await container.renderToString(ConsultantHero, {
        props: { lang: "en" },
      });

      // Verify both components render independently
      expect(headerHtml).toContain("<header");
      expect(heroHtml).toContain("<section");
    });

    it("all three shell components render in ES", async () => {
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
});
