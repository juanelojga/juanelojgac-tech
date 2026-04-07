// @vitest-environment node
/**
 * Tests for RedesignedHeader.astro
 *
 * The header embeds a MobileMenu React island (client:load), which requires
 * the React renderer in AstroContainer. Since the react/server.js module uses
 * virtual Astro imports (astro:react:opts), we verify the header structure
 * by reading the source template and testing the i18n contract.
 *
 * The MobileMenu React component is tested separately in MobileMenu.test.tsx.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import en from "../../../i18n/en.json";
import es from "../../../i18n/es.json";

const headerSource = readFileSync(resolve(__dirname, "../RedesignedHeader.astro"), "utf-8");

describe("RedesignedHeader", () => {
  describe("template structure", () => {
    it("uses a header element with redesigned-header id", () => {
      expect(headerSource).toContain("<header");
      expect(headerSource).toContain('id="redesigned-header"');
    });

    it("has fixed positioning for sticky behavior", () => {
      expect(headerSource).toContain("fixed");
      expect(headerSource).toContain("top-0");
      expect(headerSource).toContain("z-50");
    });

    it("initializes with data-scrolled false", () => {
      expect(headerSource).toContain('data-scrolled="false"');
    });

    it("references the logo image", () => {
      expect(headerSource).toContain("/assets/logo/logo.png");
    });

    it("uses larger logo size (h-12/h-14)", () => {
      expect(headerSource).toContain("h-12");
      expect(headerSource).toContain("lg:h-14");
    });

    it("contains anchor-based nav links", () => {
      expect(headerSource).toContain("#services");
      expect(headerSource).toContain("#about");
      expect(headerSource).toContain("#contact");
    });

    it("renders social links with security attributes", () => {
      expect(headerSource).toContain('target="_blank"');
      expect(headerSource).toContain('rel="noopener noreferrer"');
    });

    it("links to social profiles", () => {
      expect(headerSource).toContain('import { SOCIAL_LINKS } from "../../lib/socialLinks"');
      expect(headerSource).toContain("href={SOCIAL_LINKS.github}");
      expect(headerSource).toContain("href={SOCIAL_LINKS.linkedin}");
      expect(headerSource).toContain("href={SOCIAL_LINKS.instagram}");
    });

    it("uses pill-style language switcher", () => {
      expect(headerSource).toContain("rounded-full");
      expect(headerSource).toContain("EN");
      expect(headerSource).toContain("ES");
    });

    it("has a CTA button with gradient styling", () => {
      expect(headerSource).toContain("from-accent-cyan");
      expect(headerSource).toContain("to-accent-teal");
    });

    it("includes aria-current for active language", () => {
      expect(headerSource).toContain("aria-current");
    });

    it("includes aria-labels for social links", () => {
      expect(headerSource).toContain("aria-label={t.socialGithubLabel}");
      expect(headerSource).toContain("aria-label={t.socialLinkedinLabel}");
      expect(headerSource).toContain("aria-label={t.socialInstagramLabel}");
    });

    it("imports MobileMenu React component", () => {
      expect(headerSource).toContain("import MobileMenu from");
      expect(headerSource).toContain("client:load");
    });
  });

  describe("scroll detection", () => {
    it("includes IntersectionObserver script", () => {
      expect(headerSource).toContain("IntersectionObserver");
    });

    it("observes the hero-section element", () => {
      expect(headerSource).toContain("hero-section");
    });

    it("toggles data-scrolled attribute", () => {
      expect(headerSource).toContain("data-scrolled");
      expect(headerSource).toContain("setAttribute");
    });

    it("has CSS for scrolled state with backdrop-blur", () => {
      expect(headerSource).toContain('data-scrolled="true"');
      expect(headerSource).toContain("backdrop-filter");
    });

    it("has CSS for unscrolled transparent state", () => {
      expect(headerSource).toContain('data-scrolled="false"');
      expect(headerSource).toContain("transparent");
    });
  });

  describe("i18n — EN translations", () => {
    const t = en.redesign.header;

    it("has all required EN header translation keys", () => {
      expect(t.navServices).toBe("Services");
      expect(t.navAbout).toBe("About");
      expect(t.navContact).toBe("Contact");
      expect(t.ctaLabel).toBe("Book a Consultation");
      expect(t.logoAlt).toBe("JuaneloJGAC Tech logo");
      expect(t.menuLabel).toBe("Menu");
      expect(t.closeMenuLabel).toBe("Close menu");
    });

    it("has social aria-label keys in EN", () => {
      expect(t.socialGithubLabel).toBe("GitHub");
      expect(t.socialLinkedinLabel).toBe("LinkedIn");
      expect(t.socialInstagramLabel).toBe("Instagram");
    });
  });

  describe("i18n — ES translations", () => {
    const t = es.redesign.header;

    it("has all required ES header translation keys", () => {
      expect(t.navServices).toBe("Servicios");
      expect(t.navAbout).toBe("Nosotros");
      expect(t.navContact).toBe("Contacto");
      expect(t.ctaLabel).toBe("Agendar Consulta");
      expect(t.logoAlt).toBe("Logo de JuaneloJGAC Tech");
      expect(t.menuLabel).toBe("Menú");
      expect(t.closeMenuLabel).toBe("Cerrar menú");
    });

    it("has social aria-label keys in ES", () => {
      expect(t.socialGithubLabel).toBe("GitHub");
      expect(t.socialLinkedinLabel).toBe("LinkedIn");
      expect(t.socialInstagramLabel).toBe("Instagram");
    });
  });

  describe("i18n — key symmetry", () => {
    it("EN and ES header keys match", () => {
      const enKeys = Object.keys(en.redesign.header).sort();
      const esKeys = Object.keys(es.redesign.header).sort();
      expect(enKeys).toEqual(esKeys);
    });
  });
});
