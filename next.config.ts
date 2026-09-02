import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Pricing ownership: nexmenu.my owns the detailed NexMenu pricing table.
      // Maintaining a second full copy here split commercial search intent
      // across two domains and duplicated content. A permanent redirect passes
      // the accumulated signal to the canonical page instead.
      {
        source: '/pricing',
        destination: 'https://nexmenu.my/product#pricing',
        permanent: true,
      },
      // Legal routes moved under /legal for a single compliance hub. These
      // paths were published and are referenced by external policies, so they
      // must keep resolving.
      { source: '/privacy', destination: '/legal/privacy', permanent: true },
      { source: '/terms', destination: '/legal/terms', permanent: true },
      { source: '/refund', destination: '/legal/refund', permanent: true },
      { source: '/service-delivery', destination: '/legal/service-delivery', permanent: true },
      { source: '/payment-policy', destination: '/legal/payment-policy', permanent: true },
      // Common alias.
      { source: '/about', destination: '/company', permanent: true },
    ];
  },

  async headers() {
    // NOTE: static assets (/_next/static/*, /images/*) are served by the
    // Cloudflare Workers Assets layer, which does not apply these headers.
    // Their caching is configured in `public/_headers` instead. Rules here
    // apply to Worker-rendered (document/route handler) responses.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
