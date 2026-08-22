import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { ArrowLeftIcon, ArrowUpRightIcon, GitHubIcon } from '@/components/icons';
import { JsonLd } from '@/components/layout/JsonLd';
import { Container } from '@/components/ui/Container';
import { locales, siteConfig, type Locale } from '@/config/site';
import { getProject, projects } from '@/content/projects';
import { getDictionary, isLocale } from '@/i18n';
import { breadcrumbJsonLd, jsonLdGraph, projectJsonLd } from '@/lib/jsonLd';
import { buildMetadata } from '@/lib/metadata';
import { localePath } from '@/lib/paths';
import styles from './page.module.css';

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

const accentVars = (palette: string): CSSProperties =>
  ({
    '--accent-light': `var(--${palette}-9)`,
    '--accent-dark': `var(--${palette}-1)`,
  }) as CSSProperties;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    locale,
    title: `${project.name} — ${project.role[locale]}`,
    description: project.summary[locale],
    segments: ['work', project.slug],
    type: 'article',
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();

  const t = getDictionary(locale as Locale);
  const hasLinks = Boolean(project.url || project.github);

  return (
    <>
      <div className={styles.hero} style={accentVars(project.palette)}>
        <Container>
          <Link href={localePath(locale, 'work')} className={styles.back}>
            <ArrowLeftIcon width={16} height={16} />
            {t.work.backToWork}
          </Link>
          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.summary}>{project.summary[locale]}</p>

          <div className={styles.visual} aria-hidden="true">
            <span className={styles.visualText}>{project.name}</span>
          </div>

          <div className={styles.layout}>
            <div className={styles.body}>
              {project.description[locale].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <aside className={styles.meta}>
              <div>
                <p className={styles.metaLabel}>{t.work.year}</p>
                <p className={`${styles.metaValue} tnum`}>{project.year}</p>
              </div>
              <div>
                <p className={styles.metaLabel}>{t.work.role}</p>
                <p className={styles.metaValue}>{project.role[locale]}</p>
              </div>
              <div>
                <p className={styles.metaLabel}>{t.work.stack}</p>
                <ul className={styles.stack}>
                  {project.technologies.map((tech) => (
                    <li key={tech} className={styles.stackItem}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.links}>
                {project.url ? (
                  <a
                    className={styles.link}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.work.visitSite}
                    <ArrowUpRightIcon width={16} height={16} />
                  </a>
                ) : null}
                {project.github ? (
                  <a
                    className={styles.link}
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon width={16} height={16} />
                    {t.work.viewSource}
                  </a>
                ) : null}
                {/* Vier Projekte haben weder URL noch Repo - das muss die Seite aushalten. */}
                {hasLinks ? null : <p className={styles.noLink}>{t.work.noLink}</p>}
              </div>
            </aside>
          </div>
        </Container>
      </div>

      <JsonLd
        data={jsonLdGraph(
          projectJsonLd(project, locale),
          breadcrumbJsonLd([
            { name: t.nav.home, url: `${siteConfig.url}/${locale}/` },
            { name: t.work.title, url: `${siteConfig.url}/${locale}/work/` },
            { name: project.name, url: `${siteConfig.url}/${locale}/work/${project.slug}/` },
          ]),
        )}
      />
    </>
  );
}
