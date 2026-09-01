import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';
import RefundPage from '@/app/refund/page';
import ServiceDeliveryPage from '@/app/service-delivery/page';
import PaymentPolicyPage from '@/app/payment-policy/page';

describe('PolicyLayout', () => {
  it('privacy has 10 sections + TOC + nexmenu cross-link', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('navigation', { name: /On this page/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What personal data we collect/i })).toBeInTheDocument();
    const crossLinks = screen.getAllByRole('link', { name: /nexmenu\.my\/privacy/i });
    expect(crossLinks.length).toBeGreaterThanOrEqual(1);
    expect(crossLinks[0]).toHaveAttribute('href', expect.stringContaining('nexmenu.my/privacy'));
    // at least 10 section headings
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(10);
  });
  it('terms has Services/IP/Liability and contact', () => {
    render(<TermsPage />);
    expect(screen.getByRole('heading', { name: /Services/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Intellectual property/i })).toBeInTheDocument();
    expect(screen.getByText(/support@finchtech\.my/i)).toBeInTheDocument();
  });
  it('refund has subscription/cancellation/order sections', () => {
    render(<RefundPage />);
    expect(screen.getByRole('navigation', { name: /On this page/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /NexMenu subscription refunds/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Subscription cancellation/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Customer order refunds/i })).toBeInTheDocument();
    expect(screen.getAllByText(/support@finchtech\.my/i).length).toBeGreaterThanOrEqual(1);
  });
  it('service delivery explains SaaS delivery', () => {
    render(<ServiceDeliveryPage />);
    expect(screen.getByRole('navigation', { name: /On this page/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What NexMenu is/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /How the service is delivered/i })).toBeInTheDocument();
    expect(screen.getByText(/software-as-a-service/i)).toBeInTheDocument();
  });
  it('payment policy covers subscriptions and gateways', () => {
    render(<PaymentPolicyPage />);
    expect(screen.getByRole('navigation', { name: /On this page/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Merchant subscriptions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Supported payment gateways/i })).toBeInTheDocument();
    expect(screen.getByText(/Malaysian Ringgit/i)).toBeInTheDocument();
  });
});
