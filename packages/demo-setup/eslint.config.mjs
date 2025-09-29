import { defineConfig, globalIgnores } from 'eslint/config';
import config from '@brickninja-org/eslint-config';

export default defineConfig(
  globalIgnores(['dist/']),
  ...config,
);
