// @vitest-environment node
/**
 * Tests for HeroSection.astro
 *
 * The hero embeds HeroVisual and TrustMetrics React islands (client:load),
 * which require the React renderer in AstroContainer. We verify the hero
 * structure by reading the source template and testing the i18n contract.
 *
 * React components are tested separately in their own test files.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import en from "../../../i18n/en.json";
import es from "../../../i18n/es.json";

const heroSource = readFileSync(resolve(__dirname, "../HeroSection.astro"), "utf-8");

describe("HeroSection", () => {
  describe("template structure", () => {
    it("uses a section element with hero-section id", () => {
      expect(heroSource).toContain("<section");
      expect(heroSource).toContain('id="hero-section"');
    });

    it("has dark gradient background", () => {
      expect(heroSource).toContain("bg-gradient-to-b");
      expect(heroSource).toContain("midnight");
    });

    it("has overflow hidden for orbs", () => {
      expect(heroSource).toContain("overflow-hidden");
    });

    it("contains background orbs layer", () => {
      expect(heroSource).toContain("orb");
      expect(heroSource).toContain("orb-cyan");
      expect(heroSource).toContain("orb-teal");
      expect(heroSource).toContain("orb-violet");
    });

    it("has a 2-column grid layout for desktop", () => {
      expect(heroSource).toContain("lg:grid-cols-2");
    });

    it("contains micro-label with accent styling", () => {
      expect(heroSource).toContain("tracking-");
      expect(heroSource).toContain("uppercase");
      expect(heroSource).toContain("accent-cyan");
    });

    it("contains h1 headline with Sora font", () => {
      expect(heroSource).toContain("<h1");
      expect(heroSource).toContain("font-sora");
    });

    it("uses large responsive headline sizes", () => {
      expect(heroSource).toContain("text-4xl");
      expect(heroSource).toContain("lg:text-6xl");
    });

    it("contains subheadline paragraph", () => {
      expect(heroSource).toContain("text-text-muted");
      expect(heroSource).toContain("max-w-xl");
    });

    it("has primary CTA with gradient styling", () => {
      expect(heroSource).toContain("from-accent-cyan");
      expect(heroSource).toContain("to-accent-teal");
    });

    it("has secondary CTA with ghost/border styling", () => {
      expect(heroSource).toContain("border");
      expect(heroSource).toContain("white/20");
    });

    it("imports and renders HeroVisual React island", () => {
      expect(heroSource).toContain("import HeroVisual");
      expect(heroSource).toContain("HeroVisual");
      expect(heroSource).toContain("client:load");
    });

    it("imports and renders TrustMetrics React island", () => {
      expect(heroSource).toContain("import TrustMetrics");
      expect(heroSource).toContain("TrustMetrics");
      expect(heroSource).toContain("client:load");
    });

    it("hides visual column on mobile", () => {
      expect(heroSource).toContain("hidden");
      expect(heroSource).toContain("lg:block");
    });

    it("uses staggered animation delays", () => {
      expect(heroSource).toContain("animation-delay");
    });

    it("uses semantic section with aria-label or role", () => {
      expect(heroSource).toContain("aria-label");
    });
  });

  describe("i18n — EN translations", () => {
    const t = en.redesign.hero;

    it("has all required EN hero translation keys", () => {
      expect(t.microLabel).toBe("AI Consulting for Modern Businesses");
      expect(t.headline).toBe("Build Smarter Products, Automations, and AI Experiences");
      expect(t.subheadline).toBeDefined();
      expect(t.ctaPrimary).toBe("Book a Free Consultation");
      expect(t.ctaSecondary).toBe("Explore Services");
    });

    it("has trust metric labels in EN", () => {
      expect(t.trustProjects).toBe("Projects Delivered");
      expect(t.trustSatisfaction).toBe("Client Satisfaction");
      expect(t.trustMarkets).toBe("US & LATAM Clients Served");
    });
  });

  describe("i18n — ES translations", () => {
    const t = es.redesign.hero;

    it("has all required ES hero translation keys", () => {
      expect(t.microLabel).toBe("Consultoría IA para Empresas Modernas");
      expect(t.headline).toBe(
        "Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes"
      );
      expect(t.subheadline).toBeDefined();
      expect(t.ctaPrimary).toBe("Agendar Consulta Gratis");
      expect(t.ctaSecondary).toBe("Explorar Servicios");
    });

    it("has trust metric labels in ES", () => {
      expect(t.trustProjects).toBe("Proyectos Entregados");
      expect(t.trustSatisfaction).toBe("Satisfacción del Cliente");
      expect(t.trustMarkets).toBe("Clientes en EE.UU. y LATAM");
    });
  });

  describe("i18n — key symmetry", () => {
    it("EN and ES hero keys match", () => {
      const enKeys = Object.keys(en.redesign.hero).sort();
      const esKeys = Object.keys(es.redesign.hero).sort();
      expect(enKeys).toEqual(esKeys);
    });
  });
});
