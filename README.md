# schadler.dev

Portfolio und Werdegang von Patrick Schadler — Software Engineer und Gründer der
mrsd Solutions GmbH in Leibnitz, Österreich.

Zweite Generation der Seite. Die erste Fassung war eine Create-React-App ohne
Prerendering, bei der Suchmaschinen ein leeres `<div id="root">` sahen. Diese
Fassung ist ein **statischer Next.js-Export**: jede Route liegt als fertiges
HTML vor, die Animationen legen sich nur darüber.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Ausgabe | `output: 'export'` — reines HTML, kein Node-Server |
| Styling | CSS Modules + Custom-Property-Tokens (`src/styles/tokens.css`) |
| Animation | CSS-Transitions, IntersectionObserver, Web Animations API, Lenis für Smooth Scroll |
| Inhalte | Getypter Content-Layer in `src/content/`, per Zod zur Build-Zeit validiert |
| Blog | MDX, Syntax-Highlighting mit Shiki zur Build-Zeit |
| Sprachen | Deutsch und Englisch unter `/de/` und `/en/` |
| Hosting | Firebase Hosting, Auto-Deploy über GitHub Actions |

Es ist **keine Animationsbibliothek** im Bundle. Preloader, Reveals, Marquee und
Vorhang laufen über CSS und eingebaute Browser-APIs — das spart rund 42 KB gzip
gegenüber einer Motion-basierten Umsetzung.

## Entwicklung

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run check:console  # jede Seite in einem Browser OHNE Erweiterungen laden
                       # und Konsolenfehler melden
```

Letzteres klaert die haeufigste Verwechslung: React DevTools und andere
Erweiterungen schreiben ihre eigenen Fehler in dieselbe Konsole, und das
Next-Overlay zeigt sie an, als kaemen sie aus der Anwendung. Das Skript
startet ein nacktes Chromium - was dort auftaucht, gehoert wirklich uns.

```bash
npm run build        # statischer Export nach out/
npm run serve:out    # den Export lokal ausliefern
npm run lint
npm run typecheck
npm test             # Vitest: Inhalte, i18n, Pfade, Theme, Kontraste
npm run build        # muss vor dem Rauchtest laufen - er prueft out/
npm run test:e2e     # Playwright: Desktop und Mobil gegen den Export
```

Der Rauchtest laeuft gegen den **statischen Export**, nicht gegen den
Dev-Server: nur dort steht genau das HTML, das Firebase ausliefert. Er deckt
ab, was sich ausserhalb eines Browsers nicht pruefen laesst — Startanimation
und ihr Ueberspringen beim zweiten Besuch, Sprachwechsel samt Ausweichen auf
die Uebersicht, Theme-Wahl ueber einen Reload hinweg, Lesbarkeit mit
abgeschaltetem JavaScript, echte 404 und Konsolenfreiheit auf elf Seiten.

Beide Workflows fuehren ihn vor dem Deploy aus; bei einem Fehlschlag haengt
der Playwright-Bericht sieben Tage als Artefakt am Lauf.

`npm run build` erzeugt über den `prebuild`-Hook zuerst die Social-Vorschaubilder
nach `public/og/` (`scripts/generate-og.mjs`).

## Aufbau

```
src/
  app/[locale]/        Routen: /, /work, /work/[slug], /about, /blog,
                       /blog/[slug], /contact, /imprint, /privacy
  app/page.tsx         Sprachweiche unter /
  components/
    layout/            Nav, Footer, Analytics, JSON-LD
    motion/            Preloader, ScrollReveal, WordReveal, Curtain,
                       GrainCanvas, WorkCursor, Lenis-Provider
    sections/          Hero, SelectedWork, Principles, Services, Timeline, …
    ui/                Container, Section, Button
  content/             Jobs, Projekte, Skills, Prinzipien, Blog (MDX)
  i18n/                Wörterbücher DE/EN, typgesichert
  lib/                 Metadata, JSON-LD, Pfade, Blog-Reader
```

## Inhalte pflegen

Alle Texte liegen zweisprachig im Repo, es gibt kein CMS.

- **Werdegang** → `src/content/jobs.ts`
- **Projekte** → `src/content/projects.ts`
- **Skills, Ausbildung, Prinzipien, Leistungen** → `src/content/about.ts`
- **Open Source** → `src/content/oss.ts`
- **Oberflächentexte** → `src/i18n/de.ts` und `src/i18n/en.ts`
- **Firmen- und Kontaktdaten** → `src/config/site.ts`

Ein Tippfehler bricht den Build, nicht die ausgelieferte Seite: die
Zod-Schemata in `src/content/schema.ts` laufen beim Import, also während
`next build`. Fehlt ein Schlüssel in einer Sprache, meldet es TypeScript.

### Neuen Blogartikel anlegen

Eine `.mdx`-Datei in `src/content/blog/de/` oder `src/content/blog/en/` mit
Frontmatter:

```yaml
---
title: 'Titel'
description: 'Ein Satz für Suchergebnis und Vorschau.'
date: '2026-03-01'
tags: ['C#', '.NET']
draft: false
---
```

`draft: true` erscheint nur im Dev-Server. Artikel, die es nur in einer Sprache
gibt, werden in der anderen Übersicht markiert verlinkt statt verschwiegen.

## Cache-Header

Die Regel fuer Seiten lautet `**/`, nicht `**/*.html`. Firebase gleicht das
Muster gegen den **angefragten** Pfad ab, und der endet wegen `trailingSlash`
auf `/` statt auf `.html` — `**/*.html` trifft damit keine einzige Seite.

Auf einem Vorschau-Kanal nachgemessen:

| Muster | `/` | `/de/` | `/de/work/qr-maker/` | `.js` | `.xml` |
|---|---|---|---|---|---|
| `**` | tr | tr | tr | tr | tr |
| `**/` | tr | tr | tr | – | – |
| `**/*.html` | – | – | – | – | – |

Ausserdem gilt: **spaetere Regeln ueberschreiben fruehere** fuer denselben
Header-Schluessel. Die `**`-Regel am Ende setzt deshalb nur Security-Header
und bewusst kein `Cache-Control`, sonst wuerde sie das `immutable` der
Assets aushebeln.

## Deployment

Push auf `master` → GitHub Actions baut und deployt auf Firebase Hosting.
Pull Requests bekommen einen Preview-Channel mit sieben Tagen Laufzeit.

Voraussetzung ist das Repository-Secret `FIREBASE_SERVICE_ACCOUNT`, erzeugt mit:

```bash
npx --package=firebase-tools firebase init hosting:github
```

Das Paket heisst `firebase-tools`, die ausfuehrbare Datei `firebase` — `npx firebase`
allein sucht das gleichnamige Client-SDK und findet dort nichts Ausfuehrbares.

Manuell geht es weiterhin über `npm run deploy`.

## Barrierefreiheit und Performance

- Der vollständige Inhalt steht im statischen HTML. Ohne JavaScript bleibt die
  Seite vollständig lesbar — alle versteckten Ausgangszustände hängen an
  `html[data-js]`, das erst ein Inline-Skript setzt.
- `prefers-reduced-motion` schaltet Preloader, Filmkorn, Smooth Scroll,
  Sticky-Stack und sämtliche Reveals ab.
- Google Analytics lädt erst nach ausdrücklicher Einwilligung. Ohne Zustimmung
  geht keine einzige Anfrage an Google.

## Lizenz

MIT — siehe [LICENSE](./LICENSE). Inhalte, Texte und Bilder ausgenommen.
