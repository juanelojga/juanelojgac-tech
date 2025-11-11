import en from './en.json';
import es from './es.json';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const defaultLang = 'en';
export const supportedLanguages = ['en', 'es'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const translations = {
  en,
  es,
};

export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang && supportedLanguages.includes(lang as SupportedLanguage)) {
    return lang as SupportedLanguage;
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLanguage) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = translations[lang];

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };
}

export function getPreferredLanguage(acceptLanguage?: string): SupportedLanguage {
  if (!acceptLanguage) {
    return defaultLang;
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, qValue] = lang.trim().split(';q=');
      const quality = qValue ? parseFloat(qValue) : 1.0;
      return { locale: locale.split('-')[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const { locale } of languages) {
    if (supportedLanguages.includes(locale as SupportedLanguage)) {
      return locale as SupportedLanguage;
    }
  }

  return defaultLang;
}
