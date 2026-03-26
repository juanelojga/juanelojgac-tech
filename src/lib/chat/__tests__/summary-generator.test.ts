import { beforeEach, describe, expect, it } from "vitest";

import { StaticContentProvider } from "../content/static-content-provider";
import { SummaryGeneratorImpl } from "../summary-generator";
import type { ContentProvider } from "../types";
import { createLeadAttributes } from "./factories";

describe("SummaryGeneratorImpl", () => {
  let contentProvider: ContentProvider;
  let generator: SummaryGeneratorImpl;

  beforeEach(() => {
    contentProvider = new StaticContentProvider();
    generator = new SummaryGeneratorImpl(contentProvider);
  });

  // ──────────────────────────────────────────────
  // Summary generation
  // ──────────────────────────────────────────────

  describe("generateSummary", () => {
    it("generates a summary with all required fields", () => {
      const leadAttributes = createLeadAttributes({
        projectType: "web-platform",
        targetUsers: "Small business owners",
        goals: "Increase online sales",
        timeline: "short-term",
        budgetRange: "growth",
      });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.id).toBeTruthy();
      expect(summary.leadAttributes).toEqual(leadAttributes);
      expect(summary.recommendedSolution).toBeDefined();
      expect(summary.recommendedSolution.type).toBeTruthy();
      expect(summary.recommendedSolution.description).toBeTruthy();
      expect(summary.timeline).toBeDefined();
      expect(summary.timeline.minWeeks).toBeGreaterThanOrEqual(0);
      expect(summary.timeline.maxWeeks).toBeGreaterThanOrEqual(summary.timeline.minWeeks);
      expect(summary.priceRange).toBeDefined();
      expect(summary.priceRange.minUSD).toBeGreaterThanOrEqual(0);
      expect(summary.priceRange.maxUSD).toBeGreaterThanOrEqual(summary.priceRange.minUSD);
      expect(summary.nextSteps.length).toBeGreaterThan(0);
      expect(summary.generatedAt).toBeGreaterThan(0);
      expect(summary.language).toBe("en");
    });

    it("generates a summary in Spanish", () => {
      const leadAttributes = createLeadAttributes({
        projectType: "ai-integration",
        goals: "Automate support",
        timeline: "short-term",
      });
      const summary = generator.generateSummary(leadAttributes, "es");
      expect(summary.language).toBe("es");
      expect(summary.nextSteps.length).toBeGreaterThan(0);
    });

    it("matches solution to web-platform project type", () => {
      const leadAttributes = createLeadAttributes({ projectType: "web-platform" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.recommendedSolution.type.toLowerCase()).toMatch(/web|platform|development/);
    });

    it("matches solution to ai-integration project type", () => {
      const leadAttributes = createLeadAttributes({ projectType: "ai-integration" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.recommendedSolution.type.toLowerCase()).toMatch(/ai|integration/);
    });

    it("matches solution to automation project type", () => {
      const leadAttributes = createLeadAttributes({ projectType: "automation" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.recommendedSolution.type.toLowerCase()).toMatch(/automat|workflow/);
    });

    it("matches solution to consulting project type", () => {
      const leadAttributes = createLeadAttributes({ projectType: "consulting" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.recommendedSolution.type.toLowerCase()).toMatch(/consult/);
    });

    it("handles custom project type", () => {
      const leadAttributes = createLeadAttributes({ projectType: "custom" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.recommendedSolution.type).toBeTruthy();
    });
  });

  // ──────────────────────────────────────────────
  // Timeline and pricing from service data
  // ──────────────────────────────────────────────

  describe("timeline and pricing from service data", () => {
    it("uses service-specific timeline for web-platform", () => {
      const leadAttributes = createLeadAttributes({ projectType: "web-platform" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.timeline.minWeeks).toBeGreaterThan(0);
      expect(summary.timeline.maxWeeks).toBeGreaterThan(summary.timeline.minWeeks);
    });

    it("uses service-specific pricing for automation", () => {
      const leadAttributes = createLeadAttributes({ projectType: "automation" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.priceRange.minUSD).toBeGreaterThan(0);
      expect(summary.priceRange.maxUSD).toBeGreaterThan(summary.priceRange.minUSD);
    });

    it("includes pricing description", () => {
      const leadAttributes = createLeadAttributes({ projectType: "web-platform" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.priceRange.description).toBeTruthy();
    });

    it("includes timeline description", () => {
      const leadAttributes = createLeadAttributes({ projectType: "web-platform" });
      const summary = generator.generateSummary(leadAttributes, "en");
      expect(summary.timeline.description).toBeTruthy();
    });
  });

  // ──────────────────────────────────────────────
  // Next steps
  // ──────────────────────────────────────────────

  describe("next steps", () => {
    it("includes booking CTA in next steps", () => {
      const leadAttributes = createLeadAttributes();
      const summary = generator.generateSummary(leadAttributes, "en");
      const hasBooking = summary.nextSteps.some((s) => s.toLowerCase().match(/book|consult|call/));
      expect(hasBooking).toBe(true);
    });

    it("includes next steps in Spanish for ES summaries", () => {
      const leadAttributes = createLeadAttributes();
      const summary = generator.generateSummary(leadAttributes, "es");
      expect(summary.nextSteps.length).toBeGreaterThan(0);
      // Spanish next steps should not be English
      const hasSpanishContent = summary.nextSteps.some((s: string) =>
        /reserv|consult|propuesta|revis/i.test(s)
      );
      expect(hasSpanishContent).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // canGenerateSummary
  // ──────────────────────────────────────────────

  describe("canGenerateSummary", () => {
    it("returns true when minimum attributes are present", () => {
      const attrs = {
        projectType: "web-platform" as const,
        goals: "Increase sales",
        timeline: "short-term" as const,
      };
      expect(generator.canGenerateSummary(attrs)).toBe(true);
    });

    it("returns false when projectType is missing", () => {
      const attrs = {
        goals: "Increase sales",
        timeline: "short-term" as const,
      };
      expect(generator.canGenerateSummary(attrs)).toBe(false);
    });

    it("returns false when goals is missing", () => {
      const attrs = {
        projectType: "web-platform" as const,
        timeline: "short-term" as const,
      };
      expect(generator.canGenerateSummary(attrs)).toBe(false);
    });

    it("returns false when timeline is missing", () => {
      const attrs = {
        projectType: "web-platform" as const,
        goals: "Increase sales",
      };
      expect(generator.canGenerateSummary(attrs)).toBe(false);
    });

    it("returns false for empty attributes", () => {
      expect(generator.canGenerateSummary({})).toBe(false);
    });

    it("returns true even without budget range", () => {
      const attrs = {
        projectType: "web-platform" as const,
        goals: "Increase sales",
        timeline: "short-term" as const,
      };
      expect(generator.canGenerateSummary(attrs)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────

  describe("edge cases", () => {
    it("generates unique IDs for different summaries", () => {
      const leadAttributes = createLeadAttributes();
      const summary1 = generator.generateSummary(leadAttributes, "en");
      const summary2 = generator.generateSummary(leadAttributes, "en");
      expect(summary1.id).not.toBe(summary2.id);
    });

    it("sets generatedAt to current timestamp", () => {
      const before = Date.now();
      const leadAttributes = createLeadAttributes();
      const summary = generator.generateSummary(leadAttributes, "en");
      const after = Date.now();
      expect(summary.generatedAt).toBeGreaterThanOrEqual(before);
      expect(summary.generatedAt).toBeLessThanOrEqual(after);
    });
  });
});
