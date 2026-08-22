import type { Metadata } from 'next';
import { siteConfig, type Locale } from '@/config/site';
import { getDictionary } from '@/i18n';

const OG_LOCALE: Record<Locale, string> = { de: 'de_AT', en: 'en_US' };

interface BuildMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  /** Pfadsegmente ohne Locale, z.B. ['work', 'qr-maker']. */
  segments?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  image?: string;
  /** Sprachen, in denen es diese Seite gibt. Default: beide. */
  availableIn?: Locale[];
}

/**
 * Baut Metadata inklusive Canonical und hreflang.
 *
 * Wichtig fuer Artikel, die es nur in einer Sprache gibt: dort darf kein
 * hreflang auf eine nicht existierende Uebersetzung zeigen, sonst meldet die
 * Search Console fehlerhafte Alternativen.
 */
export function buildMetadata({
  locale,
  title,
  description,
  segments = [],
  type = 'website',
  publishedTime,
  image,
  availableIn = ['de', 'en'],
}: BuildMetadataOptions): Metadata {
  const path = segments.length ? `/${segments.join('/')}/` : '/';
  const canonical = `${siteConfig.url}/${locale}${path === '/' ? '/' : path}`;
  // Pro Sprache ein eigenes Vorschaubild (siehe scripts/generate-og.mjs).
  const ogImage = image ?? `/og/${locale}.png`;

  const languages: Record<string, string> = {};
  for (const alt of availableIn) {
    const key = alt === 'de' ? 'de-AT' : 'en';
    languages[key] = `${siteConfig.url}/${alt}${path === '/' ? '/' : path}`;
  }
  if (availableIn.includes('en')) {
    languages['x-default'] = `${siteConfig.url}/en${path === '/' ? '/' : path}`;
  }

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale],
      images: [{ url: `${siteConfig.url}${ogImage}`, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}${ogImage}`],
    },
  };
}

export function pageMetadata(
  locale: Locale,
  section: 'home' | 'work' | 'about' | 'blog' | 'contact' | 'imprint' | 'privacy',
  segments: string[] = [],
): Metadata {
  const t = getDictionary(locale);
  const entry = t[section];
  return buildMetadata({
    locale,
    title: entry.title,
    description: entry.description,
    segments,
  });
}
