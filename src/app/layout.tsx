import type { ReactNode } from 'react';
import '@/styles/globals.css';

/**
 * Root-Layout. Haelt bewusst kein <html>/<body> - das macht
 * src/app/[locale]/layout.tsx, weil dort erst das lang-Attribut feststeht.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
