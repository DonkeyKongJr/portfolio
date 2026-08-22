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
