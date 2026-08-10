import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

// Content-Security-Policy — Report-Only first: monitor violations in production, then
// flip to enforced once clean. Allows GA / AdSense / Funding Choices (CMP). 'unsafe-inline'
// is required for the Consent Mode default script (static export → no per-request nonce).
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.google.com https://*.gstatic.com https://*.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google.com https://*.adtrafficquality.google",
  'frame-src https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google',
].join('; ');

/** Baseline security headers on every page response. */
function withSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  );
  res.headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY);
  return res;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return withSecurityHeaders(NextResponse.next());

  // No locale prefix → redirect to the default locale (both /ko and /en are prefixed).
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return withSecurityHeaders(NextResponse.redirect(url));
}

export const config = {
  // Skip Next internals, API routes, the generated OG image (no locale prefix — a
  // locale redirect would 404 it), and any path with a file extension (e.g. /ads.txt)
  // so static assets are served directly.
  matcher: ['/((?!_next|api|opengraph-image|.*\\..*).*)'],
};
