import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";

// Import the Astro page you want to test
import IndexPage from "../index.astro";

describe("index.astro", () => {
  test("renders the page without crashing", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IndexPage);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("renders the Welcome component content", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IndexPage);

    // Look for content that would be rendered by Welcome component
    // This will depend on what's actually in the Welcome.astro file
    // For now, check that it contains some content structure
    expect(result).toContain("Welcome");
  });
});
