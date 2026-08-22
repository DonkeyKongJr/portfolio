import { expect, test, type Page } from '@playwright/test';

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
