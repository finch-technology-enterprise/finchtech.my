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
  title: 'Finch Technology Enterprise | Software for Malaysian Businesses',
  description:
    'Finch Technology Enterprise: Specialized in high-performance VPN services (FinchVPN), custom software development, hosting infrastructure, and IT consultancy in Malaysia.',
  alternates: {
    canonical: 'https://finchtech.my',
  },
  openGraph: {
    url: 'https://finchtech.my',
    type: 'website',
    title: 'Finch Technology Enterprise | Software for Malaysian Businesses',
    description:
      'Finch Technology Enterprise: Specialized in high-performance VPN services (FinchVPN), custom software development, hosting infrastructure, and IT consultancy in Malaysia.',
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
      'Finch Technology Enterprise: Specialized in high-performance VPN services (FinchVPN), custom software development, hosting infrastructure, and IT consultancy in Malaysia.',
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
        <Nav />
        {children}
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
