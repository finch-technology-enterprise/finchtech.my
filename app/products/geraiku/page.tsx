import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Badge } from '@/components/ui/card';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { COMPANY, GERAIKU } from '@/lib/company';
import { breadcrumbSchema, geraikuSchema, jsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'GeraiKu — online stores for small Malaysian businesses',
  description:
    'GeraiKu is a product by Finch Technology: a free online storefront for Malaysian home businesses and small sellers, turning WhatsApp orders into a managed catalogue and order dashboard.',
  alternates: { canonical: '/products/geraiku' },
};

const POINTS = [
  'A branded storefront on your own geraiku.my address',
  'Product catalogue with photos, prices and options',
  'Orders collected in one dashboard instead of a chat thread',
  'No commission taken on your orders',
  'Free plan to start, with an upgrade when you grow',
] as const;

export default function GeraiKuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(geraikuSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: 'GeraiKu', path: '/products/geraiku' },
          ]),
        )}
      />

      <Section flow="lg">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-fg-subtle" role="list">
            <li>
              <Link href="/" className="hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/products" className="hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-fg">GeraiKu</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <Badge tone="geraiku">A product by Finch Technology</Badge>
            <h1 className="text-h1 mt-5 font-semibold text-fg">
              GeraiKu — open an online store, free
            </h1>
            <p className="text-lead mt-5 text-fg-muted">
              Built for small Malaysian sellers running a business out of WhatsApp: home bakers,
              florists, sambal makers, fashion and tudung sellers. GeraiKu gives you a proper
              storefront and a single place to see every order.
            </p>
            <ul className="mt-8 space-y-3" role="list">
              {POINTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-geraiku" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink
                href={GERAIKU.signup}
                event="geraiku_outbound"
                placement="geraiku_bridge_primary"
                variant="primary"
                size="lg"
              >
                Open your store free
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
              <TrackedLink
                href={GERAIKU.home}
                event="geraiku_outbound"
                placement="geraiku_bridge_visit"
                variant="secondary"
                size="lg"
              >
                Visit geraiku.my
              </TrackedLink>
            </div>
            <p className="mt-5 text-sm text-fg-subtle">
              GeraiKu is presented in Bahasa Malaysia and English at geraiku.my.
            </p>
          </div>

          <Reveal>
            <div className="screenshot">
              <Image
                src="/images/products/geraiku-storefront.webp"
                alt="The GeraiKu homepage showing store themes and the free plan for Malaysian small businesses"
                width={1200}
                height={750}
                priority
                sizes="(max-width: 1023px) 92vw, 52vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section flow="default" tone="sunken">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-10">
          <SectionHeading
            eyebrow="Who operates GeraiKu"
            title="Also built and run by Finch Technology"
            lead={`${COMPANY.legalName}, SSM registration ${COMPANY.registrationNo}, ${COMPANY.address.city}, ${COMPANY.address.state}. Same team, same infrastructure, same support channels as NexMenu.`}
            className="max-w-2xl"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/company"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-sm font-semibold text-fg shadow-card transition-colors hover:border-ink-400 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              About Finch Technology
            </Link>
            <Link
              href="/products/nexmenu"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-fg transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              See NexMenu
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
