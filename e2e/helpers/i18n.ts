import type { Page } from "@playwright/test";

export type SupportedLanguage = "en" | "es";

/**
 * Navigates to the page with the specified language.
 * EN uses / (default), ES uses /es (dedicated pre-rendered page).
 */
export async function navigateWithLanguage(
  page: Page,
  lang: SupportedLanguage,
  path = "/"
): Promise<Page> {
  const url = lang === "es" ? "/es" : path;
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  return page;
}
