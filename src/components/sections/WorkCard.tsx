import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/config/site';
import { localePath } from '@/lib/paths';
import styles from './WorkCard.module.css';

/**
 * Ansichtsmodell einer Projektkarte.
 *
 * Bewusst schon auf eine Sprache reduziert: die Karte wird innerhalb einer
 * Client-Komponente gerendert, und alles, was hier steht, landet im
 * RSC-Payload des HTML. Das vollstaendige zweisprachige Projekt-Objekt
 * mitzugeben wuerde diesen Payload verdoppeln.
 */
export interface WorkCardItem {
  slug: string;
  name: string;
  year: string;
  outcome: string;
  typeLabel: string;
  technologies: string[];
  palette: 'yellow' | 'blue' | 'green' | 'violet';
}

const paletteVars = (palette: WorkCardItem['palette']): CSSProperties =>
  ({
    '--accent-light': `var(--${palette}-9)`,
    '--accent-dark': `var(--${palette}-1)`,
  }) as CSSProperties;

export function WorkCard({ item, locale }: { item: WorkCardItem; locale: Locale }) {
  return (
    <Link
      href={localePath(locale, 'work', item.slug)}
      className={styles.card}
      style={paletteVars(item.palette)}
    >
      {/* data-work-img steuert den nachlaufenden Cursor. */}
      <div className={styles.frame} data-work-img data-palette={item.palette}>
        <div className={styles.visual}>
          <span className={styles.visualText}>{item.name}</span>
        </div>
      </div>

      <div className={styles.meta}>
        <h3 className={styles.name}>{item.name}</h3>
        <span className={`${styles.year} tnum`}>
          {item.year} · {item.typeLabel}
        </span>
      </div>

      <p className={styles.outcome}>{item.outcome}</p>

      <ul className={styles.tags}>
        {item.technologies.slice(0, 5).map((tech) => (
          <li key={tech} className={styles.tag}>
            {tech}
          </li>
        ))}
      </ul>
    </Link>
  );
}
