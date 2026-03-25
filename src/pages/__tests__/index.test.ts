import reactRenderer from "@astrojs/react/server.js";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";

// Import the Astro page you want to test
import IndexPage from "../index.astro";

describe("index.astro", () => {
  test("renders the page without crashing", async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({
      name: "@astrojs/react",
      renderer: reactRenderer,
    });
    const result = await container.renderToString(IndexPage);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("renders the Welcome component content", async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({
      name: "@astrojs/react",
      renderer: reactRenderer,
    });
    const result = await container.renderToString(IndexPage);

    // Check that the page renders HTML content
    expect(result).toContain("<html");
  });
});
