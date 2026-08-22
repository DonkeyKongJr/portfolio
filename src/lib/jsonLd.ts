import { company, siteConfig, socialLinks, type Locale } from '@/config/site';
import { skillGroups } from '@/content/about';
import { currentJob } from '@/content/jobs';
import type { Project } from '@/content/schema';

const organizationId = `${siteConfig.url}/#organization`;
const personId = `${siteConfig.url}/#person`;

export function organizationJsonLd() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: company.legalName,
    url: company.website,
    email: company.email,
    vatID: company.vatId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressCountry: company.countryCode,
    },
    founder: { '@id': personId },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': personId,
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}/`,
    email: `mailto:${siteConfig.email}`,
    jobTitle: currentJob?.role[locale] ?? 'Software Engineer',
    worksFor: { '@id': organizationId },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'FH JOANNEUM' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.city,
      addressCountry: company.countryCode,
    },
    knowsAbout: skillGroups.flatMap((group) => group.items),
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function projectJsonLd(project: Project, locale: Locale) {
  return {
    '@type': 'CreativeWork',
    name: project.name,
    description: project.summary[locale],
    url: `${siteConfig.url}/${locale}/work/${project.slug}/`,
    dateCreated: project.year,
    creator: { '@id': personId },
    keywords: project.technologies.join(', '),
    ...(project.url ? { sameAs: project.url } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Verpackt beliebig viele Knoten in einen einzigen @graph. */
export function jsonLdGraph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
