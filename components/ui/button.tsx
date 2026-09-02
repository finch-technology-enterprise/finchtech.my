import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * The single button/CTA implementation for the site.
 *
 * Previously every visible CTA was a hand-rolled <Link> with bespoke classes
 * while the Button primitive went unused. Both `Button` and `ButtonLink` share
 * one `buttonVariants` source so a CTA looks identical whether it renders as a
 * <button> or an <a>.
 *
 * Sizes are floored at 44px (`md` and up) to satisfy the WCAG 2.5.8 target-size
 * guidance the audit found failing on every interactive element.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full',
    'font-semibold transition-[background-color,border-color,color,box-shadow,transform]',
    'duration-200 ease-[var(--ease-standard)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-brand-600 focus-visible:ring-offset-surface',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55',
  ].join(' '),
  {
    variants: {
      variant: {
        // 6.36:1 with white text — AA at every size.
        primary: 'bg-brand-600 text-white shadow-card hover:bg-brand-700 hover:shadow-lift',
        secondary:
          'border border-border-strong bg-surface text-fg shadow-card hover:border-ink-400 hover:bg-ink-50',
        ghost: 'text-fg hover:bg-ink-100',
        inverse: 'bg-white text-ink-900 shadow-card hover:bg-ink-100',
        'inverse-outline': 'border border-white/30 text-white hover:border-white/60 hover:bg-white/10',
        whatsapp: 'bg-whatsapp text-white shadow-card hover:brightness-110 hover:shadow-lift',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      full: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', full: false },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

function Button({ className, variant, size, full, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, full }), className)} {...props} />;
}

export interface ButtonLinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'href'>,
    ButtonVariants {
  href: string;
  /** External links get target/rel automatically — a consistency bug previously. */
  external?: boolean;
}

function ButtonLink({
  className,
  variant,
  size,
  full,
  href,
  external,
  ...props
}: ButtonLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
}

export { Button, ButtonLink, buttonVariants };
