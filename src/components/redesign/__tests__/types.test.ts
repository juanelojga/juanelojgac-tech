// @vitest-environment node
import { describe, expect, it } from "vitest";

import type {
  FinalCTAProps,
  HeroSectionProps,
  HeroVisualProps,
  ProcessStepProps,
  RedesignedFooterProps,
  RedesignedHeaderProps,
  ServiceCardData,
  ServiceCardProps,
  ServicesPreviewProps,
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

  describe("ServiceCardData", () => {
    it("contains icon, title, and description", () => {
      const card: ServiceCardData = {
        icon: "<svg>...</svg>",
        title: "Web Development",
        description: "Modern platforms built for scale.",
      };
      expect(card.icon).toBeDefined();
      expect(card.title).toBe("Web Development");
      expect(card.description).toBeDefined();
    });
  });

  describe("ServiceCardProps", () => {
    it("extends card data with index", () => {
      const props: ServiceCardProps = {
        icon: "<svg>...</svg>",
        title: "AI Integration",
        description: "Turn AI into a practical advantage.",
        index: 2,
      };
      expect(props.index).toBe(2);
    });
  });

  describe("ServicesPreviewProps", () => {
    it("accepts services array and section text", () => {
      const props: ServicesPreviewProps = {
        services: [{ icon: "<svg/>", title: "Test", description: "Desc" }],
        sectionLabel: "Services",
        heading: "Solutions",
        subheading: "Practical solutions",
      };
      expect(props.services).toHaveLength(1);
      expect(props.sectionLabel).toBe("Services");
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
});
