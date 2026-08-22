import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    // Standard ist node; Komponententests setzen jsdom per Docblock im Datei-Kopf.
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  resolve: {
    alias: { '@': path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'src') },
  },
});
