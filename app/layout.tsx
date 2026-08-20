import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://finchtech.my'),
  title: {
    default: 'Finch Technology Enterprise | Software for Malaysian Businesses',
    template: '%s | Finch Technology Enterprise',
  },
  description:
    'Finch Technology Enterprise — custom software development, hosting infrastructure and IT consultancy for Malaysian businesses. House of NexMenu (QR ordering & kitchen display) & GeraiKu (storefront SaaS).',
  alternates: {
    canonical: 'https://finchtech.my',
  },
  openGraph: {
    url: 'https://finchtech.my',
    type: 'website',
    title: 'Finch Technology Enterprise | Software for Malaysian Businesses',
    description:
      'Finch Technology Enterprise — custom software development, hosting infrastructure and IT consultancy for Malaysian businesses. House of NexMenu & GeraiKu.',
    siteName: 'Finch Technology Enterprise',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Finch Technology Enterprise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finch Technology Enterprise | Software for Malaysian Businesses',
    description:
      'Finch Technology Enterprise — custom software development, hosting infrastructure and IT consultancy for Malaysian businesses. House of NexMenu & GeraiKu.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} min-h-screen antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--bg)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-white/20"
        >
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
