'use client';

import { useEffect } from 'react';

/**
 * Sperrt das Scrollen ueber ein data-Attribut am <body>, damit sich mehrere
 * Aufrufer (Preloader, Page-Curtain, mobiles Menue) nicht gegenseitig den
 * overflow-Wert ueberschreiben.
 */
let lockCount = 0;

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    document.body.setAttribute('data-scroll-locked', '');

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.body.removeAttribute('data-scroll-locked');
    };
  }, [active]);
}
