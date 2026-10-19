import { guideSlugs } from '@/content/guideSlugs';
import { isLocale } from '@/i18n/config';
import { isToolId } from '@/lib/tools';

/** Positive route allowlist: nested paths and future routes are ad-free by default. */
export function isAdEligibleRoute(pathname: string): boolean {
  const segments = pathname.split('/');
  if (segments[0] !== '' || !isLocale(segments[1])) return false;
  if (segments.length === 2) return true;
  if (segments.length === 3) {
    return isToolId(segments[2]) || ['guides', 'reference'].includes(segments[2]);
  }
  return (
    segments.length === 4 &&
    segments[2] === 'guides' &&
    (guideSlugs as readonly string[]).includes(segments[3])
  );
}
