'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './WorkCursor.module.css';

/** Anteil der Reststrecke pro Frame - kleiner Wert = mehr Nachlauf. */
const LERP = 0.1;
const OFFSET_X = 18;
const OFFSET_Y = 10;

const paletteColors: Record<string, { bg: string; fg: string }> = {
  yellow: { bg: 'var(--yellow-9)', fg: 'var(--yellow-4)' },
  blue: { bg: 'var(--blue-9)', fg: 'var(--blue-4)' },
  green: { bg: 'var(--green-9)', fg: 'var(--green-4)' },
  violet: { bg: 'var(--violet-9)', fg: 'var(--violet-4)' },
};

/**
 * Pille, die dem Zeiger ueber Projektbildern nachlaeuft.
 *
 * Die rAF-Schleife startet erst beim Betreten eines Bildes und stoppt beim
 * Verlassen - eine dauerhaft laufende Schleife fuer einen Effekt, den man
 * meistens nicht sieht, waere Verschwendung.
 */
export function WorkCursor({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [palette, setPalette] = useState('yellow');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const node = ref.current;
    if (!node) return;

    const target = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    let frame = 0;
    let active = false;

    const tick = () => {
      position.x += (target.x - position.x) * LERP;
      position.y += (target.y - position.y) * LERP;
      node.style.transform = `translate3d(${position.x + OFFSET_X}px, ${position.y + OFFSET_Y}px, 0)`;
      if (active) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      const hovered = (event.target as Element | null)?.closest?.('[data-work-img]');
      if (hovered) {
        const next = hovered.getAttribute('data-palette') ?? 'yellow';
        setPalette(next);
        if (!active) {
          // Ohne diesen Sprung fliegt die Pille aus der letzten Ecke heran.
          position.x = target.x;
          position.y = target.y;
          active = true;
          setVisible(true);
          frame = requestAnimationFrame(tick);
        }
      } else if (active) {
        active = false;
        cancelAnimationFrame(frame);
        setVisible(false);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  const colors = paletteColors[palette] ?? paletteColors.yellow!;

  return (
    <div
      ref={ref}
      className={styles.cursor}
      data-visible={visible}
      aria-hidden="true"
      style={{ '--cursor-bg': colors.bg, '--cursor-fg': colors.fg } as React.CSSProperties}
    >
      {label}
    </div>
  );
}
