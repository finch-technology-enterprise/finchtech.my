import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';

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
});
