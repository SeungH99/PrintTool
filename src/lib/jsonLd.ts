/**
 * Props for a native JSON-LD <script> tag. Escapes `<` to < to keep the
 * payload from breaking out of the script element (XSS-safe). Use as:
 * `<script {...jsonLdScriptProps(data)} />`.
 */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, '\\u003c') },
  };
}
