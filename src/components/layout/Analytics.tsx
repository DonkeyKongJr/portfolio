'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useSyncExternalStore } from 'react';
import { siteConfig, type Locale } from '@/config/site';
import { getConsent, getServerConsent, setConsent, subscribeConsent } from '@/lib/consent';
import { localePath } from '@/lib/paths';
import styles from './Analytics.module.css';

/**
 * Google Analytics hinter einem Einwilligungs-Gate.
 *
 * Im alten Stand stand gtag.js renderblockierend im <head> und feuerte
 * ungefragt. Hier wird das Skript erst nach ausdruecklicher Zustimmung
 * ueberhaupt geladen - vorher geht keine einzige Anfrage an Google.
 */
export interface ConsentLabels {
  message: string;
  accept: string;
  decline: string;
  more: string;
}

export function Analytics({ locale, labels }: { locale: Locale; labels: ConsentLabels }) {
  /*
   * Die Einwilligung liegt im localStorage, ist also externer Zustand.
   * useSyncExternalStore liefert serverseitig 'unknown' - dadurch enthaelt das
   * statische HTML kein Banner und es flackert beim Hydrieren nichts.
   */
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  const decide = (value: 'granted' | 'denied') => setConsent(value);

  return (
    <>
      {consent === 'granted' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${siteConfig.gaMeasurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {consent === 'unknown' ? (
        <div className={styles.banner} role="dialog" aria-live="polite" aria-label={labels.message}>
          <p className={styles.message}>{labels.message}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.accept}`}
              onClick={() => decide('granted')}
            >
              {labels.accept}
            </button>
            <button type="button" className={styles.button} onClick={() => decide('denied')}>
              {labels.decline}
            </button>
            <Link className={styles.more} href={localePath(locale, 'privacy')}>
              {labels.more}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
