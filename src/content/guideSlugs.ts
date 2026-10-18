/** Stable slugs shared by both locales, safe to use in client-side route checks. */
export const guideSlugs = [
  'print-file-prep',
  'bleed-and-trim',
  'cmyk-vs-rgb',
  'resolution-and-dpi',
  'paper-weight-gsm',
  'saddle-stitch-booklet',
  'large-format-banner',
] as const;

export type GuideSlug = (typeof guideSlugs)[number];
