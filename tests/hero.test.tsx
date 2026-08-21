import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/hero';
describe('Hero Saasland', () => {
  it('renders tighter H1 and dual CTAs + device stack', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore products/i })).toHaveAttribute('href', '#products');
    expect(screen.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '#contact');
    expect(screen.getByLabelText(/Device preview/i)).toBeInTheDocument();
  });
});
