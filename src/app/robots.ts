import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/store/dashboard', '/store/settings', '/store/products/', '/admin/'],
      },
    ],
    sitemap: 'https://anshinsweets.com/sitemap.xml',
  };
}
