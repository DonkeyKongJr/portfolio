import { ossRepoSchema, parseAll, type OssRepo } from './schema';

/**
 * Kuratierte Open-Source-Repos.
 *
 * Bewusst statisch gepflegt statt per GitHub-API: ein Client-Call kostet
 * Latenz, laeuft ins Rate-Limit und landet ohnehin nicht im statischen Export,
 * bringt fuer SEO also nichts.
 */
const raw = [
  {
    name: 'design-patterns-observer',
    url: 'https://github.com/DonkeyKongJr/ObserverDesignPattern',
    language: 'C#',
    description: {
      de: 'Das Observer-Pattern in C#, als lauffähiges Beispiel mit Tests.',
      en: 'The observer pattern in C#, as a runnable example with tests.',
    },
  },
  {
    name: 'design-patterns-builder',
    url: 'https://github.com/DonkeyKongJr/BuilderDesignPattern',
    language: 'C#',
    description: {
      de: 'Das Builder-Pattern in C# — Begleitcode zum gleichnamigen Artikel.',
      en: 'The builder pattern in C# — companion code to the article of the same name.',
    },
  },
  {
    name: 'design-patterns-factory-method',
    url: 'https://github.com/DonkeyKongJr/FactoryMethodDesignPattern',
    language: 'C#',
    description: {
      de: 'Factory Method in C#, mit Fokus auf Testbarkeit.',
      en: 'Factory method in C#, focused on testability.',
    },
  },
  {
    name: 'design-patterns-singleton',
    url: 'https://github.com/DonkeyKongJr/SingletonDesignPattern',
    language: 'C#',
    description: {
      de: 'Singleton in C# — inklusive der Gründe, es meist nicht zu verwenden.',
      en: 'Singleton in C# — including the reasons not to use it most of the time.',
    },
  },
  {
    name: 'design-patterns-strategy',
    url: 'https://github.com/DonkeyKongJr/StrategyDesignPattern',
    language: 'C#',
    description: {
      de: 'Das Strategy-Pattern in C# als kleines, lesbares Beispiel.',
      en: 'The strategy pattern in C# as a small, readable example.',
    },
  },
  {
    name: 'dotnet-stryker-demo',
    url: 'https://github.com/DonkeyKongJr/dotnet-stryker-demo',
    language: 'C#',
    description: {
      de: 'Mutation Testing mit Stryker.NET — zeigt, wo Code Coverage lügt.',
      en: 'Mutation testing with Stryker.NET — shows where code coverage lies.',
    },
  },
  {
    name: 'aspnet-core-odata-sample',
    url: 'https://github.com/DonkeyKongJr/aspnet-core-odata-sample',
    language: 'C#',
    description: {
      de: 'OData-Endpunkte mit ASP.NET Core, minimal gehalten.',
      en: 'OData endpoints with ASP.NET Core, kept minimal.',
    },
  },
  {
    name: 'aspnet-core-authentication-auth0',
    url: 'https://github.com/DonkeyKongJr/aspnet-core-authentication-auth0',
    language: 'C#',
    description: {
      de: 'Authentifizierung in ASP.NET Core mit Auth0, End-to-End.',
      en: 'Authentication in ASP.NET Core with Auth0, end to end.',
    },
  },
];

export const ossRepos: OssRepo[] = parseAll(ossRepoSchema, raw, 'ossRepos');
