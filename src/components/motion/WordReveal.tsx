'use client';

import { useEffect, useState, type CSSProperties, type ElementType } from 'react';
import styles from './WordReveal.module.css';

type RevealState = 'hidden' | 'visible' | 'exit';

interface WordRevealProps {
  text: string;
  as?: ElementType;
  /** Sobald true, faehrt der Text aus der Maske nach oben ins Bild. */
  active: boolean;
  /** Wenn true, faehrt der Text beim Scrollen wieder in die Maske zurueck. */
  exitOnScroll?: boolean;
  /** Sekunden zwischen zwei Woertern. */
  stagger?: number;
  /** Sekunden Vorlauf vor dem ersten Wort. */
  delay?: number;
  className?: string;
}

/** Anteil der Viewport-Hoehe, ab dem der Hero-Titel wieder verschwindet. */
const EXIT_THRESHOLD = 0.38;

export function WordReveal({
  text,
  as: Tag = 'span',
  active,
  exitOnScroll = false,
  stagger = 0.055,
  delay = 0.05,
  className,
}: WordRevealProps) {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!exitOnScroll) return;

    const onScroll = () => {
      setScrolledPast(window.scrollY > window.innerHeight * EXIT_THRESHOLD);
    };
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [exitOnScroll]);

  // Erst nach Abschluss der Einblendung den Clip freigeben.
  useEffect(() => {
    if (!active) return;
    const words = text.trim().split(/\s+/).length;
    const total = (delay + words * stagger + 0.75) * 1000;
    const timer = window.setTimeout(() => setSettled(true), total);
    return () => window.clearTimeout(timer);
  }, [active, text, delay, stagger]);

  const state: RevealState = !active ? 'hidden' : scrolledPast ? 'exit' : 'visible';
  const words = text.split(' ');

  return (
    <Tag
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-state={state}
      style={
        {
          '--stagger': `${stagger}s`,
          '--delay-base': `${delay}s`,
        } as CSSProperties
      }
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className={styles.clip} data-settled={settled && state === 'visible'}>
            <span className={styles.inner} style={{ '--index': index } as CSSProperties}>
              {word}
            </span>
          </span>
          {index < words.length - 1 ? <span className={styles.space}> </span> : null}
        </span>
      ))}
    </Tag>
  );
}
