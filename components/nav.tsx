'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#products', label: 'Products' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;

function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else {
    html.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch {}
}

function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = (() => {
      try {
        return localStorage.getItem('theme');
      } catch {
        return null;
      }
    })();
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = prefersDark ? 'dark' : 'light';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('theme')) return;
      } catch {}
      const next = e.matches ? 'dark' : 'light';
      setTheme(next);
      applyTheme(next);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mounted]);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-current opacity-60"
        disabled
      >
        <Moon className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-current backdrop-blur hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

export default function Nav() {
  const [open, setOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Close on escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Lock body scroll when sheet open (optional, lightweight)
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        // translucent material — apple-design:184
        'sticky top-0 z-50 w-full border-b border-white/10',
        // dark default: rgba(11,12,16,0.6); light via data-theme
        'bg-[rgba(11,12,16,0.6)]',
        'backdrop-blur-[20px] saturate-[180%]',
        // supports fallback — solid when backdrop-filter unsupported
        'supports-[backdrop-filter]:bg-[rgba(11,12,16,0.6)]',
        // light theme override via data-theme attribute on html
        'data-[theme=light]:bg-[rgba(255,255,255,0.6)]',
        // explicit light selector for html[data-theme=light] context
        '[html[data-theme=light]_&]:bg-[rgba(255,255,255,0.6)]',
        '[html[data-theme=light]_&]:border-black/10',
      )}
      // fallback bg for no backdrop-filter — inline style ensures solid when unsupported
      style={
        {
          // CSS var hint — consumed by globals if needed
        } as React.CSSProperties
      }
    >
      {/* solid fallback layer for browsers without backdrop-filter */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--bg)] opacity-0 supports-[backdrop-filter]:opacity-0 [@supports_not_(backdrop-filter:blur(0))]:opacity-100"
      />

      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="text-[15px]">Finch Technology</span>
          <span className="hidden text-sm font-normal opacity-60 sm:inline">Enterprise</span>
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-6 md:flex" role="list">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium opacity-80 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://dash.finchtech.my"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center rounded-md border border-white/15 bg-white/5 px-3 text-sm font-medium backdrop-blur hover:bg-white/10"
            >
              Client Portal
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden
              className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0.15 } : { duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-x-0 top-14 z-50 border-b border-white/10 bg-[rgba(11,12,16,0.95)] p-4 backdrop-blur-[20px] md:hidden [html[data-theme=light]_&]:bg-[rgba(255,255,255,0.95)]"
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
              }
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.15 }
                  : {
                      type: 'spring',
                      damping: 1,
                      stiffness: 260,
                      mass: 0.3,
                    }
              }
            >
              <ul className="flex flex-col gap-1" role="list">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-white/10"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="https://dash.finchtech.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-center text-sm font-medium hover:bg-white/10"
                  >
                    Client Portal
                  </a>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
