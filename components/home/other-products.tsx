import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Badge } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { GERAIKU } from '@/lib/company';

/**
 * Secondary product block.
 *
 * GeraiKu is deliberately given a single wide card rather than a 50/50 split
 * with NexMenu — the previous layout implied the two products carried equal
 * commercial weight, which diluted the flagship.
 *
 * Copy is in customer language ("open an online store"), not the previous
 * "multi-tenant storefront SaaS with subscriptions and tenancy built-in", which
 * described the architecture rather than the benefit.
 */
export function OtherProducts() {
  return (
    <Section flow="lg" aria-labelledby="other-products-heading">
      <SectionHeading
        eyebrow="Also by Finch"
        title="Another product from the same team"
        lead="Built and operated by Finch Technology, on the same infrastructure and with the same support."
        id="other-products-heading"
        className="max-w-2xl"
      />

      <Reveal className="mt-10">
        <article className="grid overflow-hidden rounded-2xl border border-border bg-surface shadow-card lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Badge tone="geraiku">GeraiKu</Badge>
            <h3 className="text-h2 mt-4 font-semibold text-fg">
              An online store for small Malaysian sellers
            </h3>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              For home bakers, florists, fashion sellers and anyone running a business through
              WhatsApp. GeraiKu turns scattered chat orders into a proper storefront with a
              catalogue and an order dashboard — free to start, with no commission on orders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink
                href={GERAIKU.signup}
                event="geraiku_outbound"
                placement="home_geraiku_primary"
                variant="secondary"
                size="md"
              >
                Open a store free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </TrackedLink>
              <ButtonLink href="/products/geraiku" variant="ghost" size="md">
                More about GeraiKu
              </ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden border-t border-border bg-geraiku-soft p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="overflow-hidden rounded-lg border border-geraiku-border shadow-lift">
              <Image
                src="/images/products/geraiku-storefront.webp"
                alt="The GeraiKu website showing the online store builder for Malaysian small businesses"
                width={1200}
                height={750}
                loading="lazy"
                sizes="(max-width: 1023px) 92vw, 52vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
