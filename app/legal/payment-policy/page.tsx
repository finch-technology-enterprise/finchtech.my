import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/policy-layout';

export const metadata: Metadata = {
  title: 'Payment Policy',
  description:
    'Payment and subscription terms for NexMenu — Malaysian Ringgit pricing, billing, payment gateways, and subscription conditions.',
};

const LAST_UPDATED = '1 September 2026';

const TOC = [
  { id: 'subscriptions', label: 'Merchant subscriptions' },
  { id: 'customer-orders', label: 'Customer orders and payment gateways' },
  { id: 'gateways', label: 'Supported payment gateways' },
  { id: 'security', label: 'Security of payment information' },
  { id: 'contact', label: 'Contact' },
];

export default function PaymentPolicyPage() {
  return (
    <PolicyLayout
      title="Payment Policy"
      description="The payment boundaries between NexMenu subscriptions, merchant-owned payment gateways, and customer orders."
      lastUpdated={LAST_UPDATED}
      toc={TOC}
    >
      <Section id="subscriptions" title="1. Merchant subscriptions">
        <p>
          NexMenu subscription prices are displayed in <strong>Malaysian Ringgit (RM)</strong>. Subscriptions are
          payable through the checkout method during onboarding. Plans, features, and order limits are shown on the{' '}
          <a href="/pricing" className="underline underline-offset-2">
            NexMenu pricing page
          </a>
          .
        </p>
        <p>
          The merchant is responsible for selecting the correct plan and providing accurate billing information.
          Paid subscriptions are billed in advance on a monthly basis. Unless stated otherwise at checkout,
          subscription fees are non-refundable for partial billing periods.
        </p>
        <p>
          Plan features and limits may change with reasonable prior notice. NexMenu charges zero commission on
          customer orders — subscription fees are separate from payment-gateway charges, settlement fees, or
          merchant-selected customer-order policies.
        </p>
      </Section>

      <Section id="customer-orders" title="2. Customer orders and payment gateways">
        <p>
          When a customer places an order through a NexMenu storefront, payment is processed by the{' '}
          <strong>merchant&apos;s own third-party payment gateway</strong>. NexMenu does{' '}
          <strong>not</strong> hold, custody, or settle customer-order money.
        </p>
        <p>
          Card, bank account, and e-wallet details are entered on the gateway&apos;s hosted payment page — they
          are <strong>not</strong> stored by NexMenu. NexMenu receives only the payment status and transaction
          reference to confirm whether the order was paid.
        </p>
        <p>
          Gateway fees, settlement timing, payment-method availability, failed payments, chargebacks, and disputes
          are governed by the merchant&apos;s agreement with its gateway provider, not by NexMenu.
        </p>
      </Section>

      <Section id="gateways" title="3. Supported payment gateways">
        <p>
          NexMenu currently supports the following payment gateways, each licensed or registered with Bank Negara
          Malaysia:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Billplz</li>
          <li>Fiuu</li>
          <li>ChipIn</li>
          <li>Revenue Monster</li>
          <li>Curlec</li>
        </ul>
        <p>
          The availability and functionality of each gateway is determined by the gateway provider, not by NexMenu.
          Merchants are responsible for their own gateway account, fees, and compliance with the gateway&apos;s
          terms.
        </p>
      </Section>

      <Section id="security" title="4. Security of payment information">
        <p>
          <strong>Never send card numbers, CVV codes, bank credentials, gateway API keys, or webhook secrets to
          NexMenu support.</strong> NexMenu will never ask for these details.
        </p>
        <p>
          If you believe your payment information was exposed, contact your payment gateway and merchant
          immediately, then notify{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>
          .
        </p>
      </Section>

      <Section id="contact" title="5. Contact">
        <p>
          Questions about payments or subscriptions? Contact{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>{' '}
          — Finch Technology Enterprise, 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor, Malaysia.
        </p>
      </Section>
    </PolicyLayout>
  );
}
