import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Navigation regression coverage.
 *
 * The audit's P0-3: every header link was a bare fragment (`#products`), so on
 * `/privacy` they resolved to `/privacy#products` — dead on every route except
 * the homepage. These tests fail if fragment-only navigation is reintroduced.
 */

const mockPathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname() }));

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

beforeEach(() => {
  mockPathname.mockReturnValue('/');
});

describe('site header', () => {
  it('uses real routes — never fragment-only hrefs', () => {
    const { container } = render(<SiteHeader />);
    const internal = [...container.querySelectorAll('a')]
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => !href.startsWith('http') && !href.startsWith('mailto:'));

    expect(internal.length).toBeGreaterThan(0);
    for (const href of internal) {
      expect(href.startsWith('#'), `"${href}" is fragment-only and breaks off-homepage`).toBe(false);
      expect(href.startsWith('/'), `"${href}" must be root-relative`).toBe(true);
    }
  });

  it('exposes the four primary sections', () => {
    const { container } = render(<SiteHeader />);
    for (const href of ['/products', '/capabilities', '/company', '/contact']) {
      expect(container.querySelector(`a[href="${href}"]`), `missing ${href}`).not.toBeNull();
    }
  });

  it('marks the active route with aria-current', () => {
    mockPathname.mockReturnValue('/products');
    const { container } = render(<SiteHeader />);
    const active = container.querySelector('a[aria-current="page"]');
    expect(active?.getAttribute('href')).toBe('/products');
  });

  it('treats nested product routes as within Products', () => {
    mockPathname.mockReturnValue('/products/nexmenu');
    const { container } = render(<SiteHeader />);
    expect(container.querySelector('a[aria-current="page"]')?.getAttribute('href')).toBe('/products');
  });

  it('has no theme toggle — the previous one was a no-op', () => {
    render(<SiteHeader />);
    expect(screen.queryByRole('button', { name: /theme/i })).toBeNull();
  });

  it('mobile menu contains a conversion CTA and WhatsApp', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/See NexMenu demo/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/WhatsApp us/i)).toBeInTheDocument();
  });

  it('mobile menu closes on Escape', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('mobile menu is a labelled modal dialog', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label');
  });
});

describe('site footer', () => {
  it('links every legal policy so reviewers can reach them from any page', () => {
    const { container } = render(<SiteFooter />);
    for (const href of [
      '/legal',
      '/legal/privacy',
      '/legal/terms',
      '/legal/refund',
      '/legal/service-delivery',
      '/legal/payment-policy',
    ]) {
      expect(container.querySelector(`a[href="${href}"]`), `footer missing ${href}`).not.toBeNull();
    }
  });

  it('links the primary company routes', () => {
    const { container } = render(<SiteFooter />);
    for (const href of ['/products', '/capabilities', '/company', '/contact']) {
      expect(container.querySelector(`a[href="${href}"]`), `footer missing ${href}`).not.toBeNull();
    }
  });

  it('identifies the legal entity', () => {
    render(<SiteFooter />);
    expect(screen.getByText(/201603312160/)).toBeInTheDocument();
    expect(screen.getAllByText(/Finch Technology Enterprise/).length).toBeGreaterThanOrEqual(1);
  });

  it('opens external product links safely', () => {
    const { container } = render(<SiteFooter />);
    const external = [...container.querySelectorAll('a')].filter((a) =>
      (a.getAttribute('href') ?? '').startsWith('http'),
    );
    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });
});
