'use client';

import type { CSSProperties } from 'react';
import styles from './Preloader.module.css';

const NAME = 'patrick schadler';

/**
 * Vollbild-Overlay mit dem Namen. Wird ausschliesslich clientseitig gerendert
 * und taucht daher nicht im statischen HTML auf.
 */
export function Preloader({ leaving }: { leaving: boolean }) {
  return (
    <div className={styles.overlay} data-state={leaving ? 'leaving' : 'entering'} aria-hidden="true">
      <span className={styles.name}>
        {NAME.split('').map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={`${styles.char} ${letter === ' ' ? styles.space : ''}`}
            style={{ '--char-index': index } as CSSProperties}
          >
            {letter}
          </span>
        ))}
      </span>
    </div>
  );
}
