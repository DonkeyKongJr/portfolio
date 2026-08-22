import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WorkCursor } from '@/components/motion/WorkCursor';
import { PageHeader } from '@/components/sections/PageHeader';
import { WorkGrid } from '@/components/sections/WorkGrid';
import { projects } from '@/content/projects';
import { toWorkGridItem } from '@/lib/viewModels';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, 'work', ['work']) : {};
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.work.eyebrow} title={t.work.headline} lead={t.work.description} />
      <WorkGrid
        items={projects.map((project) => toWorkGridItem(project, locale, t))}
        locale={locale}
        filters={[
          { key: 'all', label: t.work.filterAll },
          // Nur Filter anbieten, zu denen es auch Projekte gibt.
          ...Array.from(new Set(projects.map((project) => project.type))).map((type) => ({
            key: type,
            label: t.work.filters[type],
          })),
        ]}
      />
      <WorkCursor label={t.work.viewProject} />
    </>
  );
}
