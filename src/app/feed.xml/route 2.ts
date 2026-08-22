import { defaultLocale, siteConfig } from '@/config/site';
import { getPosts } from '@/lib/blog';

/**
 * RSS-Feed. force-static ist bei output: 'export' zwingend, sonst versucht
 * Next, die Route zur Laufzeit zu bedienen - was es hier nicht gibt.
 */
export const dynamic = 'force-static';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const posts = getPosts(defaultLocale);
  const updated = posts[0]?.frontmatter.date;

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/${defaultLocale}/blog/${post.slug}/`;
      return `    <item>
      <title>${escape(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.frontmatter.description)}</description>
      <pubDate>${new Date(`${post.frontmatter.date}T12:00:00Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/${defaultLocale}/blog/</link>
    <description>Articles on C#, .NET, Microsoft Azure and software quality.</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
${updated ? `    <lastBuildDate>${new Date(`${updated}T12:00:00Z`).toUTCString()}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
