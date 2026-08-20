import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Finch Technology Enterprise — how we collect, use, and protect your information. Contact support@finchtech.my for enquiries.',
};

export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm opacity-60">Last updated: 20 August 2026</p>
      <p className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
        Stub — owner to fill legal copy. Contact{' '}
        <a href="mailto:support@finchtech.my" className="font-medium underline">
          support@finchtech.my
        </a>{' '}
        for privacy enquiries.
      </p>

      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed text-slate-600 prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-slate-900 prose-a:underline-offset-2 hover:prose-a:underline">
        <section>
          <h2 className="text-xl font-semibold">What we collect</h2>
          <p className="mt-2">
            When you use our contact form we collect the name, contact detail (email or WhatsApp number),
            and message you submit, plus technical metadata such as IP address and Turnstile verification token
            for abuse prevention. We also collect standard analytics via server logs when you visit
            finchtech.my.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How we use it</h2>
          <p className="mt-2">We use your information to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Respond to your enquiry and provide requested services.</li>
            <li>Operate, secure, and improve our websites and infrastructure.</li>
            <li>Comply with legal obligations and prevent fraud or abuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Third parties</h2>
          <p className="mt-2">
            To deliver enquiries we relay messages via <strong>Telegram</strong> (Telegram Bot API) and email
            via <strong>Brevo</strong> (formerly Sendinblue) — or Sender.net as an alternative — as described
            in our contact flow. Turnstile verification is handled by Cloudflare. Each provider processes data
            under its own privacy policy and only as needed to deliver the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Retention</h2>
          <p className="mt-2">
            Contact submissions are retained only as long as needed to handle your request and meet legal or
            accounting requirements. Telegram and email delivery logs are subject to the respective provider
            retention policies. Server logs are rotated periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Your rights</h2>
          <p className="mt-2">
            You may request access, correction, or deletion of your personal data, and object to or restrict
            certain processing, subject to applicable Malaysian law (including the Personal Data Protection Act
            2010). To exercise these rights, contact{' '}
            <a href="mailto:support@finchtech.my">support@finchtech.my</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2">
            Finch Technology Enterprise (MA0215195-D) — 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong,
            Selangor. Email{' '}
            <a href="mailto:support@finchtech.my">support@finchtech.my</a>. This is a stub; final legal copy
            will be provided by the owner.
          </p>
        </section>
      </div>
    </main>
  );
}
