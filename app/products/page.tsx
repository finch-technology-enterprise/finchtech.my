import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Badge } from '@/components/ui/card';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { GERAIKU, NEXMENU } from '@/lib/company';
import { breadcrumbSchema, geraikuSchema, jsonLd, nexmenuSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Software products built and operated by Finch Technology: NexMenu for restaurant ordering and operations, and GeraiKu for small online stores in Malaysia.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(nexmenuSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(geraikuSchema())} />

      <Section flow="lg">
        <SectionHeading
          as="h1"
          eyebrow="Products"
          title="Software we build and operate"
          lead="These are our own products — designed, developed, hosted and supported by Finch Technology. They are live services with paying customers, not concepts."
          className="max-w-3xl"
        />
      </Section>

      <Section flow="default" tone="sunken" className="!pt-0">
        <div className="grid gap-8">
          {/* NexMenu — flagship, full-width feature treatment */}
          <Reveal>
            <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <div className="grid lg:grid-cols-[1fr_1.15fr]">
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <Badge tone="nexmenu">Flagship product</Badge>
                  <h2 className="text-h2 mt-4 font-semibold text-fg">NexMenu</h2>
                  <p className="mt-2 text-eyebrow font-semibold uppercase text-nexmenu">
                    Restaurant ordering &amp; operations
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-fg-muted">
                    For cafes and restaurants in Malaysia. Guests scan a QR code and order from
                    their own phone; the kitchen sees each ticket the moment it is placed; and the
                    owner runs payments, tables, stock and reports from one dashboard.
                  </p>
                  <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-eyebrow font-semibold uppercase text-fg-subtle">
                        Built for
                      </dt>
                      <dd className="mt-1 text-sm text-fg">Cafes, restaurants and F&amp;B outlets</dd>
                    </div>
                    <div>
                      <dt className="text-eyebrow font-semibold uppercase text-fg-subtle">
                        Plans
                      </dt>
                      <dd className="mt-1 text-sm text-fg">Free Lite plan · paid from RM29/month</dd>
                    </div>
                  </dl>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/products/nexmenu"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                    >
                      About NexMenu
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <TrackedLink
                      href={NEXMENU.demo}
                      event="nexmenu_demo"
                      placement="products_nexmenu"
                      variant="secondary"
                      size="md"
                    >
                      See the demo
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </TrackedLink>
                  </div>
                </div>

                <div className="relative border-t border-border bg-nexmenu-soft p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <div className="overflow-hidden rounded-lg border border-nexmenu-border shadow-lift">
                    <Image
                      src="/images/products/kds-live-orders.webp"
                      alt="The NexMenu kitchen display showing live order tickets grouped by preparation status"
                      width={1200}
                      height={750}
                      sizes="(max-width: 1023px) 92vw, 52vw"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </article>
          </Reveal>

          {/* GeraiKu — secondary weight */}
          <Reveal delay={80}>
            <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <div className="grid lg:grid-cols-[1fr_1.15fr]">
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <Badge tone="geraiku">Also by Finch</Badge>
                  <h2 className="text-h2 mt-4 font-semibold text-fg">GeraiKu</h2>
                  <p className="mt-2 text-eyebrow font-semibold uppercase text-geraiku">
                    Online stores for small sellers
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-fg-muted">
                    For home bakers, florists, fashion sellers and other small Malaysian businesses
                    taking orders through WhatsApp. GeraiKu gives them a proper storefront, a
                    product catalogue and an order dashboard instead of a scrolling chat thread.
                  </p>
                  <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-eyebrow font-semibold uppercase text-fg-subtle">
                        Built for
                      </dt>
                      <dd className="mt-1 text-sm text-fg">Home businesses and small sellers</dd>
                    </div>
                    <div>
                      <dt className="text-eyebrow font-semibold uppercase text-fg-subtle">
                        Plans
                      </dt>
                      <dd className="mt-1 text-sm text-fg">Free plan · no order commission</dd>
                    </div>
                  </dl>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/products/geraiku"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-sm font-semibold text-fg shadow-card transition-colors hover:border-ink-400 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                    >
                      About GeraiKu
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <TrackedLink
                      href={GERAIKU.home}
                      event="geraiku_outbound"
                      placement="products_geraiku"
                      variant="ghost"
                      size="md"
                    >
                      Visit geraiku.my
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </TrackedLink>
                  </div>
                </div>

                <div className="relative border-t border-border bg-geraiku-soft p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <div className="overflow-hidden rounded-lg border border-geraiku-border shadow-lift">
                    <Image
                      src="/images/products/geraiku-storefront.webp"
                      alt="The GeraiKu homepage showing the free online store builder for Malaysian small businesses"
                      width={1200}
                      height={750}
                      loading="lazy"
                      sizes="(max-width: 1023px) 92vw, 52vw"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
