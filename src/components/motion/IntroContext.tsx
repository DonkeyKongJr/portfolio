'use client';

import { createContext, useContext } from 'react';

interface IntroState {
  /** true, sobald der Hero starten darf. */
  ready: boolean;
  /** true, wenn die volle Intro gespielt wurde (nicht bei Wiederkehr). */
  played: boolean;
}

export const IntroContext = createContext<IntroState>({ ready: true, played: false });

export function useIntro(): IntroState {
  return useContext(IntroContext);
}
