import type { ReactNode } from 'react';
import type { Metadata } from 'next';

// AdSense account is a global signal → declared at the root (not the locale layer).
// env-gated; rendered into <head> via Next's metadata merge. The loader script lives
// in ConsentScripts (body), and ads.txt is a static crawler file at the site root.
export const metadata: Metadata = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  ? { other: { 'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT } }
  : {};

// Pass-through root layout. The real <html>/<body> document lives in
// app/[locale]/layout.tsx so the `lang` attribute can follow the active locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
