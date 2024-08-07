const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  transpilePackages: ['@brickninja-org/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
