import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  useTranslations,
  getPreferredLanguage,
  defaultLang,
  supportedLanguages,
  languages,
} from './utils';

describe('constants', () => {
  it('should export correct default language', () => {
    expect(defaultLang).toBe('en');
  });

  it('should export supported languages', () => {
    expect(supportedLanguages).toEqual(['en', 'es']);
  });

  it('should export language names', () => {
    expect(languages).toEqual({
      en: 'English',
      es: 'Español',
    });
  });
});

describe('getLangFromUrl', () => {
  it('should extract English language from URL', () => {
    const url = new URL('https://example.com/en/page');
    expect(getLangFromUrl(url)).toBe('en');
  });

  it('should extract Spanish language from URL', () => {
    const url = new URL('https://example.com/es/page');
    expect(getLangFromUrl(url)).toBe('es');
  });

  it('should return default language for root URL', () => {
    const url = new URL('https://example.com/');
    expect(getLangFromUrl(url)).toBe(defaultLang);
  });

  it('should return default language for unsupported language', () => {
    const url = new URL('https://example.com/fr/page');
    expect(getLangFromUrl(url)).toBe(defaultLang);
  });

  it('should return default language for invalid language code', () => {
    const url = new URL('https://example.com/xyz/page');
    expect(getLangFromUrl(url)).toBe(defaultLang);
  });

  it('should handle URL with nested paths', () => {
    const url = new URL('https://example.com/en/blog/post-1');
    expect(getLangFromUrl(url)).toBe('en');
  });

  it('should handle URL with query parameters', () => {
    const url = new URL('https://example.com/es/page?foo=bar');
    expect(getLangFromUrl(url)).toBe('es');
  });

  it('should handle URL with hash', () => {
    const url = new URL('https://example.com/en/page#section');
    expect(getLangFromUrl(url)).toBe('en');
  });
});

