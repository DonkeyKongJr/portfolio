import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { locales, type Locale } from '@/config/site';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** ISO-Datum, z.B. 2026-02-14. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  canonical: z.string().url().optional(),
  /**
   * Maschinell uebersetzte Fassung. Pro Artikel gesetzt, nicht pro Sprache:
   * eine spaeter von Hand geschriebene Uebersetzung soll den Hinweis nicht
   * faelschlich tragen.
   */
  machineTranslated: z.boolean().default(false),
});

export interface Post {
  slug: string;
  locale: Locale;
  content: string;
  readingMinutes: number;
  frontmatter: z.infer<typeof frontmatterSchema>;
}

/** Entwuerfe sind nur im Dev-Server sichtbar, nie im Production-Build. */
const includeDrafts = process.env.NODE_ENV === 'development';

function readPosts(locale: Locale): Post[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Ungueltiges Frontmatter in blog/${locale}/${file}:\n${z.prettifyError(parsed.error)}`,
        );
      }

      // ~200 Woerter pro Minute, aufgerundet, mindestens 1.
      const words = content.trim().split(/\s+/).length;

      return {
        slug: file.replace(/\.mdx$/, ''),
        locale,
        content,
        readingMinutes: Math.max(1, Math.round(words / 200)),
        frontmatter: parsed.data,
      };
    })
    .filter((post) => includeDrafts || !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getPosts(locale: Locale): Post[] {
  return readPosts(locale);
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return readPosts(locale).find((post) => post.slug === slug);
}

/**
 * Sprachen, in denen es diesen Artikel gibt.
 * Wichtig fuer hreflang: ein Verweis auf eine nicht existierende Uebersetzung
 * meldet die Search Console als Fehler.
 */
export function availableLocales(slug: string): Locale[] {
  return locales.filter((locale) => fs.existsSync(path.join(BLOG_DIR, locale, `${slug}.mdx`)));
}

export function allPostParams() {
  return locales.flatMap((locale) =>
    readPosts(locale).map((post) => ({ locale, slug: post.slug })),
  );
}

/** Vorheriger und naechster Artikel in derselben Sprache. */
export function getNeighbours(locale: Locale, slug: string) {
  const posts = readPosts(locale);
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    // posts ist absteigend sortiert: der naechste Eintrag ist der aeltere.
    next: posts[index - 1],
    previous: posts[index + 1],
  };
}

/**
 * Artikel, die es nur in der jeweils anderen Sprache gibt.
 *
 * Ohne das waeren sie fuer Besucher der deutschen Fassung unsichtbar - es gibt
 * ja keine deutsche Seite, auf der ein Hinweis stehen koennte.
 */
export function getUntranslatedPosts(locale: Locale): Post[] {
  const own = new Set(readPosts(locale).map((post) => post.slug));
  return locales
    .filter((other) => other !== locale)
    .flatMap((other) => readPosts(other))
    .filter((post) => !own.has(post.slug));
}
