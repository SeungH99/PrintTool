import type { ReactNode } from 'react';

// Pass-through root layout. The real <html>/<body> document lives in
// app/[locale]/layout.tsx so the `lang` attribute can follow the active locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
