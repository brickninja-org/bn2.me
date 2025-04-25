import tseslint from 'typescript-eslint';

import reactConfig from '@brickninja-org/eslint-config/react';

export default tseslint.config(
  { ignores: ['dist/**' ] },

  reactConfig,
);
