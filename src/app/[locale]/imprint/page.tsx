import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/ui/Container';
import { company } from '@/config/site';
import { getDictionary, isLocale, localeParams } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import styles from '@/components/sections/Legal.module.css';

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, 'imprint', ['imprint']) : {};
}

export default async function ImprintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const rows: [string, string][] = [
    [t.imprint.registerNumber, company.companyRegisterNumber],
    [t.imprint.registerCourt, company.companyRegisterCourt],
    [t.imprint.vatId, company.vatId],
    [t.imprint.managingDirector, company.managingDirector],
    [t.imprint.purpose, t.imprint.purposeValue],
    [t.imprint.trade, company.trade],
    [t.imprint.chamber, company.chamber],
    [t.imprint.supervisoryAuthority, company.supervisoryAuthority],
    [t.imprint.lawsApplied, t.imprint.lawsAppliedValue],
  ];

  return (
    <>
      <PageHeader eyebrow={t.imprint.eyebrow} title={t.imprint.headline} />
      <Container>
        <div className={styles.prose}>
          <h2>{t.imprint.mediaOwner}</h2>
          <p>
            {company.legalName}
            <br />
            {company.street}
            <br />
            {company.postalCode} {company.city}
            <br />
            {company.country}
          </p>
          <p>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>

          <div className={styles.rows}>
            {rows.map(([label, value]) => (
              <div key={label} className={styles.row}>
                <span className={styles.rowLabel}>{label}</span>
                <span className={styles.rowValue}>{value}</span>
              </div>
            ))}
          </div>

          <h2>{t.imprint.disputeResolution}</h2>
          <p>{t.imprint.disputeResolutionValue}</p>
        </div>
      </Container>
    </>
  );
}
