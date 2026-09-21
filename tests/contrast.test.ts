import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/** Liest die ink-Rampe aus einem Regelblock. */
function ramp(selector: string): Record<number, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Block nicht gefunden: ${selector}`);
  const block = css.slice(start, css.indexOf('}', start));
  const out: Record<number, string> = {};
  for (const [, step, value] of block.matchAll(/--ink-(\d+):\s*(#[0-9a-f]{6})/gi)) {
    out[Number(step)] = value!;
  }
  return out;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/* --- Liquid Glass: Alpha-Compositing ------------------------------------- */

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Liest alle --Namen: Wert; Paare eines Blocks roh (ohne sie aufzuloesen).
 * Kommentare fallen vorher weg - sonst faengt z.B. das Beispiel
 * "--glass-tint: transparent fuer ..." aus dem Fliesstext der Kommentare
 * den Regex ein und frisst alles bis zum naechsten echten Semikolon.
 */
function tokenTable(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Block nicht gefunden: ${selector}`);
  const block = css.slice(start, css.indexOf('}', start)).replace(/\/\*[\s\S]*?\*\//g, '');
  const out: Record<string, string> = {};
  for (const [, name, value] of block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/gi)) {
    out[name!] = value!.trim();
  }
  return out;
}

function hexToRgba(hex: string): Rgba {
  const h = hex.replace('#', '');
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    };
  }
  if (h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }
  throw new Error(`Unerwartetes Hex-Format: ${hex}`);
}

/**
 * Loest var(--x) und color-mix(in srgb, X N%, transparent) rekursiv gegen
 * eine Token-Tabelle auf - genau die beiden Formen, die glass.module.css und
 * tokens.css fuer die Glas-Flaechen verwenden.
 */
function resolveColor(value: string, table: Record<string, string>): Rgba {
  const trimmed = value.trim();

  const varMatch = trimmed.match(/^var\(--([a-z0-9-]+)\)$/i);
  if (varMatch) {
    const next = table[varMatch[1]!];
    if (!next) throw new Error(`Token nicht gefunden: --${varMatch[1]}`);
    return resolveColor(next, table);
  }

  const mixMatch = trimmed.match(/^color-mix\(in srgb,\s*(.+?)\s+(\d+)%,\s*transparent\)$/i);
  if (mixMatch) {
    const base = resolveColor(mixMatch[1]!, table);
    const pct = Number(mixMatch[2]) / 100;
    return { ...base, a: base.a * pct };
  }

  if (trimmed.startsWith('#')) return hexToRgba(trimmed);

  throw new Error(`Kann Farbwert nicht aufloesen: ${trimmed}`);
}

/** Alpha-Compositing "source over" in sRGB, wie der Browser Hintergrundebenen mischt. */
function over(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (cf: number, cb: number) => (cf * fg.a + cb * bg.a * (1 - fg.a)) / a;
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a };
}

