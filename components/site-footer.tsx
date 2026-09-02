import Link from 'next/link';
import { COMPANY } from '@/lib/company';
import { FinchMark } from '@/components/brand';
import { FooterContactLinks, FooterProductLinks } from '@/components/footer-links';

/**
 * Site footer — a server component; only the tracked outbound links below are
 * client-side.
 *
 * Every legal policy is listed here, so a payment-gateway or partner reviewer
 * landing anywhere on the site is one click from the complete set.
 */

const COMPANY_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/company', label: 'Company' },
  { href: '/contact', label: 'Contact' },
] as const;

const LEGAL_LINKS = [
  { href: '/legal', label: 'Legal hub' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/refund', label: 'Refund & Cancellation' },
  { href: '/legal/service-delivery', label: 'Service Delivery' },
  { href: '/legal/payment-policy', label: 'Payment Policy' },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface-inverse text-fg-inverse-muted">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <FinchMark className="h-8 w-8" />
              <span className="text-base font-semibold tracking-tight text-white">
                Finch Technology
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              We build and operate cloud software for Malaysian businesses — including NexMenu,
              restaurant ordering and operations software.
            </p>
            <address className="mt-5 text-sm not-italic leading-relaxed">
              {COMPANY.address.line1}, {COMPANY.address.line2}
              <br />
              {COMPANY.address.postcode} {COMPANY.address.city}, {COMPANY.address.state}
            </address>
            <FooterContactLinks />
          </div>

          <FooterProductLinks />

          <nav aria-label="Company">
            <h2 className="text-eyebrow font-semibold uppercase text-white">Company</h2>
            <ul className="mt-4 space-y-3 text-sm" role="list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[24px] items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="text-eyebrow font-semibold uppercase text-white">Legal</h2>
            <ul className="mt-4 space-y-3 text-sm" role="list">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[24px] items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="text-fg-inverse-muted">
            SSM registration no. {COMPANY.registrationNo} · Registered in Malaysia
          </p>
        </div>
      </div>
    </footer>
  );
}
