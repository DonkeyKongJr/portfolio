import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { featuredProjects } from '@/content/projects';
import type { Locale } from '@/config/site';
import type { Dictionary } from '@/i18n/types';
import { localePath } from '@/lib/paths';
import { toWorkCardItem } from '@/lib/viewModels';
import { WorkCard } from './WorkCard';
import styles from './SelectedWork.module.css';

export function SelectedWork({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <Section id="work" eyebrow={t.home.workEyebrow} title={t.home.workTitle}>
      <div className={styles.list}>
        {featuredProjects.map((project) => (
          <ScrollReveal key={project.slug}>
            <WorkCard item={toWorkCardItem(project, locale, t)} locale={locale} />
          </ScrollReveal>
        ))}
      </div>
      <div className={styles.footer}>
        <Button href={localePath(locale, 'work')}>{t.home.workAll}</Button>
      </div>
    </Section>
  );
}
