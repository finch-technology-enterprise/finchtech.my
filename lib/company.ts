/**
 * Company facts and outbound destinations — the single source of truth for
 * anything that appears in more than one place.
 *
 * Every value here is verifiable:
 *  - Registration/address: SSM 201603312160, corroborated independently on
 *    nexmenu.my/about ("Operated by Finch Technology Enterprise (SSM …)").
 *  - WhatsApp: wa.me/60164525797, carried forward from the legacy site and the
 *    previous contact section. (60123456789 seen elsewhere in the monorepo is a
 *    test fixture, not a real number.)
 *  - Product routes: verified live 2026-09-02, all returning 200.
 *
 * Deliberately absent: founding year (the 2012 FinchVPN vs 2016 SSM dates are
 * unreconciled), customer counts, uptime figures, testimonials, partner logos.
 * None of those can be substantiated, so none are published.
 */

export const COMPANY = {
  name: 'Finch Technology',
  legalName: 'Finch Technology Enterprise',
  registrationNo: '201603312160',
  registrationAlt: 'MA0215195-D',
  legalForm: 'Sole proprietorship registered under the Registration of Businesses Act 1956',
  msic: ['62010', '63111', '62021'],
  email: 'support@finchtech.my',
  whatsappNumber: '60164525797',
  address: {
    line1: '5B, Jalan BPU 5',
    line2: 'Bandar Puchong Utama',
    postcode: '47100',
    city: 'Puchong',
    state: 'Selangor',
    country: 'Malaysia',
  },
  mapsUrl: 'https://maps.app.goo.gl/aYkckpagJbw4fjgKA',
  siteUrl: 'https://finchtech.my',
} as const;

export const ADDRESS_ONE_LINE = `${COMPANY.address.line1}, ${COMPANY.address.line2}, ${COMPANY.address.postcode} ${COMPANY.address.city}, ${COMPANY.address.state}, ${COMPANY.address.country}`;

/**
 * WhatsApp deep link with a prefilled enquiry.
 * `context` lets each surface pre-frame the conversation so the team knows
 * where the lead came from without any tracking cookie.
 */
export function whatsappUrl(context?: string): string {
  const message = context
    ? `Hi Finch Technology, I'd like to ask about ${context}.`
    : `Hi Finch Technology, I'd like to make an enquiry.`;
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const MAILTO = `mailto:${COMPANY.email}`;

/**
 * NexMenu destinations — verified against the NexMenu repository
 * (packages/frontend/src/app/(marketing)/…) and live HTTP probes on 2026-09-02.
 * `?plan=<id>` is read by the signup page (auth/signup/page.tsx:22).
 */
export const NEXMENU = {
  origin: 'https://nexmenu.my',
  home: 'https://nexmenu.my',
  demo: 'https://nexmenu.my/demo',
  signup: 'https://nexmenu.my/auth/signup',
  signupFree: 'https://nexmenu.my/auth/signup?plan=lite',
  product: 'https://nexmenu.my/product',
  pricing: 'https://nexmenu.my/product#pricing',
  contact: 'https://nexmenu.my/contact',
  security: 'https://nexmenu.my/security',
  legal: 'https://nexmenu.my/legal',
  privacy: 'https://nexmenu.my/privacy',
  terms: 'https://nexmenu.my/terms',
} as const;

export const GERAIKU = {
  origin: 'https://geraiku.my',
  home: 'https://geraiku.my',
  signup: 'https://geraiku.my/auth/signin?new=1',
  themes: 'https://geraiku.my/#tema',
  pricing: 'https://geraiku.my/#harga',
} as const;
