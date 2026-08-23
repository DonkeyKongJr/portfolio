'use client';

import { useSyncExternalStore } from 'react';
import { getConsent, getServerConsent, setConsent, subscribeConsent } from '@/lib/consent';
import styles from './ConsentSettings.module.css';

export interface ConsentSettingsLabels {
  statusGranted: string;
  statusDenied: string;
  statusUnknown: string;
  allow: string;
  deny: string;
  note: string;
}

/**
 * Dauerhafte Schaltstelle fuer die Analytics-Einwilligung.
 *
 * Das Banner erscheint nur, solange nichts entschieden ist - ohne diese Seite
 * waere die Wahl faktisch endgueltig und nur ueber das Loeschen der
 * Website-Daten zu aendern. Der Widerruf muss aber so einfach sein wie die
 * Zustimmung.
 */
export function ConsentSettings({ labels }: { labels: ConsentSettingsLabels }) {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);

  const status =
    consent === 'granted'
      ? labels.statusGranted
      : consent === 'denied'
        ? labels.statusDenied
        : labels.statusUnknown;

  const choose = (value: 'granted' | 'denied') => {
    const revoking = consent === 'granted' && value === 'denied';
    setConsent(value);
    /*
     * Beim Widerruf neu laden: gtag.js steckt dann schon im Dokument und
     * liesse sich durch blosses Aushaengen der Script-Tags nicht mehr stoppen.
     * Beim Erteilen ist das nicht noetig, dort wird es frisch geladen.
     */
    if (revoking) window.location.reload();
  };

  return (
    <div className={styles.panel}>
      <p className={styles.status}>
        <span className={styles.dot} data-state={consent} aria-hidden="true" />
        {/* Vor der Hydration steht hier der Server-Zustand; danach der echte. */}
        <span suppressHydrationWarning>{status}</span>
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          aria-pressed={consent === 'granted'}
          onClick={() => choose('granted')}
        >
          {labels.allow}
        </button>
        <button
          type="button"
          className={styles.button}
          aria-pressed={consent === 'denied'}
          onClick={() => choose('denied')}
        >
          {labels.deny}
        </button>
      </div>

      <p className={styles.note}>{labels.note}</p>
    </div>
  );
}
