import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

/** Baseline security headers on every page response. CSP lands in P2 (needs the AdSense/CMP/GA domains). */
function withSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  );
  return res;
}

export function middleware(request: NextRequest) {
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
  // Skip Next internals, API routes, and any path with a file extension (e.g.
  // /ads.txt, /favicon.ico) so static assets are served directly.
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
