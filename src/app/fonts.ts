import { Inter } from 'next/font/google';

/**
 * Inter als Fallback fuer Nicht-Apple-Plattformen.
 *
 * next/font laedt die Datei zur Build-Zeit herunter und liefert sie aus
 * /_next/static/media aus - zur Laufzeit gibt es also keine Anfrage an
 * Google. Der alte Stand hatte dafuer zwei <link>-Tags auf fonts.googleapis.com.
 *
 * Auf Apple-Geraeten greift ohnehin -apple-system (echtes SF Pro) und Inter
 * wird nie gebraucht; siehe --font-display in src/styles/tokens.css.
 */
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});
