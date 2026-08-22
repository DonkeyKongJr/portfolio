import type { Metadata } from 'next';
import { defaultLocale, locales, siteConfig } from '@/config/site';
import { STANDALONE_STYLES, STANDALONE_THEME_SCRIPT } from './standalone';

/**
 * Sprachweiche unter /.
 *
 * Bei einem statischen Export gibt es keinen Server, der Accept-Language
 * auswerten koennte - die Entscheidung faellt daher im Browser. Fuer Crawler
 * ist das unschaedlich: das Canonical zeigt auf /en/, und beide Sprachfassungen
 * stehen ohnehin in der Sitemap.
 */
export const metadata: Metadata = {
  title: siteConfig.name,
  description: 'Portfolio of Patrick Schadler, software engineer.',
  alternates: {
    canonical: `${siteConfig.url}/${defaultLocale}/`,
    languages: {
      'de-AT': `${siteConfig.url}/de/`,
      en: `${siteConfig.url}/en/`,
      'x-default': `${siteConfig.url}/en/`,
    },
  },
  robots: { index: false, follow: true },
};

const REDIRECT = `
(function () {
  var supported = ${JSON.stringify(locales)};
  var fallback = ${JSON.stringify(defaultLocale)};
  var langs = navigator.languages || [navigator.language || fallback];
  var target = fallback;
  for (var i = 0; i < langs.length; i++) {
    var code = String(langs[i]).slice(0, 2).toLowerCase();
    if (supported.indexOf(code) !== -1) { target = code; break; }
  }
  location.replace('/' + target + '/' + location.search + location.hash);
})();
`;

export default function RootRedirect() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Greift auch ohne JavaScript, nur langsamer. */}
        <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
        <script dangerouslySetInnerHTML={{ __html: STANDALONE_THEME_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: STANDALONE_STYLES }} />
        <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      </head>
      <body>
        <p>
          <a href={`/${defaultLocale}/`}>Continue to schadler.dev</a>
        </p>
      </body>
    </html>
  );
}
