import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { socialIcons } from '@/components/icons';
import { PageHeader } from '@/components/sections/PageHeader';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig, socialLinks } from '@/config/site';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import styles from './page.module.css';

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, 'contact', ['contact']) : {};
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  /*
   * Kein Formular: bei einem statischen Export braeuchte es dafuer einen
   * Fremddienst. Ein vorbefuellter mailto-Link erfuellt denselben Zweck,
   * ohne Daten an Dritte zu geben.
   */
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    t.contact.mailSubject,
  )}&body=${encodeURIComponent(t.contact.mailBody)}`;

  return (
    <>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.headline} lead={t.contact.body} />
      <Container>
        <div className={styles.body}>
          <a className={styles.mail} href={mailto}>
            {siteConfig.email}
          </a>
          <div className={styles.action}>
            <Button href={mailto} variant="primary">
              {t.contact.emailLabel}
            </Button>
          </div>

          <p className={styles.elsewhereLabel}>{t.contact.elsewhere}</p>
          <ul className={styles.social}>
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.key];
              return (
                <li key={link.key}>
                  <a
                    className={styles.socialLink}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon width={18} height={18} />
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </>
  );
}
