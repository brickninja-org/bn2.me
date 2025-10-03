import type { NextConfig } from 'next';

import path from 'path';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@heroui/react', '@heroui/styles', '@brickninja-org/ui'],
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@heroui/react'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // eslint-disable-next-line require-await
  async redirects() {
    return [
      {
        destination: '/dev/docs/introduction',
        permanent: true,
        source: '/dev/docs',
      },
    ];
  },
};

export default withMDX(nextConfig);
