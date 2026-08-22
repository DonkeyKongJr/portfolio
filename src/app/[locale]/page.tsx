import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Marquee } from '@/components/motion/Marquee';
import { WorkCursor } from '@/components/motion/WorkCursor';
import { Cta } from '@/components/sections/Cta';
import { Hero } from '@/components/sections/Hero';
import { Principles } from '@/components/sections/Principles';
import { principles } from '@/content/about';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Services } from '@/components/sections/Services';
import { yearsOfExperience } from '@/config/site';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { interpolate } from '@/lib/interpolate';
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
  return isLocale(locale) ? pageMetadata(locale, 'home') : {};
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  // Zur Build-Zeit aus dem Startjahr 2009 gerechnet.
  const years = yearsOfExperience();

  return (
    <>
      <Hero
        locale={locale}
        copy={{
          eyebrow: t.home.eyebrow,
          headline: t.home.headline,
          subline: interpolate(t.home.subline, { years }),
          primaryCta: t.home.workAll,
          secondaryCta: t.nav.cta,
        }}
      />
      <Marquee items={t.home.proof.map((item) => interpolate(item, { years }))} />
      <SelectedWork locale={locale} t={t} />
      <Principles
        items={principles.map((principle) => ({
          id: principle.id,
          title: principle.title[locale],
          body: principle.body[locale],
        }))}
        eyebrow={t.home.principlesEyebrow}
        title={t.home.principlesTitle}
      />
      <Services locale={locale} t={t} />
      <Cta t={t} />
      <WorkCursor label={t.work.viewProject} />
    </>
  );
}
