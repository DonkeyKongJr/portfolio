import { describe, expect, it } from 'vitest';
import { localePath, swapLocale } from '@/lib/paths';

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
