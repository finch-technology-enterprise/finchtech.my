import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '@/components/about';

describe('About trust band', () => {
  it('preserves registration + MSICs + map link', () => {
    render(<About />);
    expect(screen.getByText(/201603312160/)).toBeInTheDocument();
    expect(screen.getByText(/MSIC 62010/)).toBeInTheDocument();
    expect(screen.getByText(/62010/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Google Maps/i })).toHaveAttribute(
      'href',
      expect.stringContaining('maps.app.goo.gl'),
    );
    expect(screen.getByText(/FinchVPN/)).toBeInTheDocument();
  });

  it('renders tightened headline', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { level: 2, name: /Built in Puchong\. Shipped across Malaysia\./ }),
    ).toBeInTheDocument();
  });
});
