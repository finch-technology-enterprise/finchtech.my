import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** jsdom does not expose a file: import.meta.url, so resolve from cwd. */
const readSource = (relative: string) => readFileSync(resolve(process.cwd(), relative), 'utf8');
import { organizationSchema, nexmenuSchema, geraikuSchema, websiteSchema } from '@/lib/schema';
import { COMPANY, GERAIKU, NEXMENU, whatsappUrl } from '@/lib/company';
import { withAttribution } from '@/lib/analytics';

/**
 * Regression coverage for issues found during the post-launch hardening review.
 * Each test guards a specific defect that was found in production, not a
 * hypothetical one.
 */

const ORG_ID = `${COMPANY.siteUrl}/#organization`;

describe('entity graph: Finch owns products, is not the same entity as them', () => {
  it('Organization.sameAs never claims a product domain identifies Finch', () => {
    const org = organizationSchema() as { sameAs?: string[] };
    const sameAs = org.sameAs ?? [];
    // sameAs means "another URL for THIS entity". nexmenu.my identifies
    // NexMenu, not Finch — listing it here asserted Finch === NexMenu.
    expect(sameAs).not.toContain(NEXMENU.origin);
    expect(sameAs).not.toContain(GERAIKU.origin);
  });

  it('Organization expresses ownership through owns/brand instead', () => {
    const org = organizationSchema() as {
      owns: { '@id': string }[];
      brand: { name: string }[];
    };
    expect(org.owns.map((o) => o['@id'])).toEqual([
      `${COMPANY.siteUrl}/#nexmenu`,
      `${COMPANY.siteUrl}/#geraiku`,
    ]);
    expect(org.brand.map((b) => b.name)).toEqual(['NexMenu', 'GeraiKu']);
  });

  it('each product points back at Finch as publisher, provider and copyright holder', () => {
    for (const product of [nexmenuSchema(), geraikuSchema()]) {
      const typed = product as unknown as Record<string, { '@id': string }>;
      expect(typed.publisher['@id']).toBe(ORG_ID);
      expect(typed.provider['@id']).toBe(ORG_ID);
      expect(typed.copyrightHolder['@id']).toBe(ORG_ID);
    }
  });

  it('product sameAs correctly points at its own domain', () => {
    expect((nexmenuSchema() as { sameAs: string[] }).sameAs).toContain(NEXMENU.origin);
    expect((geraikuSchema() as { sameAs: string[] }).sameAs).toContain(GERAIKU.origin);
  });

  it('product @ids are stable so the graph resolves', () => {
    expect((nexmenuSchema() as { '@id': string })['@id']).toBe(`${COMPANY.siteUrl}/#nexmenu`);
    expect((geraikuSchema() as { '@id': string })['@id']).toBe(`${COMPANY.siteUrl}/#geraiku`);
    expect((websiteSchema() as { publisher: { '@id': string } }).publisher['@id']).toBe(ORG_ID);
  });

  it('does not emit ProfessionalService — Finch sells products, not billable services', () => {
    const source = readSource('lib/schema.ts');
    // Allowed in the explanatory comment, but never as an emitted @type.
    expect(source).not.toMatch(/'@type':\s*'ProfessionalService'/);
    expect(source).not.toMatch(/'@type':\s*'LocalBusiness'/);
  });
});

describe('privacy policy matches the implemented system', () => {
  const privacy = readSource('app/legal/privacy/page.tsx');
  const route = readSource('app/api/contact/route.ts');

  it('discloses that enquiries are persisted, not just forwarded', () => {
    expect(privacy).toMatch(/Workers KV|key-value/i);
  });

  it('states a retention period that matches the code TTL', () => {
    // Code: expirationTtl 60*60*24*180 seconds.
    const ttlMatch = route.match(/expirationTtl:\s*60\s*\*\s*60\s*\*\s*24\s*\*\s*(\d+)/);
    expect(ttlMatch, 'contact route must set an explicit TTL').not.toBeNull();
    const days = ttlMatch![1];
    expect(days).toBe('180');
    expect(privacy).toContain(`${days} days`);
  });

  it('names every third party that can receive enquiry data', () => {
    for (const processor of ['Cloudflare', 'Telegram', 'Brevo', 'Turnstile']) {
      expect(privacy, `privacy must mention ${processor}`).toMatch(new RegExp(processor, 'i'));
    }
  });

  it('describes the measurement events and denies advertising tracking', () => {
    expect(privacy).toMatch(/measurement/i);
    expect(privacy).toMatch(/do not use advertising/i);
  });
});

