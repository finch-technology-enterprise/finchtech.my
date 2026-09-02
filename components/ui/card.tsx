import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * One card component with variants, replacing the three parallel card
 * treatments the audit found (Card primitive / bento div / tinted panel).
 */
export function Card({
  className,
  interactive = false,
  tone = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  tone?: 'default' | 'sunken' | 'brand' | 'inverse';
}) {
  return (
    <div
      className={cn(
        'card rounded-xl border shadow-card',
        tone === 'default' && 'border-border bg-surface',
        tone === 'sunken' && 'border-border bg-surface-sunken',
        tone === 'brand' && 'border-brand-200 bg-brand-50',
        tone === 'inverse' && 'border-white/12 bg-white/[0.06]',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift',
        className,
      )}
      {...props}
    />
  );
}

/** Small labelled pill used for facts, tags and metadata. */
export function Badge({
  className,
  tone = 'neutral',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'brand' | 'nexmenu' | 'geraiku' | 'inverse';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-eyebrow font-medium',
        tone === 'neutral' && 'border-border bg-surface-sunken text-fg-muted',
        tone === 'brand' && 'border-brand-200 bg-brand-50 text-brand-700',
        tone === 'nexmenu' && 'border-nexmenu-border bg-nexmenu-soft text-nexmenu',
        tone === 'geraiku' && 'border-geraiku-border bg-geraiku-soft text-geraiku',
        tone === 'inverse' && 'border-white/25 bg-white/10 text-white',
        className,
      )}
      {...props}
    />
  );
}
