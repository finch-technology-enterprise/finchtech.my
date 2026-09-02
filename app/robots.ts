import type { MetadataRoute } from 'next';
import { COMPANY } from '@/lib/company';

/**
 * robots.txt.
 *
 * Previously this was Cloudflare's auto-generated content-signals file — nobody
 * had made a deliberate decision, and it carried no sitemap reference.
 *
 * Search crawlers are welcome. AI training crawlers are disallowed, matching the
 * stance already taken on nexmenu.my so the two properties are consistent.
 * `/api/` is excluded as it serves no indexable content.
 */
const AI_TRAINING_CRAWLERS = [
  'Amazonbot',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'ClaudeBot',
  'Google-Extended',
  'GPTBot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      ...AI_TRAINING_CRAWLERS.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: `${COMPANY.siteUrl}/sitemap.xml`,
    host: COMPANY.siteUrl,
  };
}
