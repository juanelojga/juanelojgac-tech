// @vitest-environment node
import { describe, expect, it } from "vitest";

import type {
  FinalCTAProps,
  HeroSectionProps,
  HeroVisualProps,
  MobileMenuProps,
  NavLink,
  ProcessStepProps,
  RedesignedFooterProps,
  RedesignedHeaderProps,
  SocialIconsProps,
  SocialLink,
  TrustMetric,
  TrustMetricsProps,
} from "../types";

describe("Redesign TypeScript interfaces", () => {
  describe("RedesignedHeaderProps", () => {
    it("accepts valid lang values", () => {
      const enProps: RedesignedHeaderProps = { lang: "en" };
      const esProps: RedesignedHeaderProps = { lang: "es" };
      expect(enProps.lang).toBe("en");
      expect(esProps.lang).toBe("es");
    });
  });

  describe("HeroSectionProps", () => {
    it("accepts valid lang values", () => {
      const props: HeroSectionProps = { lang: "en" };
      expect(props.lang).toBe("en");
    });
  });

  describe("HeroVisualProps", () => {
    it("accepts optional className", () => {
      const withClass: HeroVisualProps = { className: "custom-class" };
      const withoutClass: HeroVisualProps = {};
      expect(withClass.className).toBe("custom-class");
      expect(withoutClass.className).toBeUndefined();
    });
  });

  describe("TrustMetric", () => {
    it("requires value and label", () => {
      const metric: TrustMetric = { value: "50+", label: "Projects Delivered" };
      expect(metric.value).toBe("50+");
      expect(metric.label).toBe("Projects Delivered");
      expect(metric.numericValue).toBeUndefined();
    });

    it("accepts optional numericValue", () => {
      const metric: TrustMetric = { value: "98%", label: "Satisfaction", numericValue: 98 };
      expect(metric.numericValue).toBe(98);
    });
  });

  describe("TrustMetricsProps", () => {
    it("accepts array of TrustMetric", () => {
      const props: TrustMetricsProps = {
        metrics: [
          { value: "50+", label: "Projects", numericValue: 50 },
          { value: "98%", label: "Satisfaction", numericValue: 98 },
        ],
      };
      expect(props.metrics).toHaveLength(2);
    });
  });

  describe("ProcessStepProps", () => {
    it("accepts step number, icon, title, and description", () => {
      const props: ProcessStepProps = {
        step: 1,
        icon: "<svg/>",
        title: "Discover",
        description: "We start by understanding your goals.",
      };
      expect(props.step).toBe(1);
    });
  });

  describe("FinalCTAProps", () => {
    it("accepts valid lang values", () => {
      const props: FinalCTAProps = { lang: "es" };
      expect(props.lang).toBe("es");
    });
  });

  describe("RedesignedFooterProps", () => {
    it("accepts valid lang values", () => {
      const props: RedesignedFooterProps = { lang: "en" };
      expect(props.lang).toBe("en");
    });
  });

  describe("SocialLink", () => {
    it("contains platform, url, ariaLabel, and icon", () => {
      const link: SocialLink = {
        platform: "GitHub",
        url: "https://github.com/juanelojga",
        ariaLabel: "GitHub",
        icon: "<svg/>",
      };
      expect(link.platform).toBe("GitHub");
      expect(link.url).toContain("github.com");
    });
  });

  describe("SocialIconsProps", () => {
    it("accepts links array and optional className", () => {
      const props: SocialIconsProps = {
        links: [
          { platform: "GitHub", url: "https://github.com", ariaLabel: "GitHub", icon: "<svg/>" },
        ],
        className: "flex gap-4",
      };
      expect(props.links).toHaveLength(1);
      expect(props.className).toBe("flex gap-4");
    });

    it("works without className", () => {
      const props: SocialIconsProps = {
        links: [],
      };
      expect(props.className).toBeUndefined();
    });
  });

  describe("NavLink", () => {
    it("contains label and href", () => {
      const link: NavLink = { label: "Services", href: "#services" };
      expect(link.label).toBe("Services");
      expect(link.href).toBe("#services");
    });
  });

  describe("MobileMenuProps", () => {
    it("accepts all required fields", () => {
      const props: MobileMenuProps = {
        lang: "en",
        navLinks: [{ label: "Services", href: "#services" }],
        ctaLabel: "Book a Consultation",
        menuLabel: "Menu",
        closeMenuLabel: "Close menu",
        socialGithubLabel: "GitHub",
        socialLinkedinLabel: "LinkedIn",
        socialInstagramLabel: "Instagram",
        languageSwitchLabel: "Language",
        enUrl: "/",
        esUrl: "/es",
        currentLang: "en",
      };
      expect(props.navLinks).toHaveLength(1);
      expect(props.lang).toBe("en");
      expect(props.ctaLabel).toBe("Book a Consultation");
    });

    it("accepts ES language variant", () => {
      const props: MobileMenuProps = {
        lang: "es",
        navLinks: [{ label: "Servicios", href: "#services" }],
        ctaLabel: "Agendar Consulta",
        menuLabel: "Menú",
        closeMenuLabel: "Cerrar menú",
        socialGithubLabel: "GitHub",
        socialLinkedinLabel: "LinkedIn",
        socialInstagramLabel: "Instagram",
        languageSwitchLabel: "Idioma",
        enUrl: "/",
        esUrl: "/es",
        currentLang: "es",
      };
      expect(props.lang).toBe("es");
      expect(props.currentLang).toBe("es");
    });
  });
});
