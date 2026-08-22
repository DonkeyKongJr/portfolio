import { describe, expect, it } from 'vitest';
import { alternatePath, localePath, swapLocale } from '@/lib/paths';

describe('localePath', () => {
  it('baut Pfade mit fuehrendem und schliessendem Slash', () => {
    expect(localePath('de')).toBe('/de/');
    expect(localePath('en', 'work')).toBe('/en/work/');
    expect(localePath('de', 'work', 'qr-maker')).toBe('/de/work/qr-maker/');
  });

  it('vertraegt Segmente mit ueberfluessigen Slashes', () => {
    expect(localePath('en', '/blog/', 'post')).toBe('/en/blog/post/');
  });
});

describe('swapLocale', () => {
  it('behaelt den Pfad und tauscht nur die Sprache', () => {
    // Der eigentliche Punkt: kein Sprung auf die Startseite.
    expect(swapLocale('/de/work/qr-maker/', 'en')).toBe('/en/work/qr-maker/');
    expect(swapLocale('/en/blog/', 'de')).toBe('/de/blog/');
  });

  it('funktioniert auf der Sprachstartseite', () => {
    expect(swapLocale('/de/', 'en')).toBe('/en/');
  });

  it('ergaenzt die Sprache, wenn der Pfad noch keine hat', () => {
    expect(swapLocale('/work/', 'de')).toBe('/de/work/');
  });
});

describe('alternatePath', () => {
  const slugs = {
    de: ['factory-method-design-pattern'],
    en: ['factory-method-design-pattern', 'unit-tests-with-mocks'],
  };

  it('wechselt normale Seiten einfach um', () => {
    expect(alternatePath('/de/work/qr-maker/', 'en', slugs)).toBe('/en/work/qr-maker/');
    expect(alternatePath('/en/about/', 'de', slugs)).toBe('/de/about/');
    expect(alternatePath('/de/', 'en', slugs)).toBe('/en/');
  });

  it('wechselt uebersetzte Artikel um', () => {
    expect(alternatePath('/en/blog/factory-method-design-pattern/', 'de', slugs)).toBe(
      '/de/blog/factory-method-design-pattern/',
    );
  });

  it('weicht auf die Uebersicht aus, wenn die Uebersetzung fehlt', () => {
    // Vorher zeigte der Umschalter hier auf eine 404 - ausgerechnet auf den
    // Seiten, auf denen man ihn am ehesten braucht.
    expect(alternatePath('/en/blog/unit-tests-with-mocks/', 'de', slugs)).toBe('/de/blog/');
  });

  it('laesst die Artikeluebersicht selbst unangetastet', () => {
    expect(alternatePath('/en/blog/', 'de', slugs)).toBe('/de/blog/');
  });
});
