import type { Locale } from '@/config/site';

const LOCALE_TAG: Record<Locale, string> = { de: 'de-AT', en: 'en-GB' };

/**
 * Formatiert ein ISO-Datum sprachabhaengig.
 * Bewusst mit UTC, damit Build-Maschine und Browser dasselbe Datum zeigen -
 * sonst rutscht ein Artikel je nach Zeitzone um einen Tag.
 */
export function formatDate(iso: string, locale: Locale): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALE_TAG[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
