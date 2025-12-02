import en from "../i18n/en.json";
import es from "../i18n/es.json";

export type Language = "en" | "es";

const translations = {
  en,
  es,
};

export function getTranslations(lang: Language = "en") {
  return translations[lang];
}

/**
 * Detects the preferred language from the Accept-Language header
 * Returns 'es' if Spanish is preferred, otherwise returns 'en' (default)
 */
export function detectLanguageFromHeader(acceptLanguageHeader: string | null): Language {
  if (!acceptLanguageHeader) {
    return "en";
  }

  // Parse Accept-Language header and check for Spanish variants
  const languages = acceptLanguageHeader.split(",").map((lang) => {
    const parts = lang.trim().split(";");
    const code = parts[0].toLowerCase();
    return code;
  });

  // Check if any Spanish variant is present
  const hasSpanish = languages.some((lang) => lang.startsWith("es") || lang === "es");

  return hasSpanish ? "es" : "en";
}