describe('analytics carries no personal data', () => {
  const eventRoute = readSource('app/api/event/route.ts');

  it('event payload never reads name, email, phone or message fields', () => {
    for (const field of ['body.name', 'body.contact', 'body.message', 'body.email', 'turnstileToken']) {
      expect(eventRoute, `event route must not touch ${field}`).not.toContain(field);
    }
  });

  it('logs only the allow-listed non-identifying fields', () => {
    const logged = eventRoute.slice(eventRoute.indexOf('console.log'));
    for (const key of ['event', 'placement', 'path', 'country', 'referer']) {
      expect(logged).toContain(key);
    }
    expect(logged).not.toMatch(/\bname\b:|contact:|message:/);
  });
});

describe('UTM attribution model', () => {
  it('stamps Finch attribution when no campaign is present', () => {
    const url = new URL(withAttribution(NEXMENU.demo, 'hero'));
    expect(url.searchParams.get('utm_source')).toBe('finchtech.my');
    expect(url.searchParams.get('utm_medium')).toBe('referral');
    expect(url.searchParams.get('utm_campaign')).toBe('corporate_site');
    expect(url.searchParams.get('utm_content')).toBe('hero');
  });

  it('does not accumulate duplicate parameters on repeat decoration', () => {
    const once = withAttribution(NEXMENU.demo, 'hero');
    const twice = withAttribution(once, 'hero');
    const params = new URL(twice).searchParams;
    expect(params.getAll('utm_source')).toHaveLength(1);
    expect(params.getAll('utm_content')).toHaveLength(1);
  });

  it('preserves the existing fragment on the pricing deep link', () => {
    expect(withAttribution(NEXMENU.pricing, 'footer')).toContain('#pricing');
  });

  it('returns the input unchanged if it is not a valid URL', () => {
    expect(withAttribution('not a url', 'x')).toBe('not a url');
  });
});

describe('WhatsApp prefilled messages', () => {
  it('opens conversationally and stays short', () => {
    const text = decodeURIComponent(new URL(whatsappUrl('NexMenu')).searchParams.get('text')!);
    expect(text).toBe("Hi Finch, I'd like to ask about NexMenu.");
    expect(text.length).toBeLessThan(70);
  });

  it('never repeats the company name inside the sentence', () => {
    for (const context of ['NexMenu', 'your products', 'an integration', undefined]) {
      const text = decodeURIComponent(new URL(whatsappUrl(context)).searchParams.get('text')!);
      expect(text.match(/Finch/g) ?? []).toHaveLength(1);
    }
  });

  it('uses the verified Finch number', () => {
    expect(whatsappUrl()).toContain('60164525797');
  });
});

describe('internal links never route through a redirect', () => {
  const REDIRECTED = ['/pricing', '/privacy', '/terms', '/refund', '/service-delivery', '/payment-policy', '/about'];
  const files = [
    'components/site-footer.tsx',
    'components/site-header.tsx',
    'components/home/closing-cta.tsx',
    'app/contact/page.tsx',
    'app/company/page.tsx',
    'app/legal/page.tsx',
  ];

  it('uses canonical /legal/* and /company paths directly', () => {
    for (const file of files) {
      const source = readSource(file);
      for (const path of REDIRECTED) {
        expect(source, `${file} links to redirected ${path}`).not.toContain(`href="${path}"`);
      }
    }
  });
});
