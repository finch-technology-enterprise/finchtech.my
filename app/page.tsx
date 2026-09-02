import type { Metadata } from 'next';
import { Hero } from '@/components/home/hero';
import { NexMenuSpotlight } from '@/components/home/nexmenu-spotlight';
import { OtherProducts } from '@/components/home/other-products';
import { WhyFinch } from '@/components/home/why-finch';
import { CapabilitiesPreview } from '@/components/home/capabilities-preview';
import { ClosingCta } from '@/components/home/closing-cta';
import { geraikuSchema, jsonLd, nexmenuSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Finch Technology — Cloud software built for Malaysian businesses',
  description:
    'Finch Technology builds and operates cloud software for Malaysian businesses. NexMenu handles QR ordering, point of sale and kitchen operations for cafes and restaurants. Registered in Malaysia, based in Puchong.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(nexmenuSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(geraikuSchema())} />
      <Hero />
      <NexMenuSpotlight />
      <WhyFinch />
      <CapabilitiesPreview />
      <OtherProducts />
      <ClosingCta />
    </>
  );
}
