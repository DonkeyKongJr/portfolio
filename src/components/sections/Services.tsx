import type { CSSProperties } from 'react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Section } from '@/components/ui/Section';
import { services } from '@/content/about';
import type { Locale } from '@/config/site';
import type { Dictionary } from '@/i18n/types';
import styles from './Services.module.css';

const cardBg: Record<string, string> = {
  violet: 'var(--violet-9)',
  yellow: 'var(--yellow-9)',
  blue: 'var(--blue-9)',
  green: 'var(--green-9)',
};

export function Services({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <Section eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle}>
      <div className={styles.grid}>
        {services.map((service, index) => (
          <ScrollReveal key={service.id} delay={index === 0 ? 0 : 1}>
            <article
              className={styles.card}
              style={{ '--card-bg': cardBg[service.palette] } as CSSProperties}
            >
              <h3 className={styles.title}>{service.title[locale]}</h3>
              <p className={styles.description}>{service.description[locale]}</p>
              <ul className={styles.bullets}>
                {service.bullets[locale].map((bullet) => (
                  <li key={bullet} className={styles.bullet}>
                    <span className={styles.bulletMark} aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
