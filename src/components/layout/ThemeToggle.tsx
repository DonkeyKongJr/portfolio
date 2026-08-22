'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';
import {
  applyTheme,
  DEFAULT_THEME,
  readStoredTheme,
  resolveTheme,
  THEME_KEY,
  type Theme,
} from '@/lib/theme';
import styles from './ThemeToggle.module.css';

const listeners = new Set<() => void>();
let snapshot: Theme | undefined;

function emit() {
  snapshot = undefined;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // Auf eine Wahl reagieren, die in einem anderen Tab getroffen wurde.
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_KEY) emit();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): Theme {
  snapshot ??= resolveTheme(readStoredTheme());
  return snapshot;
}

/**
 * Serverseitig ist nur der Standard bekannt. Eine abweichende Wahl liegt im
 * localStorage und wird erst nach der Hydration sichtbar - was unkritisch ist,
 * weil die Farben ohnehin am data-Attribut des <html> haengen, das schon vor
 * dem ersten Paint steht.
 */
function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Ohne Storage gilt die Wahl nur fuer diesen Seitenaufruf.
    }
    applyTheme(next);
    emit();
  }, [theme]);

  return (
    <button
      type="button"
      className={styles.toggle}
      data-theme={theme}
      onClick={toggle}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      title={theme === 'dark' ? labels.toLight : labels.toDark}
    >
      <span className={styles.icons}>
        <SunIcon width={18} height={18} className={`${styles.icon} ${styles.sun}`} />
        <MoonIcon width={18} height={18} className={`${styles.icon} ${styles.moon}`} />
      </span>
    </button>
  );
}
