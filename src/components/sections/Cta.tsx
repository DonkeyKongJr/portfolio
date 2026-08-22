import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/i18n/types';
import styles from './Cta.module.css';

export function Cta({ t }: { t: Dictionary }) {
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    t.contact.mailSubject,
  )}&body=${encodeURIComponent(t.contact.mailBody)}`;

  return (
    <section className={styles.cta}>
      <Container>
        <ScrollReveal>
          <p className={styles.title}>{t.home.ctaTitle}</p>
          <p className={styles.subtitle}>{t.home.ctaSubtitle}</p>
          <div className={styles.actions}>
            <Button href={mailto} variant="primary">
              {t.home.ctaButton}
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
