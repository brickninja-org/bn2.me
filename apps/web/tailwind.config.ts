import type { Config } from 'tailwindcss';

import bnUIConfig from '@brickninja-org/ui/tailwind.config';

const config: Partial<Config> = {
  presets: [ bnUIConfig ],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../node_modules/@brickninja-org/ui/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bitter: [ 'var(--font-bitter)', 'serif' ],
      },
    },
  },
};

export default config;
