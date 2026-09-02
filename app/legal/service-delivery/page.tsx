import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/policy-layout';

export const metadata: Metadata = {
  title: 'Service Delivery Policy',
  description:
    'How NexMenu — a Finch Technology SaaS product — is delivered and activated. Digital service delivery for Malaysian businesses.',
};

const LAST_UPDATED = '1 September 2026';

const TOC = [
  { id: 'what-nexmenu-is', label: 'What NexMenu is' },
  { id: 'how-service-is-delivered', label: 'How the service is delivered' },
  { id: 'activation', label: 'Activation and access' },
  { id: 'infrastructure', label: 'Infrastructure and availability' },
  { id: 'support', label: 'Support and response' },
  { id: 'contact', label: 'Contact' },
];

export default function ServiceDeliveryPage() {
  return (
    <PolicyLayout
      title="Service Delivery Policy"
      description="How NexMenu — a cloud-based SaaS product by Finch Technology — is delivered and activated for merchants in Malaysia."
      lastUpdated={LAST_UPDATED}
      toc={TOC}
    >
      <Section id="what-nexmenu-is" title="1. What NexMenu is">
        <p>
          NexMenu is a cloud-based software-as-a-service (SaaS) platform for Malaysian food-and-beverage
          businesses. It provides QR ordering, kitchen display systems, runner display systems, table management,
          reservations, and reporting — all accessible through a web browser.
        </p>
        <p>
          NexMenu is a product of Finch Technology Enterprise (SSM 201603312160), registered at 5B, Jalan BPU 5,
          Bandar Puchong Utama, 47100 Puchong, Selangor, Malaysia.
        </p>
      </Section>

      <Section id="how-service-is-delivered" title="2. How the service is delivered">
        <p>
          NexMenu is delivered entirely online as a digital service. There are no physical goods to ship. The
          service is accessed through:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Merchant dashboard</strong> — accessible at{' '}
            <span className="font-mono text-[13px]">dashboard.nexmenu.my</span> via any modern web browser
          </li>
          <li>
            <strong>Customer storefront</strong> — customers scan a QR code on their table and the menu opens
            directly in their phone&apos;s browser (no app download required)
          </li>
          <li>
            <strong>Kitchen and runner displays</strong> — accessible through the dashboard on a tablet or
            monitor
          </li>
        </ul>
        <p>
          Because NexMenu is cloud-hosted software, the service is available wherever you have an internet
          connection. There is no physical delivery, shipping, or installation required.
        </p>
      </Section>

      <Section id="activation" title="3. Activation and access">
        <p>
          After signing up and selecting a plan, your NexMenu account is activated immediately. You can begin
          setting up your menu, tables, and payment gateway straight away. Setup is described as taking minutes
          rather than days.
        </p>
        <p>
          For paid plans, subscription billing begins at checkout and your account remains active for the duration
          of the billing period. For the free Lite plan, no payment is required and your account remains active as
          long as you use it.
        </p>
      </Section>

      <Section id="infrastructure" title="4. Infrastructure and availability">
        <p>
          NexMenu runs on Cloudflare&apos;s global infrastructure, including Cloudflare Workers, D1, R2, KV, and
          Durable Objects. This provides low-latency access from anywhere in Malaysia and worldwide.
        </p>
        <p>
          The service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While we aim
          for high uptime, no online service can guarantee uninterrupted availability. For details, see{' '}
          <a href="https://nexmenu.my/security" className="underline underline-offset-2">
            nexmenu.my/security
          </a>
          .
        </p>
      </Section>

      <Section id="support" title="5. Support and response">
        <p>
          If you encounter issues with your NexMenu account or service, you can contact support at{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>
          . We aim to acknowledge service complaints within a reasonable period and will request additional
          information where needed to investigate.
        </p>
      </Section>

      <Section id="contact" title="6. Contact">
        <p>
          Questions about service delivery? Contact{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>{' '}
          — Finch Technology Enterprise, 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor, Malaysia.
        </p>
      </Section>
    </PolicyLayout>
  );
}
