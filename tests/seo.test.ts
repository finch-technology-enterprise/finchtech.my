import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import {
  breadcrumbSchema,
  geraikuSchema,
  nexmenuSchema,
  organizationSchema,
  websiteSchema,
} from '@/lib/schema';
import { COMPANY, NEXMENU } from '@/lib/company';

/**
 * SEO surface coverage.
 *
 * The audit found no sitemap, an unowned robots.txt, and zero structured data —
 * so five of seven pages were undiscoverable and nothing connected Finch to its
 * product domains as one entity.
 */

const PUBLIC_ROUTES = [
  '/',
  '/products',
  '/products/nexmenu',
  '/products/geraiku',
  '/capabilities',
  '/company',
  '/contact',
  '/legal',
  '/legal/privacy',
  '/legal/terms',
  '/legal/refund',
  '/legal/service-delivery',
  '/legal/payment-policy',
];

describe('sitemap', () => {
  it('includes every public route exactly once', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const route of PUBLIC_ROUTES) {
      expect(urls, `sitemap missing ${route}`).toContain(`${COMPANY.siteUrl}${route}`);
    }
  });

  it('does not list redirected or private routes', () => {
    const urls = sitemap().map((e) => e.url);
    for (const gone of ['/pricing', '/privacy', '/terms', '/about', '/api/health']) {
      expect(urls).not.toContain(`${COMPANY.siteUrl}${gone}`);
    }
  });

  it('ranks the homepage and NexMenu journey highest', () => {
    const entries = sitemap();
    const home = entries.find((e) => e.url === `${COMPANY.siteUrl}/`);
    const nexmenu = entries.find((e) => e.url === `${COMPANY.siteUrl}/products/nexmenu`);
    const privacy = entries.find((e) => e.url === `${COMPANY.siteUrl}/legal/privacy`);
    expect(home?.priority).toBe(1);
    expect(nexmenu?.priority ?? 0).toBeGreaterThan(privacy?.priority ?? 1);
  });

  it('uses absolute https URLs', () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith('https://finchtech.my')).toBe(true);
    }
  });
});

describe('robots', () => {
  it('references the sitemap', () => {
    expect(robots().sitemap).toBe(`${COMPANY.siteUrl}/sitemap.xml`);
  });

  it('allows search crawlers but not the API', () => {
    const rules = robots().rules as { userAgent: string; allow?: string; disallow?: string }[];
    const wildcard = rules.find((r) => r.userAgent === '*');
    expect(wildcard?.allow).toBe('/');
    expect(wildcard?.disallow).toBe('/api/');
  });

  it('disallows AI training crawlers, matching the NexMenu stance', () => {
    const rules = robots().rules as { userAgent: string; disallow?: string }[];
    for (const bot of ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended']) {
      expect(rules.find((r) => r.userAgent === bot)?.disallow).toBe('/');
    }
  });
});

describe('structured data', () => {
  it('organization schema links products via ownership, not sameAs', () => {
    // sameAs asserts "same entity". The products are owned BY Finch, not
    // alternative identities OF Finch — see tests/hardening.test.ts.
    const schema = organizationSchema() as {
      owns: { '@id': string }[];
      identifier: { value: string };
    };
    const owned = schema.owns.map((o) => o['@id']);
    expect(owned).toContain(`${COMPANY.siteUrl}/#nexmenu`);
    expect(owned).toContain(`${COMPANY.siteUrl}/#geraiku`);
    expect(schema.identifier.value).toBe(COMPANY.registrationNo);
  });

  it('organization schema publishes a verifiable Malaysian address', () => {
    const schema = organizationSchema() as { address: Record<string, string> };
    expect(schema.address.addressCountry).toBe('MY');
    expect(schema.address.addressLocality).toBe('Puchong');
  });

  it('website schema points back to the organization', () => {
    const schema = websiteSchema() as { publisher: { '@id': string } };
    expect(schema.publisher['@id']).toBe(`${COMPANY.siteUrl}/#organization`);
  });

  it('product schemas attribute publisher to Finch', () => {
    for (const schema of [nexmenuSchema(), geraikuSchema()]) {
      const typed = schema as { publisher: { '@id': string }; '@type': string };
      expect(typed['@type']).toBe('SoftwareApplication');
      expect(typed.publisher['@id']).toBe(`${COMPANY.siteUrl}/#organization`);
    }
  });

  it('claims no ratings, review counts or user numbers', () => {
    // Guards against schema being used to manufacture social proof.
    for (const schema of [organizationSchema(), nexmenuSchema(), geraikuSchema(), websiteSchema()]) {
      const serialised = JSON.stringify(schema);
      expect(serialised).not.toMatch(/aggregateRating|reviewCount|ratingValue|userInteractionCount/);
    }
  });

  it('does not assert a founding date while 2012 and 2016 remain unreconciled', () => {
    expect(JSON.stringify(organizationSchema())).not.toMatch(/foundingDate/);
  });

  it('breadcrumbs build absolute positioned trails', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].item).toBe(`${COMPANY.siteUrl}/products`);
  });
});

describe('outbound product destinations', () => {
  it('uses the verified NexMenu conversion routes', () => {
    expect(NEXMENU.demo).toBe('https://nexmenu.my/demo');
    expect(NEXMENU.signupFree).toBe('https://nexmenu.my/auth/signup?plan=lite');
    expect(NEXMENU.pricing).toBe('https://nexmenu.my/product#pricing');
  });

  it('never points at a finchtech.my pricing page', () => {
    // Pricing ownership belongs to nexmenu.my; /pricing here is a 308 redirect.
    expect(Object.values(NEXMENU).every((url) => url.startsWith('https://nexmenu.my'))).toBe(true);
  });
});
