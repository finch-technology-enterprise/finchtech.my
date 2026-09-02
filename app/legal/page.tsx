import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CreditCard, RefreshCw, Scale, ShieldCheck, Truck } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { TrackedLink } from '@/components/ui/tracked-link';
import { COMPANY, MAILTO, NEXMENU } from '@/lib/company';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Legal & compliance',
  description:
    'Policies for Finch Technology Enterprise (SSM 201603312160): privacy, terms of service, refund and cancellation, service delivery, and payment policy.',
  alternates: { canonical: '/legal' },
};

/**
 * Legal hub.
 *
 * Built primarily for payment-gateway and partner reviewers: every policy in one
 * place, with the company identifiers they need to complete onboarding visible
 * without further navigation. The audit found three of these policies returning
 * 404 in production while a gateway compliance review was presumably depending
 * on them.
 */

const POLICIES = [
  {
    href: '/legal/privacy',
    icon: ShieldCheck,
    title: 'Privacy Policy',
    body: 'What personal data we collect on this site, how it is used and shared, and your rights under the Personal Data Protection Act 2010.',
  },
  {
    href: '/legal/terms',
    icon: Scale,
    title: 'Terms of Service',
    body: 'The terms that govern use of this website and engagement of Finch Technology for software, hosting and consultancy work.',
  },
  {
    href: '/legal/refund',
    icon: RefreshCw,
    title: 'Refund & Cancellation',
    body: 'How refunds and cancellations are handled for NexMenu subscriptions, and how customer order refunds work with merchants.',
  },
  {
    href: '/legal/service-delivery',
    icon: Truck,
    title: 'Service Delivery',
    body: 'How our software is delivered and activated. Digital service delivery, access, infrastructure and support.',
  },
  {
    href: '/legal/payment-policy',
    icon: CreditCard,
    title: 'Payment Policy',
    body: 'Subscription billing, supported payment gateways, currency, and how payment information is handled.',
  },
] as const;

export default function LegalHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Legal', path: '/legal' },
          ]),
        )}
      />

      <Section flow="lg">
        <SectionHeading
          as="h1"
          eyebrow="Legal & compliance"
          title="Policies and company information"
          lead="Everything a merchant, partner or payment provider needs to review before working with us — in one place."
          className="max-w-2xl"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {POLICIES.map(({ href, icon: Icon, title, body }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-xl border border-border bg-surface p-7 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-5 text-base font-semibold text-fg">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section flow="default" tone="sunken">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-7 shadow-card sm:p-8">
            <h2 className="text-h3 font-semibold text-fg">Company identifiers</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              For onboarding, due diligence and merchant verification.
            </p>
            <dl className="mt-6 divide-y divide-border text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
                <dt className="font-semibold text-fg">Registered name</dt>
                <dd className="text-fg-muted">{COMPANY.legalName}</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
                <dt className="font-semibold text-fg">SSM registration</dt>
                <dd className="text-fg-muted">
                  {COMPANY.registrationNo} ({COMPANY.registrationAlt})
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
                <dt className="font-semibold text-fg">MSIC codes</dt>
                <dd className="text-fg-muted">{COMPANY.msic.join(' · ')}</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
                <dt className="font-semibold text-fg">Registered address</dt>
                <dd className="text-fg-muted">
                  <address className="not-italic">
                    {COMPANY.address.line1}, {COMPANY.address.line2}
                    <br />
                    {COMPANY.address.postcode} {COMPANY.address.city}, {COMPANY.address.state},{' '}
                    {COMPANY.address.country}
                  </address>
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
                <dt className="font-semibold text-fg">Contact</dt>
                <dd>
                  <a
                    href={MAILTO}
                    className="font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  >
                    {COMPANY.email}
                  </a>
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
                <dt className="font-semibold text-fg">Governing law</dt>
                <dd className="text-fg-muted">Malaysia</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-7 shadow-card sm:p-8">
            <h2 className="text-h3 font-semibold text-fg">Product-specific policies</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Merchant and customer terms for NexMenu, including its security policy and account
              deletion process, are published on the product site.
            </p>
            <ul className="mt-6 space-y-3 text-sm" role="list">
              {[
                { href: NEXMENU.legal, label: 'NexMenu legal hub' },
                { href: NEXMENU.terms, label: 'NexMenu merchant service terms' },
                { href: NEXMENU.privacy, label: 'NexMenu privacy policy' },
                { href: NEXMENU.security, label: 'NexMenu security policy' },
              ].map((item) => (
                <li key={item.href}>
                  <TrackedLink
                    href={item.href}
                    event="nexmenu_outbound"
                    placement="legal_hub"
                    unstyled
                    className="inline-flex min-h-[40px] items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
