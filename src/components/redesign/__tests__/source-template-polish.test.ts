// @vitest-environment node
/**
 * Phase 7 — Source Template Polish Tests
 *
 * These tests verify animation/responsive polish applied to Astro components
 * by reading their source templates (since AstroContainer can't hydrate React islands).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const heroSource = readFileSync(resolve(__dirname, "../HeroSection.astro"), "utf-8");
const headerSource = readFileSync(resolve(__dirname, "../RedesignedHeader.astro"), "utf-8");
const footerSource = readFileSync(resolve(__dirname, "../RedesignedFooter.astro"), "utf-8");
const tailwindSource = readFileSync(resolve(__dirname, "../../../styles/tailwind.css"), "utf-8");

describe("Phase 7: Source Template Polish", () => {
  describe("prefers-reduced-motion — global CSS", () => {
    it("has prefers-reduced-motion media query", () => {
      expect(tailwindSource).toContain("prefers-reduced-motion: reduce");
    });

    it("resets animation-duration in reduced motion", () => {
      expect(tailwindSource).toContain("animation-duration: 0.01ms !important");
    });

    it("resets animation-delay in reduced motion", () => {
      expect(tailwindSource).toContain("animation-delay: 0ms !important");
    });

    it("resets animation-iteration-count in reduced motion", () => {
      expect(tailwindSource).toContain("animation-iteration-count: 1 !important");
    });

    it("resets transition-duration in reduced motion", () => {
      expect(tailwindSource).toContain("transition-duration: 0.01ms !important");
    });
  });

  describe("HeroSection — reduced motion safety", () => {
    it("uses motion-safe:opacity-0 instead of bare opacity-0 for animated elements", () => {
      // Should use motion-safe:opacity-0 so elements are visible when motion is reduced
      expect(heroSource).toContain("motion-safe:opacity-0");
      // Should not have bare opacity-0 (without motion-safe prefix) on animated elements
      // Count occurrences: motion-safe:opacity-0 should be the only opacity-0 pattern
      const bareOpacity0 = heroSource.match(/(?<!motion-safe:)opacity-0/g);
      expect(bareOpacity0).toBeNull();
    });

    it("has staggered animation delays in 100ms intervals", () => {
      expect(heroSource).toContain("animation-delay: 0ms");
      expect(heroSource).toContain("animation-delay: 100ms");
      expect(heroSource).toContain("animation-delay: 200ms");
      expect(heroSource).toContain("animation-delay: 300ms");
      expect(heroSource).toContain("animation-delay: 400ms");
    });

    it("uses responsive headline sizing with text-3xl base", () => {
      expect(heroSource).toContain("text-3xl");
      expect(heroSource).toContain("sm:text-4xl");
      expect(heroSource).toContain("md:text-5xl");
      expect(heroSource).toContain("lg:text-6xl");
      expect(heroSource).toContain("xl:text-7xl");
    });
  });

  describe("RedesignedHeader — reduced motion", () => {
    it("has motion-reduce:transition-none on the header element", () => {
      expect(headerSource).toContain("motion-reduce:transition-none");
    });

    it("uses fixed positioning for sticky header", () => {
      expect(headerSource).toContain("fixed");
    });
  });

  describe("RedesignedFooter — responsive polish", () => {
    it("centers social section on mobile", () => {
      expect(footerSource).toContain("text-center");
      expect(footerSource).toContain("sm:text-left");
    });

    it("centers social icons on mobile, left-aligns on sm:", () => {
      expect(footerSource).toContain("justify-center");
      expect(footerSource).toContain("sm:justify-start");
    });

    it("social icons meet 44px touch target", () => {
      expect(footerSource).toContain("min-h-[44px]");
      expect(footerSource).toContain("min-w-[44px]");
    });
  });
});
