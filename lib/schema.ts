import { ADDRESS_ONE_LINE, COMPANY, GERAIKU, NEXMENU } from '@/lib/company';

/**
 * Structured data.
 *
 * Rule applied throughout: schema describes facts that are already stated and
 * verifiable on the page. No aggregateRating, no review, no employee counts, no
 * foundingDate (2012 vs 2016 is unreconciled) — schema is not used to
 * manufacture credibility.
 */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${COMPANY.siteUrl}/#organization`,
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
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      postalCode: COMPANY.address.postcode,
      addressCountry: 'MY',
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
    // Connects the corporate entity to the product properties it operates.
    sameAs: [NEXMENU.origin, GERAIKU.origin],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${COMPANY.siteUrl}/#website`,
    url: COMPANY.siteUrl,
    name: COMPANY.name,
    publisher: { '@id': `${COMPANY.siteUrl}/#organization` },
    inLanguage: 'en-MY',
  };
}

/**
 * SoftwareApplication for NexMenu.
 *
 * `offers` states only what is independently verifiable from the NexMenu plan
 * catalog (packages/shared/src/plans.ts): a free tier exists and paid plans
 * start at RM29/month. No user counts or ratings are claimed.
 */
export function nexmenuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NexMenu',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Restaurant management software',
    operatingSystem: 'Web browser',
    url: NEXMENU.origin,
    description:
      'QR ordering, point of sale, kitchen and runner displays, table sessions, reservations, inventory and reporting for Malaysian cafes and restaurants.',
    publisher: { '@id': `${COMPANY.siteUrl}/#organization` },
    provider: { '@id': `${COMPANY.siteUrl}/#organization` },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MYR',
      description: 'Free Lite plan available. Paid plans from RM29 per month.',
      url: NEXMENU.pricing,
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
  };
}

export function geraikuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GeraiKu',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Online store builder',
    operatingSystem: 'Web browser',
    url: GERAIKU.origin,
    description:
      'A simple online storefront for Malaysian small businesses — turn WhatsApp orders into a managed catalogue and order dashboard.',
    publisher: { '@id': `${COMPANY.siteUrl}/#organization` },
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

/** LocalBusiness — supports "software company Puchong" style local intent. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${COMPANY.siteUrl}/#localbusiness`,
    name: COMPANY.legalName,
    url: COMPANY.siteUrl,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      postalCode: COMPANY.address.postcode,
      addressCountry: 'MY',
    },
    description: ADDRESS_ONE_LINE,
    parentOrganization: { '@id': `${COMPANY.siteUrl}/#organization` },
    hasMap: COMPANY.mapsUrl,
  };
}

export function jsonLd(schema: object) {
  return { __html: JSON.stringify(schema) };
}
