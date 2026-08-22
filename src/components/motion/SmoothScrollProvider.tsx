'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lenis-Smooth-Scroll.
 *
 * Die Instanz liegt auf window, damit Preloader und Page-Curtain das Scrollen
 * anhalten koennen, ohne dass wir dafuer einen Context durch den halben Baum
 * reichen muessen.
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScrollProvider() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Bei reduzierter Bewegung bleibt natives Scrollen aktiv.
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reducedMotion]);

  return null;
}

export function stopScroll() {
  window.__lenis?.stop();
}

export function startScroll() {
  window.__lenis?.start();
}
