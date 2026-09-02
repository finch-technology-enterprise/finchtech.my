import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, MessageCircle } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { CAPABILITIES } from '@/lib/capabilities';
import { whatsappUrl } from '@/lib/company';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Capabilities',
  description:
    'The engineering behind Finch Technology products: Malaysian payment gateways, ESC/POS thermal printing, restaurant operations, e-Invoice export, and cloud platform engineering on Cloudflare.',
  alternates: { canonical: '/capabilities' },
};

export default function CapabilitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Capabilities', path: '/capabilities' },
          ]),
        )}
      />

      <Section flow="lg">
        <SectionHeading
          as="h1"
          eyebrow="Capabilities"
          title="What we have actually built"
          lead="Everything below is in production in our own products. We list it here so anyone evaluating Finch — as a supplier, an integration partner or a payment provider — can see the specific ground we cover."
          className="max-w-3xl"
        />
      </Section>

      <Section flow="default" tone="sunken" className="!pt-0">
        <div className="grid gap-5 lg:grid-cols-2">
          {CAPABILITIES.map(({ icon: Icon, title, detail, points }, i) => (
            <Reveal key={title} delay={i * 50}>
              <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-7 shadow-card sm:p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="text-h3 mt-5 font-semibold text-fg">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{detail}</p>
                <ul className="mt-5 space-y-2.5 border-t border-border pt-5" role="list">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-fg-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section flow="lg">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Working together"
                title="Integration or partnership enquiry?"
                lead="If you are a payment provider, hardware vendor or platform looking to integrate with our products — or a business that needs something connected to a system we already work with — tell us what you have in mind."
              />
            </div>
            <div className="flex flex-col gap-3">
              <TrackedLink
                href={whatsappUrl('an integration or partnership')}
                event="whatsapp_click"
                placement="capabilities_cta"
                attribute={false}
                variant="whatsapp"
                size="lg"
                full
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp us
              </TrackedLink>
              <Link
                href="/contact"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 text-base font-semibold text-fg shadow-card transition-colors hover:border-ink-400 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                Send an enquiry
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
