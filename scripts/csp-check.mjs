/**
 * Prueft, ob Google Analytics unter der ausgelieferten CSP wirklich sendet.
 *
 * Notwendig, weil ein zu enger connect-src nichts kaputtmacht, was man sieht:
 * die Seite laeuft weiter, nur es wird still nichts gemessen. Genau das war
 * der Fall - "https://www.google-analytics.com" deckt die regionalen
 * Endpunkte wie region1.google-analytics.com nicht ab.
 *
 * Muss gegen eine echte Firebase-Auslieferung laufen; ein lokaler Export
 * traegt die Header nicht.
 *
 *   node scripts/csp-check.mjs https://portfolio-bb87c--vorschau.web.app
 *
 * Erfolg: mindestens eine 2xx-Antwort von Analytics, kein CSP-Verstoss.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage();

const csp = [];
const responses = [];
const failures = [];

page.on('console', (m) => {
  if (/Content Security Policy/i.test(m.text())) csp.push(m.text().slice(0, 180));
});
page.on('response', (r) => {
  if (/google-analytics|analytics\.google/.test(r.url())) {
    responses.push(`${r.status()} ${r.url().split('?')[0]}`);
  }
});
page.on('requestfailed', (r) => {
  if (/google-analytics|analytics\.google/.test(r.url())) {
    failures.push(`${r.failure()?.errorText} ${r.url().split('?')[0]}`);
  }
});

await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /^Accept$/i }).click();
// Ausreichend warten und NICHT weiternavigieren - sonst bricht der Browser
// den Beacon selbst ab und das saehe wie ein Fehler aus.
await page.waitForTimeout(6000);

console.log('Antworten von Google Analytics:');
for (const r of [...new Set(responses)]) console.log('   ' + r);
console.log('Fehlgeschlagene Anfragen:', failures.length ? failures : 'keine');
console.log('CSP-Verstoesse in der Konsole:', csp.length ? csp : 'keine');

await browser.close();
process.exit(csp.length === 0 && responses.some((r) => r.startsWith('2')) ? 0 : 1);
