import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Finch Technology Enterprise — services, intellectual property, and liability. Contact support@finchtech.my for enquiries.',
};

export default function TermsPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm opacity-60">Last updated: 20 August 2026</p>
      <p className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
        Stub — owner to fill legal copy. Contact{' '}
        <a href="mailto:support@finchtech.my" className="font-medium underline">
          support@finchtech.my
        </a>{' '}
        for questions.
      </p>

      <div className="prose prose-invert mt-8 max-w-none space-y-8 text-sm leading-relaxed opacity-90 prose-headings:tracking-tight prose-a:text-[var(--accent,#66fcf1)] prose-a:no-underline hover:prose-a:underline">
        <section>
          <h2 className="text-xl font-semibold">Services</h2>
          <p className="mt-2">
            Finch Technology Enterprise (MA0215195-D) provides custom software development, hosting
            infrastructure, IT consultancy, and related digital services, including products operated under
            NexMenu and GeraiKu. Service scope, fees, timelines, and deliverables are as agreed in writing
            (proposal, quotation, or statement of work). We may update or discontinue non-contracted public
            content on finchtech.my at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Intellectual property</h2>
          <p className="mt-2">
            Unless otherwise agreed, pre-existing IP remains with its owner. Deliverables are licensed or
            assigned as set out in the governing agreement. You retain rights to content you provide; you
            grant us a limited licence to use it solely to provide the services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Liability</h2>
          <p className="mt-2">
            Services are provided on an “as is” basis to the extent permitted by law. To the maximum extent
            permitted by applicable law, our aggregate liability is limited to the fees paid for the relevant
            service in the 3 months preceding the claim. Nothing excludes liability that cannot be excluded by
            law. You agree to use services in compliance with applicable laws and not to misuse or attempt to
            disrupt them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Contact{' '}
            <a href="mailto:support@finchtech.my">support@finchtech.my</a> — 5B, Jalan BPU 5, Bandar Puchong
            Utama, 47100 Puchong, Selangor. This is a stub; final legal copy will be provided by the owner.
          </p>
        </section>
      </div>
    </main>
  );
}
