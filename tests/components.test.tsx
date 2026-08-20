import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Page from '@/app/page';

describe('Nav', () => {
  it('renders brand and links', () => {
    render(<Nav />);
    expect(screen.getByText(/Finch Technology/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Products/ })).toBeInTheDocument();
  });

  it('renders all anchor links and has no Client Portal', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /Expertise/ })).toHaveAttribute('href', '#expertise');
    expect(screen.getByRole('link', { name: /About/ })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /Contact/ })).toHaveAttribute('href', '#contact');
    expect(screen.queryByRole('link', { name: /Client Portal/i })).not.toBeInTheDocument();
    expect(document.documentElement.innerHTML).not.toContain('dash.finchtech.my');
  });

  it('has light header classes', () => {
    const { container } = render(<Nav />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('bg-[rgba(255,255,255,0.85)]');
    expect(header?.className).toContain('border-slate-200');
  });

  it('renders theme toggle', () => {
    render(<Nav />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(<Nav />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getAllByText(/Finch Technology Enterprise/).length).toBeGreaterThanOrEqual(1);
  });

  it('links to local privacy/terms', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /^Privacy$/ })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /^Terms$/ })).toHaveAttribute('href', '/terms');
  });
});

describe('Button', () => {
  it('renders with variants', () => {
    const { rerender } = render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button', { name: 'Ghost' })).toBeInTheDocument();
    rerender(<Button variant="outline" size="sm">Outline</Button>);
    expect(screen.getByRole('button', { name: 'Outline' })).toBeInTheDocument();
  });
});

describe('Card', () => {
  it('renders card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', { 'font-bold': true })).toContain('font-bold');
  });
});

describe('Landing composition', () => {
  it('renders hero CTA and both product cards', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /Two products\. One partner\./i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Products/ })).toBeInTheDocument();
    expect(screen.getAllByText(/NexMenu/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/GeraiKu/).length).toBeGreaterThanOrEqual(1);
  });
});

describe('Light IA', () => {
  it('nav has no Client Portal link', () => {
    render(<Nav />);
    expect(screen.queryByRole('link', { name: /Client Portal/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });
  it('landing has hero + products + contact on light paper', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /Two products\. One partner\./i })).toBeInTheDocument();
    expect(screen.getAllByText(/NexMenu/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/GeraiKu/).length).toBeGreaterThanOrEqual(1);
  });
});
