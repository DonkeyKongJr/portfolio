'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right';
type Delay = 0 | 1 | 2 | 3 | 4;

interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  delay?: Delay;
  slow?: boolean;
  /** Anteil des Elements, der sichtbar sein muss (0-1). */
  threshold?: number;
  className?: string;
}

const directionClass: Record<Direction, string> = {
  up: '',
  left: 'reveal--from-left',
  right: 'reveal--from-right',
};

/**
 * Blendet Inhalte beim Scrollen ein.
 *
 * Bewusst IntersectionObserver + CSS-Klasse statt einer Motion-Animation:
 * das ist der Grund, warum die Seite trotz vieler Effekte leicht bleibt.
 * Der Inhalt steht dabei vollstaendig im statischen HTML - nur die Sichtbarkeit
 * wird animiert, es wird nichts nachtraeglich eingefuegt.
 */
export function ScrollReveal({
  children,
  as: Tag = 'div',
  direction = 'up',
  delay = 0,
  slow = false,
  threshold = 0.15,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Sehr alte Browser ohne IntersectionObserver: sofort zeigen.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          // Einmalig: nach dem Reveal nicht wieder ausblenden.
          observer.unobserve(entry.target);
          // will-change wieder abraeumen, sonst haelt der Browser die Layer.
          window.setTimeout(() => setSettled(true), 1300);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const classes = [
    'reveal',
    directionClass[direction],
    slow ? 'reveal--slow' : '',
    delay > 0 ? `reveal--d${delay}` : '',
    visible ? 'is-visible' : '',
    settled ? 'is-settled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
