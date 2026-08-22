import next from 'eslint-config-next';

/**
 * eslint-config-next 16 liefert bereits ein Flat-Config-Array - es wird direkt
 * gespreizt. Der Umweg ueber FlatCompat aus der eslintrc-Aera ist hier falsch
 * und laeuft in eine zirkulaere Struktur.
 */
const config = [
  { ignores: ['legacy/**', 'out/**', '.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...next,
];

export default config;
