'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Principles.module.css';

/* Akzent als Textfarbe - die Tokens wechseln die Stufe je nach Theme. */
const ACCENTS = [
  'var(--accent-ink-blue)',
  'var(--accent-ink-violet)',
  'var(--accent-ink-green)',
  'var(--accent-ink-yellow)',
];
/** Anteil der Kartenhoehe an der Viewport-Hoehe. Muss zu .card passen. */
const CARD_VH = 0.5;
/** Weiche Kante der Masken-Loeschung in Prozent. */
const MASK_FEATHER = 30;
/** Wie weit sich die zeilenweise Aufloesung ueber die Karte verteilt. */
const LINE_SPREAD = 0.7;
const LINE_DURATION = 0.3;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Gestapelte Prinzipienkarten.
 *
 * Die ausgehende Karte bekommt aus einem einzigen passiven Scroll-Listener
 * drei Behandlungen gleichzeitig: Masken-Loeschung von unten nach oben,
 * zeilenweise Aufloesung der Woerter (unterste Zeile zuerst) und eine
 * Tiefenskalierung. Alles zusammen laesst die Karte zerfallen statt nur
 * zu verschwinden.
 */
export interface PrincipleItem {
  id: string;
  title: string;
  body: string;
}

/*
 * Inhalte kommen als Props herein, nicht per Import aus dem Content-Layer.
 * Der importiert zod fuer die Schema-Pruefung - und alles, was eine
 * Client-Komponente importiert, landet im Browser-Bundle. Das waren 67 KB
 * gzip fuer eine Validierung, die ausschliesslich zur Build-Zeit laeuft.
 */
export function Principles({
  items,
  eyebrow,
  title,
}: {
  items: PrincipleItem[];
  eyebrow: string;
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const itemCount = items.length;

  useEffect(() => {
    if (reducedMotion) return;

    const root = rootRef.current;
    if (!root) return;

    // Woerter je Karte einmal nach visuellen Zeilen gruppieren (per offsetTop).
    let lineGroups: HTMLElement[][][] = [];

    const measure = () => {
      lineGroups = cardRefs.current.map((card) => {
        if (!card) return [];
        const words = Array.from(card.querySelectorAll<HTMLElement>(`.${styles.word}`));
        const byTop = new Map<number, HTMLElement[]>();
        for (const word of words) {
          const top = Math.round(word.offsetTop);
          const bucket = byTop.get(top);
          if (bucket) bucket.push(word);
          else byTop.set(top, [word]);
        }
        return Array.from(byTop.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([, group]) => group);
      });
    };

    let lastIndex = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const segment = window.innerHeight * CARD_VH;
      const stickyTop = window.innerHeight * 0.32 - 25;
      const rect = root.getBoundingClientRect();
      const scrolled = -rect.top + stickyTop;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const progress = clamp01((scrolled - index * segment) / segment);

        if (progress <= 0) {
          card.style.removeProperty('mask-image');
          card.style.removeProperty('-webkit-mask-image');
          card.style.removeProperty('transform');
        } else {
          // 1. Maske loescht die Karte von unten nach oben weg.
          const p = progress * 100;
          const mask = `linear-gradient(to top, transparent ${p}%, black ${Math.min(100, p + MASK_FEATHER)}%)`;
          card.style.setProperty('mask-image', mask);
          card.style.setProperty('-webkit-mask-image', mask);

          // 3. Verdeckte Karten treten in die Tiefe zurueck.
          const scale = Math.max(0.88, 1 - 0.06 * progress * (index + 1) * 0.25);
          card.style.transform = `scale(${scale})`;
        }

        // 2. Zeilenweise Aufloesung, unterste Zeile zuerst.
        const lines = lineGroups[index] ?? [];
        const lineCount = lines.length || 1;
        lines.forEach((line, lineIndex) => {
          const fromBottom = lineCount - 1 - lineIndex;
          const start = (fromBottom / Math.max(1, lineCount - 1)) * LINE_SPREAD;
          const local = clamp01((progress - start) / LINE_DURATION);
          for (const word of line) {
            word.style.transform = `translateY(${local * 20}px)`;
            word.style.opacity = String(1 - local);
          }
        });
      });

      // Zaehler: die oberste noch sichtbare Karte bestimmt die Ziffer.
      const current = Math.min(itemCount - 1, Math.max(0, Math.floor(scrolled / segment + 0.5)));
      if (current !== lastIndex) {
        setDirection(current > lastIndex ? 1 : -1);
        lastIndex = current;
        setActiveIndex(current);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    measure();
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      measure();
      update();
    });
    resizeObserver.observe(root);

    return () => {
      window.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
    };
  }, [reducedMotion, itemCount]);

  return (
    <section className={styles.stack} aria-labelledby="principles-title">
      <Container>
        <div className={styles.header}>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="principles-title" className={styles.headerTitle}>
              {title}
            </h2>
          </div>
          <p className={`${styles.counter} tnum`} aria-hidden="true">
            <span className={styles.counterDigits}>
              {/*
                Der key-Wechsel montiert das span neu, wodurch die
                CSS-Animation erneut startet. Richtungsabhaengig ueber
                data-direction - das ersetzt AnimatePresence vollstaendig.
              */}
              <span key={activeIndex} className={styles.digit} data-direction={direction}>
                {activeIndex + 1}
              </span>
            </span>
            <span className={styles.counterTotal}>&nbsp;/&nbsp;{itemCount}</span>
          </p>
        </div>

        <div ref={rootRef} className={styles.cards}>
          {items.map((principle, index) => (
            <article
              key={principle.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={styles.card}
              style={{ '--accent': ACCENTS[index] } as CSSProperties}
            >
              <p className={`${styles.index} tnum`}>{String(index + 1).padStart(2, '0')}</p>
              <h3 className={styles.title}>{splitWords(principle.title)}</h3>
              <p className={styles.body}>{splitWords(principle.body)}</p>
            </article>
          ))}
          <div className={styles.spacer} />
        </div>
      </Container>
    </section>
  );
}

/**
 * Zerlegt Text in Wort-Spans, damit die zeilenweise Aufloesung sie einzeln
 * bewegen kann. Der Text bleibt als zusammenhaengender Inhalt im DOM.
 */
function splitWords(text: string) {
  return text.split(' ').map((word, index, all) => (
    <span key={`${word}-${index}`} className={styles.word}>
      {index < all.length - 1 ? `${word} ` : word}
    </span>
  ));
}
