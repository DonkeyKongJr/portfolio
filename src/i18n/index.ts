import { defaultLocale, isLocale, locales, type Locale } from '@/config/site';
import { de } from './de';
import { en } from './en';
import type { Dictionary } from './types';

const dictionaries = { de, en } as const satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fuer generateStaticParams() in jedem [locale]-Segment. */
export function localeParams() {
  return locales.map((locale) => ({ locale }));
}

export { defaultLocale, isLocale, locales };
export type { Dictionary, Locale };
