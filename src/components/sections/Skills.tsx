import type { CSSProperties } from 'react';
import { ArrowUpRightIcon } from '@/components/icons';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import type { Locale } from '@/config/site';
import { certifications, education, skillGroups } from '@/content/about';
import { ossRepos } from '@/content/oss';
import styles from './Skills.module.css';

export function Skills({ locale }: { locale: Locale }) {
  return (
    <div className={styles.groups}>
      {skillGroups.map((group) => (
        <ScrollReveal key={group.id}>
          <h3 className={styles.groupTitle}>{group.title[locale]}</h3>
          <ul className={styles.pills}>
            {group.items.map((item, index) => (
              <li
                key={item}
                className={styles.pill}
                style={{ '--pill-index': index } as CSSProperties}
              >
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      ))}
    </div>
  );
}

export function OpenSource({ locale }: { locale: Locale }) {
  return (
    <div className={styles.oss}>
      {ossRepos.map((repo) => (
        <ScrollReveal key={repo.name}>
          <a className={styles.repo} href={repo.url} target="_blank" rel="noopener noreferrer">
            <span className={styles.repoName}>
              {repo.name}
              <ArrowUpRightIcon width={14} height={14} />
            </span>
            <span className={styles.repoDescription}>{repo.description[locale]}</span>
            <span className={styles.repoLanguage}>{repo.language}</span>
          </a>
        </ScrollReveal>
      ))}
    </div>
  );
}

export function Education({ locale }: { locale: Locale }) {
  return (
    <div className={styles.education}>
      {education.map((entry) => (
        <ScrollReveal key={entry.id} className={styles.eduItem}>
          <p className={`${styles.eduPeriod} tnum`}>
            {entry.from} — {entry.till}
          </p>
          <div>
            <p className={styles.eduQualification}>{entry.qualification[locale]}</p>
            <p className={styles.eduInstitution}>{entry.institution}</p>
          </div>
        </ScrollReveal>
      ))}
      {certifications.map((cert) => (
        <ScrollReveal key={cert.id} className={styles.eduItem}>
          <p className={`${styles.eduPeriod} tnum`}>
            {cert.issued}
            {cert.expires ? ` — ${cert.expires}` : ''}
          </p>
          <div>
            <p className={styles.eduQualification}>{cert.title}</p>
            <p className={styles.eduInstitution}>{cert.issuer}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
