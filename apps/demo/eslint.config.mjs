import { defineConfig, globalIgnores } from 'eslint/config';
import nextConfig from '@next/eslint-plugin-next';

import reactConfig from '@brickninja-org/eslint-config/react';

export default defineConfig(
  // ignore Next.js generated files
  globalIgnores([
    '.next/',
    'next-env.d.ts'
  ]),

  // extends next/core-web-vitals
  nextConfig.flatConfig.coreWebVitals,

  // extend @brickninja-org/eslint-config/react
  ...reactConfig,
);
