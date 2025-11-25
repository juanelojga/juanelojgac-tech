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
