'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { shouldInterceptNavigation } from '@/lib/navigation';
import styles from './Curtain.module.css';

/** Hoehe des Wellenbereichs ueber der Flaeche. */
const WAVE_BAND = 56;
const WAVE_BASE = 28;
const WAVE_AMPLITUDE = 10;
const LOBES = 8;
const DURATION = 1;
/* Als CSS-Kurve, weil die Web Animations API sie direkt versteht. */
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

/**
 * Baut die gewellte Oberkante.
 *
 * Die Welle ist der eigentliche Grund, warum der Uebergang hochwertig wirkt -
 * eine gerade Kante liest sich wie ein Balken, der ueber den Bildschirm faehrt.
 */
function wavePath(width: number, height: number): string {
  const segment = width / LOBES;
  let d = `M 0,${WAVE_BASE}`;

  for (let i = 0; i < LOBES; i += 1) {
    const x0 = i * segment;
    const x1 = x0 + segment;
    // Abwechselnd nach oben und unten ausschlagen.
    const target = WAVE_BASE + (i % 2 === 0 ? -WAVE_AMPLITUDE : WAVE_AMPLITUDE);
    const from = WAVE_BASE + (i % 2 === 0 ? WAVE_AMPLITUDE : -WAVE_AMPLITUDE);
    const start = i === 0 ? WAVE_BASE : from;
    d += ` C ${x0 + segment * 0.5},${start} ${x0 + segment * 0.5},${target} ${x1},${target}`;
  }

  d += ` L ${width},${height + WAVE_BAND} L 0,${height + WAVE_BAND} Z`;
  return d;
}

export function Curtain() {
  const ref = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState(false);
  const pending = useRef<string | null>(null);
  const closedFor = useRef<string | null>(null);

  useEffect(() => {
    const measure = () => {
      setSize({
        width: window.innerWidth,
        // visualViewport, nicht innerHeight: sonst stimmt es auf Mobile mit
        // ein- und ausfahrender Adressleiste nicht.
        height: window.visualViewport?.height ?? window.innerHeight,
      });
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  const travel = size.height + WAVE_BAND;

  const setY = useCallback((value: number) => {
    if (ref.current) ref.current.style.transform = `translateY(${value}px)`;
  }, []);

  /**
   * Fahrt von einer Position zur anderen, ueber die Web Animations API.
   * Die ist im Browser eingebaut und kostet kein einziges Byte im Bundle -
   * eine Animationsbibliothek nur fuer zwei Tweens waere hier verschwendet.
   */
  const slide = useCallback(
    (from: number, to: number, onDone: () => void) => {
      const node = ref.current;
      if (!node) {
        onDone();
        return;
      }
      setY(from);
      const animation = node.animate(
        [{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }],
        { duration: DURATION * 1000, easing: EASE, fill: 'forwards' },
      );
      animation.onfinish = () => {
        // Endzustand als Inline-Style festschreiben und die Animation abraeumen,
        // sonst blockiert fill: 'forwards' spaetere Zuweisungen.
        animation.cancel();
        setY(to);
        onDone();
      };
    },
    [setY],
  );

  // Klicks auf interne Links abfangen und erst den Vorhang schliessen.
  useEffect(() => {
    if (reducedMotion) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const intercept = shouldInterceptNavigation({
        href: anchor.href,
        current: window.location.href,
        target: anchor.getAttribute('target'),
        hasDownload: anchor.hasAttribute('download'),
        nativeNav: anchor.hasAttribute('data-native-nav'),
        modified:
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
      });
      if (!intercept) return;

      const url = new URL(anchor.href, window.location.href);

      event.preventDefault();
      pending.current = url.pathname + url.search;
      setActive(true);

      slide(travel, 0, () => {
        closedFor.current = pending.current;
        if (pending.current) router.push(pending.current);
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [reducedMotion, router, travel, slide]);

  // Nach dem Routenwechsel den Vorhang wieder aufziehen.
  useEffect(() => {
    if (!closedFor.current) return;
    closedFor.current = null;
    pending.current = null;
    window.scrollTo(0, 0);

    slide(0, -travel, () => setActive(false));
  }, [pathname, travel, slide]);

  // Sicherheitsnetz: ein haengender Push darf die Seite nicht dauerhaft verdecken.
  useEffect(() => {
    if (!active) return;
    const failsafe = window.setTimeout(() => setActive(false), 4000);
    return () => window.clearTimeout(failsafe);
  }, [active, pathname]);

  if (reducedMotion || size.width === 0) return null;

  return (
    <svg
      ref={ref}
      className={styles.curtain}
      data-active={active}
      width={size.width}
      height={size.height + WAVE_BAND}
      viewBox={`0 0 ${size.width} ${size.height + WAVE_BAND}`}
      aria-hidden="true"
      style={{ transform: `translateY(${travel}px)` }}
    >
      <path className={styles.shape} d={wavePath(size.width, size.height)} />
    </svg>
  );
}
