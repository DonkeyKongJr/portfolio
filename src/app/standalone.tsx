import { THEME_KEY } from '@/lib/theme';

/**
 * Bausteine fuer die beiden Seiten, die ihr eigenes Dokument rendern:
 * die 404-Seite und die Sprachweiche unter /.
 *
 * Beide liegen ausserhalb des [locale]-Layouts und bekommen daher weder das
 * Stylesheet noch das Boot-Skript. Ohne diese Kopie waeren sie dauerhaft
 * dunkel - auch fuer jemanden, der das helle Theme gewaehlt hat.
 */
export const STANDALONE_THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    document.documentElement.setAttribute('data-theme', stored === 'light' ? 'light' : 'dark');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

/** Nur die wenigen Tokens, die diese Seiten tatsaechlich brauchen. */
export const STANDALONE_STYLES = `
:root { color-scheme: dark; --bg:#141414; --fg:#dedede; --muted:#8a8a8a; }
:root[data-theme='light'] { color-scheme: light; --bg:#fbfaf8; --fg:#1a1815; --muted:#5c564d; }
html, body { margin:0; background: var(--bg); color: var(--fg); }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  min-height: 100dvh; display: grid; place-items: center; padding: 24px; text-align: center;
}
a { color: inherit; }
.eyebrow { font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin:0 0 16px; }
h1 { font-size: clamp(32px,6vw,56px); font-weight:500; letter-spacing:-.03em; margin:0; }
.lead { color: var(--muted); margin-top:12px; }
.cta { margin-top:28px; }
`;
