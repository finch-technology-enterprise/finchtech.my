import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from '@/components/contact';
describe('Contact split', () => {
  it('renders info + form + turnstile hook', () => {
    const { container } = render(<Contact />);
    expect(screen.getAllByText(/Get in touch/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Let's build your workflow/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument();
    expect(container.querySelector('[class*="e0f2fe"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="bg-\\[var"]')).toBeInTheDocument();
    expect(screen.getByText(/support@finchtech.my/i)).toBeInTheDocument();
    expect(screen.getByText(/wa\.me\/60164525797/i)).toBeInTheDocument();
    expect(screen.getByText(/Operations Center: 5B/i)).toBeInTheDocument();
    // grid + cards
    expect(container.querySelector('[class*="lg:grid-cols-\\[1fr_1\\.2fr\\]"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="border-sky-100"]')).toBeInTheDocument();
    // form card
    expect(container.querySelector('form[class*="bg-white"]')).toBeInTheDocument();
  });
});
