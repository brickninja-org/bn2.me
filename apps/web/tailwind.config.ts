import type { Config } from 'tailwindcss';

const config: Partial<Config> = {
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
