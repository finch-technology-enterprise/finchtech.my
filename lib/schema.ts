import { COMPANY, GERAIKU, NEXMENU } from '@/lib/company';

/**
 * Structured data.
 *
 * Entity model — the relationship this graph must express is:
 *
 *   Finch Technology Enterprise (Organization)
 *       ├── owns / publishes → NexMenu   (SoftwareApplication)
 *       └── owns / publishes → GeraiKu   (SoftwareApplication)
 *
 * NOT `Finch = NexMenu = GeraiKu`.
 *
 * `sameAs` is deliberately NOT used for the product domains. Schema.org defines
 * sameAs as "a reference page that unambiguously indicates the item's identity"
 * — i.e. another URL for *the same entity*. nexmenu.my identifies NexMenu, not
 * Finch, so listing it under Finch's sameAs asserts the two are the same thing.
 * That is the exact confusion this site exists to remove.
 *
 * The relationship is instead expressed with properties that actually mean
 * ownership/production:
 *   - Organization.owns  → the products the company owns
 *   - SoftwareApplication.publisher / .provider / .copyrightHolder → Finch
 *   - SoftwareApplication.brand → the product's own brand
 * with shared `@id`s so consumers resolve one coherent graph.
 *
 * Facts only: no aggregateRating, no reviewCount, no foundingDate (2012 vs 2016
 * unreconciled), no employee counts, no uptime.
 */

const ORG_ID = `${COMPANY.siteUrl}/#organization`;
const NEXMENU_ID = `${COMPANY.siteUrl}/#nexmenu`;
const GERAIKU_ID = `${COMPANY.siteUrl}/#geraiku`;

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.postcode,
    addressCountry: 'MY',
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: COMPANY.siteUrl,
    description:
      'Finch Technology builds and operates cloud software for Malaysian businesses, including NexMenu restaurant ordering and operations software.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SSM registration number',
      value: COMPANY.registrationNo,
    },
    address: postalAddress(),
    location: {
      '@type': 'Place',
      address: postalAddress(),
      hasMap: COMPANY.mapsUrl,
    },
    email: COMPANY.email,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: COMPANY.email,
        areaServed: 'MY',
        availableLanguage: ['en', 'ms'],
      },
    ],
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    // The products Finch owns and operates. This is the ownership edge —
    // it does NOT assert that Finch and the products are the same entity.
    owns: [{ '@id': NEXMENU_ID }, { '@id': GERAIKU_ID }],
    brand: [
      { '@type': 'Brand', name: 'NexMenu', url: NEXMENU.origin },
      { '@type': 'Brand', name: 'GeraiKu', url: GERAIKU.origin },
    ],
    // No sameAs: Finch has no other URL that identifies Finch itself. When a
    // company profile (LinkedIn, SSM directory, Google Business) is confirmed,
    // those belong here — the product domains never do.
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${COMPANY.siteUrl}/#website`,
    url: COMPANY.siteUrl,
    name: COMPANY.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-MY',
  };
}

/**
 * NexMenu.
 *
 * `offers` states only what is verifiable from the NexMenu plan catalog
 * (packages/shared/src/plans.ts): a free tier exists, paid plans start at RM29.
 * `sameAs` here IS correct — nexmenu.my genuinely identifies NexMenu.
 */
export function nexmenuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': NEXMENU_ID,
    name: 'NexMenu',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Restaurant management software',
    operatingSystem: 'Web browser',
    url: NEXMENU.origin,
    sameAs: [NEXMENU.origin],
    description:
      'QR ordering, point of sale, kitchen and runner displays, table sessions, reservations, inventory and reporting for Malaysian cafes and restaurants.',
    publisher: { '@id': ORG_ID },
    provider: { '@id': ORG_ID },
    copyrightHolder: { '@id': ORG_ID },
    brand: { '@type': 'Brand', name: 'NexMenu' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MYR',
      description: 'Free Lite plan available. Paid plans from RM29 per month.',
      url: NEXMENU.pricing,
      availableAtOrFrom: { '@type': 'Country', name: 'Malaysia' },
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
  };
}

export function geraikuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': GERAIKU_ID,
    name: 'GeraiKu',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Online store builder',
    operatingSystem: 'Web browser',
    url: GERAIKU.origin,
    sameAs: [GERAIKU.origin],
    description:
      'A simple online storefront for Malaysian small businesses — turn WhatsApp orders into a managed catalogue and order dashboard.',
    publisher: { '@id': ORG_ID },
    provider: { '@id': ORG_ID },
    copyrightHolder: { '@id': ORG_ID },
    brand: { '@type': 'Brand', name: 'GeraiKu' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MYR',
      description: 'Free plan available.',
      url: GERAIKU.home,
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
  };
}

/** Breadcrumbs for nested routes. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${COMPANY.siteUrl}${item.path}`,
    })),
  };
}

export function jsonLd(schema: object) {
  return { __html: JSON.stringify(schema) };
}

/*
 * `ProfessionalService` was removed.
 *
 * It is a LocalBusiness subtype meaning "a provider of professional services"
 * — the consultancy/agency signal this site was rebuilt specifically to stop
 * sending. Finch sells subscription software products, not billable
 * professional services, so the type did not describe a real offering.
 *
 * The genuinely useful part of it (a verifiable Malaysian address for local
 * intent) is retained on the Organization via `address` + `location`, which is
 * accurate and does not mislabel the business.
 */
