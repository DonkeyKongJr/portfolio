/**
 * Strukturierte Daten. Wird als Server-Komponente gerendert und landet damit
 * im statischen HTML - genau dort, wo Crawler sie erwarten.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Kein Nutzereingabe-Pfad: der Inhalt kommt ausschliesslich aus dem
      // Content-Layer im Repo.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
