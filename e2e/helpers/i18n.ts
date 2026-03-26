import type { Page } from "@playwright/test";

export type SupportedLanguage = "en" | "es";

/**
 * Sets the Accept-Language header to simulate a language preference.
 * Must be called before navigation.
 */
export async function setLanguage(page: Page, lang: SupportedLanguage): Promise<void> {
  const headers: Record<SupportedLanguage, string> = {
    en: "en-US,en;q=0.9",
    es: "es-ES,es;q=0.9",
  };
  await page.setExtraHTTPHeaders({
    "Accept-Language": headers[lang],
  });
}

/**
 * Navigates to the page with the specified language and returns
 * the page ready for assertions.
 */
export async function navigateWithLanguage(
  page: Page,
  lang: SupportedLanguage,
  path = "/"
): Promise<Page> {
  await setLanguage(page, lang);
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  return page;
}
