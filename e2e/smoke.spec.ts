import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * Rauchtest gegen den statischen Export.
 *
 * Deckt die Zusagen ab, die sich nur im echten Browser pruefen lassen:
 * Startanimation, Sprachwechsel, Theme, Lesbarkeit ohne JavaScript und die
 * Frage, ob die Anwendung selbst etwas in die Konsole schreibt.
 */

/** Sammelt Konsolenfehler; ohne Erweiterungen ist jede Meldung wirklich unsere. */
function collectConsole(page: Page): string[] {
  const messages: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') messages.push(`[${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (e) => messages.push(`[pageerror] ${e.message}`));
  return messages;
}

const PAGES = [
  '/de/',
  '/en/',
  '/de/work/',
  '/de/work/qr-maker/',
  '/de/about/',
  '/de/blog/',
  '/de/blog/factory-method-design-pattern/',
  '/en/blog/unit-tests-with-mocks/',
  '/de/contact/',
  '/de/imprint/',
  '/de/privacy/',
];

test.describe('Seiten laden sauber', () => {
  for (const path of PAGES) {
    test(`ohne Konsolenmeldung: ${path}`, async ({ page }) => {
      const messages = collectConsole(page);
      await page.goto(path);
      await expect(page.locator('h1').first()).toBeVisible();
      // Erneutes Laden geht einen anderen Weg: die Intro wird uebersprungen.
      await page.reload();
      await expect(page.locator('h1').first()).toBeVisible();
      expect(messages).toEqual([]);
    });
  }
});

