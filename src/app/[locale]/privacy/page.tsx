import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/ui/Container';
import { privacySections } from '@/content/privacy';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import styles from '@/components/sections/Legal.module.css';

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, 'privacy', ['privacy']) : {};
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.privacy.eyebrow} title={t.privacy.headline} />
      <Container>
        <div className={styles.prose}>
          {privacySections.map((section) => (
            <section key={section.id}>
              <h2>{section.heading[locale]}</h2>
              {section.paragraphs[locale].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
