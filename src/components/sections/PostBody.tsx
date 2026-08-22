import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import styles from './Prose.module.css';

/**
 * Rendert MDX zur Build-Zeit als Server-Komponente.
 *
 * Das Syntax-Highlighting macht Shiki hier im Build - der Browser bekommt
 * fertig eingefaerbtes HTML und kein einziges Byte Highlighter-JavaScript.
 */
export function PostBody({ source }: { source: string }) {
  return (
    <div className={styles.prose}>
      <MDXRemote
        source={source}
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
              [rehypePrettyCode, { theme: 'github-dark-default', keepBackground: false }],
            ],
          },
        }}
      />
    </div>
  );
}
