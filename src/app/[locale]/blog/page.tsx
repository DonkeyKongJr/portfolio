import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/ui/Container';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { getPosts, getUntranslatedPosts } from '@/lib/blog';
import { formatDate } from '@/lib/date';
import { pageMetadata } from '@/lib/metadata';
import { localePath } from '@/lib/paths';
import styles from './page.module.css';

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, 'blog', ['blog']) : {};
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const posts = getPosts(locale);
  const untranslated = getUntranslatedPosts(locale);

  return (
    <>
      <PageHeader eyebrow={t.blog.eyebrow} title={t.blog.headline} lead={t.blog.description} />
      <Container>
        <div className={styles.list}>
          {posts.length === 0 ? <p className={styles.empty}>{t.blog.empty}</p> : null}

          {posts.map((post) => (
            <ScrollReveal key={post.slug}>
              <Link href={localePath(locale, 'blog', post.slug)} className={styles.item}>
                <p className={`${styles.date} tnum`}>
                  <time dateTime={post.frontmatter.date}>
                    {formatDate(post.frontmatter.date, locale)}
                  </time>
                  <br />
                  {post.readingMinutes} {t.blog.readingTime}
                </p>
                <div>
                  <h2 className={styles.title}>{post.frontmatter.title}</h2>
                  <p className={styles.description}>{post.frontmatter.description}</p>
                  <ul className={styles.tags}>
                    {post.frontmatter.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </ScrollReveal>
          ))}

          {/*
            Artikel, die es nur in der anderen Sprache gibt. Sie verlinken auf
            ihre eigene Sprachfassung - sonst waeren sie hier unauffindbar.
          */}
          {untranslated.map((post) => (
            <ScrollReveal key={`${post.locale}-${post.slug}`}>
              {/* Sprachwechsel: native Navigation, siehe Nav.tsx. */}
              <a
                href={localePath(post.locale, 'blog', post.slug)}
                className={styles.item}
                hrefLang={post.locale}
                data-native-nav
              >
                <p className={`${styles.date} tnum`}>
                  <time dateTime={post.frontmatter.date}>
                    {formatDate(post.frontmatter.date, locale)}
                  </time>
                  <br />
                  {post.readingMinutes} {t.blog.readingTime}
                </p>
                <div>
                  <h2 className={styles.title} lang={post.locale}>
                    {post.frontmatter.title}
                  </h2>
                  <p className={styles.description} lang={post.locale}>
                    {post.frontmatter.description}
                  </p>
                  <p className={styles.foreign}>{t.blog.otherLanguage}</p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </>
  );
}
