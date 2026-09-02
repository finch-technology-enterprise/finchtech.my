import type { MetadataRoute } from 'next';
import { COMPANY } from '@/lib/company';

/**
 * Sitemap.
 *
 * The previous site had none, so five of its seven pages were undiscoverable.
 * Priorities reflect commercial intent: the NexMenu bridge page ranks directly
 * below the homepage because it carries the primary conversion journey.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = COMPANY.siteUrl;
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] =
    [
      { path: '/', priority: 1, changeFrequency: 'weekly' },
      { path: '/products', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/products/nexmenu', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/products/geraiku', priority: 0.7, changeFrequency: 'monthly' },
      { path: '/capabilities', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/company', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/legal', priority: 0.6, changeFrequency: 'yearly' },
      { path: '/legal/privacy', priority: 0.4, changeFrequency: 'yearly' },
      { path: '/legal/terms', priority: 0.4, changeFrequency: 'yearly' },
      { path: '/legal/refund', priority: 0.4, changeFrequency: 'yearly' },
      { path: '/legal/service-delivery', priority: 0.4, changeFrequency: 'yearly' },
      { path: '/legal/payment-policy', priority: 0.4, changeFrequency: 'yearly' },
    ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
