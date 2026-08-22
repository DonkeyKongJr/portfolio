'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { IntroContext } from './IntroContext';
import { Preloader } from './Preloader';
import { startScroll, stopScroll } from './SmoothScrollProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollLock } from '@/hooks/useScrollLock';

const SESSION_KEY = 'heroIntroPlayed';
/** Zeitpunkt, zu dem der Austritt startet (Referenzwert). */
const EXIT_AT = 1100;
/** Dauer des Austritts: 0.75s Verzoegerung + 1s Panel-Fahrt. */
const EXIT_DURATION = 1800;
/** Notbremse, falls ein Asset haengt - die Seite muss immer erscheinen. */
const HARD_TIMEOUT = 3000;

/**
 * Steuert die Startanimation.
 *
 * Sie laeuft nur beim ersten Aufruf pro Session und wird bei reduzierter
 * Bewegung ganz uebersprungen. Bei Wiederkehr setzt sie fuer 50ms
 * body[data-fast-entry], was alle ScrollReveals global verkuerzt - sonst
 * wirkt die Seite beim zweiten Besuch traege.
 *
 * Zwei Fallstricke, die hier bewusst vermieden werden:
 *
 *  - Kein useRef-Guard gegen mehrfaches Ausfuehren. Refs ueberleben den
 *    simulierten Remount von StrictMode, der Effect wuerde beim zweiten Mount
 *    sofort abbrechen und nie wieder etwas planen - ready bliebe fuer immer
 *    false und die Ueberschrift unsichtbar.
 *  - Das Session-Flag wird erst beim Austritt gesetzt, nicht beim Start.
 *    Wuerde es am Anfang geschrieben, saehe der zweite StrictMode-Mount die
 *    Intro als "schon gelaufen" an und uebersprungen sie.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  /*
   * Startwert 'entering', damit das Overlay bereits im statischen HTML steht
   * und die Seite ab dem ersten Paint abdeckt. Ob es sichtbar ist, entscheidet
   * allein CSS ueber data-js und data-intro (siehe Preloader.module.css) -
   * React entfernt es hinterher nur noch aus dem DOM.
   */
  const [preloader, setPreloader] = useState<'off' | 'entering' | 'leaving'>('entering');
  const [ready, setReady] = useState(false);
  const [played, setPlayed] = useState(false);

  useScrollLock(preloader !== 'off');

  useEffect(() => {
    const timers: number[] = [];
    const finish = () => {
      setPreloader('off');
      setReady(true);
      startScroll();
    };

    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1';

    if (alreadyPlayed || reducedMotion) {
      document.body.setAttribute('data-fast-entry', '');
      timers.push(
        window.setTimeout(() => document.body.removeAttribute('data-fast-entry'), 50),
        // Im naechsten Tick, damit kein Kaskadenrender aus dem Effect faellt.
        // Das Overlay ist per CSS ohnehin schon unsichtbar (data-intro="skip").
        window.setTimeout(() => {
          setPreloader('off');
          setReady(true);
        }, 0),
      );
      return () => {
        for (const timer of timers) window.clearTimeout(timer);
      };
    }

    /*
     * Der naechste Frame statt direkt im Effect-Body, damit kein
     * Kaskadenrender aus dem Effect faellt. Das Overlay laeuft zu diesem
     * Zeitpunkt schon - seine Zeichenanimation ist reines CSS und startet
     * bereits beim Parsen des HTML.
     */
    const start = requestAnimationFrame(() => {
      setPlayed(true);
      stopScroll();

      timers.push(
        window.setTimeout(() => {
          setPreloader('leaving');
          // Jetzt gilt die Intro als gespielt - siehe Hinweis oben.
          sessionStorage.setItem(SESSION_KEY, '1');
        }, EXIT_AT),
        // Der Hero startet, waehrend das Panel noch faehrt - bewusst ueberlappend.
        window.setTimeout(() => setReady(true), EXIT_AT + 750),
        window.setTimeout(finish, EXIT_AT + EXIT_DURATION),
        // Notbremse: eine Seite, die wegen des Preloaders nie erscheint, waere
        // der schlimmste anzunehmende Fehler.
        window.setTimeout(finish, HARD_TIMEOUT),
      );
    });

    return () => {
      cancelAnimationFrame(start);
      for (const timer of timers) window.clearTimeout(timer);
      startScroll();
    };
  }, [reducedMotion]);

  return (
    <IntroContext.Provider value={{ ready, played }}>
      {preloader === 'off' ? null : <Preloader leaving={preloader === 'leaving'} />}
      {children}
    </IntroContext.Provider>
  );
}
