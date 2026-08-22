'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { siteConfig, type Locale } from '@/config/site';
import { alternatePath, localePath } from '@/lib/paths';
import styles from './Nav.module.css';

const SCROLL_TRIGGER = 40;
/** Millisekunden Versatz pro Buchstabe beim Zusammenklappen. */
const CHAR_STEP = 17;

export interface NavLabels {
  home: string;
  work: string;
  about: string;
  blog: string;
  contact: string;
  cta: string;
  menu: string;
  switchTo: string;
  toLight: string;
  toDark: string;
}

export function Nav({
  locale,
  labels,
  blogSlugs,
}: {
  locale: Locale;
  labels: NavLabels;
  /** Welche Artikel es je Sprache gibt - siehe alternatePath(). */
  blogSlugs: Record<Locale, string[]>;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_TRIGGER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    { href: localePath(locale), label: labels.home, key: 'home' },
    { href: localePath(locale, 'work'), label: labels.work, key: 'work' },
    { href: localePath(locale, 'about'), label: labels.about, key: 'about' },
    { href: localePath(locale, 'blog'), label: labels.blog, key: 'blog' },
    { href: localePath(locale, 'contact'), label: labels.contact, key: 'contact' },
  ];

  const current = items
    .filter((item) => item.key !== 'home')
    .find((item) => pathname.startsWith(item.href.replace(/\/$/, '')));

  const other: Locale = locale === 'de' ? 'en' : 'de';

  return (
    <nav className={styles.nav} data-scrolled={scrolled} aria-label={labels.menu}>
      <Link href={localePath(locale)} className={styles.logo}>
        {/*
          Der volle Name steht im DOM und ist fuer Screenreader vollstaendig;
          visuell klappt er beim Scrollen buchstabenweise auf "PS" zusammen.
        */}
        <span className={styles.logoName} aria-label={siteConfig.name}>
          {siteConfig.name.split('').map((letter, index) => {
            // P und S bleiben stehen, alles andere faellt weg.
            const keep = index === 0 || letter === 'S';
            return (
              <span
                key={`${letter}-${index}`}
                aria-hidden="true"
                className={`${styles.char} ${keep ? '' : styles.drop}`}
                style={{ transitionDelay: `${index * CHAR_STEP}ms` } as CSSProperties}
              >
                {letter}
              </span>
            );
          })}
        </span>
        {current ? (
          <span className={styles.pageLabel} aria-hidden="true">
            {current.label}
          </span>
        ) : null}
      </Link>

      <ul className={styles.links}>
        {items.map((item) => {
          const isHome = item.key === 'home';
          const active = isHome
            ? pathname === item.href
            : pathname.startsWith(item.href.replace(/\/$/, ''));
          return (
            <li key={item.key}>
              {/* Echte href-Werte - im alten Stand fehlten sie und die Nav war
                  per Tastatur nicht erreichbar. */}
              <Link
                href={item.href}
                className={styles.link}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.actions}>
        <ThemeToggle labels={{ toLight: labels.toLight, toDark: labels.toDark }} />
        {/*
          Bewusst ein <a> und kein <Link>: ein Sprachwechsel ist ein
          Dokumentwechsel. Bei Client-Navigation wuerde das [locale]-Segment
          neu gerendert, React das Boot-Skript im <head> als toten Knoten neu
          anlegen, und <html lang> muesste nachtraeglich gepatcht werden.
        */}
        <a
          href={alternatePath(pathname, other, blogSlugs)}
          className={styles.localeSwitch}
          hrefLang={other}
          lang={other}
          title={labels.switchTo}
          data-native-nav
        >
          {other}
        </a>
        <span className={styles.navCta}>
          <Button href={`mailto:${siteConfig.email}`} variant="primary" size="small">
            {labels.cta}
          </Button>
        </span>
      </div>
    </nav>
  );
}
