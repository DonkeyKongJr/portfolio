import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, resolveTheme, THEME_COLOR } from '@/lib/theme';

describe('resolveTheme', () => {
  it('ist ohne eigene Wahl dunkel', () => {
    // Die Systemeinstellung geht bewusst nicht ein - die Seite ist dunkel
    // entworfen, hell ist ein Angebot und keine Voreinstellung.
    expect(resolveTheme(null)).toBe('dark');
    expect(DEFAULT_THEME).toBe('dark');
  });

  it('uebernimmt die getroffene Wahl', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('hat fuer beide Themes eine Browserleisten-Farbe', () => {
    expect(THEME_COLOR.dark).toBe('#141414');
    expect(THEME_COLOR.light).toBe('#fbfaf8');
  });
});
