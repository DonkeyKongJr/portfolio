import { describe, expect, it } from 'vitest';
import { locales } from '@/config/site';
import { allPostParams, availableLocales, getNeighbours, getPost, getPosts } from '@/lib/blog';

describe('Blog', () => {
  it('liest Artikel mit gueltigem Frontmatter', () => {
    // Ein kaputtes Frontmatter wuerde hier eine Exception werfen.
    for (const locale of locales) {
      for (const post of getPosts(locale)) {
        expect(post.frontmatter.title.length).toBeGreaterThan(0);
        expect(post.readingMinutes).toBeGreaterThan(0);
      }
    }
  });

  it('sortiert absteigend nach Datum', () => {
    const dates = getPosts('en').map((post) => post.frontmatter.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('meldet nur Sprachen, in denen der Artikel existiert', () => {
    expect(availableLocales('factory-method-design-pattern').sort()).toEqual(['de', 'en']);
    expect(availableLocales('unit-tests-with-mocks')).toEqual(['en']);
  });

  it('erzeugt fuer jeden Artikel genau einen statischen Pfad', () => {
    const params = allPostParams();
    const keys = params.map((p) => `${p.locale}/${p.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('markiert maschinell uebersetzte Fassungen', () => {
    // Pro Artikel gesetzt, nicht pro Sprache - eine spaeter von Hand
    // geschriebene Uebersetzung soll den Hinweis nicht faelschlich tragen.
    expect(getPost('de', 'factory-method-design-pattern')?.frontmatter.machineTranslated).toBe(true);
    expect(getPost('en', 'factory-method-design-pattern')?.frontmatter.machineTranslated).toBe(
      false,
    );
  });

  it('setzt das Kennzeichen standardmaessig auf false', () => {
    for (const post of getPosts('en')) {
      expect(typeof post.frontmatter.machineTranslated).toBe('boolean');
    }
  });

  it('verkettet Artikel in chronologischer Richtung', () => {
    // en hat zwei Artikel: der neuere hat einen "previous", aber keinen "next".
    const posts = getPosts('en');
    const newest = posts[0]!;
    const { previous, next } = getNeighbours('en', newest.slug);
    expect(next).toBeUndefined();
    expect(previous?.slug).toBe(posts[1]!.slug);
  });
});
