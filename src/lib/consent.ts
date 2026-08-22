const KEY = 'analyticsConsent';

/**
 * 'ssr' ist der Zustand vor dem Hydrieren. Er ist bewusst von 'unknown'
 * getrennt: sonst stuende das Einwilligungsbanner im statischen HTML und waere
 * ohne JavaScript sichtbar, aber nicht wegklickbar.
 */
export type Consent = 'granted' | 'denied' | 'unknown' | 'ssr';

const listeners = new Set<() => void>();
/** Gecachter Snapshot: useSyncExternalStore verlangt referenzstabile Werte. */
let snapshot: Consent | undefined;

function read(): Consent {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'granted' || stored === 'denied' ? stored : 'unknown';
  } catch {
    // Privater Modus oder blockierter Storage: dann eben keine Einwilligung.
    return 'unknown';
  }
}

export function subscribeConsent(onChange: () => void) {
  listeners.add(onChange);
  // Auch auf Aenderungen in anderen Tabs reagieren.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    snapshot = undefined;
    onChange();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function getConsent(): Consent {
  snapshot ??= read();
  return snapshot;
}

export function getServerConsent(): Consent {
  return 'ssr';
}

export function setConsent(value: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Ohne Storage gilt die Entscheidung nur fuer diesen Seitenaufruf.
  }
  snapshot = value;
  for (const listener of listeners) listener();
}
