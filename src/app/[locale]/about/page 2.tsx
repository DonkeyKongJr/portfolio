import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/sections/PageHeader';
import { Education, OpenSource, Skills } from '@/components/sections/Skills';
import { Timeline } from '@/components/sections/Timeline';
import { Section } from '@/components/ui/Section';
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
  return isLocale(locale) ? pageMetadata(locale, 'about', ['about']) : {};
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.headline} lead={t.about.bio} />

      <Section eyebrow={t.about.timelineEyebrow} title={t.about.timelineTitle}>
        <Timeline locale={locale} t={t} />
      </Section>

      <Section eyebrow={t.about.skillsEyebrow} title={t.about.skillsTitle}>
        <Skills locale={locale} />
      </Section>

      <Section eyebrow={t.about.ossEyebrow} title={t.about.ossTitle}>
        <OpenSource locale={locale} />
      </Section>

      <Section eyebrow={t.about.educationEyebrow} title={t.about.educationTitle}>
        <Education locale={locale} />
      </Section>
    </>
  );
}
