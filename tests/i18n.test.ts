import { describe, expect, it } from 'vitest';
import { de } from '@/i18n/de';
import { en } from '@/i18n/en';

/** Sammelt alle Schluesselpfade rekursiv, damit sich beide Woerterbuecher vergleichen lassen. */
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return [`${prefix}[]`];
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function leafStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(leafStrings);
  if (value === null || typeof value !== 'object') return [];
  return Object.values(value as Record<string, unknown>).flatMap(leafStrings);
}

describe('Woerterbuecher', () => {
  it('haben in beiden Sprachen exakt dieselben Schluessel', () => {
    // TypeScript faengt fehlende Keys bereits ab; das hier sichert die
    // Struktur auch dann, wenn jemand den Dictionary-Typ aufweicht.
    expect(keyPaths(en).sort()).toEqual(keyPaths(de).sort());
  });

  it('enthalten keine leeren Texte', () => {
    for (const dict of [de, en]) {
      for (const text of leafStrings(dict)) {
        expect(text.trim()).not.toBe('');
      }
    }
  });

  it('haben gleich viele Marquee-Eintraege', () => {
    expect(en.home.proof).toHaveLength(de.home.proof.length);
  });
});
