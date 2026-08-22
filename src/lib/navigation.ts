/**
 * Entscheidet, ob der Seitenvorhang einen Klick abfangen darf.
 *
 * Als reine Funktion herausgezogen, weil die Regeln sonst als Verzweigungen in
 * einem Event-Handler liegen und nicht pruefbar waeren - und ein Fehler hier
 * bedeutet im schlimmsten Fall, dass ein Link gar nicht mehr funktioniert.
 */
export interface ClickIntent {
  /** Ziel des Links, absolut aufgeloest. */
  href: string;
  /** Aktuelle Adresse. */
  current: string;
  target: string | null;
  hasDownload: boolean;
  /** Links, die bewusst eine vollstaendige Navigation ausloesen sollen. */
  nativeNav: boolean;
  /** Sekundaerklick oder gedrueckte Modifiertaste. */
  modified: boolean;
}

export function shouldInterceptNavigation(intent: ClickIntent): boolean {
  if (intent.modified) return false;
  if (intent.nativeNav) return false;
  if (intent.hasDownload) return false;
  if (intent.target === '_blank') return false;

  let url: URL;
  let here: URL;
  try {
    here = new URL(intent.current);
    url = new URL(intent.href, intent.current);
  } catch {
    return false;
  }

  // Fremde Hosts, mailto: und tel: gehen den Vorhang nichts an.
  if (url.origin !== here.origin) return false;
  // Reine Sprungmarken auf derselben Seite.
  if (url.pathname === here.pathname) return false;

  /*
   * Sprachwechsel laufen als vollstaendige Navigation. Wuerde der Vorhang hier
   * schliessen, koennte ihn der anschliessende Neuaufbau der Seite nie wieder
   * oeffnen - die Seite bliebe verdeckt.
   */
  if (localeOf(url.pathname) !== localeOf(here.pathname)) return false;

  return true;
}

function localeOf(pathname: string): string {
  return pathname.split('/')[1] ?? '';
}
