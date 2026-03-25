import type { MetadataRoute } from 'next';
import { getAllStores } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://anshinsweets.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shops`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/feedback`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic shop pages
  let shopPages: MetadataRoute.Sitemap = [];
  try {
    const stores = await getAllStores();
    shopPages = stores.map((store) => ({
      url: `${baseUrl}/shop/${store.id}`,
      lastModified: new Date(store.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If DB is unavailable, skip dynamic pages
  }

  return [...staticPages, ...shopPages];
}
