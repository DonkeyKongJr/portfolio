// @vitest-environment jsdom

import { StrictMode } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntroProvider } from '@/components/motion/IntroProvider';
import { useIntro } from '@/components/motion/IntroContext';

/** Zeigt an, ob der Hero starten darf. */
function ReadyProbe() {
  const { ready } = useIntro();
  return <span data-testid="ready">{String(ready)}</span>;
}

function setReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
  setReducedMotion(false);
  // jsdom kennt kein requestAnimationFrame mit Timerbezug.
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(performance.now()), 16),
  );
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const ready = () => screen.getByTestId('ready').textContent;

describe('IntroProvider', () => {
  it('gibt den Hero unter StrictMode frei', () => {
    /*
     * Der eigentliche Punkt dieses Tests: StrictMode montiert im Dev-Modus
     * zweimal und raeumt dazwischen auf. Ein useRef-Guard ueberlebt das und
     * verhindert, dass beim zweiten Mount noch irgendetwas geplant wird -
     * ready bliebe dauerhaft false und die Ueberschrift unsichtbar.
     */
    render(
      <StrictMode>
        <IntroProvider>
          <ReadyProbe />
        </IntroProvider>
      </StrictMode>,
    );

    expect(ready()).toBe('false');

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(ready()).toBe('true');
    // Nach Abschluss muss das Overlay wieder aus dem DOM sein.
    expect(document.querySelector('[data-state]')).toBeNull();
  });

  it('spielt die Intro und setzt danach das Session-Flag', () => {
    render(
      <IntroProvider>
        <ReadyProbe />
      </IntroProvider>,
    );

    /*
     * Das Overlay steht schon im ersten Render - nur so deckt es die Seite ab
     * dem ersten Paint ab, statt erst nach der Hydration aufzutauchen.
     */
    expect(document.querySelector('[data-state="entering"]')).not.toBeNull();

    // Vor dem Austritt darf das Flag noch nicht stehen, sonst wuerde ein
    // zweiter Mount die Intro faelschlich als gelaufen ansehen.
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(sessionStorage.getItem('heroIntroPlayed')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(sessionStorage.getItem('heroIntroPlayed')).toBe('1');
    // Der Vorhang faehrt jetzt weg, ist aber noch im DOM.
    expect(document.querySelector('[data-state="leaving"]')).not.toBeNull();
  });

  it('ueberspringt die Intro beim zweiten Besuch in derselben Session', () => {
    sessionStorage.setItem('heroIntroPlayed', '1');

    render(
      <IntroProvider>
        <ReadyProbe />
      </IntroProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(ready()).toBe('true');
    expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('ueberspringt die Intro bei reduzierter Bewegung', () => {
    setReducedMotion(true);

    render(
      <IntroProvider>
        <ReadyProbe />
      </IntroProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(ready()).toBe('true');
    expect(sessionStorage.getItem('heroIntroPlayed')).toBeNull();
  });
});
