import js from "@eslint/js";
import astroParser from "astro-eslint-parser";
import astro from "eslint-plugin-astro";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

// parsers
const tsParser = tseslint.parser;

export default [
  // Global JS/TS env
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Base JS + TS recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro recommended + a11y rules
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],

  // Extra config specifically for .astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json", // make sure this exists
      },
    },
    rules: {
      // Astro-specific tweaks
      "no-undef": "off", // avoid false positives on Astro globals like ImageMetadata
      // "@typescript-eslint/no-explicit-any": "off", // uncomment if it gets annoying
    },
  },

  // Global rules for all files
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-duplicate-imports": "error",
    },
  },

  // Ignore build artifacts etc.
  {
    ignores: ["dist/**", "**/*.d.ts", ".github/"],
  },
];
