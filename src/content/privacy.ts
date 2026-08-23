import type { Localized } from './schema';

/**
 * Datenschutzerklaerung.
 *
 * Ein sachlich vollstaendiges Geruest fuer eine statisch gehostete Seite mit
 * Firebase Hosting und einwilligungspflichtigem Google Analytics - aber keine
 * Rechtsberatung. Vor dem Livegang bitte fachlich pruefen lassen.
 */
export interface LegalSection {
  id: string;
  heading: Localized<string>;
  paragraphs: Localized<string[]>;
}

export const privacySections: LegalSection[] = [
  {
    id: 'controller',
    heading: { de: 'Verantwortlicher', en: 'Controller' },
    paragraphs: {
      de: [
        'Verantwortlich für die Datenverarbeitung auf dieser Website ist die mrsd Solutions GmbH, Lahnweg 29, 8430 Leibnitz, Österreich. Bei Fragen zum Datenschutz erreichst du uns unter hello@mrsd.at.',
      ],
      en: [
        'The controller for data processing on this website is mrsd Solutions GmbH, Lahnweg 29, 8430 Leibnitz, Austria. For any privacy-related questions, contact us at hello@mrsd.at.',
      ],
    },
  },
  {
    id: 'hosting',
    heading: { de: 'Hosting und Server-Logs', en: 'Hosting and server logs' },
    paragraphs: {
      de: [
        'Diese Website wird bei Firebase Hosting (Google Ireland Limited) betrieben. Beim Abruf einer Seite werden technisch notwendige Daten verarbeitet: IP-Adresse, Datum und Uhrzeit, abgerufene Datei, übertragene Datenmenge, Referrer und User-Agent.',
        'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an einem stabilen und sicheren Betrieb. Diese Verarbeitung lässt sich beim Aufruf einer Website technisch nicht vermeiden.',
      ],
      en: [
        'This website is hosted on Firebase Hosting (Google Ireland Limited). When a page is requested, technically necessary data is processed: IP address, date and time, requested file, volume of data transferred, referrer and user agent.',
        'The legal basis is Art. 6(1)(f) GDPR — our legitimate interest in stable and secure operation. This processing cannot technically be avoided when a website is accessed.',
      ],
    },
  },
  {
    id: 'analytics',
    heading: { de: 'Google Analytics', en: 'Google Analytics' },
    paragraphs: {
      de: [
        'Wir verwenden Google Analytics 4, um zu verstehen, welche Inhalte gelesen werden. Das Skript wird erst geladen, nachdem du im Hinweisbanner ausdrücklich zugestimmt hast. Ohne Zustimmung wird kein Analyse-Skript geladen und es werden keine Cookies zu diesem Zweck gesetzt.',
        'Rechtsgrundlage ist deine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Du kannst sie jederzeit und mit einem Klick widerrufen — unter „Deine Entscheidung“ weiter unten auf dieser Seite, erreichbar auch über „Analytics-Einstellungen“ im Seitenfuß.',
        'Anbieter ist Google Ireland Limited. Eine Übermittlung in die USA kann nicht ausgeschlossen werden; Google stützt sich dafür auf das EU-US Data Privacy Framework.',
      ],
      en: [
        'We use Google Analytics 4 to understand which content gets read. The script is only loaded after you have explicitly consented in the notice banner. Without consent, no analytics script is loaded and no cookies are set for this purpose.',
        'The legal basis is your consent under Art. 6(1)(a) GDPR. You can withdraw it at any time with a single click — under “Your choice” further down this page, also reachable via “Analytics settings” in the footer.',
        'The provider is Google Ireland Limited. Transfer to the USA cannot be ruled out; Google relies on the EU-US Data Privacy Framework for this.',
      ],
    },
  },
  {
    id: 'storage',
    heading: { de: 'Lokale Speicherung', en: 'Local storage' },
    paragraphs: {
      de: [
        'Wir speichern zwei technische Werte lokal in deinem Browser: ob die Startanimation in dieser Sitzung bereits gelaufen ist, und deine Entscheidung zum Analyse-Banner. Beide Werte verlassen dein Gerät nicht und dienen keiner Wiedererkennung.',
      ],
      en: [
        'We store two technical values locally in your browser: whether the intro animation has already played in this session, and your decision on the analytics banner. Neither value leaves your device, and neither is used to recognise you.',
      ],
    },
  },
  {
    id: 'contact',
    heading: { de: 'Kontaktaufnahme', en: 'Getting in touch' },
    paragraphs: {
      de: [
        'Diese Website enthält kein Kontaktformular. Wenn du uns per E-Mail schreibst, verarbeiten wir deine Angaben ausschließlich zur Beantwortung deiner Anfrage — Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Die Nachrichten werden gelöscht, sobald sie nicht mehr benötigt werden und keine Aufbewahrungspflicht entgegensteht.',
      ],
      en: [
        'This website has no contact form. If you email us, we process your details solely to answer your enquiry — the legal basis is Art. 6(1)(b) or (f) GDPR. Messages are deleted once they are no longer needed and no retention obligation applies.',
      ],
    },
  },
  {
    id: 'rights',
    heading: { de: 'Deine Rechte', en: 'Your rights' },
    paragraphs: {
      de: [
        'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wende dich dafür an hello@mrsd.at.',
        'Wenn du der Ansicht bist, dass die Verarbeitung deiner Daten gegen die DSGVO verstößt, kannst du dich bei der österreichischen Datenschutzbehörde (dsb.gv.at) beschweren.',
      ],
      en: [
        'You have the right to access, rectification, erasure, restriction of processing, data portability and objection. To exercise these rights, contact hello@mrsd.at.',
        'If you believe the processing of your data infringes the GDPR, you can lodge a complaint with the Austrian Data Protection Authority (dsb.gv.at).',
      ],
    },
  },
];
