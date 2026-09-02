import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Section heading pattern — eyebrow / title / lead.
 *
 * The previous site repeated this markup in five components with slightly
 * different sizes each time. One component now owns it, so the vertical rhythm
 * and type scale stay consistent across every page.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'start',
  tone = 'default',
  as: Heading = 'h2',
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'start' | 'center';
  tone?: 'default' | 'inverse';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  id?: string;
}) {
  const inverse = tone === 'inverse';
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'text-eyebrow font-semibold uppercase',
            inverse ? 'text-brand-200' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          Heading === 'h1' ? 'text-h1' : 'text-h2',
          'font-semibold',
          inverse ? 'text-white' : 'text-fg',
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <p
          className={cn(
            'text-lead max-w-2xl',
            align === 'center' && 'mx-auto',
            inverse ? 'text-fg-inverse-muted' : 'text-fg-muted',
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Page section wrapper — owns the shell + rhythm so pages stay declarative. */
export function Section({
  children,
  className,
  flow = 'default',
  tone = 'default',
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  flow?: 'default' | 'lg' | 'xl';
  tone?: 'default' | 'sunken' | 'inverse';
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        flow === 'xl' ? 'section-flow-xl' : flow === 'lg' ? 'section-flow-lg' : 'section-flow',
        tone === 'sunken' && 'bg-surface-sunken',
        tone === 'inverse' && 'bg-surface-inverse text-white',
        className,
      )}
    >
      <div className="shell">{children}</div>
    </section>
  );
}
