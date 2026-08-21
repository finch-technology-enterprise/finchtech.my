import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/policy-layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Finch Technology Enterprise (201603312160) — services, intellectual property, liability, governing law (Malaysia) and contact.',
};

const LAST_UPDATED = '20 August 2026';

const TOC = [
  { id: 'services', label: 'Services' },
  { id: 'intellectual-property', label: 'Intellectual property' },
  { id: 'liability', label: 'Liability' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      description="Terms governing use of finchtech.my and engagement of Finch Technology Enterprise (SSM 201603312160) for software, hosting and consultancy."
      lastUpdated={LAST_UPDATED}
      toc={TOC}
    >
      <Section id="services" title="Services">
        <p>
          Finch Technology Enterprise (MA0215195-D) provides custom software development, hosting infrastructure, IT
          consultancy, and related digital products including NexMenu and GeraiKu. Scope, fees, timelines, and
          deliverables for any engagement are as agreed in writing (proposal, quotation, or statement of work). We may
          update or discontinue non-contracted public content on finchtech.my at any time.
        </p>
      </Section>

      <Section id="intellectual-property" title="Intellectual property">
        <p>
          Unless otherwise agreed in writing, pre-existing intellectual property remains with its owner. Deliverables are
          licensed or assigned as set out in the governing agreement. You retain rights to content you provide; you
          grant us a limited licence to use it solely to provide the agreed work.
        </p>
      </Section>

      <Section id="liability" title="Liability">
        <p>
          To the maximum extent permitted by law, our work is provided on an &ldquo;as is&rdquo; basis and our
          aggregate liability for any claim is limited to the fees paid for the relevant engagement in the 3 months
          preceding the claim. Nothing in these terms excludes liability that cannot be excluded by law. You agree to
          use the site and any deliverables in compliance with applicable laws and not to misuse or attempt to disrupt
          them.
        </p>
      </Section>

      <Section id="governing-law" title="Governing law">
        <p>
          These terms are governed by the laws of Malaysia. The courts of Malaysia have exclusive jurisdiction over any
          dispute arising out of or in connection with these terms or your use of finchtech.my.
        </p>
      </Section>

      <Section id="contact" title="Contact">
        <p>
          Questions about these terms? Contact{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>{' '}
          — Finch Technology Enterprise, 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor, Malaysia.
        </p>
      </Section>
    </PolicyLayout>
  );
}
