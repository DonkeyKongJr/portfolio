/**
 * Exportiert die .drawio-Quellen aus src/content/blog/diagrams/ nach SVG und
 * macht sie themefaehig.
 *
 * Bewusst KEIN prebuild-Schritt: die GitHub-Action hat kein draw.io, und der
 * Build darf daran nicht scheitern. Die erzeugten SVG sind eingecheckt - dies
 * hier ist ein Autorenwerkzeug, das nach einer Diagrammaenderung von Hand
 * laeuft ("npm run diagrams").
 *
 * Die Nachbearbeitung ist noetig, weil draw.io 31.x jede Farbe doppelt
 * schreibt: einmal als Praesentationsattribut (stroke="#707070") und einmal
 * als Inline-Style mit light-dark(). Der Inline-Style gewinnt, deshalb muss
 * er weg, bevor das Attribut auf currentColor umgeschrieben werden kann.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'src', 'content', 'blog', 'diagrams');
const DRAWIO = '/Applications/draw.io.app/Contents/MacOS/draw.io';

/**
 * Je Sprache ein Export. Die .drawio-Quelle ist deutsch und bleibt die
 * Wahrheit; fuer Englisch werden die Labels VOR dem Export im XML ersetzt und
 * nicht nachtraeglich im SVG. Nur so setzt draw.io den Text neu und zentriert
 * ihn auf die neue Laenge - eine Ersetzung im fertigen SVG liesse ihn an der
 * deutschen Position stehen.
 */
const LABELS = JSON.parse(readFileSync(path.join(DIR, 'labels.en.json'), 'utf8'));

/**
 * Feste Farben in der Quelle werden zu Token-Verweisen. Linien und Text in
 * ink-8 tragen die Grundfarbe und folgen deshalb currentColor; die Akzente
 * bekommen die --accent-ink-*-Tokens, die in beiden Themes den jeweils
 * lesbaren Ton liefern (hell: die dunkle Stufe, dunkel: die helle).
 */
const COLOURS = new Map([
  ['#707070', 'currentColor'],
  ['#1aa7ff', 'var(--accent-ink-blue)'],
  ['#ffdd1a', 'var(--accent-ink-yellow)'],
  ['#16ca52', 'var(--accent-ink-green)'],
  ['#4710c6', 'var(--accent-ink-violet)'],
  // Freistellflaeche hinter Kantenbeschriftungen: muss den Seitenhintergrund
  // treffen, sonst steht im dunklen Theme ein weisser Block im Bild.
  ['#ffffff', 'var(--background)'],
]);

function prepare(svg) {
  let out = svg;

  // 1. XML-Prolog und DOCTYPE entfernen - das SVG wird inline eingebettet.
  out = out.replace(/<\?xml[^>]*\?>\s*/i, '').replace(/<!DOCTYPE[^>]*>\s*/i, '');

  // 2. Den <style>-Block mit --ge-adaptive-bg entfernen. Er haengt an der
  //    zufaelligen SVG-Id und wuerde nach der Umschreibung ins Leere zeigen.
  out = out.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 3. Saemtliche Inline-Styles entfernen. draw.io schreibt dort ausschliesslich
  //    die light-dark()-Doppelung, die die Attribute uebersteuern wuerde.
  out = out.replace(/\s+style="[^"]*"/g, '');

  // 4. Zufaellige Id entfernen: sie aendert sich bei jedem Export und wuerde
  //    sonst bei jedem Lauf einen Diff erzeugen.
  out = out.replace(/\s+id="ge-svg-[^"]*"/g, '');

  // 5. Feste Breite und Hoehe raus, viewBox bleibt - so skaliert das Bild mit.
  out = out.replace(/\s+(width|height)="[\d.]+px"/g, '');

  // 6. Farben auf Tokens umschreiben.
  for (const [hex, token] of COLOURS) {
    out = out.replace(new RegExp(`(fill|stroke)="${hex}"`, 'gi'), `$1="${token}"`);
  }

  // 7. Nicht abgedeckte Fixfarben sichtbar machen, statt sie still
  //    durchzureichen - im dunklen Theme faellt so etwas sonst erst live auf.
  const rest = [...out.matchAll(/(?:fill|stroke)="(#[0-9a-f]{3,6})"/gi)].map((m) => m[1]);
  return { svg: out.trim(), rest: [...new Set(rest)] };
}

/**
 * Uebersetzt die Labels einer Quelle. Ersetzt wird ausschliesslich innerhalb
 * von value="...", damit ein Begriff, der zufaellig auch in einem Style oder
 * einer Id vorkommt, unangetastet bleibt.
 *
 * Ein Label ohne Eintrag im Woerterbuch ist ein Fehler und kein Grund zum
 * Weitermachen: sonst steht spaeter unbemerkt Deutsch im englischen Artikel.
 */
function translate(xml, source, missing) {
  return xml.replace(/value="([^"]*)"/g, (match, label) => {
    if (label === '') return match;
    const english = LABELS[label];
    if (english === undefined) {
      missing.push(`${source}: "${label}"`);
      return match;
    }
    return `value="${english}"`;
  });
}

function exportSvg(from, to) {
  execFileSync(DRAWIO, ['-x', '-f', 'svg', '-o', to, from], { stdio: 'pipe' });
  const { svg, rest } = prepare(readFileSync(to, 'utf8'));
  writeFileSync(to, `${svg}\n`);
  return rest;
}

const sources = readdirSync(DIR).filter((f) => f.endsWith('.drawio'));
if (sources.length === 0) {
  console.error(`Keine .drawio-Dateien in ${DIR}`);
  process.exit(1);
}

const tempDir = mkdtempSync(path.join(os.tmpdir(), 'diagramme-'));
const missing = [];
let warnings = 0;

try {
  for (const source of sources) {
    const from = path.join(DIR, source);
    const base = source.replace(/\.drawio$/, '');

    // Deutsch direkt aus der Quelle.
    const restDe = exportSvg(from, path.join(DIR, `${base}.de.svg`));

    // Englisch ueber eine uebersetzte Kopie im Temp-Verzeichnis.
    const enSource = path.join(tempDir, source);
    writeFileSync(enSource, translate(readFileSync(from, 'utf8'), source, missing));
    const restEn = exportSvg(enSource, path.join(DIR, `${base}.en.svg`));

    const rest = [...new Set([...restDe, ...restEn])];
    if (rest.length > 0) {
      warnings += 1;
      console.warn(`  ! ${source}: nicht zugeordnete Farben ${rest.join(', ')}`);
    }
    console.log(`  ${source} -> ${base}.de.svg, ${base}.en.svg`);
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

if (missing.length > 0) {
  console.error(`\nFehlende Uebersetzungen in labels.en.json:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}

console.log(`\n${sources.length} Diagramm(e) x 2 Sprachen exportiert${warnings > 0 ? `, ${warnings} mit Warnung` : ''}.`);
