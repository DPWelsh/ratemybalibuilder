import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/server';
import { locations } from '@/lib/supabase/builders';
import { trades } from '@/lib/trades';
import { chapters } from '@/lib/guide';

const BASE_URL = 'https://ratemybalibuilder.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // Fetch all published builders
  const { data: builders } = await supabase
    .from('builders')
    .select('id, updated_at')
    .eq('is_published', true);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/builders`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/add-builder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/submit-review`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Location pages
  const locationPages: MetadataRoute.Sitemap = locations
    .filter(loc => loc !== 'Other' && loc !== 'Bali Wide')
    .map((location) => ({
      url: `${BASE_URL}/builders/${location.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Builder detail pages
  const builderPages: MetadataRoute.Sitemap = (builders || []).map((builder) => ({
    url: `${BASE_URL}/builder/${builder.id}`,
    lastModified: builder.updated_at ? new Date(builder.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Trade landing pages (Find a Plumber, Find an Electrician, etc.)
  const tradePages: MetadataRoute.Sitemap = trades.map((trade) => ({
    url: `${BASE_URL}/find/${trade.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Guide pages
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...chapters.map((chapter) => ({
      url: `${BASE_URL}/guide/${chapter.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: chapter.accessLevel === 'free' ? 0.8 : 0.6,
    })),
  ];

  return [...staticPages, ...tradePages, ...guidePages, ...locationPages, ...builderPages];
}
