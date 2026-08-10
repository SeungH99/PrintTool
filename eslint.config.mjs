import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  globalIgnores([
    '.gstack/**',
    '.next/**',
    '.open-next/**',
    'docs/design/printready/**',
    'out/**',
    'build/**',
    'public/lcms/**',
    'next-env.d.ts',
  ]),
]);
