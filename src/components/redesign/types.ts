import type { Language } from "../../lib/i18n";

/** Props for the redesigned site header with nav, social icons, language switch, and CTA */
export interface RedesignedHeaderProps {
  lang: Language;
}

/** Props for the hero section wrapper (Astro component) */
export interface HeroSectionProps {
  lang: Language;
}

/** Props for the animated hero visual (React island — floating mockup + glass cards + orbs) */
export interface HeroVisualProps {
  /** Optional CSS class for the container */
  className?: string;
}

/** A single trust metric displayed in the hero */
export interface TrustMetric {
  /** Display value (e.g., "50+", "98%") */
  value: string;
  /** Descriptive label (e.g., "Projects Delivered") */
  label: string;
  /** Numeric value for count-up animation (e.g., 50, 98) */
  numericValue?: number;
}

/** Props for the trust metrics React island with count-up animation */
export interface TrustMetricsProps {
  metrics: TrustMetric[];
}

/** Props for a single process step */
export interface ProcessStepProps {
  /** Step number (1-4) */
  step: number;
  /** SVG icon markup */
  icon: string;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
}

/** Props for the final CTA section (Astro component) */
export interface FinalCTAProps {
  lang: Language;
}

/** Props for the redesigned footer (Astro component) */
export interface RedesignedFooterProps {
  lang: Language;
}

/** Social link data for header and footer */
export interface SocialLink {
  /** Platform name (e.g., "GitHub") */
  platform: string;
  /** URL to the social profile */
  url: string;
  /** Accessible label */
  ariaLabel: string;
  /** SVG icon markup */
  icon: string;
}

/** Props for the social icons component (React island for hover glow) */
export interface SocialIconsProps {
  links: SocialLink[];
  /** Optional CSS class for the container */
  className?: string;
}

/** Navigation link data */
export interface NavLink {
  label: string;
  href: string;
  action?: string;
}

/** Props for the mobile menu React island */
export interface MobileMenuProps {
  lang: "en" | "es";
  navLinks: NavLink[];
  ctaLabel: string;
  menuLabel: string;
  closeMenuLabel: string;
  socialGithubLabel: string;
  socialLinkedinLabel: string;
  socialInstagramLabel: string;
  languageSwitchLabel: string;
  enUrl: string;
  esUrl: string;
  currentLang: "en" | "es";
}
