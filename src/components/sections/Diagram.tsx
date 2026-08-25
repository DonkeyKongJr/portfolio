import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from '@/config/site';
import styles from './Diagram.module.css';

/**
 * Bettet ein Diagramm als inline-SVG in einen Artikel ein.
 *
 * Inline und nicht ueber <img>, weil die Diagramme ihre Farben aus
 * currentColor und den Theme-Tokens beziehen. Ein <img src="....svg"> ist ein
 * eigenes Dokument und erbt davon nichts - es bliebe in einem der beiden
 * Themes unlesbar.
 *
 * Der Umweg ueber dangerouslySetInnerHTML ist hier der sichere Weg, nicht der
 * gefaehrliche: das SVG geht damit am JSX-Parser vorbei. Direkt ins MDX
 * geschrieben wuerde MDX es als JSX lesen und ueber class, style-Strings und
 * hyphenierte Attribute stolpern. Die Quelle ist eine eingecheckte Datei aus
 * diesem Repository, keine Eingabe von aussen.
 *
 * Erzeugt werden die SVG mit "npm run diagrams" aus den .drawio-Quellen im
 * selben Verzeichnis - je Sprache eine Datei.
 */

const DIAGRAM_DIR = path.join(process.cwd(), 'src', 'content', 'blog', 'diagrams');

export interface DiagramProps {
  /** Dateiname ohne Sprachkuerzel und Endung, z.B. "architektur". */
  name: string;
  /** Bildunterschrift. Dient zugleich als Textalternative. */
  caption: string;
  locale: Locale;
}

export function Diagram({ name, caption, locale }: DiagramProps) {
  const file = path.join(DIAGRAM_DIR, `${name}.${locale}.svg`);

  // Zur Build-Zeit gelesen: die Seite ist ein statischer Export, zur Laufzeit
  // gibt es kein Dateisystem. Ein fehlendes Diagramm soll den Build brechen
  // und nicht als leere Luecke im Artikel landen.
  if (!fs.existsSync(file)) {
    throw new Error(
      `Diagramm "${name}" fehlt fuer Sprache "${locale}" (${file}). ` +
        `Erzeugen mit: npm run diagrams`,
    );
  }
  const svg = fs.readFileSync(file, 'utf8');

  return (
    <figure className={styles.figure}>
      <div
        className={styles.canvas}
        role="img"
        aria-label={caption}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
