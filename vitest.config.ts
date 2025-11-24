/// <reference types="vitest" />

import { getViteConfig } from "astro/config";
import { defineConfig } from "vitest/config";

export default defineConfig(
  getViteConfig({
    test: {
      // Use jsdom for component / DOM tests
      environment: "node",

      // Jest-style globals: describe/it/expect without importing
      globals: true,

      // Global setup file
      setupFiles: ["./setupTests.ts"],

      // Where Vitest looks for tests
      include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}"],

      // Coverage defaults
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        exclude: [
          "**/*.stories.*",
          "node_modules/**",
          ".astro/**",
          "**/__tests__/**",
          "**/*.{test,spec}.{ts,tsx,js,jsx}",
          "**/setupTests.ts",
          "**/*.config.{js,ts,mjs}",
          "**/*.d.ts",
          "dist/**",
        ],
      },
    },
  })
);
