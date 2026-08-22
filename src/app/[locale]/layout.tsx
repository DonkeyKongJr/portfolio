import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { inter } from '../fonts';
import { Analytics } from '@/components/layout/Analytics';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/layout/JsonLd';
import { Nav } from '@/components/layout/Nav';
import { Curtain } from '@/components/motion/Curtain';
import { IntroProvider } from '@/components/motion/IntroProvider';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { siteConfig } from '@/config/site';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { THEME_KEY } from '@/lib/theme';
import { jsonLdGraph, organizationJsonLd, personJsonLd } from '@/lib/jsonLd';
import { buildMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return localeParams();
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: 'dark',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    ...buildMetadata({ locale, title: t.home.title, description: t.home.description }),
    title: { default: t.home.title, template: `%s — ${siteConfig.name}` },
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '48x48' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

/**
 * Laeuft vor dem ersten Paint und setzt zwei Flags am <html>:
 *
 *  - data-js       Ohne JavaScript bleibt es aus. Alle versteckten
 *                  Ausgangszustaende der Masken-Reveals haengen daran, sonst
 *                  waere der Text unsichtbar und niemand wuerde ihn aufdecken.
 *  - data-intro    "skip", wenn die Intro in dieser Sitzung schon lief oder
 *                  reduzierte Bewegung gewuenscht ist. Nur so laesst sich das
 *                  Overlay bereits im HTML ausliefern, ohne beim zweiten
 *                  Besuch kurz aufzublitzen.
 *  - data-theme    "light" oder "dark". Muss vor dem ersten Paint stehen,
 *                  sonst blitzt beim Laden kurz das falsche Theme auf.
 *                  Ohne gespeicherte Wahl immer dunkel - die Systemeinstellung
 *                  geht bewusst nicht ein.
 */
const BOOT_FLAGS = `
(function () {
  var el = document.documentElement;
  el.setAttribute('data-js','');
  try {
    if (sessionStorage.getItem('heroIntroPlayed') === '1' ||
        matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-intro','skip');
    }
  } catch (e) {}
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    el.setAttribute('data-theme', stored === 'light' ? 'light' : 'dark');
  } catch (e) {
    el.setAttribute('data-theme', 'dark');
  }
})();
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    /*
     * suppressHydrationWarning gilt nur fuer die Attribute des <html> selbst,
     * nicht fuer den Baum darunter. Genau hier ist es noetig: das Boot-Skript
     * setzt data-js und data-intro vor der Hydration, und Browser-
     * Erweiterungen haengen zusaetzliche Attribute an. Beides sind
     * erwartbare Abweichungen, keine Fehler.
     */
    <html lang={t.meta.htmlLang} className={inter.variable} suppressHydrationWarning>
      <head>
        {/*
          Bewusst ein rohes <script> und nicht next/script: dessen
          beforeInteractive schiebt den Code nur in die Next-Runtime-Queue,
          er liefe also erst nach der Hydration - viel zu spaet fuer Flags,
          die vor dem ersten Paint stehen muessen.
        */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_FLAGS }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {t.nav.skipToContent}
        </a>
        <SmoothScrollProvider />
        <Curtain />
        <IntroProvider>
          <Nav
            locale={locale}
            labels={{
              home: t.nav.home,
              work: t.nav.work,
              about: t.nav.about,
              blog: t.nav.blog,
              contact: t.nav.contact,
              cta: t.nav.cta,
              menu: t.nav.menu,
              switchTo: t.meta.switchTo,
              toLight: t.meta.toLight,
              toDark: t.meta.toDark,
            }}
          />
          <main id="main">{children}</main>
          <Footer locale={locale} t={t} />
        </IntroProvider>
        <Analytics
          locale={locale}
          labels={{
            message: t.consent.message,
            accept: t.consent.accept,
            decline: t.consent.decline,
            more: t.consent.more,
          }}
        />
        <JsonLd data={jsonLdGraph(personJsonLd(locale), organizationJsonLd())} />
      </body>
    </html>
  );
}
