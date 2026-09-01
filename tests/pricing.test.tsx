import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingPage from '@/app/pricing/page';

describe('PricingPage', () => {
  it('renders all five NexMenu plans with RM pricing', () => {
    render(<PricingPage />);
    expect(screen.getByRole('heading', { name: /NexMenu Pricing/i })).toBeInTheDocument();
    // All plan names
    expect(screen.getByRole('heading', { name: /Lite/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Essential/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Starter/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Growth/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pro/i })).toBeInTheDocument();
    // RM pricing visible
    expect(screen.getAllByText(/RM0/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/RM29/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/RM59/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/RM109/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/RM149/).length).toBeGreaterThanOrEqual(1);
  });

  it('has important notes section with key disclosures', () => {
    render(<PricingPage />);
    expect(screen.getByRole('heading', { name: /Important notes/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Malaysian Ringgit/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/non-refundable for partial billing periods/)).toBeInTheDocument();
    expect(screen.getByText(/zero commission/)).toBeInTheDocument();
    expect(screen.getByText(/Bank Negara Malaysia/)).toBeInTheDocument();
  });

  it('links to NexMenu and related policy pages', () => {
    render(<PricingPage />);
    const nexmenuLinks = screen.getAllByRole('link', { name: /Visit NexMenu/i });
    expect(nexmenuLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: /Refund.*Cancellation Policy/i })).toHaveAttribute('href', '/refund');
    expect(screen.getByRole('link', { name: /Payment Policy/i })).toHaveAttribute('href', '/payment-policy');
  });
});
