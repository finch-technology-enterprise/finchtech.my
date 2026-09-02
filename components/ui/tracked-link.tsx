'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonVariants } from '@/components/ui/button';
import { trackConversion, withAttribution, type ConversionEvent } from '@/lib/analytics';

/**
 * Outbound CTA that records the conversion and stamps campaign attribution.
 *
 * This is the only place outbound product links are created, so every
 * NexMenu/GeraiKu/WhatsApp click is measurable and every product handoff
 * carries UTM parameters.
 *
 * Attribution is applied on click rather than during render so the server HTML
 * stays static (cacheable) and the href remains a clean, crawlable URL.
 */
export function TrackedLink({
  href,
  event,
  placement,
  attribute = true,
  variant,
  size,
  full,
  className,
  children,
  unstyled = false,
  ...rest
}: {
  href: string;
  event: ConversionEvent;
  placement: string;
  /** Set false for WhatsApp/mailto where UTM params are meaningless. */
  attribute?: boolean;
  unstyled?: boolean;
  children: React.ReactNode;
  className?: string;
} & ButtonVariants &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackConversion(event, placement);
      if (attribute) {
        const decorated = withAttribution(href, placement);
        if (decorated !== href) e.currentTarget.href = decorated;
      }
    },
    [event, placement, href, attribute],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={unstyled ? className : cn(buttonVariants({ variant, size, full }), className)}
      {...rest}
    >
      {children}
    </a>
  );
}
