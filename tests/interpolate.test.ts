import { describe, expect, it } from 'vitest';
import { CAREER_START_YEAR, yearsOfExperience } from '@/config/site';
import { de } from '@/i18n/de';
import { en } from '@/i18n/en';
import { interpolate } from '@/lib/interpolate';

describe('yearsOfExperience', () => {
  it('rechnet vom Startjahr 2009 weg', () => {
    expect(CAREER_START_YEAR).toBe(2009);
    expect(yearsOfExperience(new Date('2026-08-22T12:00:00Z'))).toBe(17);
    expect(yearsOfExperience(new Date('2030-01-01T12:00:00Z'))).toBe(21);
  });

  it('waechst mit jedem Jahreswechsel', () => {
    const a = yearsOfExperience(new Date('2026-12-31T12:00:00Z'));
    const b = yearsOfExperience(new Date('2027-01-01T12:00:00Z'));
    expect(b).toBe(a + 1);
  });
});

describe('interpolate', () => {
  it('ersetzt Platzhalter', () => {
    expect(interpolate('Seit über {years} Jahren', { years: 17 })).toBe('Seit über 17 Jahren');
    expect(interpolate('{years}+ Jahre', { years: 17 })).toBe('17+ Jahre');
  });

  it('laesst unbekannte Platzhalter stehen', () => {
    // Sichtbar stehen lassen statt still loeschen - so faellt es beim
    // Durchsehen auf, statt einen Satz zu verstuemmeln.
    expect(interpolate('Hallo {name}', { years: 17 })).toBe('Hallo {name}');
  });

  it('laesst Text ohne Platzhalter unveraendert', () => {
    expect(interpolate('Nichts zu ersetzen', { years: 17 })).toBe('Nichts zu ersetzen');
  });
});

describe('Woerterbuecher', () => {
  it('verwenden den Platzhalter statt einer festen Zahl', () => {
    for (const dict of [de, en]) {
      expect(dict.home.subline).toContain('{years}');
      expect(dict.home.proof[0]).toContain('{years}');
      // Eine hartcodierte Jahreszahl wuerde stillschweigend veralten.
      expect(dict.home.subline).not.toMatch(/\b1[5-9] (Jahren|years)\b/);
    }
  });
});
