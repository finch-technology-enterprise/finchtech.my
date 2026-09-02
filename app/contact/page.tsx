import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { ContactForm } from '@/components/contact-form';
import { TrackedLink } from '@/components/ui/tracked-link';
import { COMPANY, MAILTO, NEXMENU, whatsappUrl } from '@/lib/company';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Finch Technology — WhatsApp, email or send an enquiry. Product questions, support, integrations and partnership enquiries for NexMenu and GeraiKu.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        )}
      />

      <Section flow="lg">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Talk to Finch Technology"
          lead="WhatsApp is usually the fastest way to reach us. Email and the enquiry form both work too — we reply to all three."
          className="max-w-2xl"
        />

        {/* Direct channels first: the form is deliberately secondary. */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-border bg-surface p-7 shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-whatsapp/10 text-whatsapp">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-5 text-h3 font-semibold text-fg">WhatsApp</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              Quickest for product questions, pricing and anything you would rather just ask.
            </p>
            <TrackedLink
              href={whatsappUrl()}
              event="whatsapp_click"
              placement="contact_page"
              attribute={false}
              variant="whatsapp"
              size="lg"
              full
              className="mt-6"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Message us on WhatsApp
            </TrackedLink>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-surface p-7 shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-5 text-h3 font-semibold text-fg">Email</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              Best for anything with detail attached — support issues, invoices, formal enquiries.
            </p>
            <TrackedLink
              href={MAILTO}
              event="email_click"
              placement="contact_page"
              attribute={false}
              variant="secondary"
              size="lg"
              full
              className="mt-6"
              target={undefined}
              rel={undefined}
            >
              {COMPANY.email}
            </TrackedLink>
          </div>
        </div>
      </Section>

      <Section flow="lg" tone="sunken" aria-labelledby="enquiry-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Enquiry form"
              title="Send us the details"
              id="enquiry-heading"
              lead="Tell us what you need and we will point you to the right place. We usually reply within one business day."
            />

            <div className="mt-10 space-y-5">
              <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <h3 className="text-base font-semibold text-fg">Already using NexMenu?</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  For account or billing questions, the NexMenu team can help directly.
                </p>
                <TrackedLink
                  href={NEXMENU.contact}
                  event="nexmenu_outbound"
                  placement="contact_page_nexmenu"
                  unstyled
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  Contact NexMenu support
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </TrackedLink>
              </div>

              <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-fg">Where we are</h3>
                <address className="mt-2 text-sm not-italic leading-relaxed text-fg-muted">
                  {COMPANY.address.line1}, {COMPANY.address.line2}
                  <br />
                  {COMPANY.address.postcode} {COMPANY.address.city}, {COMPANY.address.state}
                  <br />
                  {COMPANY.address.country}
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

              <p className="text-sm leading-relaxed text-fg-subtle">
                How we handle the information you send is described in our{' '}
                <Link
                  href="/legal/privacy"
                  className="font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-7 shadow-card sm:p-9">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
