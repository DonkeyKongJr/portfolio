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

/**
 * Zieladresse des Sprachumschalters.
 *
 * Nicht jede Seite gibt es in beiden Sprachen: Blogartikel koennen nur in
 * einer vorliegen. Ein blosses Austauschen des Sprachsegments fuehrt dann auf
 * eine 404 - der Umschalter waere auf genau den Seiten eine Sackgasse, auf
 * denen man ihn am ehesten braucht. Fehlt die Uebersetzung, landet man
 * stattdessen auf der Artikeluebersicht der Zielsprache.
 */
export function alternatePath(
  pathname: string,
  target: Locale,
  blogSlugs: Record<Locale, readonly string[]>,
): string {
  const swapped = swapLocale(pathname, target);
  const segments = swapped.split('/').filter(Boolean);

  const isBlogPost = segments[1] === 'blog' && segments.length >= 3;
  if (isBlogPost && !blogSlugs[target].includes(segments[2]!)) {
    return localePath(target, 'blog');
  }

  return swapped;
}
