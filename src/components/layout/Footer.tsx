import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { socialIcons } from '@/components/icons';
import { siteConfig, socialLinks, type Locale } from '@/config/site';
import type { Dictionary } from '@/i18n/types';
import { localePath } from '@/lib/paths';
import styles from './Footer.module.css';

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <p className={styles.watermark} aria-hidden="true">
          {siteConfig.name}
        </p>

        <div className={styles.grid}>
          <div>
            <p className={styles.tagline}>{t.footer.tagline}</p>
            <a className={styles.email} href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>

          <ul className={styles.social}>
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.key];
              return (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                    {/* Ohne diesen Text haetten die Icons keinen zugaenglichen Namen. */}
                    <span className="sr-only">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {siteConfig.name}. {t.footer.rights}
          </p>
          <nav className={styles.legal} aria-label={t.footer.imprint}>
            <Link href={localePath(locale, 'imprint')}>{t.footer.imprint}</Link>
            <Link href={localePath(locale, 'privacy')}>{t.footer.privacy}</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
