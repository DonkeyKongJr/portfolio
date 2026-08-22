/**
 * Laedt jede Seite in einem Chromium ohne Erweiterungen und meldet jede
 * Konsolenausgabe vom Typ error oder warning.
 *
 * Grund fuer dieses Skript: Browser-Erweiterungen - allen voran React
 * DevTools - schreiben Fehler in dieselbe Konsole und tauchen im Next-Overlay
 * auf, als kaemen sie aus der Anwendung. Hier laeuft nichts ausser der Seite,
 * die Ausgabe ist damit eindeutig zuzuordnen.
 *
 *   npm run check:console                    # gegen den Dev-Server
 *   npm run check:console -- http://…:4321   # gegen einen Export
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';

const paths = [
  '/de/',
  '/en/',
  '/de/work/',
  '/de/work/qr-maker/',
  '/de/about/',
  '/de/blog/',
  '/de/blog/factory-method-design-pattern/',
  '/en/blog/factory-method-design-pattern/',
  '/en/blog/unit-tests-with-mocks/',
  '/de/contact/',
  '/de/imprint/',
  '/de/privacy/',
];

const browser = await chromium.launch();
let total = 0;

for (const path of paths) {
  const page = await browser.newPage();
  const messages = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') messages.push(`[${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (e) => messages.push(`[pageerror] ${e.message}`));

  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Neu laden: die Startanimation wird dann uebersprungen, ein anderer Pfad.
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  total += messages.length;
  console.log(`${messages.length === 0 ? '  ok  ' : ' FEHL '} ${path}`);
  for (const m of messages) console.log('        ' + m.slice(0, 220));
  await page.close();
}

await browser.close();
console.log(`\n${total} Meldungen ueber ${paths.length} Seiten`);
process.exit(total === 0 ? 0 : 1);
