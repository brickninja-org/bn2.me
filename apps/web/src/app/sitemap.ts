import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bn2.me/' },
    { url: 'https://bn2.me/login' },
    { url: 'https://bn2.me/discover' },
    { url: 'https://bn2.me/extension' },
    { url: 'https://bn2.me/dev/docs' },
    { url: 'https://bn2.me/legal' },
    { url: 'https://bn2.me/legal/privacy-policy' },
  ];
}
