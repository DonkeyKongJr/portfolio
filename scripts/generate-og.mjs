/**
 * Erzeugt die Social-Vorschaubilder vor dem Next-Build.
 *
 * Bewusst als Skript statt ueber die opengraph-image-Konvention: die legt bei
 * output: 'export' Dateien ohne .png-Endung ab, die Firebase dann mit falschem
 * Content-Type ausliefert.
 */
import { ImageResponse } from 'next/og.js';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'og');
const SIZE = { width: 1200, height: 630 };

const copy = {
  de: {
    headline: 'Ich baue Software, die auch in fünf Jahren noch wartbar ist.',
    kicker: 'Software Engineering · Cloud',
  },
  en: {
    headline: 'I build software that is still maintainable in five years.',
    kicker: 'Software Engineering · Cloud',
  },
};

function card({ headline, kicker }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#141414',
        padding: 80,
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 28 },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: 24, letterSpacing: 4, color: '#8a8a8a' },
                  children: `PATRICK SCHADLER — ${kicker.toUpperCase()}`,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 64, lineHeight: 1.08, color: '#dedede', maxWidth: 940 },
                  children: headline,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 20 },
            children: [
              { type: 'div', props: { style: { width: 56, height: 6, background: '#c2a8ff' } } },
              {
                type: 'div',
                props: {
                  style: { fontSize: 26, color: '#a6a6a6' },
                  children: 'schadler.dev · mrsd Solutions GmbH',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

await mkdir(OUT_DIR, { recursive: true });

/*
 * Apple-Touch-Icon. Ohne die Datei fragen Safari und iOS
 * /apple-touch-icon.png sowie /apple-touch-icon-precomposed.png an; beide
 * laufen in die [locale]-Route und quittieren im Dev-Modus mit
 * "missing param in generateStaticParams()".
 */
const touchIcon = new ImageResponse(
  {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#141414',
        color: '#dedede',
        fontSize: 84,
        letterSpacing: -4,
      },
      children: 'PS',
    },
  },
  { width: 180, height: 180 },
);
const touchIconBuffer = Buffer.from(await touchIcon.arrayBuffer());
const publicDir = path.join(process.cwd(), 'public');
await writeFile(path.join(publicDir, 'apple-touch-icon.png'), touchIconBuffer);
// Aeltere iOS-Versionen fragen zusaetzlich die -precomposed-Variante an.
await writeFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'), touchIconBuffer);
console.log('apple-touch-icon(-precomposed).png geschrieben');

for (const [locale, text] of Object.entries(copy)) {
  const response = new ImageResponse(card(text), SIZE);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(OUT_DIR, `${locale}.png`), buffer);
  // Englische Fassung dient zugleich als Standardbild.
  if (locale === 'en') await writeFile(path.join(OUT_DIR, 'default.png'), buffer);
  console.log(`og/${locale}.png geschrieben (${(buffer.length / 1024).toFixed(0)} KB)`);
}
