import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@/components/icons';
import { JsonLd } from '@/components/layout/JsonLd';
import { PostBody } from '@/components/sections/PostBody';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { getDictionary, isLocale } from '@/i18n';
import { allPostParams, availableLocales, getNeighbours, getPost } from '@/lib/blog';
import { formatDate } from '@/lib/date';
import { breadcrumbJsonLd, jsonLdGraph } from '@/lib/jsonLd';
import { buildMetadata } from '@/lib/metadata';
import { localePath } from '@/lib/paths';
import styles from './page.module.css';

export function generateStaticParams() {
  return allPostParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};

  return buildMetadata({
    locale,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    segments: ['blog', slug],
    type: 'article',
    publishedTime: post.frontmatter.date,
    // Nur auf Sprachen verweisen, in denen es den Artikel wirklich gibt.
    availableIn: availableLocales(slug),
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = getDictionary(locale);
  const { previous, next } = getNeighbours(locale, slug);

  return (
    <>
      <div className={styles.header}>
        <Container>
          <Link href={localePath(locale, 'blog')} className={styles.back}>
            <ArrowLeftIcon width={16} height={16} />
            {t.blog.backToBlog}
          </Link>
          <h1 className={styles.title}>{post.frontmatter.title}</h1>
          <div className={`${styles.meta} tnum`}>
            <time dateTime={post.frontmatter.date}>
              {formatDate(post.frontmatter.date, locale)}
            </time>
            <span>
              {post.readingMinutes} {t.blog.readingTime}
            </span>
          </div>
        </Container>
      </div>

      <Container>
        <div className={styles.body}>
          <PostBody source={post.content} />
        </div>

        <nav className={styles.neighbours} aria-label={t.blog.title}>
          {previous ? (
            <Link href={localePath(locale, 'blog', previous.slug)} className={styles.neighbour}>
              <span className={styles.neighbourLabel}>{t.blog.previous}</span>
              <span className={styles.neighbourTitle}>{previous.frontmatter.title}</span>
            </Link>
          ) : null}
          {next ? (
            <Link href={localePath(locale, 'blog', next.slug)} className={styles.neighbour}>
              <span className={styles.neighbourLabel}>{t.blog.next}</span>
              <span className={styles.neighbourTitle}>{next.frontmatter.title}</span>
            </Link>
          ) : null}
        </nav>
      </Container>

      <JsonLd
        data={jsonLdGraph(
          {
            '@type': 'BlogPosting',
            headline: post.frontmatter.title,
            description: post.frontmatter.description,
            datePublished: post.frontmatter.date,
            inLanguage: t.meta.htmlLang,
            keywords: post.frontmatter.tags.join(', '),
            author: { '@id': `${siteConfig.url}/#person` },
            publisher: { '@id': `${siteConfig.url}/#organization` },
            mainEntityOfPage: `${siteConfig.url}/${locale}/blog/${slug}/`,
          },
          breadcrumbJsonLd([
            { name: t.nav.home, url: `${siteConfig.url}/${locale}/` },
            { name: t.blog.title, url: `${siteConfig.url}/${locale}/blog/` },
            { name: post.frontmatter.title, url: `${siteConfig.url}/${locale}/blog/${slug}/` },
          ]),
        )}
      />
    </>
  );
}
