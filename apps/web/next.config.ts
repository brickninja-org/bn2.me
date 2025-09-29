import type { NextConfig } from 'next';

import path from 'path';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../src/'),
  transpilePackages: ['@heroui/react', '@heroui/styles', '@brickninja-org/ui'],
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@heroui/react'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withMDX(nextConfig);
