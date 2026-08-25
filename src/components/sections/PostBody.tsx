import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Diagram, type DiagramProps } from './Diagram';
import type { Locale } from '@/config/site';
import styles from './Prose.module.css';

/**
 * Rendert MDX zur Build-Zeit als Server-Komponente.
 *
 * Das Syntax-Highlighting macht Shiki hier im Build - der Browser bekommt
 * fertig eingefaerbtes HTML und kein einziges Byte Highlighter-JavaScript.
 */
export function PostBody({ source, locale }: { source: string; locale: Locale }) {
  // Die Sprache kommt aus der Route, nicht aus dem MDX: so steht in beiden
  // Sprachfassungen derselbe Aufruf, und ein Copy-and-paste zwischen ihnen
  // kann die Sprache des Diagramms nicht verstellen.
  const components = {
    Diagram: (props: Omit<DiagramProps, 'locale'>) => <Diagram {...props} locale={locale} />,
  };

  return (
    <div className={styles.prose}>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'append',
                  properties: { className: ['anchor'], ariaHidden: true, tabIndex: -1 },
                },
              ],
              /*
               * Zwei Themes statt einem: "theme" nimmt dafuer ein Objekt, nicht
               * etwa ein eigenes "themes" - ein unbekannter Schluessel wuerde
               * hier still ignoriert und faende auf github-dark-dimmed zurueck.
               *
               * Shiki schreibt dann je Token beide Farben als CSS-Variablen
               * (--shiki-light, --shiki-dark) ins style-Attribut, und
               * Prose.module.css waehlt die passende aus. Mit nur einem Theme
               * standen die dunklen Tokenfarben auch im hellen Theme auf hellem
               * Grund, ganze Zeilen waren dort praktisch unlesbar.
               */
              [
                rehypePrettyCode,
                {
                  theme: { light: 'github-light-default', dark: 'github-dark-default' },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
