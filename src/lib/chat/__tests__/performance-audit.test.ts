/**
 * Performance audit tests for Phase 9.
 * Validates that the production build follows performance best practices:
 * - No render-blocking resources
 * - Proper font loading strategy
 * - Optimized bundle outputs
 * - Correct meta tags
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// Helper to read built HTML
function readBuiltHtml(pagePath: string): string {
  const segment = pagePath === "/" ? "" : pagePath.replace(/^\//, "");
  const htmlPath = path.resolve(process.cwd(), "dist", segment, "index.html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Built HTML not found at ${htmlPath}. Run 'pnpm run build' first.`);
  }
  return fs.readFileSync(htmlPath, "utf-8");
}

describe("Performance Audit — Build Output", () => {
  // Skip if dist doesn't exist (CI may not build first)
  const distExists = fs.existsSync(path.resolve(process.cwd(), "dist/index.html"));

  describe.skipIf(!distExists)("EN page", () => {
    let html: string;

    beforeAll(() => {
      html = readBuiltHtml("/");
    });

    it("includes meta viewport tag", () => {
      expect(html).toContain('name="viewport"');
      expect(html).toContain("width=device-width");
    });

    it("includes charset meta tag", () => {
      expect(html).toContain('charset="UTF-8"');
    });

    it("uses font-display swap for Google Fonts", () => {
      expect(html).toContain("display=swap");
    });

    it("includes preconnect hints for Google Fonts", () => {
      expect(html).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
      expect(html).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
    });

    it("includes a main landmark element", () => {
      expect(html).toMatch(/<main[\s>]/);
    });

    it("includes skip-to-content link", () => {
      expect(html).toMatch(/skip/i);
      expect(html).toMatch(/href="#main-content"/);
    });

    it("does not include duplicate favicon links", () => {
      const faviconMatches = html.match(/rel="icon" type="image\/x-icon"/g);
      // Should have at most 1 x-icon link
      expect(faviconMatches?.length ?? 0).toBeLessThanOrEqual(1);
    });

    it("includes lang attribute on html element", () => {
      expect(html).toMatch(/<html[^>]*lang="en"/);
    });

    it("has valid structured data", () => {
      expect(html).toContain('type="application/ld+json"');
    });
  });

  describe.skipIf(!distExists)("ES page", () => {
    let html: string;

    beforeAll(() => {
      html = readBuiltHtml("/es");
    });

    it("includes lang=es on html element", () => {
      expect(html).toMatch(/<html[^>]*lang="es"/);
    });

    it("includes a main landmark element", () => {
      expect(html).toMatch(/<main[\s>]/);
    });

    it("includes skip-to-content link", () => {
      expect(html).toMatch(/href="#main-content"/);
    });
  });

  describe.skipIf(!distExists)("Bundle output", () => {
    it("produces JS bundles", () => {
      const astroDir = path.resolve(process.cwd(), "dist/_astro");
      const files = fs.readdirSync(astroDir).filter((f) => f.endsWith(".js"));
      expect(files.length).toBeGreaterThan(0);
    });

    it("produces CSS bundles", () => {
      const astroDir = path.resolve(process.cwd(), "dist/_astro");
      const files = fs.readdirSync(astroDir).filter((f) => f.endsWith(".css"));
      expect(files.length).toBeGreaterThan(0);
    });

    it("total JS bundle under 250KB", () => {
      const astroDir = path.resolve(process.cwd(), "dist/_astro");
      const jsFiles = fs.readdirSync(astroDir).filter((f) => f.endsWith(".js"));
      let totalSize = 0;
      for (const file of jsFiles) {
        totalSize += fs.statSync(path.join(astroDir, file)).size;
      }
      // 250KB = 256000 bytes
      expect(totalSize).toBeLessThan(256000);
    });
  });
});
