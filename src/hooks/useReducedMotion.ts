'use client';

import { useCallback, useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Liest prefers-reduced-motion.
 *
 * useSyncExternalStore statt useState+useEffect: die Einstellung ist externer
 * Zustand des Browsers, kein React-Zustand. Damit gibt es weder eine
 * Kaskadenrenderung nach dem Mount noch eine Hydration-Abweichung - der
 * Server-Snapshot ist definiert false.
 */
export function useReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia(QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
