import { describe, expect, it } from 'vitest';
import { locales } from '@/config/site';
import { allPostParams, availableLocales, getNeighbours, getPosts } from '@/lib/blog';

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

  it('verkettet Artikel in chronologischer Richtung', () => {
    // en hat zwei Artikel: der neuere hat einen "previous", aber keinen "next".
    const posts = getPosts('en');
    const newest = posts[0]!;
    const { previous, next } = getNeighbours('en', newest.slug);
    expect(next).toBeUndefined();
    expect(previous?.slug).toBe(posts[1]!.slug);
  });
});
