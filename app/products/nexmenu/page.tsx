import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, MonitorSmartphone, QrCode, Radio, Store } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Badge } from '@/components/ui/card';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { COMPANY, NEXMENU } from '@/lib/company';
import { breadcrumbSchema, jsonLd, nexmenuSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'NexMenu — restaurant ordering and operations software',
  description:
    'NexMenu is restaurant software by Finch Technology: QR ordering, point of sale, kitchen and runner displays, table sessions and reporting for Malaysian cafes and restaurants.',
  alternates: { canonical: '/products/nexmenu' },
};

/**
 * NexMenu bridge page.
 *
 * Purpose is ownership + credibility, then routing. It deliberately does NOT
 * reproduce nexmenu.my's feature or pricing pages — those should own product and
 * commercial search intent. This page owns "who operates NexMenu".
 *
 * Surface names verified against the current NexMenu source
 * (app/pwa/manifest/[app]/route.ts), not older marketing copy.
 */

const SURFACES = [
  {
    icon: QrCode,
    name: 'NexMenu',
    tagline: 'For the guest',
    body: 'A mobile storefront the guest opens by scanning the QR code on their table. Menu, ordering, and checkout through the restaurant’s own payment gateway.',
  },
  {
    icon: Store,
    name: 'Dashboard & POS',
    tagline: 'For the owner and counter staff',
    body: 'Menu and pricing, table sessions and bills, counter payment, staff accounts, stock, reservations, promotions and sales reports.',
  },
  {
    icon: MonitorSmartphone,
    name: 'NexKitchen',
    tagline: 'For the kitchen',
    body: 'A live display of incoming orders, grouped by station, so the kitchen works from a screen that updates instantly instead of a stack of printed tickets.',
  },
  {
    icon: Radio,
    name: 'NexRunner',
    tagline: 'For service staff',
    body: 'Tracks each order from the moment the kitchen marks it ready through collection and delivery to the table.',
  },
] as const;

const FOR_WHO = [
  'Cafes and coffee shops',
  'Casual dining restaurants',
  'Kopitiam and food court outlets',
  'Dessert, bakery and bubble tea shops',
  'Outlets running dine-in, takeaway and delivery together',
] as const;

export default function NexMenuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(nexmenuSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: 'NexMenu', path: '/products/nexmenu' },
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
            <li className="font-medium text-fg">NexMenu</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Badge tone="nexmenu">A product by Finch Technology</Badge>
            <h1 className="text-h1 mt-5 font-semibold text-fg">
              NexMenu — ordering and operations for Malaysian restaurants
            </h1>
            <p className="text-lead mt-5 text-fg-muted">
              Guests order from their own phone. The kitchen sees every ticket the moment it lands.
              Owners get payments, tables, stock and reporting in one place — without paying a
              commission on orders.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink
                href={NEXMENU.demo}
                event="nexmenu_demo"
                placement="bridge_hero"
                variant="primary"
                size="lg"
              >
                See the demo
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
              <TrackedLink
                href={NEXMENU.signupFree}
                event="nexmenu_signup"
                placement="bridge_hero_free"
                variant="secondary"
                size="lg"
              >
                Start free
              </TrackedLink>
            </div>
            <p className="mt-5 text-sm text-fg-subtle">
              The demo is a fully loaded store — no signup, nothing to install.
            </p>
          </div>

          <Reveal>
            <div className="screenshot">
              <Image
                src="/images/products/storefront-checkout.webp"
                alt="The NexMenu checkout on a phone, showing an order summary and the place order button"
                width={390}
                height={844}
                priority
                sizes="(max-width: 1023px) 70vw, 30vw"
                className="mx-auto h-auto w-full max-w-[300px]"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section flow="lg" tone="sunken" aria-labelledby="surfaces-heading">
        <SectionHeading
          eyebrow="How it fits together"
          title="Four surfaces, one system"
          lead="Each part of the restaurant gets the view it needs, all reading from the same live order data."
          id="surfaces-heading"
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SURFACES.map(({ icon: Icon, name, tagline, body }, i) => (
            <Reveal key={name} delay={i * 60}>
              <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-7 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-nexmenu-soft text-nexmenu">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-semibold text-fg">{name}</h3>
                <p className="mt-1 text-eyebrow font-semibold uppercase text-nexmenu">{tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section flow="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Who it is for"
              title="Built for the way Malaysian F&B runs"
              lead="Ringgit pricing, local payment gateways, e-Invoice export, and support in the same timezone as your kitchen."
            />
            <ul className="mt-8 space-y-3" role="list">
              {FOR_WHO.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-nexmenu" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <div className="screenshot">
              <Image
                src="/images/products/dashboard-open-tables.webp"
                alt="The NexMenu dashboard showing open table sessions with live totals and settle buttons"
                width={1200}
                height={910}
                loading="lazy"
                sizes="(max-width: 1023px) 92vw, 52vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Operator statement — this is the credibility payload of the bridge page. */}
      <Section flow="lg" tone="inverse" aria-labelledby="operator-heading">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Who operates NexMenu"
              title="NexMenu is built and run by Finch Technology"
              tone="inverse"
              id="operator-heading"
              lead={`${COMPANY.legalName}, SSM registration ${COMPANY.registrationNo}, based in ${COMPANY.address.city}, ${COMPANY.address.state}. The same team writes the software, runs the infrastructure and answers support.`}
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/company"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink-900 shadow-card transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
              >
                About Finch Technology
              </Link>
              <TrackedLink
                href={NEXMENU.security}
                event="nexmenu_outbound"
                placement="bridge_security"
                variant="inverse-outline"
                size="md"
              >
                NexMenu security policy
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
            </div>
          </div>

          <div className="rounded-xl border border-white/12 bg-white/[0.06] p-7">
            <h3 className="text-base font-semibold text-white">Go to NexMenu</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-inverse-muted">
              Full product details, plan comparison and signup live on nexmenu.my.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <TrackedLink
                href={NEXMENU.product}
                event="nexmenu_product"
                placement="bridge_footer_product"
                variant="inverse"
                size="md"
                full
              >
                Product overview
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
              <TrackedLink
                href={NEXMENU.pricing}
                event="nexmenu_pricing"
                placement="bridge_footer_pricing"
                variant="inverse-outline"
                size="md"
                full
              >
                Plans &amp; pricing
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
              <TrackedLink
                href={NEXMENU.contact}
                event="nexmenu_outbound"
                placement="bridge_footer_sales"
                variant="inverse-outline"
                size="md"
                full
              >
                Contact NexMenu sales
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
