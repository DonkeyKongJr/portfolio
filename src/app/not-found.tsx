import { defaultLocale, siteConfig } from '@/config/site';
import { getDictionary } from '@/i18n';
import { STANDALONE_STYLES, STANDALONE_THEME_SCRIPT } from './standalone';

/**
 * 404-Seite. Landet im Export als /404.html, das Firebase Hosting automatisch
 * mit Status 404 ausliefert. Wichtig: der frueher gesetzte SPA-Rewrite
 * ** -> /index.html wuerde stattdessen 200 liefern und Soft-404s erzeugen.
 */
export default function NotFound() {
  const t = getDictionary(defaultLocale);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex" />
        <script dangerouslySetInnerHTML={{ __html: STANDALONE_THEME_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: STANDALONE_STYLES }} />
      </head>
      <body>
        <div>
          <p className="eyebrow">404</p>
          <h1>{t.notFound.headline}</h1>
          <p className="lead">{t.notFound.body}</p>
          <p className="cta">
            <a href={`${siteConfig.url}/${defaultLocale}/`}>{t.notFound.cta}</a>
          </p>
        </div>
      </body>
    </html>
  );
}
