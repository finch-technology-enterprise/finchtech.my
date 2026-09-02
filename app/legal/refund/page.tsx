import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/policy-layout';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description:
    'Refund and cancellation policy for NexMenu subscriptions and customer orders — how refunds are handled by Finch Technology Enterprise.',
};

const LAST_UPDATED = '1 September 2026';

const TOC = [
  { id: 'subscriptions', label: 'NexMenu subscription refunds' },
  { id: 'cancellation', label: 'Subscription cancellation' },
  { id: 'customer-orders', label: 'Customer order refunds' },
  { id: 'how-to-request', label: 'How to request a refund review' },
  { id: 'contact', label: 'Contact' },
];

export default function RefundPage() {
  return (
    <PolicyLayout
      title="Refund & Cancellation Policy"
      description="How refunds and cancellations are handled for NexMenu subscriptions and for orders placed with independent merchants through NexMenu."
      lastUpdated={LAST_UPDATED}
      toc={TOC}
    >
      <Section id="subscriptions" title="1. NexMenu subscription refunds">
        <p>
          There are no routine refunds for an activated paid NexMenu subscription or for an unused portion of a
          billing period. Merchants should review the plan, features, limits, and payment amount shown during
          signup and checkout before purchasing.
        </p>
        <p>
          NexMenu may review a refund request where there was a <strong>duplicate charge</strong>, a{' '}
          <strong>confirmed billing error</strong>, or a <strong>material service failure</strong> that NexMenu
          could not reasonably remedy. Approval is not automatic and is assessed against the facts of each case.
        </p>
      </Section>

      <Section id="cancellation" title="2. Subscription cancellation">
        <p>
          You may cancel your NexMenu subscription at any time by contacting{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>
          . Cancellation takes effect at the end of the current paid billing period. You will continue to have
          access to NexMenu until that period ends.
        </p>
        <p>
          Cancellation does not entitle you to a refund or credit for the remaining portion of the current billing
          period, unless a refund is warranted under the subscription refund terms above (for example, a confirmed
          billing error).
        </p>
        <p>
          If you are on the free Lite plan, you may stop using NexMenu at any time. No cancellation process is
          required for the free plan.
        </p>
      </Section>

      <Section id="customer-orders" title="3. Customer order refunds">
        <p>
          NexMenu is <strong>not</strong> the restaurant and does <strong>not</strong> sell food or beverages.
          Any refund for an order, delivery, missing item, incorrect item, food-quality issue, cancellation, or
          chargeback must be requested from the <strong>merchant</strong> that accepted the order and, where
          relevant, the merchant&apos;s chosen payment gateway.
        </p>
        <p>
          NexMenu does not hold or settle customer-order funds. NexMenu may help route a technical report to the
          merchant, but does not decide the merchant&apos;s customer refund policy.
        </p>
      </Section>

      <Section id="how-to-request" title="4. How to request a refund review">
        <p>
          To request a review of a NexMenu subscription charge, email{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>{' '}
          with the following information:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>The email address associated with your NexMenu account</li>
          <li>The date of the payment</li>
          <li>The transaction reference or receipt</li>
          <li>A description of why you are requesting a refund</li>
        </ul>
        <p>
          <strong>Important:</strong> Never include card numbers, CVV codes, gateway API keys, webhook secrets, or
          OTPs in your email. NexMenu will never ask for these details.
        </p>
        <p>
          We aim to acknowledge refund-related complaints within a reasonable period and will request additional
          information where needed to investigate.
        </p>
      </Section>

      <Section id="contact" title="5. Contact">
        <p>
          Questions about refunds or cancellations? Contact{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>{' '}
          — Finch Technology Enterprise, 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor, Malaysia.
        </p>
      </Section>
    </PolicyLayout>
  );
}