test.describe('Sprachen', () => {
  test('setzt lang und Titel je Sprache', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de-AT');
    await expect(page.locator('h1')).toContainText('Software');

    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('behaelt beim Wechsel den Pfad', async ({ page }) => {
    await page.goto('/de/work/qr-maker/');
    await page.getByTitle(/Switch to English/i).click();
    await expect(page).toHaveURL(/\/en\/work\/qr-maker\/$/);
  });

  test('weicht auf die Uebersicht aus, wenn die Uebersetzung fehlt', async ({ page }) => {
    // Vorher zeigte der Umschalter hier auf eine 404.
    await page.goto('/en/blog/unit-tests-with-mocks/');
    await page.getByTitle(/Auf Deutsch wechseln/i).click();
    await expect(page).toHaveURL(/\/de\/blog\/$/);
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Startanimation', () => {
  test('laeuft beim ersten Besuch und wird danach uebersprungen', async ({ page }) => {
    await page.goto('/de/');

    const overlay = page.locator('[data-state="entering"], [data-state="leaving"]');
    await expect(overlay).toBeVisible();
    // Nach Ablauf ist sie aus dem DOM und die Ueberschrift steht frei.
    await expect(overlay).toBeHidden({ timeout: 6000 });
    await expect(page.locator('h1')).toBeVisible();

    await page.reload();
    // Zweiter Besuch derselben Sitzung: das Flag greift, kein Vorhang mehr.
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'skip');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('bleibt bei reduzierter Bewegung ganz aus', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/de/');
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'skip');
    await expect(page.locator('h1')).toBeVisible();
    await context.close();
  });
});

test.describe('Theme', () => {
  test('startet dunkel und merkt sich die Wahl', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: /hellen Design/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    // Ohne das Boot-Skript wuerde hier kurz das dunkle Theme aufblitzen.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('bleibt der Inhalt vollstaendig lesbar', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Software');
    // Der Vorhang haengt an data-js und darf ohne JavaScript nicht erscheinen.
    await expect(page.locator('[data-state="entering"]')).toBeHidden();
  });

  test('sind auch Unterseiten lesbar', async ({ page }) => {
    await page.goto('/de/about/');
    await expect(page.getByText('mrsd Solutions GmbH').first()).toBeVisible();
    await page.goto('/de/blog/factory-method-design-pattern/');
    await expect(page.getByText('Maschinell übersetzt')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('fuehrt zu den Unterseiten', async ({ page }) => {
    await page.goto('/de/');
    await page.getByRole('link', { name: 'Projekte', exact: true }).click();
    await expect(page).toHaveURL(/\/de\/work\/$/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('liefert fuer unbekannte Pfade eine 404', async ({ page }) => {
    // Der frueher gesetzte SPA-Rewrite haette hier 200 gemeldet.
    const response = await page.goto('/de/gibt-es-nicht/');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Einwilligung', () => {
  test('laesst sich erteilen und spaeter widerrufen', async ({ page }) => {
    await page.goto('/de/');

    // Zu Beginn ist nichts entschieden, also fragt das Banner.
    const banner = page.getByRole('dialog');
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Einverstanden' }).click();
    await expect(banner).toBeHidden();

    // Widerruf ueber die Datenschutzseite - ohne diesen Weg waere die
    // Zustimmung nur ueber das Loeschen der Website-Daten zu aendern.
    await page.goto('/de/privacy/');
    const allow = page.getByRole('button', { name: 'Erlauben' });
    await expect(allow).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Ablehnen' }).click();
    // Beim Widerruf laedt die Seite neu, damit gtag.js wirklich verschwindet.
    await expect(page.getByRole('button', { name: 'Ablehnen' })).toHaveAttribute(
      'aria-pressed',
      'true',
      { timeout: 10000 },
    );

    // Die Entscheidung ueberlebt einen Seitenwechsel und das Banner bleibt weg.
    await page.goto('/de/');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('laedt ohne Zustimmung kein Google-Skript', async ({ page }) => {
    const google: string[] = [];
    page.on('request', (r) => {
      if (/googletagmanager|google-analytics/.test(r.url())) google.push(r.url());
    });
    await page.goto('/de/');
    await page.waitForTimeout(2500);
    expect(google).toEqual([]);
  });

  test('ist der Widerruf aus dem Seitenfuss erreichbar', async ({ page }) => {
    await page.goto('/de/');
    await page.getByRole('link', { name: 'Analytics-Einstellungen' }).click();
    await expect(page).toHaveURL(/\/de\/privacy\/#consent$/);
    await expect(page.getByRole('button', { name: 'Erlauben' })).toBeVisible();
  });
});

test.describe('Layout-Stabilitaet', () => {
  test('die Ueberschrift aendert ihre Hoehe nach dem Laden nicht mehr', async ({ page }) => {
    /*
     * Fuer einen Layout-Sprung braucht es keinen Schriftwechsel: ein Clip,
     * der spaet von overflow:hidden auf visible schaltet, verschiebt die
     * Grundlinie des Inline-Blocks. Die Zeilenbox wird niedriger, alles
     * darunter rutscht hoch - hier waren es 15px, Sekunden nach dem Laden.
     */
    await page.goto('/de/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    const heights: number[] = [];
    for (let i = 0; i < 12; i += 1) {
      heights.push(Math.round((await h1.boundingBox())!.height));
      await page.waitForTimeout(600);
    }

    expect(new Set(heights).size, `Hoehen im Verlauf: ${heights.join(', ')}`).toBe(1);
  });

  test('erzeugt keinen nennenswerten kumulativen Layout-Sprung', async ({ page }) => {
    await page.goto('/de/');
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let sum = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as unknown as {
              value: number;
              hadRecentInput: boolean;
            }[]) {
              if (!entry.hadRecentInput) sum += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(sum), 7000);
        }),
    );
    // Googles Schwelle fuer "gut" liegt bei 0.1.
    expect(cls).toBeLessThan(0.1);
  });
});

test.describe('Liquid Glass', () => {
  /*
   * SmoothScrollProvider.tsx laesst bei reduzierter Bewegung natives Scrollen
   * aktiv (useReducedMotion() -> Lenis startet gar nicht erst). Ohne diese
   * Einstellung kaempft Lenis' eigene Zielposition gegen ein programmatisches
   * window.scrollTo() im Test und data-scrolled kippt mitten im Test wieder
   * um - hier interessiert nur der reine data-scrolled/backdrop-filter-Effekt,
   * keine Bewegung.
   */
  test.use({ reducedMotion: 'reduce' });

  /*
   * Die eigentliche Nav (data-scrolled, siehe Nav.tsx) von der schlichten
   * Fussleisten-Navigation (Footer.tsx) unterscheiden - beide sind <nav>.
   */
  const navSelector = 'nav[data-scrolled]';

  /** Alpha-Kanal aus einem computed rgb()/rgba()-String. */
  function alphaOf(color: string): number {
    const parts =
      color
        .match(/rgba?\(([^)]+)\)/)?.[1]
        ?.split(',')
        .map(Number) ?? [];
    return parts.length === 4 ? parts[3]! : 1;
  }

  /*
   * .nav transitioniert background/backdrop-filter ueber --duration-medium
   * (Nav.module.css). window.scrollTo() im Test loest sofort den Zustand aus,
   * aber getComputedStyle direkt danach faengt sonst einen Zwischenwert der
   * laufenden Animation - deshalb erst auf transitionend warten (mit
   * Fallback, falls aus irgendeinem Grund keins feuert).
   */
  async function waitForNavTransition(nav: Locator): Promise<void> {
    await nav.evaluate(
      (el) =>
        new Promise<void>((resolve) => {
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            resolve();
          };
          el.addEventListener('transitionend', finish, { once: true });
          setTimeout(finish, 500);
        }),
    );
  }

  test('setzt data-glass auf liquid in Chromium', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('html')).toHaveAttribute('data-glass', 'liquid');
  });

  test('bindet den Brechungsfilter lg-refract genau einmal ein', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('#lg-refract')).toHaveCount(1);
  });

  test('bekommt nach dem Scrollen Blur- und Brechungsfilter, Blur vor url()', async ({ page }) => {
    await page.goto('/de/');
    const nav = page.locator(navSelector);

    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(nav).toHaveAttribute('data-scrolled', 'true');
    await waitForNavTransition(nav);

    const backdropFilter = await nav.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(backdropFilter).toContain('blur(');
    expect(backdropFilter).toContain('url(');
    /*
     * Reihenfolge ist entscheidend (glass.module.css-Kommentar): url() vor
     * blur() laesst Chromium den Blur verwerfen. Deshalb reicht es nicht,
     * beide Teilstrings zu finden - der computed String muss mit blur(
     * beginnen.
     */
    expect(backdropFilter.startsWith('blur(')).toBe(true);
  });

  test('ist ungescrollt auf dem Desktop farblich transparent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Mobile Nav ist immer im Glaszustand.');

    await page.goto('/de/');
    const nav = page.locator(navSelector);
    await expect(nav).toHaveAttribute('data-scrolled', 'false');

    const backgroundColor = await nav.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(alphaOf(backgroundColor)).toBe(0);
  });

  test('faellt bei reduzierter Transparenz auf eine undurchsichtige Flaeche zurueck', async ({
    page,
    context,
  }) => {
    // Muss vor page.goto gesetzt werden, damit das Boot-Skript data-glass korrekt liest.
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
    });

    await page.goto('/de/');
    await expect(page.locator('html')).toHaveAttribute('data-glass', 'glass');

    const nav = page.locator(navSelector);
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(nav).toHaveAttribute('data-scrolled', 'true');
    await waitForNavTransition(nav);

    const backdropFilter = await nav.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(backdropFilter).toBe('none');

    const backgroundColor = await nav.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(alphaOf(backgroundColor)).toBe(1);
  });
});
