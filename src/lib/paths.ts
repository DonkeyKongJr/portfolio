import { locales, type Locale } from '@/config/site';

/** Baut einen lokalisierten Pfad. Immer mit fuehrendem und schliessendem Slash. */
export function localePath(locale: Locale, ...segments: string[]): string {
  const parts = segments.filter(Boolean).map((segment) => segment.replace(/^\/|\/$/g, ''));
  return `/${[locale, ...parts].join('/')}/`;
}

/**
 * Tauscht das Locale-Segment eines bestehenden Pfads aus und behaelt den Rest.
 * Aus /de/work/qr-maker/ wird /en/work/qr-maker/ - und nicht die Startseite,
 * wie es ein naiver Sprachumschalter machen wuerde.
 */
export function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && (locales as readonly string[]).includes(first)) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }

  return `/${segments.join('/')}/`;
}
