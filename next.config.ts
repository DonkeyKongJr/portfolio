import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Statischer Export: Firebase Hosting liefert reines HTML aus, kein Node-Server.
  output: 'export',
  // Ohne Optimizer-Backend muss next/image die Dateien unveraendert durchreichen.
  images: { unoptimized: true },
  // /de/work/ -> /de/work/index.html, damit Firebase ohne Rewrites aufloest.
  trailingSlash: true,
  reactStrictMode: true,
  /*
   * Nur fuer den Dev-Server: Next blockiert Anfragen an /_next/-Ressourcen,
   * wenn sie nicht von localhost kommen. Beim Aufruf ueber die Netzwerk-IP
   * oder aus einer Browser-Erweiterung heraus laedt sonst kein einziges
   * Skript - die Seite erscheint, aber ohne jede Animation.
   */
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.1.61'],
};

export default nextConfig;
