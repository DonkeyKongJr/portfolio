import type { MetadataRoute } from 'next';
import { locales, siteConfig } from '@/config/site';
import { projects } from '@/content/projects';
import { getPosts } from '@/lib/blog';

/** Bei output: 'export' zwingend - sonst versucht Next, die Route zur Laufzeit zu bedienen. */
export const dynamic = 'force-static';

/**
 * Erzeugt beim Export eine echte sitemap.xml mit beiden Sprachfassungen.
 * Die alte robots.txt des CRA-Stands hatte gar keinen Sitemap-Verweis.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const alternates = (path: string) => ({
    languages: Object.fromEntries(
      locales.map((locale) => [
        locale === 'de' ? 'de-AT' : 'en',
        `${siteConfig.url}/${locale}${path}`,
      ]),
    ),
  });

  for (const locale of locales) {
    const staticPaths: {
      path: string;
      priority: number;
      freq: MetadataRoute.Sitemap[number]['changeFrequency'];
    }[] = [
      { path: '/', priority: 1, freq: 'monthly' },
      { path: '/work/', priority: 0.9, freq: 'monthly' },
      { path: '/about/', priority: 0.8, freq: 'yearly' },
      { path: '/blog/', priority: 0.7, freq: 'weekly' },
      { path: '/contact/', priority: 0.6, freq: 'yearly' },
      { path: '/imprint/', priority: 0.1, freq: 'yearly' },
      { path: '/privacy/', priority: 0.1, freq: 'yearly' },
    ];

    for (const entry of staticPaths) {
      entries.push({
        url: `${siteConfig.url}/${locale}${entry.path}`,
        changeFrequency: entry.freq,
        priority: entry.priority,
        alternates: alternates(entry.path),
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${siteConfig.url}/${locale}/work/${project.slug}/`,
        changeFrequency: 'yearly',
        priority: 0.7,
        alternates: alternates(`/work/${project.slug}/`),
      });
    }

    // Artikel gibt es nicht zwingend in beiden Sprachen - daher ohne alternates.
    for (const post of getPosts(locale)) {
      entries.push({
        url: `${siteConfig.url}/${locale}/blog/${post.slug}/`,
        lastModified: new Date(`${post.frontmatter.date}T12:00:00Z`),
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
