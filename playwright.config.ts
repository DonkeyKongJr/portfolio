import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

/*
 * Getestet wird der statische Export, nicht der Dev-Server: nur dort steht
 * genau das HTML, das Firebase spaeter ausliefert - mitsamt Boot-Skript,
 * vorgerendertem Inhalt und den Klassennamen aus dem Produktions-Build.
 */
if (!existsSync(path.join(process.cwd(), 'out', 'de', 'index.html'))) {
  throw new Error('out/ fehlt oder ist unvollstaendig. Erst `npm run build` ausfuehren.');
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx --yes serve out --no-clipboard --listen ${PORT}`,
    url: `${BASE_URL}/de/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
