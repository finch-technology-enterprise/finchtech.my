'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { TrackedLink } from '@/components/ui/tracked-link';
import { NEXMENU, whatsappUrl } from '@/lib/company';
import { FinchMark } from '@/components/brand';

/**
 * Site header.
 *
 * Fixes three audit findings:
 *  - Nav links were bare hashes (`#products`), so every link was dead on every
 *    non-homepage route. They are now real routes.
 *  - The mobile drawer contained no CTA, leaving mobile with no navigation-level
 *    conversion path. It now carries the primary CTA plus WhatsApp.
 *  - The drawer claimed `aria-modal="true"` without trapping focus. It now traps.
 *
 * The theme toggle is removed entirely: it was a no-op (its `[data-theme=light]`
 * block redefined tokens to the values they already had), it mislabelled its own
 * state to screen readers, and a single well-executed theme is better than a
 * control that does nothing.
 */

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/company', label: 'Company' },
  { href: '/contact', label: 'Contact' },
] as const;

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change.
  React.useEffect(() => setOpen(false), [pathname]);

  // Escape + focus trap + scroll lock while the drawer is open.
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'glass sticky top-0 z-50 w-full border-b transition-colors duration-300',
        scrolled
          ? 'border-border bg-surface/90 shadow-card backdrop-blur-xl'
          : 'border-transparent bg-surface/80 backdrop-blur-lg',
      )}
    >
      <nav className="shell flex h-16 items-center justify-between gap-4" aria-label="Primary">
        <Link
          href="/"
          className="-m-2 flex items-center gap-2.5 rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          aria-label="Finch Technology — home"
        >
          <FinchMark className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight text-fg">
            Finch Technology
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                  isActive(link.href)
                    ? 'bg-ink-100 text-fg'
                    : 'text-fg-muted hover:bg-ink-50 hover:text-fg',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* WhatsApp: icon-only on small screens so the header keeps a direct
              conversion channel without crowding the demo CTA. */}
          <TrackedLink
            href={whatsappUrl('NexMenu')}
            event="whatsapp_click"
            placement="header"
            attribute={false}
            unstyled
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'h-11 w-11 !px-0 text-fg-muted hover:text-fg',
            )}
            aria-label="Message Finch Technology on WhatsApp"
            title="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
          </TrackedLink>

          {/* Shortened label below `sm` so mobile still carries the primary CTA
              in the header rather than hiding it behind the hamburger. */}
          <TrackedLink
            href={NEXMENU.demo}
            event="nexmenu_demo"
            placement="header"
            variant="primary"
            size="md"
          >
            <span className="sm:hidden">Demo</span>
            <span className="hidden sm:inline">See NexMenu demo</span>
          </TrackedLink>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <>
          <div
            aria-hidden
            className="fixed inset-0 top-16 z-40 bg-ink-900/25 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-surface p-5 shadow-panel lg:hidden"
          >
            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-[48px] items-center rounded-lg px-4 text-base font-medium transition-colors',
                      isActive(link.href) ? 'bg-ink-100 text-fg' : 'text-fg hover:bg-ink-50',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5">
              <TrackedLink
                href={NEXMENU.demo}
                event="nexmenu_demo"
                placement="mobile_menu"
                variant="primary"
                size="lg"
                full
              >
                See NexMenu demo
              </TrackedLink>
              <TrackedLink
                href={whatsappUrl('NexMenu')}
                event="whatsapp_click"
                placement="mobile_menu"
                attribute={false}
                variant="whatsapp"
                size="lg"
                full
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp us
              </TrackedLink>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
