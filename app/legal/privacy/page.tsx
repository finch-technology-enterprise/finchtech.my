import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/policy-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Finch Technology Enterprise (201603312160) — how we handle personal data on finchtech.my in line with the Personal Data Protection Act 2010 (PDPA).',
};

const LAST_UPDATED = '20 August 2026';

const TOC = [
  { id: 'what-we-collect', label: 'What personal data we collect' },
  { id: 'how-we-use', label: 'How we use personal data' },
  { id: 'who-we-share-with', label: 'Who we share personal data with' },
  { id: 'storage-security', label: 'Storage and security' },
  { id: 'retention', label: 'Retention' },
  { id: 'your-rights', label: 'Your rights under the PDPA' },
  { id: 'cookies', label: 'Cookies and local storage' },
  { id: 'childrens-privacy', label: "Children's privacy" },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact us' },
];

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="How Finch Technology Enterprise (SSM 201603312160) handles personal data on finchtech.my — an inquiry-only corporate site — in line with Malaysia's Personal Data Protection Act 2010."
      lastUpdated={LAST_UPDATED}
      toc={TOC}
    >
      <p className="text-sm leading-relaxed">
        This Privacy Policy describes how <strong>Finch Technology Enterprise</strong> (SSM registration no.
        201603312160), registered address 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) handles personal data through{' '}
        <strong>finchtech.my</strong> — our corporate site for enquiries about custom software, hosting, and IT
        consultancy. It applies to visitors who submit an enquiry on this site. If you place orders or use features
        on our product platforms, that processing is governed by the privacy policy of the relevant platform — for
        NexMenu orders and platform data, see{' '}
        <a href="https://nexmenu.my/privacy" className="underline underline-offset-2">
          nexmenu.my/privacy
        </a>
        .
      </p>

      <Section id="what-we-collect" title="1. What personal data we collect">
        <p>
          <strong>On finchtech.my — enquiries only:</strong> when you use the contact form we collect the name,
          contact detail (email or WhatsApp number), enquiry topic and message you submit, plus technical metadata
          such as your IP address and a Cloudflare Turnstile verification token used to block automated abuse. We also
          collect standard server logs when you visit the site. We do not collect payment card or banking details on
          this site.
        </p>
        <p>
          For data processed when you order food or create a merchant account on our product platforms (including
          NexMenu and GeraiKu), please refer to{' '}
          <a href="https://nexmenu.my/privacy" className="underline underline-offset-2">
            nexmenu.my/privacy
          </a>{' '}
          for the full platform privacy policy.
        </p>
      </Section>

      <Section id="how-we-use" title="2. How we use personal data">
        <ul className="list-disc space-y-2 pl-5">
          <li>To respond to your enquiry and provide the services you request.</li>
          <li>To operate, secure, and improve our websites and infrastructure.</li>
          <li>To detect and prevent fraud, abuse, and security incidents.</li>
          <li>To comply with legal obligations and resolve disputes.</li>
        </ul>
        <p>We do not sell your personal data and do not use it for advertising on this site.</p>
      </Section>

      <Section id="who-we-share-with" title="3. Who we share personal data with">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Cloudflare</strong>, which hosts finchtech.my&apos;s infrastructure — as our infrastructure
            provider it processes data on our behalf and does not use it for its own purposes;
          </li>
          <li>
            <strong>Messaging providers</strong> used to deliver your enquiry (Telegram Bot API and email via Brevo /
            Sender.net) — only the enquiry content and contact detail needed to deliver it;
          </li>
          <li>
            <strong>Turnstile (Cloudflare)</strong> for bot verification; and
          </li>
          <li>Regulators or authorities, where we are required to disclose information by law.</li>
        </ul>
        <p>
          For platform order and payment disclosures (payment gateways, delivery providers), see{' '}
          <a href="https://nexmenu.my/privacy" className="underline underline-offset-2">
            nexmenu.my/privacy
          </a>
          .
        </p>
      </Section>

      <Section id="storage-security" title="4. Storage and security">
        <p>
          Personal data submitted through this site is stored on Cloudflare&apos;s global infrastructure, specifically
          in Cloudflare Workers KV. Access is restricted to the people who operate the site and handle enquiries, and
          data is transmitted over encrypted connections. No online service can be guaranteed completely secure, but we
          take reasonable technical and organisational steps to protect the data we hold.
        </p>
        <p>
          This site does not collect payment card details, banking credentials or identity documents. Please do not
          send them through the contact form.
        </p>
      </Section>

      <Section id="retention" title="5. Retention">
        <p>
          When you submit the contact form, your enquiry is stored in Cloudflare Workers KV — a key-value store on
          Cloudflare&apos;s infrastructure — so that it is not lost if a notification channel fails. Stored enquiries
          are <strong>automatically deleted 180 days after they are received</strong>. Each record contains the name,
          contact detail, enquiry topic and message you submitted, plus the country your request came from.
        </p>
        <p>
          We may delete an enquiry sooner once it has been handled. Delivery logs held by messaging providers are
          subject to those providers&apos; own retention policies. Server request logs are retained for a short period
          for security and troubleshooting, and are rotated periodically.
        </p>
        <p>
          You can ask us to delete an enquiry you sent at any time using the contact details in Section 10.
        </p>
      </Section>

      <Section id="your-rights" title="6. Your rights under the PDPA 2010">
        <p>Under Malaysia&apos;s Personal Data Protection Act 2010, you may:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Ask us to confirm what personal data of yours we hold, and access a copy of it;</li>
          <li>Ask us to correct personal data that is inaccurate or out of date;</li>
          <li>Withdraw consent to a specific use of your personal data, where consent is the basis for that use; and</li>
          <li>Ask us to delete personal data we no longer have a lawful reason to keep.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us using the details in Section 10. We may need to verify your
          identity before acting on a request, and some requests may be limited where we have a legal obligation to
          keep the data (for example, accounting records).
        </p>
      </Section>

      <Section id="cookies" title="7. Cookies, analytics and local storage">
        <p>
          finchtech.my uses only essential cookies and browser storage needed to keep the site working — for example,
          to remember that a Turnstile verification passed or to support the contact form. We do not use advertising
          cookies, advertising pixels or cross-site tracking on this site. Disabling cookies in your browser may
          prevent the contact form from working correctly.
        </p>
        <p>
          <strong>Measurement.</strong> We record which buttons are used — for example when someone opens the NexMenu
          demo, clicks through to pricing, or starts a WhatsApp message — so we can tell which parts of the site are
          useful. These records contain only the action taken, where on the page it happened, the page path, the
          country of the request and the referring site. They do{' '}
          <strong>not</strong> contain your name, email address, phone number, message, or any identifier that
          persists between visits, and they are not shared with advertising networks.
        </p>
        <p>
          Product platforms (including NexMenu) may use additional cookies as described in{' '}
          <a href="https://nexmenu.my/privacy" className="underline underline-offset-2">
            nexmenu.my/privacy
          </a>
          .
        </p>
      </Section>

      <Section id="childrens-privacy" title="8. Children's privacy">
        <p>
          finchtech.my is intended for business enquiries from adults. We do not knowingly collect personal data from
          children through this site. If you believe a child has submitted personal data via the contact form, please
          contact us so we can delete it.
        </p>
      </Section>

      <Section id="changes" title="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes to our services or applicable law. We
          will post the updated policy on this page with a new &ldquo;Last updated&rdquo; date, and where a change is
          material we will make reasonable efforts to notify affected contacts in advance.
        </p>
      </Section>

      <Section id="contact" title="10. Contact us">
        <p>
          Questions about this Privacy Policy, or requests relating to your personal data, can be sent to{' '}
          <a href="mailto:support@finchtech.my" className="underline underline-offset-2">
            support@finchtech.my
          </a>
          , or by post to Finch Technology Enterprise, 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor,
          Malaysia.
        </p>
      </Section>
    </PolicyLayout>
  );
}
