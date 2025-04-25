import tseslint from 'typescript-eslint';
import { flatConfig as nextConfig } from '@next/eslint-plugin-next';

import reactConfig from '@brickninja-org/eslint-config/react';

export default tseslint.config(
  // ignore all files in .next
  { ignores: ['.next'] },

  // extends next/core-web-vitals
  nextConfig.coreWebVitals,

  // extend @brickninja-org/eslint-config/react
  ...reactConfig,
);