describe('useTranslations', () => {
  describe('English translations', () => {
    it('should return translation for simple key', () => {
      const t = useTranslations('en');
      expect(t('nav.home')).toBe('Home');
    });

    it('should return translation for nested key', () => {
      const t = useTranslations('en');
      expect(t('site.title')).toBe('Astro Basics');
      expect(t('site.description')).toBe('Welcome to Astro');
    });

    it('should return translation for deeply nested key', () => {
      const t = useTranslations('en');
      expect(t('welcome.readDocs')).toBe('Read our docs');
      expect(t('welcome.joinDiscord')).toBe('Join our Discord');
    });

    it('should return key if translation not found', () => {
      const t = useTranslations('en');
      expect(t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('should return key if nested path does not exist', () => {
      const t = useTranslations('en');
      expect(t('site.nonexistent.nested')).toBe('site.nonexistent.nested');
    });

    it('should handle HTML content in translations', () => {
      const t = useTranslations('en');
      const result = t('welcome.getStarted');
      expect(result).toContain('<code>');
      expect(result).toContain('src/pages');
    });
  });

  describe('Spanish translations', () => {
    it('should return Spanish translation for simple key', () => {
      const t = useTranslations('es');
      expect(t('nav.home')).toBe('Inicio');
    });

    it('should return Spanish translation for nested key', () => {
      const t = useTranslations('es');
      expect(t('site.title')).toBe('Fundamentos de Astro');
      expect(t('site.description')).toBe('Bienvenido a Astro');
    });

    it('should return Spanish translation for deeply nested key', () => {
      const t = useTranslations('es');
      expect(t('welcome.readDocs')).toBe('Lee nuestra documentación');
      expect(t('welcome.joinDiscord')).toBe('Únete a nuestro Discord');
    });

    it('should return key if translation not found', () => {
      const t = useTranslations('es');
      expect(t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('should handle HTML content in Spanish translations', () => {
      const t = useTranslations('es');
      const result = t('welcome.getStarted');
      expect(result).toContain('<code>');
      expect(result).toContain('src/pages');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string key', () => {
      const t = useTranslations('en');
      expect(t('')).toBe('');
    });

    it('should handle single character key', () => {
      const t = useTranslations('en');
      expect(t('x')).toBe('x');
    });

    it('should return key if value is not a string', () => {
      const t = useTranslations('en');
      // Accessing 'site' should return the object, but the function should return the key
      expect(t('site')).toBe('site');
    });

    it('should be case sensitive', () => {
      const t = useTranslations('en');
      expect(t('nav.Home')).toBe('nav.Home'); // Should not find 'home'
    });
  });
});

describe('getPreferredLanguage', () => {
  describe('no accept-language header', () => {
    it('should return default language when acceptLanguage is undefined', () => {
      expect(getPreferredLanguage()).toBe(defaultLang);
    });

    it('should return default language when acceptLanguage is empty string', () => {
      expect(getPreferredLanguage('')).toBe(defaultLang);
    });
  });

  describe('single language', () => {
    it('should return English for "en" header', () => {
      expect(getPreferredLanguage('en')).toBe('en');
    });

    it('should return Spanish for "es" header', () => {
      expect(getPreferredLanguage('es')).toBe('es');
    });

    it('should extract language code from locale', () => {
      expect(getPreferredLanguage('en-US')).toBe('en');
      expect(getPreferredLanguage('es-ES')).toBe('es');
      expect(getPreferredLanguage('es-MX')).toBe('es');
    });

    it('should return default for unsupported language', () => {
      expect(getPreferredLanguage('fr')).toBe(defaultLang);
      expect(getPreferredLanguage('de')).toBe(defaultLang);
      expect(getPreferredLanguage('ja')).toBe(defaultLang);
    });
  });

  describe('multiple languages with quality values', () => {
    it('should return highest priority supported language', () => {
      expect(getPreferredLanguage('es;q=0.9,en;q=1.0')).toBe('en');
      expect(getPreferredLanguage('en;q=0.9,es;q=1.0')).toBe('es');
    });

    it('should handle languages without quality values (default q=1.0)', () => {
      expect(getPreferredLanguage('es,en;q=0.9')).toBe('es');
      expect(getPreferredLanguage('en,es;q=0.5')).toBe('en');
    });

    it('should return first supported language when priorities are equal', () => {
      expect(getPreferredLanguage('en,es')).toBe('en');
    });

    it('should skip unsupported languages and return supported one', () => {
      expect(getPreferredLanguage('fr;q=1.0,es;q=0.9,de;q=0.8')).toBe('es');
      expect(getPreferredLanguage('de,fr,en')).toBe('en');
    });

    it('should handle complex Accept-Language header', () => {
      expect(getPreferredLanguage('fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7')).toBe('en');
      expect(getPreferredLanguage('de-DE,de;q=0.9,es-MX;q=0.8,es;q=0.7')).toBe('es');
    });

    it('should return default when no supported language found', () => {
      expect(getPreferredLanguage('fr,de,ja,zh')).toBe(defaultLang);
    });
  });

  describe('edge cases', () => {
    it('should handle spaces in header', () => {
      expect(getPreferredLanguage('en-US, es;q=0.9, fr;q=0.8')).toBe('en');
      expect(getPreferredLanguage(' es , en;q=0.5 ')).toBe('es');
    });

    it('should handle malformed quality values', () => {
      // When parseFloat returns NaN, sorting keeps original order, so 'es' (first) is returned
      expect(getPreferredLanguage('es;q=abc,en')).toBe('es');
    });

    it('should handle missing quality value after semicolon', () => {
      // Empty string after ;q= is falsy, so defaults to 1.0, same as 'en', original order maintained
      expect(getPreferredLanguage('es;q=,en')).toBe('es');
    });

    it('should handle very low quality values', () => {
      expect(getPreferredLanguage('es;q=0.001,en;q=0.999')).toBe('en');
    });

    it('should handle quality values greater than 1', () => {
      expect(getPreferredLanguage('es;q=1.5,en;q=0.5')).toBe('es');
    });

    it('should handle negative quality values', () => {
      expect(getPreferredLanguage('es;q=-1,en;q=0.5')).toBe('en');
    });

    it('should handle duplicate languages', () => {
      expect(getPreferredLanguage('en,en-US,en-GB')).toBe('en');
    });

    it('should handle wildcard in Accept-Language', () => {
      expect(getPreferredLanguage('es,*')).toBe('es');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical Chrome header', () => {
      expect(getPreferredLanguage('en-US,en;q=0.9,es;q=0.8')).toBe('en');
    });

    it('should handle typical Firefox header', () => {
      expect(getPreferredLanguage('es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7')).toBe('es');
    });

    it('should handle typical Safari header', () => {
      expect(getPreferredLanguage('en-us')).toBe('en');
    });

    it('should handle Spanish user with English fallback', () => {
      expect(getPreferredLanguage('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
    });

    it('should handle English user with Spanish fallback', () => {
      expect(getPreferredLanguage('en-GB,en;q=0.9,es;q=0.8')).toBe('en');
    });
  });
});
