import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/** Bei output: 'export' zwingend - sonst versucht Next, die Route zur Laufzeit zu bedienen. */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
