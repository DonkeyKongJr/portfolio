import styles from './Ambient.module.css';

/**
 * Farbige, weiche Flecken hinter der ganzen Seite.
 *
 * Glas braucht etwas, das es brechen und weichzeichnen kann - ueber dem
 * flachen Seitenhintergrund wirkt es nur grau. Reines CSS (radial-gradients,
 * eine transform-Animation), kein JavaScript, kein Canvas: die Komponente ist
 * eine Server Component und kostet zur Laufzeit nur einen Compositor-Layer.
 */
export function Ambient() {
  return <div className={styles.ambient} aria-hidden="true" />;
}
