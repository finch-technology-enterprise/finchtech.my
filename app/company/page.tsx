import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { COMPANY, MAILTO, whatsappUrl } from '@/lib/company';
import { breadcrumbSchema, jsonLd, localBusinessSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Finch Technology Enterprise (SSM 201603312160) is a Malaysian software company based in Puchong, Selangor. We build and operate our own cloud software products, including NexMenu.',
  alternates: { canonical: '/company' },
};

/**
 * Company page.
 *
 * Replaces the previous About block, which was registry data presented as a
 * company story. Registration details are retained in full — they are a genuine
 * trust asset — but placed in a corporate-information block rather than used as
 * a headline.
 *
 * Deliberately omitted:
 *  - Any founding year. The 2012 (FinchVPN) and 2016 (SSM registration) dates
 *    are unreconciled, so no date is claimed.
 *  - FinchVPN. Its current ownership/status cannot be established unambiguously
 *    from this repository, and the previous "retired" claim conflicted with the
 *    live site, so it is omitted rather than described incorrectly.
 */

const PRINCIPLES = [
  {
    title: 'We operate what we build',
    body: 'We are not a studio that ships a project and moves on. The people who write our software also deploy it, monitor it and answer the support mail — so problems reach the people who can actually fix them.',
  },
  {
    title: 'Local problems, properly solved',
    body: 'Ringgit pricing, Malaysian payment gateways, e-Invoice export, thermal printers that exist in real kitchens. These are not add-ons for us; they are the starting requirements.',
  },
  {
    title: 'Small enough to answer directly',
    body: 'You can reach us on WhatsApp or email and get a person. For an SME choosing software that will run their daily operations, that access matters more than a support portal.',
  },
  {
    title: 'Honest about what exists',
    body: 'We only publish what we can show. If a number, integration or capability is not in production, it does not appear on this website.',
  },
] as const;

export default function CompanyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusinessSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Company', path: '/company' },
          ]),
        )}
      />

      <Section flow="lg">
        <SectionHeading
          as="h1"
          eyebrow="Company"
          title="A Malaysian software company that builds and runs its own products"
          lead="Finch Technology develops cloud software for businesses in Malaysia. We are based in Puchong, Selangor, and our products are live services used by real businesses every day."
          className="max-w-3xl"
        />
      </Section>

      <Section flow="default" tone="sunken" className="!pt-0" aria-labelledby="what-we-build">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 id="what-we-build" className="text-h2 font-semibold text-fg">
              What we build
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-fg-muted">
              <p>
                Our main product is <strong className="font-semibold text-fg">NexMenu</strong>,
                restaurant software for Malaysian cafes and restaurants. It covers QR ordering from
                the guest&apos;s phone, point of sale at the counter, live kitchen and runner
                displays, table sessions, reservations, stock and reporting.
              </p>
              <p>
                We also operate <strong className="font-semibold text-fg">GeraiKu</strong>, a
                simpler product for small sellers who need an online storefront and a place to
                manage orders that would otherwise live in WhatsApp messages.
              </p>
              <p>
                Both run on infrastructure we manage ourselves, and both are supported by the same
                team that develops them.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                See our products
              </Link>
              <Link
                href="/capabilities"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-sm font-semibold text-fg shadow-card transition-colors hover:border-ink-400 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                Our capabilities
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {PRINCIPLES.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 50}>
                <div className="h-full rounded-xl border border-border bg-surface p-6 shadow-card">
                  <h3 className="text-base font-semibold text-fg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Corporate information — full detail, professionally presented. */}
      <Section flow="lg" aria-labelledby="corporate-info">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Corporate information"
              title="Company details"
              id="corporate-info"
              lead="Everything you need to verify who you are dealing with."
            />
            <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface shadow-card">
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">Registered name</dt>
                <dd className="text-sm text-fg-muted">{COMPANY.legalName}</dd>
              </div>
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">Trading as</dt>
                <dd className="text-sm text-fg-muted">{COMPANY.name}</dd>
              </div>
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">SSM registration no.</dt>
                <dd className="text-sm text-fg-muted">
                  {COMPANY.registrationNo}{' '}
                  <span className="text-fg-subtle">({COMPANY.registrationAlt})</span>
                </dd>
              </div>
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">Business form</dt>
                <dd className="text-sm text-fg-muted">{COMPANY.legalForm}</dd>
              </div>
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">MSIC codes</dt>
                <dd className="text-sm text-fg-muted">
                  {COMPANY.msic.join(' · ')}
                  <span className="mt-1 block text-fg-subtle">
                    Computer programming · Data processing and hosting · Other IT service activities
                  </span>
                </dd>
              </div>
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">Registered address</dt>
                <dd className="text-sm text-fg-muted">
                  <address className="not-italic">
                    {COMPANY.address.line1}, {COMPANY.address.line2}
                    <br />
                    {COMPANY.address.postcode} {COMPANY.address.city}, {COMPANY.address.state}
                    <br />
                    {COMPANY.address.country}
                  </address>
                </dd>
              </div>
              <div className="grid gap-1 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-fg">Governing law</dt>
                <dd className="text-sm text-fg-muted">Malaysia</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-surface p-7 shadow-card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold text-fg">Where we are</h3>
              <address className="mt-2 text-sm not-italic leading-relaxed text-fg-muted">
                {COMPANY.address.line1}, {COMPANY.address.line2}
                <br />
                {COMPANY.address.postcode} {COMPANY.address.city}, {COMPANY.address.state}
              </address>
              <a
                href={COMPANY.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                View on Google Maps
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="rounded-xl border border-border bg-surface p-7 shadow-card">
              <h3 className="text-base font-semibold text-fg">Talk to us</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                For product questions, support, integrations or partnership enquiries.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <TrackedLink
                  href={whatsappUrl()}
                  event="whatsapp_click"
                  placement="company_card"
                  attribute={false}
                  variant="whatsapp"
                  size="md"
                  full
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  WhatsApp us
                </TrackedLink>
                <TrackedLink
                  href={MAILTO}
                  event="email_click"
                  placement="company_card"
                  attribute={false}
                  variant="secondary"
                  size="md"
                  full
                  target={undefined}
                  rel={undefined}
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {COMPANY.email}
                </TrackedLink>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-sunken p-7">
              <h3 className="text-base font-semibold text-fg">Policies &amp; compliance</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Privacy, terms, refunds, service delivery and payment policies.
              </p>
              <Link
                href="/legal"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                Go to the legal hub
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
