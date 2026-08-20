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
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
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
  const [scrolled, setScrolled] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

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
        'sticky top-0 z-50 w-full border-b backdrop-blur-[20px] saturate-[120%] transition-shadow duration-300',
        scrolled
          ? 'border-slate-200/80 bg-[rgba(255,255,255,0.92)] shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)]'
          : 'border-slate-200 bg-[rgba(255,255,255,0.85)] shadow-sm',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--bg)] opacity-0 supports-[backdrop-filter]:opacity-0 [@supports_not_(backdrop-filter:blur(0))]:opacity-100"
      />

      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 active:scale-[0.98]"
        >
          <span className="text-[15px]">Finch Technology</span>
          <span className="hidden text-sm font-normal tracking-normal text-slate-500 sm:inline">
            Enterprise
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex" role="list">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="#contact"
            className="hidden md:inline-flex h-9 items-center rounded-full bg-[var(--sky,#0ea5e9)] px-5 text-sm font-medium text-white shadow-sm hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Start a project
          </Link>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white transition hover:bg-slate-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden
              className="fixed inset-0 top-14 z-40 bg-slate-900/10 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0.12 } : { duration: 0.22, ease: 'easeOut' }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-x-0 top-14 z-50 border-b border-slate-200 bg-[rgba(255,255,255,0.97)] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[16px] md:hidden"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.14 }
                  : {
                      type: 'spring',
                      damping: 1,
                      stiffness: 300,
                      mass: 0.32,
                    }
              }
            >
              <ul className="flex flex-col gap-1" role="list">
                {NAV_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.12, delay: i * 0.02 }
                        : { type: 'spring', damping: 1, stiffness: 260, delay: i * 0.02 }
                    }
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 active:scale-[0.98]"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
