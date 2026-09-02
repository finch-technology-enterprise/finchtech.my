import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';
import { TrackedLink } from '@/components/ui/tracked-link';
import { NEXMENU, whatsappUrl } from '@/lib/company';

/**
 * Hero — a server component.
 *
 * Renders fully visible in the server HTML (no `opacity:0`), so the LCP element
 * is painted from the document rather than gated on hydration. The previous
 * hero cost 667ms of render delay for exactly this reason.
 *
 * The imagery is real product UI (NexMenu storefront + kitchen display), not
 * the hand-coded grey rectangles the audit flagged as reading like vapourware.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-surface">
      {/* Restrained depth: one soft brand wash, no glowing blobs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60rem_32rem_at_50%_-18%,var(--color-brand-50),transparent)]"
      />

      <div className="shell grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-24">
        <div>
          <Badge tone="brand">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
            Malaysian software company · Puchong, Selangor
          </Badge>

          <h1 id="hero-heading" className="text-display mt-6 font-semibold text-fg">
            Software built for how Malaysian businesses actually operate.
          </h1>

          <p className="text-lead mt-6 max-w-xl text-fg-muted">
            Finch Technology builds and operates cloud software for businesses in Malaysia. Our main
            product, <strong className="font-semibold text-fg">NexMenu</strong>, handles ordering,
            payments and kitchen operations for cafes and restaurants across the country.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TrackedLink
              href={NEXMENU.demo}
              event="nexmenu_demo"
              placement="hero_primary"
              variant="primary"
              size="lg"
            >
              See NexMenu in action
              <ArrowRight className="h-4 w-4" aria-hidden />
            </TrackedLink>
            <ButtonLink href="/products" variant="secondary" size="lg">
              Our products
            </ButtonLink>
          </div>

          <p className="mt-6 text-sm text-fg-subtle">
            Prefer to talk?{' '}
            <TrackedLink
              href={whatsappUrl('NexMenu')}
              event="whatsapp_click"
              placement="hero_inline"
              attribute={false}
              unstyled
              className="inline-flex items-center gap-1.5 font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Message us on WhatsApp
            </TrackedLink>
          </p>
        </div>

        {/* Device pairing: phone storefront over the kitchen display, both real. */}
        <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
          <div className="screenshot">
            <Image
              src="/images/products/kds-live-orders.webp"
              alt="The NexMenu kitchen display showing live order tickets as they arrive from the storefront"
              width={1200}
              height={750}
              priority
              sizes="(max-width: 1023px) 92vw, 46vw"
              className="h-auto w-full"
            />
          </div>

          <div className="absolute -bottom-8 -left-2 w-[34%] max-w-[168px] overflow-hidden rounded-2xl border border-border bg-surface shadow-panel sm:-left-6 sm:w-[36%]">
            <Image
              src="/images/products/storefront-menu.webp"
              alt="The NexMenu customer storefront on a phone, showing a cafe menu with category filters and item cards"
              width={390}
              height={844}
              priority
              sizes="(max-width: 640px) 34vw, 168px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