function rgbaToHex({ r, g, b }: Rgba): string {
  const channel = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Kleinster Kontrast von textHex gegen eine Reihe moeglicher Hintergruende - der Worst Case. */
function worstContrast(textHex: string, backgrounds: Rgba[]): number {
  return Math.min(...backgrounds.map((bg) => contrast(textHex, rgbaToHex(bg))));
}

/**
 * Die vier Ambient-Flecken einer Theme-Tabelle (Ambient.tsx/.module.css),
 * jeweils mit der Layer-Deckkraft (--ambient-opacity) multipliziert. Manche
 * Flecken bringen schon eine eigene Deckkraft mit (--ambient-d ist per
 * color-mix gedaempft) - die wird beim Aufloesen bereits eingerechnet.
 */
function ambientPatches(table: Record<string, string>): Rgba[] {
  const opacity = Number(table['ambient-opacity']);
  return ['ambient-a', 'ambient-b', 'ambient-c', 'ambient-d'].map((name) => {
    const patch = resolveColor(table[name]!, table);
    return { ...patch, a: patch.a * opacity };
  });
}

const rootTokens = tokenTable(':root {');
// Nicht neu definierte Custom Properties (z.B. --media-surface, die Akzentrampen)
// gelten unveraendert weiter - dieselbe Kaskade wie im Browser.
const lightTokens: Record<string, string> = {
  ...rootTokens,
  ...tokenTable(":root[data-theme='light'] {"),
};

describe('Farbkontraste', () => {
  const themes: [string, string][] = [
    ['dunkel', ':root {'],
    ['hell', ":root[data-theme='light'] {"],
  ];

  for (const [name, selector] of themes) {
    describe(name, () => {
      const ink = ramp(selector);

      it('hat alle zwoelf Stufen', () => {
        expect(Object.keys(ink)).toHaveLength(12);
      });

      it('haelt 4.5:1 fuer Fliesstext (ink-9 aufwaerts)', () => {
        for (const step of [9, 10, 11, 12]) {
          expect(contrast(ink[step]!, ink[1]!)).toBeGreaterThanOrEqual(4.5);
        }
      });

      it('haelt 7:1 fuer Ueberschriften (ink-12)', () => {
        expect(contrast(ink[12]!, ink[1]!)).toBeGreaterThanOrEqual(7);
      });

      it('laeuft in der Helligkeit durchgehend in eine Richtung', () => {
        // Ein Ausreisser in der Rampe wuerde die Rollen durcheinanderbringen.
        const values = Array.from({ length: 12 }, (_, i) => contrast(ink[i + 1]!, ink[1]!));
        for (let i = 1; i < values.length; i += 1) {
          expect(values[i]!).toBeGreaterThanOrEqual(values[i - 1]!);
        }
      });
    });
  }

  it('haelt dunklen Text auf den Pastellkarten lesbar', () => {
    // --on-accent wechselt bewusst nicht mit dem Theme, die Karten auch nicht.
    const onAccent = css.match(/--on-accent:\s*(#[0-9a-f]{6})/i)?.[1];
    expect(onAccent).toBeDefined();
    for (const pastel of ['#c2a8ff', '#ffef93', '#aee0ff', '#9bfcb7']) {
      expect(contrast(onAccent!, pastel)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('Glas-Kontraste (Liquid Glass)', () => {
  const themes: [string, Record<string, string>][] = [
    ['dunkel', rootTokens],
    ['hell', lightTokens],
  ];

  /**
   * Unguenstigster Untergrund fuer die Nav-/Banner-Toenung je Theme:
   * dunkel - die vier Pastellkarten (Akzentstufe 9), die hellste bleibt
   * massgeblich (Beispiel im Kommentar von Nav.module.css: --yellow-9);
   * hell - die dunkle Medienflaeche, die in beiden Themes denselben Wert
   * behaelt (tokens.css: --media-surface).
   */
  function navWorstCaseBackgrounds(theme: string, table: Record<string, string>): Rgba[] {
    if (theme === 'hell') return [resolveColor(table['media-surface']!, table)];
    return ['yellow-9', 'blue-9', 'green-9', 'violet-9'].map((name) =>
      resolveColor(table[name]!, table),
    );
  }

  describe('Nav- und Banner-Text auf glass-tint-strong', () => {
    for (const [theme, table] of themes) {
      it(`haelt 4.5:1 gegen den unguenstigsten Hintergrund (${theme})`, () => {
        const tintStrong = resolveColor(table['glass-tint-strong']!, table);
        const surfaces = navWorstCaseBackgrounds(theme, table).map((bg) => over(tintStrong, bg));
        // Nav.module.css: --nav-ink im Glaszustand ist ink-11.
        // Analytics.module.css: .message/.more sind ebenfalls ink-11.
        expect(worstContrast(table['ink-11']!, surfaces)).toBeGreaterThanOrEqual(4.5);
      });
    }
  });

  describe('Nav-Innenelemente (glass-inner / glass-inner-hover)', () => {
    for (const [theme, table] of themes) {
      it(`haelt 4.5:1 auf der Linse ueber der Nav-Flaeche (${theme})`, () => {
        const tintStrong = resolveColor(table['glass-tint-strong']!, table);
        const navSurfaces = navWorstCaseBackgrounds(theme, table).map((bg) => over(tintStrong, bg));

        // .localeSwitch in Ruhe: ink-11 auf --glass-inner (Nav.module.css: --nav-lens).
        const inner = resolveColor(table['glass-inner']!, table);
        const withInner = navSurfaces.map((surface) => over(inner, surface));
        expect(worstContrast(table['ink-11']!, withInner)).toBeGreaterThanOrEqual(4.5);

        // .link:hover/.localeSwitch:hover: ink-12 auf --glass-inner-hover (--nav-hover).
        const innerHover = resolveColor(table['glass-inner-hover']!, table);
        const withInnerHover = navSurfaces.map((surface) => over(innerHover, surface));
        expect(worstContrast(table['ink-12']!, withInnerHover)).toBeGreaterThanOrEqual(4.5);
      });
    }
  });

  describe('Ambient-Layer', () => {
    for (const [theme, table] of themes) {
      it(`drueckt ink-9 auf dem Seitenhintergrund nicht unter 4.5:1 (${theme})`, () => {
        const pageBg = resolveColor(table['ink-1']!, table);
        const composites = ambientPatches(table).map((patch) => over(patch, pageBg));
        // Eyebrows/gedaempfter Fliesstext (Ambient.module.css-Kommentar).
        expect(worstContrast(table['ink-9']!, composites)).toBeGreaterThanOrEqual(4.5);
      });
    }
  });

  describe('Principles-Fliesstext auf glass-tint', () => {
    for (const [theme, table] of themes) {
      it(`haelt 4.5:1 ueber Seitenhintergrund plus hellstem Ambient-Fleck (${theme})`, () => {
        const pageBg = resolveColor(table['ink-1']!, table);
        const backdrops = ambientPatches(table).map((patch) => over(patch, pageBg));
        const tint = resolveColor(table['glass-tint']!, table);
        const surfaces = backdrops.map((backdrop) => over(tint, backdrop));
        // Principles.module.css: .body ist ink-10 (ink-9 haelt dort laut Kommentar nur ~4.94:1).
        expect(worstContrast(table['ink-10']!, surfaces)).toBeGreaterThanOrEqual(4.5);
      });
    }
  });
});
