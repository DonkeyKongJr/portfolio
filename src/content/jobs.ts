import { jobSchema, parseAll, type Job } from './schema';

/**
 * Werdegang. Migriert aus dem alten src/data/jobs.json mit vier Korrekturen:
 *  - mrsd Solutions GmbH neu an Position 0 (im alten Stand komplett fehlend)
 *  - Guid.New von "present" auf 2025 korrigiert
 *  - ACP-Firmenname auf die Schreibweise des GitHub-Profils vereinheitlicht
 *  - Provaria Junior/Head hatten woertlich identische Texte - jetzt getrennt
 */
const raw = [
  {
    id: 'mrsd',
    company: 'mrsd Solutions GmbH',
    link: 'https://www.mrsd.at',
    from: '2025',
    till: null,
    current: true,
    role: {
      de: 'Gründer & Geschäftsführer',
      en: 'Founder & Managing Director',
    },
    description: {
      de: [
        'mrsd Solutions ist mein eigenes Softwareunternehmen. Ich baue individuelle Anwendungen mit .NET und Microsoft Azure und begleite Teams von der Architektur bis zum Betrieb.',
        'Der Fokus liegt auf Software, die man auch in fünf Jahren noch weiterentwickeln kann: klare Architektur, hohe Testabdeckung, automatisierte Auslieferung.',
        'Daneben übernehme ich technische Beratung — Code-Reviews, Architekturentscheidungen und der Aufbau von CI/CD-Prozessen in bestehenden Teams.',
      ],
      en: [
        'mrsd Solutions is my own software company. I build custom applications with .NET and Microsoft Azure and support teams from architecture through to operations.',
        'The focus is on software that can still be evolved five years from now: clear architecture, high test coverage, automated delivery.',
        'Alongside that I take on technical consulting — code reviews, architecture decisions, and setting up CI/CD processes in existing teams.',
      ],
    },
  },
  {
    id: 'guidnew',
    company: 'Guid.New GmbH',
    link: 'https://www.guidnew.com',
    from: '2023',
    till: '2025',
    current: false,
    role: {
      de: 'Lead Software Developer',
      en: 'Lead Software Developer',
    },
    description: {
      de: [
        'Entwicklung von Anwendungen der nächsten Generation mit .NET, .NET MAUI und Microsoft Azure.',
        'Technische Führung im Projektgeschäft für Kunden aus Industrie, Handel und öffentlichem Sektor.',
      ],
      en: [
        'Building next generation applications with .NET, .NET MAUI and Microsoft Azure to help customers succeed.',
        'Technical leadership in client projects across industry, retail and the public sector.',
      ],
    },
  },
  {
    id: 'acp',
    company: 'ACP Digital Business Applications GmbH',
    link: 'https://www.acp.at',
    from: '2020',
    till: '2023',
    current: false,
    role: {
      de: 'Head of Software Development',
      en: 'Head of Software Development',
    },
    description: {
      de: [
        'Führung eines Teams von Softwareentwicklerinnen und -entwicklern.',
        'Etablierung von S.O.L.I.D., Clean-Code-Prinzipien, Continuous Integration & Delivery, statischer Codeanalyse und automatischer Codeformatierung.',
        'Mentoring von Junior-Kolleginnen und -Kollegen.',
      ],
      en: [
        'Leading a team of software developers.',
        'Increased the use of S.O.L.I.D. and clean code principles, continuous integration & delivery, static code analysis and automatic code formatting.',
        'Mentoring of junior colleagues.',
      ],
    },
  },
  {
    id: 'pmone',
    company: 'pmOne GmbH',
    link: 'https://www.pmone.com',
    from: '2017',
    till: '2020',
    current: false,
    role: {
      de: 'Senior Software Developer',
      en: 'Senior Software Developer',
    },
    description: {
      de: [
        'Frontend-Webanwendungen mit Aurelia, Angular 5+ und NodeJS.',
        'RESTful Services mit .NET Classic, .NET Core und Entity Framework (Core).',
        'Intensiver Einsatz von Microsoft-Azure-Architektur und -Produkten.',
        'Einführung von Unit Tests in allen neuen Projekten mit mindestens 90 % Code Coverage.',
        'Einführung von S.O.L.I.D., Clean Code, CI/CD, statischer Codeanalyse und Mentoring.',
      ],
      en: [
        'Built frontend web applications with Aurelia, Angular 5+ and NodeJS.',
        'Built RESTful services with .NET Classic, .NET Core and Entity Framework (Core).',
        'Heavy use of Microsoft Azure architecture and products.',
        'Introduced unit tests in all new projects with a minimum code coverage of 90%.',
        'Introduced S.O.L.I.D., clean code principles, CI/CD, static code analysis and mentoring.',
      ],
    },
  },
  {
    id: 'provaria-head',
    company: 'Provaria GmbH',
    link: 'https://www.provaria.com',
    from: '2016',
    till: '2017',
    current: false,
    role: {
      de: 'Head of Software Development',
      en: 'Head of Software Development',
    },
    description: {
      de: [
        'Verantwortung für das Entwicklungsteam und die technische Ausrichtung der CRM-Projekte.',
        'Beratung von Kunden zu Erweiterungen und Möglichkeiten von Microsoft CRM.',
        'Aufwandsschätzung, Angebotslegung und technische Projektbegleitung bis zur Abnahme.',
      ],
      en: [
        'Responsible for the development team and the technical direction of the CRM projects.',
        'Advised customers on Microsoft CRM amendments and possibilities.',
        'Estimation, proposals and technical project ownership through to handover.',
      ],
    },
  },
  {
    id: 'provaria-dev',
    company: 'Provaria GmbH',
    link: 'https://www.provaria.com',
    from: '2012',
    till: '2016',
    current: false,
    role: {
      de: 'Software Engineer',
      en: 'Software Engineer',
    },
    description: {
      de: [
        'Individuelle Microsoft-CRM-Lösungen für deutsche Automobilhersteller, Produktionsbetriebe, österreichische Unternehmen und Behörden.',
        'ASP.NET-Websites und -Services als Administrationsoberflächen für Kunden.',
      ],
      en: [
        'Built custom Microsoft CRM solutions for major German carmakers, production companies, Austrian businesses and government agencies.',
        'Built ASP.NET websites and services providing administration panels for customers.',
      ],
    },
  },
  {
    id: 'lenze',
    company: 'Lenze AG',
    link: 'https://www.lenze.com',
    from: '2011',
    till: '2012',
    current: false,
    role: {
      de: 'Software Engineer',
      en: 'Software Engineer',
    },
    description: {
      de: [
        'Bau, Test und Auslieferung von Prüfständen für Automotive-Getriebesysteme.',
        'Enge Zusammenarbeit mit Kunden und Partnerunternehmen.',
        'Einarbeitung eines neuen Kollegen, der die Betreuung einzelner Kunden übernommen hat.',
      ],
      en: [
        'Built, tested and delivered test benches for automotive transmission systems.',
        'Worked closely with customers and partner companies.',
        'Mentored a new employee to take over development for several customers.',
      ],
    },
  },
  {
    id: 'autotronic',
    company: 'Autotronic GmbH',
    link: null,
    from: '2009',
    till: '2011',
    current: false,
    role: {
      de: 'Software Engineer',
      en: 'Software Engineer',
    },
    description: {
      de: [
        'Individuelle Automatisierungsanlagen für Automobilhersteller und Zulieferer in Österreich und Deutschland.',
        'Häufige Einsätze direkt beim Kunden, um die Feedbackschleifen kurz zu halten.',
        'Eigenverantwortliche Planung der Einsätze inklusive Anreise und Unterkunft für das Team.',
      ],
      en: [
        'Built custom automation lines for major carmakers and suppliers in Austria and Germany.',
        'Worked on-site with many customers to minimise feedback cycle time.',
        'Planned most trips independently, including travel and accommodation for colleagues.',
      ],
    },
  },
];

export const jobs: Job[] = parseAll(jobSchema, raw, 'jobs');

export const currentJob = jobs.find((job) => job.current) ?? jobs[0];
