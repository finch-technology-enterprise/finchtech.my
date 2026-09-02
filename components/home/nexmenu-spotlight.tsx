import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Badge } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { NEXMENU } from '@/lib/company';

/**
 * NexMenu spotlight — the strongest product block on the site.
 *
 * Product surfaces are named exactly as the current NexMenu source defines them
 * (packages/frontend/src/app/pwa/manifest/[app]/route.ts): NexMenu, NexKitchen,
 * NexRunner. Verified current, not carried over from stale marketing copy.
 */

const FLOW = [
  {
    step: '01',
    title: 'Guest scans the QR at the table',
    body: 'The menu opens in their phone browser. No app to download, no counter queue.',
  },
  {
    step: '02',
    title: 'They order and pay from their phone',
    body: 'Orders go straight into the system. Payment runs through the restaurant’s own gateway.',
  },
  {
    step: '03',
    title: 'The kitchen sees it immediately',
    body: 'NexKitchen shows the ticket the moment it is placed, so nothing waits on a printout.',
  },
  {
    step: '04',
    title: 'Staff serve and settle',
    body: 'NexRunner tracks each order to the table; table bills and reports stay in one place.',
  },
] as const;

const CAPABILITIES = [
  'QR ordering, dine-in, takeaway and delivery',
  'Point of sale and counter settlement',
  'Kitchen and runner displays',
  'Receipt and kitchen printing',
  'Table sessions and bills',
  'Reservations, inventory and reporting',
] as const;

export function NexMenuSpotlight() {
  return (
    <Section flow="xl" tone="sunken" aria-labelledby="nexmenu-heading">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <Badge tone="nexmenu">Our flagship product</Badge>
          <h2 id="nexmenu-heading" className="text-h1 mt-5 font-semibold text-fg">
            NexMenu runs the floor, the counter and the kitchen.
          </h2>
          <p className="text-lead mt-5 text-fg-muted">
            Restaurant software for Malaysian cafes and restaurants. Guests order from their own
            phone, the kitchen sees every ticket in real time, and the owner gets one place for
            payments, tables and reports.
          </p>

          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2" role="list">
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-nexmenu" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TrackedLink
              href={NEXMENU.demo}
              event="nexmenu_demo"
              placement="spotlight_primary"
              variant="primary"
              size="lg"
            >
              See the demo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </TrackedLink>
            <TrackedLink
              href={NEXMENU.signupFree}
              event="nexmenu_signup"
              placement="spotlight_free"
              variant="secondary"
              size="lg"
            >
              Start free
            </TrackedLink>
          </div>

          <p className="mt-5 text-sm text-fg-subtle">
            Free Lite plan available · paid plans from RM29/month ·{' '}
            <TrackedLink
              href={NEXMENU.pricing}
              event="nexmenu_pricing"
              placement="spotlight_inline"
              unstyled
              className="font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              see full pricing
            </TrackedLink>
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="screenshot">
            <Image
              src="/images/products/dashboard-open-tables.png"
              alt="The NexMenu dashboard listing open table sessions with running totals and settle actions"
              width={1440}
              height={1092}
              sizes="(max-width: 1023px) 92vw, 50vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>

      {/* Operational flow — explains the product as a sequence, not a feature dump. */}
      <div className="mt-20">
        <SectionHeading
          eyebrow="How it works"
          title="From the table to the kitchen, in one flow"
          className="max-w-2xl"
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {FLOW.map((item, i) => (
            <Reveal as="li" key={item.step} delay={i * 60}>
              <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-card">
                <span className="text-eyebrow font-semibold text-nexmenu">{item.step}</span>
                <h3 className="mt-3 text-base font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href="/products/nexmenu" variant="secondary" size="md">
            More about NexMenu
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
