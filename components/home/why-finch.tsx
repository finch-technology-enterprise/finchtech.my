import { Building2, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { COMPANY } from '@/lib/company';

/**
 * Trust section.
 *
 * Every item is independently verifiable. Registration and MSIC numbers are
 * deliberately NOT the headline — they appear as supporting detail here and in
 * full on /company. The audit's point stands: raw registry data is proof, not a
 * value proposition, so each fact is translated into what it means for a buyer.
 *
 * Absent by design: customer counts, uptime percentages, testimonials, partner
 * logos, awards. None can currently be substantiated.
 */

const PILLARS = [
  {
    icon: Building2,
    title: 'A registered Malaysian business',
    body: `${COMPANY.legalName}, SSM registration ${COMPANY.registrationNo}. You can verify who you are dealing with before you commit.`,
  },
  {
    icon: MapPin,
    title: 'People you can actually reach',
    body: 'A real address in Puchong, Selangor, and support over email or WhatsApp — not a ticket queue in another timezone.',
  },
  {
    icon: Wrench,
    title: 'Software already running in production',
    body: 'NexMenu and GeraiKu are live products serving real businesses today. What you see is what is running, not a prototype.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for local rules and local payments',
    body: 'Ringgit pricing, PDPA-aware handling of personal data, e-Invoice export, and payments through Malaysian gateways.',
  },
] as const;

export function WhyFinch() {
  return (
    <Section flow="lg" aria-labelledby="why-finch-heading">
      <SectionHeading
        eyebrow="Why Finch"
        title="A software company you can check up on"
        lead="Business software is a long-term commitment. These are the things worth verifying before you make one."
        id="why-finch-heading"
        className="max-w-2xl"
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {PILLARS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 60}>
            <div className="flex h-full gap-4 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-7">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-base font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
