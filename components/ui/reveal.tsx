'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Scroll reveal as *progressive enhancement*.
 *
 * The previous implementation server-rendered 18 elements at `opacity: 0` via
 * motion's `initial` prop, which meant:
 *   - the SSR HTML was visually blank until hydration (667ms render delay =
 *     93% of LCP), and
 *   - the page rendered as a white screen entirely if JS failed.
 *
 * Here the element is always in its final visible state in the server HTML.
 * Only after mount — and only when IntersectionObserver and motion preference
 * allow — do we mark it `pending` to play the CSS keyframe. If JS never runs,
 * the content is simply visible, which is the correct default.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already on screen at mount (above the fold): don't animate, avoids a
    // flash on the LCP element.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    el.style.setProperty('animation-delay', `${delay}ms`);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = 'pending';
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
}
