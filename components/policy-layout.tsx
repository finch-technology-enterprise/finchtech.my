import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { COMPANY } from '@/lib/company';

/**
 * Shared chrome for every policy document.
 *
 * The policy *content* is deliberately preserved from the previous
 * implementation — it is PDPA-aligned, specific, and better than most Malaysian
 * SME sites manage. Only the presentation is rebuilt onto the new design system,
 * plus a route back to the legal hub so no policy page is a dead end.
 */
export function PolicyLayout({
  title,
  description,
  lastUpdated,
  toc,
  children,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="shell py-14 sm:py-20">
      <Link
        href="/legal"
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All policies
      </Link>

      <div className="mt-6 max-w-[46rem]">
        <p className="text-eyebrow font-semibold uppercase text-brand-600">
          {COMPANY.legalName} · SSM {COMPANY.registrationNo}
        </p>
        <h1 className="text-h1 mt-3 font-semibold text-fg">{title}</h1>
        <p className="text-lead mt-4 text-fg-muted">{description}</p>
        <p className="mt-3 text-sm text-fg-subtle">Last updated: {lastUpdated}</p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_minmax(0,44rem)] lg:gap-16">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-eyebrow font-semibold uppercase text-fg-subtle">On this page</p>
          <ol className="mt-4 space-y-1" role="list">
            {toc.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex min-h-[40px] items-center gap-3 rounded-lg px-3 text-sm text-fg-muted transition-colors hover:bg-ink-50 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  <span className="text-fg-subtle tabular-nums">{i + 1}.</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="policy-body flex flex-col gap-10 text-base leading-relaxed text-fg-muted">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-h3 font-semibold text-fg">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}
