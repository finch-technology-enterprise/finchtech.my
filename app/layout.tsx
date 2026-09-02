import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from 'sonner';
import { organizationSchema, websiteSchema } from '@/lib/schema';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://finchtech.my'),
  title: {
    default: 'Finch Technology — Cloud software built for Malaysian businesses',
    template: '%s | Finch Technology',
  },
  description:
    'Finch Technology builds and operates cloud software for Malaysian businesses, including NexMenu — QR ordering, POS and kitchen operations for cafes and restaurants. Registered in Malaysia, based in Puchong, Selangor.',
  applicationName: 'Finch Technology',
  authors: [{ name: 'Finch Technology' }],
  creator: 'Finch Technology',
  publisher: 'Finch Technology Enterprise',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://finchtech.my',
    siteName: 'Finch Technology',
    title: 'Finch Technology — Cloud software built for Malaysian businesses',
    description:
      'We build and operate cloud software for Malaysian businesses, including NexMenu — QR ordering, POS and kitchen operations for cafes and restaurants.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finch Technology — Cloud software built for Malaysian businesses',
    description:
      'We build and operate cloud software for Malaysian businesses, including NexMenu — QR ordering, POS and kitchen operations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY" className={inter.variable}>
      <head>
        {/* Organization + WebSite schema establish the Finch -> product
            relationship for search engines. sameAs links the three properties
            into one entity. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body className="min-h-dvh bg-surface font-sans text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:shadow-panel focus:outline-none focus:ring-2 focus:ring-brand-600"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
