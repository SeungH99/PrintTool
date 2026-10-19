/** Advertising stays off unless explicitly enabled for this build. */
export function isAdSenseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
}
