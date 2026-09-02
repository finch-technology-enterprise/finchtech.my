import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
describe('Chrome Saasland', () => {
  it('nav has CTA pill to #contact', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '#contact');
  });
  it('footer has product + legal columns with nexmenu cross-link', () => {
    render(<Footer />);
    const nexmenu = screen.getAllByRole('link', { name: /NexMenu/i }).find((a) => a.getAttribute('href') === 'https://nexmenu.my');
    expect(nexmenu).toBeDefined();
    expect(nexmenu).toHaveAttribute('href', expect.stringContaining('nexmenu.my'));
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/privacy');
  });
});
