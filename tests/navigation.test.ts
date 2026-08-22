import { describe, expect, it } from 'vitest';
import { shouldInterceptNavigation, type ClickIntent } from '@/lib/navigation';

const base: ClickIntent = {
  href: 'https://schadler.dev/de/work/',
  current: 'https://schadler.dev/de/',
  target: null,
  hasDownload: false,
  nativeNav: false,
  modified: false,
};

const intent = (overrides: Partial<ClickIntent> = {}) => ({ ...base, ...overrides });

describe('shouldInterceptNavigation', () => {
  it('faengt interne Wechsel innerhalb derselben Sprache ab', () => {
    expect(shouldInterceptNavigation(intent())).toBe(true);
    expect(
      shouldInterceptNavigation(
        intent({ href: 'https://schadler.dev/de/work/qr-maker/', current: 'https://schadler.dev/de/work/' }),
      ),
    ).toBe(true);
  });

  it('laesst Sprachwechsel als vollstaendige Navigation durch', () => {
    // Der Vorhang wuerde sonst schliessen und beim Neuaufbau nie wieder oeffnen.
    expect(shouldInterceptNavigation(intent({ href: 'https://schadler.dev/en/' }))).toBe(false);
    expect(
      shouldInterceptNavigation(
        intent({ href: 'https://schadler.dev/en/work/qr-maker/', current: 'https://schadler.dev/de/work/qr-maker/' }),
      ),
    ).toBe(false);
  });

  it('respektiert data-native-nav', () => {
    expect(shouldInterceptNavigation(intent({ nativeNav: true }))).toBe(false);
  });

  it('laesst externe Ziele in Ruhe', () => {
    expect(shouldInterceptNavigation(intent({ href: 'https://github.com/DonkeyKongJr' }))).toBe(false);
    expect(shouldInterceptNavigation(intent({ href: 'mailto:hello@mrsd.at' }))).toBe(false);
  });

  it('laesst Downloads und neue Tabs in Ruhe', () => {
    expect(shouldInterceptNavigation(intent({ hasDownload: true }))).toBe(false);
    expect(shouldInterceptNavigation(intent({ target: '_blank' }))).toBe(false);
  });

  it('greift nicht bei Modifiertasten oder Sekundaerklick', () => {
    // Sonst liesse sich kein Link mehr in einem neuen Tab oeffnen.
    expect(shouldInterceptNavigation(intent({ modified: true }))).toBe(false);
  });

  it('greift nicht bei gleichem Pfad', () => {
    expect(shouldInterceptNavigation(intent({ href: 'https://schadler.dev/de/' }))).toBe(false);
  });
});
