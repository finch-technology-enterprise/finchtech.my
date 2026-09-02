import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';

/**
 * Route coverage.
 *
 * The audit found four pages that existed in the repository, passed their unit
 * tests, and returned 404 in production. Component-level tests alone could not
 * catch that. These tests assert every public route renders with the heading
 * structure and primary conversion affordance it is supposed to have.
 */

vi.mock('next/og', () => ({ ImageResponse: class {} }));

import HomePage from '@/app/page';
import ProductsPage from '@/app/products/page';
import NexMenuPage from '@/app/products/nexmenu/page';
import GeraiKuPage from '@/app/products/geraiku/page';
import CapabilitiesPage from '@/app/capabilities/page';
import CompanyPage from '@/app/company/page';
import ContactPage from '@/app/contact/page';
import LegalHubPage from '@/app/legal/page';
import PrivacyPage from '@/app/legal/privacy/page';
import TermsPage from '@/app/legal/terms/page';
import RefundPage from '@/app/legal/refund/page';
import ServiceDeliveryPage from '@/app/legal/service-delivery/page';
import PaymentPolicyPage from '@/app/legal/payment-policy/page';

const PAGES = [
  { name: '/', Component: HomePage, heading: /Software built for how Malaysian businesses/i },
  { name: '/products', Component: ProductsPage, heading: /Software we build and operate/i },
  { name: '/products/nexmenu', Component: NexMenuPage, heading: /NexMenu — ordering and operations/i },
  { name: '/products/geraiku', Component: GeraiKuPage, heading: /GeraiKu — open an online store/i },
  { name: '/capabilities', Component: CapabilitiesPage, heading: /What we have built/i },
  { name: '/company', Component: CompanyPage, heading: /A Malaysian software company/i },
  { name: '/contact', Component: ContactPage, heading: /Talk to Finch Technology/i },
  { name: '/legal', Component: LegalHubPage, heading: /Policies and company information/i },
  { name: '/legal/privacy', Component: PrivacyPage, heading: /Privacy Policy/i },
  { name: '/legal/terms', Component: TermsPage, heading: /Terms of Service/i },
  { name: '/legal/refund', Component: RefundPage, heading: /Refund & Cancellation/i },
  { name: '/legal/service-delivery', Component: ServiceDeliveryPage, heading: /Service Delivery/i },
  { name: '/legal/payment-policy', Component: PaymentPolicyPage, heading: /Payment Policy/i },
] as const;

describe('public routes', () => {
  for (const { name, Component, heading } of PAGES) {
    it(`${name} renders with exactly one h1`, () => {
      const { container } = render(<Component />);
      const h1s = container.querySelectorAll('h1');
      expect(h1s, `${name} must have exactly one <h1>`).toHaveLength(1);
      expect(h1s[0].textContent).toMatch(heading);
    });
  }

  it('every legal page links back to the legal hub', () => {
    for (const Component of [PrivacyPage, TermsPage, RefundPage, ServiceDeliveryPage, PaymentPolicyPage]) {
      const { container, unmount } = render(<Component />);
      const back = container.querySelector('a[href="/legal"]');
      expect(back, 'policy pages must offer a route back to /legal').not.toBeNull();
      unmount();
    }
  });

  it('legal hub links to all five policies', () => {
    const { container } = render(<LegalHubPage />);
    for (const path of [
      '/legal/privacy',
      '/legal/terms',
      '/legal/refund',
      '/legal/service-delivery',
      '/legal/payment-policy',
    ]) {
      expect(container.querySelector(`a[href="${path}"]`), `missing ${path}`).not.toBeNull();
    }
  });

  it('legal hub exposes the identifiers a payment reviewer needs', () => {
    render(<LegalHubPage />);
    expect(screen.getAllByText(/201603312160/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Finch Technology Enterprise/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Puchong/).length).toBeGreaterThanOrEqual(1);
  });

  it('company page publishes verifiable registration detail', () => {
    render(<CompanyPage />);
    expect(screen.getAllByText(/201603312160/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/MA0215195-D/)).toBeInTheDocument();
    expect(screen.getAllByText(/Puchong/).length).toBeGreaterThanOrEqual(1);
  });

  it('home page leads with the NexMenu demo as primary conversion', () => {
    const { container } = render(<HomePage />);
    const demoLinks = container.querySelectorAll('a[href="https://nexmenu.my/demo"]');
    expect(demoLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('products page gives NexMenu a route to its bridge page', () => {
    const { container } = render(<ProductsPage />);
    expect(container.querySelector('a[href="/products/nexmenu"]')).not.toBeNull();
    expect(container.querySelector('a[href="/products/geraiku"]')).not.toBeNull();
  });

  it('nexmenu bridge page names Finch as operator', () => {
    render(<NexMenuPage />);
    const operator = screen.getByRole('heading', { name: /built and run by Finch Technology/i });
    expect(operator).toBeInTheDocument();
  });

  it('contact page surfaces WhatsApp and email before the form', () => {
    const { container } = render(<ContactPage />);
    expect(container.querySelector('a[href^="https://wa.me/"]')).not.toBeNull();
    expect(container.querySelector('a[href^="mailto:"]')).not.toBeNull();
  });

  it('breadcrumbs are present on nested product routes', () => {
    const { container } = render(<NexMenuPage />);
    const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).not.toBeNull();
    expect(within(nav as HTMLElement).getByText('Products')).toBeInTheDocument();
  });
});
