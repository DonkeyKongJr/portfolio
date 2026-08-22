'use client';

import { GrainCanvas } from '@/components/motion/GrainCanvas';
import { useIntro } from '@/components/motion/IntroContext';
import { WordReveal } from '@/components/motion/WordReveal';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig, type Locale } from '@/config/site';
import { localePath } from '@/lib/paths';
import styles from './Hero.module.css';

export interface HeroCopy {
  eyebrow: string;
  headline: string;
  subline: string;
  primaryCta: string;
  secondaryCta: string;
}

export function Hero({ locale, copy }: { locale: Locale; copy: HeroCopy }) {
  const { ready } = useIntro();

  return (
    <section className={styles.hero}>
      <GrainCanvas />
      <Container>
        <div className={styles.inner}>
          <p className={`eyebrow ${styles.eyebrow}`}>{copy.eyebrow}</p>

          {/*
            Die Ueberschrift startet, waehrend der Vorhang noch faehrt -
            das Ueberlappen ist der Unterschied zwischen fluessig und zaeh.
          */}
          <WordReveal
            as="h1"
            className={styles.title}
            text={copy.headline}
            active={ready}
            exitOnScroll
          />

          <WordReveal
            as="p"
            className={styles.subline}
            text={copy.subline}
            active={ready}
            stagger={0.035}
            delay={0.55}
          />

          <div className={styles.actions}>
            <Button href={localePath(locale, 'work')} variant="primary">
              {copy.primaryCta}
            </Button>
            <Button href={`mailto:${siteConfig.email}`}>{copy.secondaryCta}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
