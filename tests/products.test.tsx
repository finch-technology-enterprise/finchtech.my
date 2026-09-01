import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Products from '@/components/products';

describe('Products Saasland', () => {
  it('renders browser mocks and visit links', () => {
    render(<Products />);
    expect(screen.getByRole('link', { name: /Visit NexMenu/i })).toHaveAttribute('href', 'https://nexmenu.my');
    expect(screen.getByRole('link', { name: /Visit GeraiKu/i })).toHaveAttribute('href', 'https://geraiku.my');
    expect(screen.getAllByText(/nexmenu\.my|geraiku\.my/i).length).toBeGreaterThanOrEqual(2);
    // browser mock structure replaces placeholder
    expect(screen.queryByText(/Screenshot —/)).not.toBeInTheDocument();
    // mock containers present
    expect(document.querySelectorAll('.aspect-\\[16\\/9\\]').length).toBeGreaterThanOrEqual(2);
    expect(document.querySelectorAll('.bg-gradient-to-b').length).toBeGreaterThanOrEqual(2);
    // pills present
    expect(document.querySelectorAll('.rounded-full.bg-slate-50').length).toBeGreaterThanOrEqual(3);
  });
  it('NexMenu card shows pricing link', () => {
    render(<Products />);
    expect(screen.getByRole('link', { name: /View pricing/i })).toHaveAttribute('href', '/pricing');
  });
});
