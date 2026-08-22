import { parseAll, projectSchema, type Project } from './schema';

/**
 * Projekte. Migriert aus src/data/projects.json.
 * Das alte Feld `backgroundImage` stand auf allen acht Eintraegen auf
 * "portfolio.png" und wurde von keiner Komponente gelesen - es entfaellt.
 * `github` war mal "" und mal null; hier durchgaengig null.
 */
const raw = [
  {
    slug: 'qr-maker',
    name: 'QR-Maker',
    type: 'saas',
    year: '2020',
    palette: 'yellow',
    featured: true,
    role: { de: 'Gründer & Entwickler', en: 'Founder & Developer' },
    summary: {
      de: 'SaaS für digitale Speisekarten und Infoseiten per QR-Code.',
      en: 'SaaS for digital menus and info pages delivered via QR code.',
    },
    outcome: {
      de: 'Vom Prototyp zum zahlenden Kundenstamm — inklusive Abrechnung und Self-Service.',
      en: 'From prototype to paying customers — including billing and self-service.',
    },
    description: {
      de: [
        'QR-Maker ist ein Software-as-a-Service-Produkt, mit dem sich in wenigen Minuten eine eigene Seite anlegen lässt — etwa eine Speisekarte. Dazu wird ein QR-Code generiert, der ausgedruckt und am Tisch platziert wird.',
        'Gäste öffnen die Seite als schreibgeschützte Ansicht, ganz ohne App. Entstanden ist das Produkt während der Gastronomie-Schließungen, als kontaktlose Karten plötzlich Pflicht wurden.',
        'Technisch ist es eine Angular-Anwendung auf Firebase mit Stripe-Abrechnung und einer Auslieferung über GitHub Actions.',
      ],
      en: [
        'QR-Maker is a software-as-a-service product that lets anyone create their own page — a restaurant menu, for example — within minutes. It generates a QR code that can be printed and placed on the table.',
        'Guests open the page as a read-only view, with no app required. The product grew out of the hospitality shutdowns, when contactless menus suddenly became mandatory.',
        'Technically it is an Angular application on Firebase with Stripe billing and delivery through GitHub Actions.',
      ],
    },
    technologies: ['Angular', 'Firebase', 'Stripe', 'TypeScript', 'SCSS', 'GitHub Actions'],
    github: null,
    url: 'https://qrmaker.eu/',
  },
  {
    slug: 'pmone-share',
    name: 'pmOne Share',
    type: 'product',
    year: '2017',
    palette: 'violet',
    featured: true,
    role: { de: 'Senior Software Developer', en: 'Senior Software Developer' },
    summary: {
      de: 'Kachelbasierte Dashboards und Unternehmensportale für BI-Teams.',
      en: 'Tile-based dashboards and corporate portals for BI teams.',
    },
    outcome: {
      de: 'Fachabteilungen bauen ihre Portale selbst — ohne Entwicklungsticket.',
      en: 'Departments build their own portals — without filing a development ticket.',
    },
    description: {
      de: [
        'pmOne Share ist eine Webanwendung für kachelbasierte Dashboards, Reporting- und Unternehmensportale.',
        'Der Kerngedanke: Fachabteilungen sollen ihre Lösungen eigenständig und bedarfsgerecht zusammenstellen können, statt für jede Änderung die Entwicklung zu beauftragen.',
        'Umgesetzt mit Aurelia im Frontend, .NET Core im Backend und Microsoft Azure als Plattform.',
      ],
      en: [
        'pmOne Share is a web application for tile-based dashboards, reporting portals and corporate portals.',
        'The core idea: let departments assemble their own solutions independently and in a way that fits their needs, instead of raising a development ticket for every change.',
        'Built with Aurelia on the frontend, .NET Core on the backend and Microsoft Azure as the platform.',
      ],
    },
    technologies: ['Aurelia', 'TypeScript', '.NET Core', 'Azure', 'SCSS'],
    github: null,
    url: 'https://www.pmone.com/share',
  },
  {
    slug: 'podify',
    name: 'Podify',
    type: 'personal',
    year: '2019',
    palette: 'green',
    featured: true,
    role: { de: 'Entwickler', en: 'Developer' },
    summary: {
      de: 'Text-zu-Sprache: geschriebener Text wird zur einbettbaren Audiodatei.',
      en: 'Text to speech: written text becomes an embeddable audio file.',
    },
    outcome: {
      de: 'Blogartikel als Audio — ohne Aufnahmestudio, in unter einer Minute.',
      en: 'Blog posts as audio — no recording studio, in under a minute.',
    },
    description: {
      de: [
        'Podify wandelt geschriebenen Text in eine einbettbare Audiodatei um. Entstanden aus dem Wunsch, eigene Blogartikel hörbar zu machen, ohne jedes Mal ein Mikrofon aufzubauen.',
        'Die Sprachsynthese und der Storage-Bucket kommen von Google, das Frontend ist Angular, die API läuft auf NodeJS.',
      ],
      en: [
        'Podify converts written text into an embeddable audio file. It grew out of wanting to make my own blog posts listenable without setting up a microphone every time.',
        'Speech synthesis and the storage bucket come from Google, the frontend is Angular and the API runs on NodeJS.',
      ],
    },
    technologies: ['Angular', 'NodeJS', 'Google Text-to-Speech', 'Firebase'],
    github: 'https://github.com/DonkeyKongJr/podify',
    url: null,
  },
  {
    slug: 'portfolio',
    name: 'schadler.dev',
    type: 'personal',
    year: '2026',
    palette: 'blue',
    featured: false,
    role: { de: 'Entwickler & Design', en: 'Developer & Design' },
    summary: {
      de: 'Diese Seite — Next.js, statisch exportiert, zweisprachig.',
      en: 'This site — Next.js, statically exported, bilingual.',
    },
    outcome: {
      de: 'Vollständig vorgerendert, damit sie ohne JavaScript lesbar bleibt.',
      en: 'Fully prerendered, so it stays readable without JavaScript.',
    },
    description: {
      de: [
        'Mein Portfolio in der zweiten Generation. Die erste Fassung war eine Create-React-App ohne Prerendering — Suchmaschinen sahen eine leere Seite.',
        'Die Neufassung ist ein statischer Next.js-Export: jede Route liegt als fertiges HTML vor, die Animationen legen sich nur darüber. Zweisprachig, mit eigenem MDX-Blog und automatischer Auslieferung über GitHub Actions auf Firebase Hosting.',
      ],
      en: [
        'My portfolio, second generation. The first version was a Create React App with no prerendering — search engines saw an empty page.',
        'The rebuild is a static Next.js export: every route ships as finished HTML, with the animations layered on top. Bilingual, with its own MDX blog and automated delivery through GitHub Actions to Firebase Hosting.',
      ],
    },
    technologies: ['Next.js', 'React', 'TypeScript', 'Motion', 'Lenis', 'Firebase Hosting'],
    github: 'https://github.com/DonkeyKongJr/portfolio',
    url: 'https://schadler.dev/',
  },
  {
    slug: 'pmone-xpct',
    name: 'pmOne XPCT',
    type: 'product',
    year: '2018',
    palette: 'violet',
    featured: false,
    role: { de: 'Senior Software Developer', en: 'Senior Software Developer' },
    summary: {
      de: 'Forecasting und Simulation von Finanzkennzahlen.',
      en: 'Forecasting and simulation of financial figures.',
    },
    outcome: {
      de: 'Treiberbasierte Szenarien statt Tabellenkalkulation.',
      en: 'Driver-based scenarios instead of spreadsheets.',
    },
    description: {
      de: [
        'XPCT erlaubte es, verschiedene Treiber auf die eigene Finanzlage hochzurechnen und Szenarien zu simulieren.',
        'Das Produkt wurde 2018 eingestellt. Angular im Frontend, .NET Core und Microsoft Azure im Hintergrund.',
      ],
      en: [
        'XPCT allowed customers to forecast and simulate the effect of different drivers on their financial position.',
        'The product was discontinued in 2018. Angular on the frontend, .NET Core and Microsoft Azure behind it.',
      ],
    },
    technologies: ['Angular', 'Material Design', '.NET Core', 'Microsoft Azure'],
    github: null,
    url: 'https://www.pmone.com/pmone-loesungen/finanzen/forecasting-und-simulation/',
  },
  {
    slug: 'patrick-visuals',
    name: 'Patrick Visuals',
    type: 'personal',
    year: '2019',
    palette: 'yellow',
    featured: false,
    role: { de: 'Fotograf & Betreiber', en: 'Photographer & Owner' },
    summary: {
      de: 'Foto- und Videografie, nebenberuflich seit Juli 2019.',
      en: 'Photo and videography, alongside the day job since July 2019.',
    },
    outcome: {
      de: 'Hochzeiten und Produktfotografie — die andere Hälfte meiner Arbeit mit Technik.',
      en: 'Weddings and product photography — the other half of my work with technology.',
    },
    description: {
      de: [
        'Patrick Visuals ist mein Gewerbe für Foto- und Videografie, gestartet im Juli 2019 neben dem Hauptberuf.',
        'Der Großteil der Aufträge sind Hochzeiten und Produktfotografie. Die Website läuft auf WordPress.',
      ],
      en: [
        'Patrick Visuals is my photo and video business, started in July 2019 alongside my full-time job.',
        'Most of the work is weddings and product photography. The website runs on WordPress.',
      ],
    },
    technologies: ['WordPress', 'Google Analytics'],
    github: null,
    url: 'https://www.patrickvisuals.at',
  },
  {
    slug: 'personal-blog',
    name: 'Personal Blog',
    type: 'personal',
    year: '2018',
    palette: 'green',
    featured: false,
    role: { de: 'Autor', en: 'Author' },
    summary: {
      de: 'Technikblog auf Ghost CMS, einige tausend Aufrufe im Monat.',
      en: 'Tech blog on Ghost CMS, a few thousand visits per month.',
    },
    outcome: {
      de: 'Artikel zu C#, .NET und Design Patterns — inzwischen hierher umgezogen.',
      en: 'Articles on C#, .NET and design patterns — since moved here.',
    },
    description: {
      de: [
        'Über mehrere Jahre habe ich unter patrickschadler.com einen Technikblog auf Ghost CMS betrieben, überwiegend zu C#, .NET, Webservices und Microsoft Dynamics CRM.',
        'Die Domain leitet inzwischen hierher um; die Artikel ziehen nach und nach in den Blog dieser Seite.',
      ],
      en: [
        'For several years I ran a tech blog on Ghost CMS at patrickschadler.com, mostly about C#, .NET, web services and Microsoft Dynamics CRM.',
        'The domain now redirects here, and the articles are gradually moving into this site’s blog.',
      ],
    },
    technologies: ['Ghost CMS', 'Google Analytics'],
    github: null,
    url: null,
  },
  {
    slug: 'burger-builder',
    name: 'Burger Builder',
    type: 'personal',
    year: '2019',
    palette: 'blue',
    featured: false,
    role: { de: 'Entwickler', en: 'Developer' },
    summary: {
      de: 'React-Übungsprojekt mit Firebase Realtime Database.',
      en: 'React practice project backed by Firebase Realtime Database.',
    },
    outcome: {
      de: 'Der Einstieg in React — Grundlage für alles, was danach kam.',
      en: 'My way into React — the groundwork for everything that followed.',
    },
    description: {
      de: [
        'Ein React-Projekt, in dem Burger zusammengestellt und in einer Firebase Realtime Database abgelegt werden. Teil eines React-Onlinekurses.',
        'Klein, aber der eigentliche Einstieg in das React-Ökosystem.',
      ],
      en: [
        'A React project for assembling burgers and storing them in a Firebase Realtime Database. Part of a React online course.',
        'Small, but the actual entry point into the React ecosystem.',
      ],
    },
    technologies: ['React', 'Styled Components', 'Firebase'],
    github: 'https://github.com/DonkeyKongJr/burger-builder',
    url: null,
  },
];

export const projects: Project[] = parseAll(projectSchema, raw, 'projects');

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
