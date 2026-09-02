import Link from 'next/link';
import { ArrowRight, FileText, MessageCircle, Utensils } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { TrackedLink } from '@/components/ui/tracked-link';
import { Reveal } from '@/components/ui/reveal';
import { NEXMENU, whatsappUrl } from '@/lib/company';

/**
 * Closing CTA — three routes for three intents.
 *
 * The previous site funnelled every visitor into one generic project form,
 * which served none of them well. A restaurant owner, a partner and a compliance
 * reviewer each get their own next step here.
 */
export function ClosingCta() {
  return (
    <Section flow="lg" tone="sunken" aria-labelledby="closing-heading">
      <SectionHeading
        eyebrow="Next step"
        title="Where would you like to go?"
        id="closing-heading"
        align="center"
      />

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        <Reveal>
          <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-7 shadow-card">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-nexmenu-soft text-nexmenu">
              <Utensils className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-5 text-base font-semibold text-fg">I run a cafe or restaurant</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              Try NexMenu with a full demo store — no signup, nothing to install.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <TrackedLink
                href={NEXMENU.demo}
                event="nexmenu_demo"
                placement="closing_demo"
                variant="primary"
                size="md"
                full
              >
                See the demo
              </TrackedLink>
              <TrackedLink
                href={NEXMENU.signupFree}
                event="nexmenu_signup"
                placement="closing_free"
                variant="ghost"
                size="md"
                full
              >
                Start free
              </TrackedLink>
            </div>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-7 shadow-card">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-5 text-base font-semibold text-fg">I want to talk to someone</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              Questions about a product, an integration or working together — WhatsApp is fastest.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <TrackedLink
                href={whatsappUrl('working with Finch Technology')}
                event="whatsapp_click"
                placement="closing_whatsapp"
                attribute={false}
                variant="whatsapp"
                size="md"
                full
              >
                WhatsApp us
              </TrackedLink>
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-fg transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                Other ways to reach us
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-7 shadow-card">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink-100 text-ink-700">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-5 text-base font-semibold text-fg">
              I&apos;m reviewing Finch as a partner
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              Company registration, policies and service terms are all in one place.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/legal"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-sm font-semibold text-fg shadow-card transition-colors hover:border-ink-400 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                Legal &amp; compliance
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/company"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-fg transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                Company details
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
