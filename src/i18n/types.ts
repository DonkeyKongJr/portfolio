import type { de } from './de';

/**
 * Weitet die Literaltypen von `de` (das `as const` ist) auf, damit die
 * englische Fassung eigene Texte haben darf und trotzdem exakt dieselbe
 * Struktur erzwungen bekommt. Ein fehlender Key bricht den Build.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof de>;
