import {
  certificationSchema,
  educationSchema,
  parseAll,
  principleSchema,
  serviceSchema,
  skillGroupSchema,
  type Certification,
  type Education,
  type Principle,
  type Service,
  type SkillGroup,
} from './schema';

/**
 * Skills. Im alten Stand lagen sie hartcodiert in AboutMe.js, waehrend Jobs
 * und Projekte in JSON standen. Jetzt liegt alles im selben Content-Layer.
 */
export const skillGroups: SkillGroup[] = parseAll(
  skillGroupSchema,
  [
    {
      id: 'languages',
      title: { de: 'Sprachen', en: 'Languages' },
      items: ['C#', 'TypeScript', 'JavaScript', 'SQL', 'Go'],
    },
    {
      id: 'frontend',
      title: { de: 'Frontend', en: 'Frontend' },
      items: ['React', 'Next.js', 'Angular', 'Aurelia', '.NET MAUI', 'HTML & CSS'],
    },
    {
      id: 'backend',
      title: { de: 'Backend & Cloud', en: 'Backend & Cloud' },
      items: [
        '.NET / .NET Core',
        'ASP.NET',
        'Entity Framework Core',
        'NodeJS',
        'Microsoft Azure',
        'Google Cloud',
        'Firebase',
      ],
    },
    {
      id: 'practices',
      title: { de: 'Arbeitsweise', en: 'Practices' },
      items: [
        'Clean Code & S.O.L.I.D.',
        'Design Patterns',
        'Unit & Mutation Testing',
        'Statische Codeanalyse',
        'CI/CD & GitHub Actions',
        'Scrum & Kanban',
        'Mentoring',
      ],
    },
  ],
  'skillGroups',
);

export const education: Education[] = parseAll(
  educationSchema,
  [
    {
      id: 'ma',
      institution: 'FH JOANNEUM',
      qualification: {
        de: 'MA — IT-Recht & Management',
        en: 'MA — IT Law & Management',
      },
      from: '2014',
      till: '2016',
    },
    {
      id: 'bsc',
      institution: 'FH JOANNEUM',
      qualification: {
        de: 'BSc — Software Design',
        en: 'BSc — Software Design',
      },
      from: '2011',
      till: '2014',
    },
  ],
  'education',
);

export const certifications: Certification[] = parseAll(
  certificationSchema,
  [
    {
      id: 'az204',
      title: 'Microsoft Certified: Azure Developer Associate',
      issuer: 'Microsoft',
      issued: '2021',
      expires: '2026',
    },
  ],
  'certifications',
);

/**
 * Die vier Prinzipien im Sticky-Stack auf der Startseite.
 */
export const principles: Principle[] = parseAll(
  principleSchema,
  [
    {
      id: 'quality',
      title: { de: 'Qualität vor Tempo', en: 'Quality before speed' },
      body: {
        de: 'Eine Woche gesparte Entwicklungszeit kostet oft ein Jahr Wartung. Ich baue lieber einmal sauber als dreimal schnell.',
        en: 'A week saved in development often costs a year in maintenance. I would rather build it properly once than quickly three times.',
      },
    },
    {
      id: 'testability',
      title: { de: 'Testbarkeit von Anfang an', en: 'Testable from day one' },
      body: {
        de: 'Tests werden nicht nachgerüstet. Wenn sich Code schwer testen lässt, ist meist die Architektur das Problem — nicht der Test.',
        en: 'Tests are not retrofitted. When code is hard to test, the architecture is usually the problem — not the test.',
      },
    },
    {
      id: 'automation',
      title: { de: 'Automatisieren, was zweimal passiert', en: 'Automate what happens twice' },
      body: {
        de: 'Build, Formatierung, Analyse, Auslieferung. Alles, was ein Mensch zweimal von Hand macht, gehört in die Pipeline.',
        en: 'Build, formatting, analysis, delivery. Anything a person does by hand twice belongs in the pipeline.',
      },
    },
    {
      id: 'knowledge',
      title: { de: 'Wissen im Team, nicht im Kopf', en: 'Knowledge in the team, not in one head' },
      body: {
        de: 'Reviews, Pairing und Mentoring sind kein Beiwerk. Software, die nur eine Person versteht, ist ein Risiko — kein Vorteil.',
        en: 'Reviews, pairing and mentoring are not extras. Software only one person understands is a risk — not an asset.',
      },
    },
  ],
  'principles',
);

/**
 * Leistungen der mrsd Solutions GmbH. Ersetzt die /services-Seite der
 * Referenz durch einen Block auf der Startseite.
 */
export const services: Service[] = parseAll(
  serviceSchema,
  [
    {
      id: 'development',
      palette: 'violet',
      title: { de: 'Individualentwicklung', en: 'Custom development' },
      description: {
        de: 'Anwendungen mit .NET und Microsoft Azure — von der Architektur bis in den Betrieb.',
        en: 'Applications built with .NET and Microsoft Azure — from architecture through to operations.',
      },
      bullets: {
        de: [
          'Web- und Desktop-Anwendungen mit .NET und .NET MAUI',
          'APIs und Services auf Microsoft Azure',
          'Ablösung und Modernisierung bestehender Systeme',
        ],
        en: [
          'Web and desktop applications with .NET and .NET MAUI',
          'APIs and services on Microsoft Azure',
          'Replacing and modernising existing systems',
        ],
      },
    },
    {
      id: 'consulting',
      palette: 'yellow',
      title: { de: 'Technische Beratung', en: 'Technical consulting' },
      description: {
        de: 'Begleitung bestehender Teams bei Architektur, Qualität und Auslieferung.',
        en: 'Supporting existing teams on architecture, quality and delivery.',
      },
      bullets: {
        de: [
          'Architektur- und Code-Reviews',
          'Aufbau von CI/CD, Teststrategie und statischer Analyse',
          'Mentoring und Wissenstransfer im Team',
        ],
        en: [
          'Architecture and code reviews',
          'Setting up CI/CD, test strategy and static analysis',
          'Mentoring and knowledge transfer within the team',
        ],
      },
    },
  ],
  'services',
);
