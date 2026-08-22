/**
 * Zentrale Konfiguration.
 *
 * Loest src/environment.js des alten Stands ab und beendet die doppelte
 * Pflege von Kontaktdaten und Links, die vorher woertlich in Toolbar.js und
 * SideDrawer.js dupliziert waren.
 */

export const siteConfig = {
  domain: 'schadler.dev',
  url: 'https://schadler.dev',
  name: 'Patrick Schadler',
  initials: 'PS',
  email: 'hello@mrsd.at',
  locationShort: 'Leibnitz, Austria',
  gaMeasurementId: 'G-VMLW1DB5B4',
  themeColor: '#141414',
  ogImage: '/og/default.png',
} as const;

export const socialLinks = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/DonkeyKongJr' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://at.linkedin.com/in/patrick-schadler-19104750',
  },
  { key: 'devto', label: 'DEV', href: 'https://dev.to/patzistar' },
  { key: 'x', label: 'X', href: 'https://x.com/pschadi' },
] as const;

export type SocialLink = (typeof socialLinks)[number];

/**
 * Firmendaten der mrsd Solutions GmbH.
 * Grundlage fuer Impressum (§ 5 ECG, § 14 UGB) und das Organization-JSON-LD.
 */
export const company = {
  legalName: 'mrsd Solutions GmbH',
  shortName: 'mrsd Solutions',
  street: 'Lahnweg 29',
  postalCode: '8430',
  city: 'Leibnitz',
  country: 'Österreich',
  countryCode: 'AT',
  companyRegisterNumber: 'FN 667700m',
  companyRegisterCourt: 'Landesgericht für Zivilrechtssachen Graz',
  vatId: 'ATU82847859',
  managingDirector: 'Patrick Schadler',
  trade: 'Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik',
  chamber: 'Wirtschaftskammer Steiermark, Fachgruppe UBIT',
  supervisoryAuthority: 'Bezirkshauptmannschaft Leibnitz',
  email: 'hello@mrsd.at',
  website: 'https://www.mrsd.at',
} as const;

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
