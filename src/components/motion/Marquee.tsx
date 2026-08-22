import styles from './Marquee.module.css';

/**
 * Endlos laufendes Band.
 *
 * Der Inhalt liegt dreifach im DOM: die Animation schiebt um -50%, also
 * muessen mindestens zwei identische Gruppen nebeneinander stehen, damit der
 * Sprung unsichtbar bleibt. Die dritte Gruppe deckt sehr breite Viewports ab.
 *
 * Bewusst eine Server-Komponente - hier laeuft kein JavaScript.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const group = (
    <div className={styles.group} aria-hidden="true">
      {items.map((item, index) => (
        <span className={styles.item} key={`${item}-${index}`}>
          <span>{item}</span>
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.bar}>
      {/* Nur die erste Gruppe ist fuer Screenreader sichtbar. */}
      <div className={styles.track}>
        <div className={styles.group}>
          {items.map((item, index) => (
            <span className={styles.item} key={`${item}-${index}`}>
              <span>{item}</span>
              <span className={styles.dot} aria-hidden="true" />
            </span>
          ))}
        </div>
        {group}
        {group}
      </div>
    </div>
  );
}
