import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api',
        '/auth',
        '/fed-cm'
      ]
    },
    sitemap: 'https://bn2.me/sitemap.xml',
  };
}
