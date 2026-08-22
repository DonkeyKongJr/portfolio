/**
 * Ersetzt {platzhalter} in Woerterbuchtexten.
 *
 * Die Texte bleiben damit einfache Strings statt Funktionen - wichtig, weil
 * sie an Client-Komponenten weitergereicht und dabei serialisiert werden.
 * Ein unbekannter Platzhalter bleibt sichtbar stehen, statt still zu
 * verschwinden: so faellt er beim Durchsehen sofort auf.
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
