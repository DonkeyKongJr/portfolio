export const THEME_KEY = 'theme';
export type Theme = 'light' | 'dark';
/** Was im Speicher stehen kann: eine Wahl oder gar nichts. */
export type StoredTheme = Theme | null;

/** Ohne eigene Wahl bleibt es dunkel - das ist der Entwurf der Seite. */
export const DEFAULT_THEME: Theme = 'dark';

export const THEME_COLOR: Record<Theme, string> = {
  dark: '#141414',
  light: '#fbfaf8',
};

/**
 * Ermittelt das anzuzeigende Theme.
 *
 * Die Systemeinstellung geht hier bewusst nicht ein: Dunkel ist der Standard,
 * hell ist eine ausdrueckliche Entscheidung. Als reine Funktion herausgezogen,
 * weil dieselbe Logik im Boot-Skript, beim Umschalten und im Test gebraucht wird.
 */
export function resolveTheme(stored: StoredTheme): Theme {
  return stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME;
}

export function readStoredTheme(): StoredTheme {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    // Privater Modus oder blockierter Storage.
    return null;
  }
}

/**
 * Schreibt das Theme ins Dokument.
 *
 * Das data-Attribut steuert die Tokens, das theme-color-Meta die Faerbung der
 * Browser-Oberflaeche auf Mobilgeraeten - ohne das bliebe dort ein dunkler
 * Balken ueber einer hellen Seite stehen.
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}
