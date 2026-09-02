import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { CAPABILITIES } from '@/lib/capabilities';

/**
 * Capability summary.
 *
 * Positioned as evidence that the company behind NexMenu is technically
 * capable — supporting the product story rather than repositioning Finch as a
 * development agency. The full detail lives on /capabilities.
 */
export function CapabilitiesPreview() {
  return (
    <Section flow="lg" tone="inverse" aria-labelledby="capabilities-heading">
      <SectionHeading
        eyebrow="What we work with"
        title="The engineering behind the products"
        lead="Running restaurant software means dealing with payment gateways, thermal printers, live kitchen screens and Malaysian tax rules. This is the ground we already cover."
        id="capabilities-heading"
        tone="inverse"
        className="max-w-2xl"
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map(({ icon: Icon, title, summary }, i) => (
          <Reveal key={title} delay={i * 50}>
            <div className="flex h-full flex-col rounded-xl border border-white/12 bg-white/[0.06] p-6 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.09]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-inverse-muted">{summary}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <ButtonLink href="/capabilities" variant="inverse" size="md">
          Explore our capabilities
          <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}
