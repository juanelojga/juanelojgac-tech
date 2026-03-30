/**
 * Accessibility audit tests for Phase 9.
 * Validates WCAG 2.1 AA compliance patterns in the HTML output:
 * - Landmark regions
 * - ARIA attributes
 * - Focus management
 * - Color contrast considerations
 * - Keyboard navigation patterns
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function readBuiltHtml(pagePath: string): string {
  const segment = pagePath === "/" ? "" : pagePath.replace(/^\//, "");
  const htmlPath = path.resolve(process.cwd(), "dist", segment, "index.html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Built HTML not found at ${htmlPath}. Run 'pnpm run build' first.`);
  }
  return fs.readFileSync(htmlPath, "utf-8");
}

describe("Accessibility Audit — WCAG 2.1 AA", () => {
  const distExists = fs.existsSync(path.resolve(process.cwd(), "dist/index.html"));

  describe.skipIf(!distExists)("Landmark regions", () => {
    let html: string;

    beforeAll(() => {
      html = readBuiltHtml("/");
    });

    it("has a <main> landmark", () => {
      expect(html).toMatch(/<main[\s>]/);
    });

    it("has navigation or aside landmarks", () => {
      // TrustPanel uses <aside>
      expect(html).toMatch(/<aside[\s>]/);
    });

    it("all interactive elements have accessible names", () => {
      // Buttons should have text content or aria-label
      const buttons = html.match(/<button[^>]*>/g) || [];
      for (const button of buttons) {
        const hasAriaLabel = button.includes("aria-label");
        const hasContent = !button.includes("/>"); // self-closing = no content
        expect(hasAriaLabel || hasContent).toBe(true);
      }
    });

    it("form inputs have labels", () => {
      // Textarea should have aria-label
      const textareas = html.match(/<textarea[^>]*>/g) || [];
      for (const textarea of textareas) {
        expect(textarea).toMatch(/aria-label/);
      }
    });

    it("images and decorative SVGs have appropriate attributes", () => {
      // SVGs used as decorative should have aria-hidden
      const svgs = html.match(/<svg[^>]*>/g) || [];
      for (const svg of svgs) {
        const hasAriaHidden = svg.includes('aria-hidden="true"');
        const hasRole = svg.includes("role=");
        const hasAriaLabel = svg.includes("aria-label");
        // Decorative SVGs should be hidden, functional ones should have a label
        expect(hasAriaHidden || hasRole || hasAriaLabel).toBe(true);
      }
    });
  });

  describe.skipIf(!distExists)("ARIA attributes", () => {
    let html: string;

    beforeAll(() => {
      html = readBuiltHtml("/");
    });

    it("chat region has aria-label", () => {
      expect(html).toMatch(/role="region"[^>]*aria-label/);
    });

    it("message list has aria-live for dynamic content (client-rendered React island)", () => {
      // aria-live="polite" is in the React ChatContainer component which renders client-side only.
      // Verify the attribute exists in the source rather than built HTML.
      const source = fs.readFileSync(
        path.resolve(process.cwd(), "src/components/react/chat/ChatContainer.tsx"),
        "utf-8",
      );
      expect(source).toContain('aria-live="polite"');
    });

    it("message list has role=log (client-rendered React island)", () => {
      // role="log" is in the React ChatContainer component which renders client-side only.
      const source = fs.readFileSync(
        path.resolve(process.cwd(), "src/components/react/chat/ChatContainer.tsx"),
        "utf-8",
      );
      expect(source).toContain('role="log"');
    });

    it("expandable panel has aria-expanded", () => {
      expect(html).toMatch(/aria-expanded/);
    });
  });

  describe.skipIf(!distExists)("Keyboard navigation", () => {
    let html: string;

    beforeAll(() => {
      html = readBuiltHtml("/");
    });

    it("interactive elements use button or anchor tags", () => {
      // Click handlers should be on buttons, not divs
      const clickDivs = html.match(/<div[^>]*onClick/g) || [];
      expect(clickDivs.length).toBe(0);
    });

    it("links with target=_blank have rel=noopener", () => {
      const externalLinks = html.match(/<a[^>]*target="_blank"[^>]*>/g) || [];
      for (const link of externalLinks) {
        expect(link).toContain("noopener");
      }
    });

    it("focus-visible styles are applied to interactive elements", () => {
      // Buttons should have focus-visible ring/outline styles
      expect(html).toContain("focus-visible:");
    });
  });

  describe.skipIf(!distExists)("Language and text", () => {
    let html: string;

    beforeAll(() => {
      html = readBuiltHtml("/");
    });

    it("html element has lang attribute", () => {
      expect(html).toMatch(/<html[^>]*lang="/);
    });

    it("page has a title", () => {
      expect(html).toMatch(/<title>[^<]+<\/title>/);
    });

    it("character count is associated with input via aria-describedby (client-rendered React island)", () => {
      // aria-describedby is in the React ChatInput component which renders client-side only.
      const source = fs.readFileSync(
        path.resolve(process.cwd(), "src/components/react/chat/ChatInput.tsx"),
        "utf-8",
      );
      expect(source).toContain("aria-describedby");
    });
  });
});
