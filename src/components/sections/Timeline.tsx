import { ArrowUpRightIcon } from '@/components/icons';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import type { Locale } from '@/config/site';
import { jobs } from '@/content/jobs';
import type { Dictionary } from '@/i18n/types';
import styles from './Timeline.module.css';

export function Timeline({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <ol className={styles.list}>
      {jobs.map((job) => (
        <ScrollReveal as="li" key={job.id} className={styles.item}>
          <div className={styles.period}>
            {/* Tabellenziffern, damit die Jahreszahlen buendig untereinander stehen. */}
            <span className="tnum">
              {job.from} — {job.till ?? t.about.present}
            </span>
            {job.current ? (
              <span className={styles.current}>
                <span className={styles.pulse} aria-hidden="true" />
                {t.about.present}
              </span>
            ) : null}
          </div>

          <div>
            <h3 className={styles.role}>{job.role[locale]}</h3>
            <p className={styles.company}>
              {/* Autotronic existiert nicht mehr - dort steht der Name ohne Link. */}
              {job.link ? (
                <a
                  className={styles.companyLink}
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {job.company}
                  <ArrowUpRightIcon width={14} height={14} />
                </a>
              ) : (
                job.company
              )}
            </p>
            <div className={styles.description}>
              {job.description[locale].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </ol>
  );
}
