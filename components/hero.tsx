'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {

  const reveal = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.35, ease: 'easeOut' as const },
  };

  const terminalReveal = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.35, ease: 'easeOut' as const, delay: 0.12 },
  };

  return (
    <section
      aria-label="Hero"
      className="relative isolate overflow-hidden bg-[var(--ink,#0f172a)] text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'var(--hero-mesh)' }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <motion.p
              className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80"
              initial={reveal.initial}
              animate={reveal.animate}
              transition={reveal.transition}
            >
              House of NexMenu &amp; GeraiKu — Puchong, MY
            </motion.p>

            <motion.h1
              className="font-semibold tracking-tight text-balance"
              style={{
                fontSize: 'clamp(2.2rem,5vw,3.6rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
              }}
              initial={reveal.initial}
              animate={reveal.animate}
              transition={reveal.transition}
            >
              One house. Two platforms. Built for Malaysian commerce.
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-[17px] sm:leading-7"
              initial={reveal.initial}
              animate={reveal.animate}
              transition={{ duration: 0.35, ease: 'easeOut' as const, delay: 0.06 }}
            >
              NexMenu &amp; GeraiKu in production — we tailor, host and integrate payments, printers,
              workflows, SLAs.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reveal.initial}
              animate={reveal.animate}
              transition={{ duration: 0.35, ease: 'easeOut' as const, delay: 0.1 }}
            >
              <Link
                href="#products"
                className="group inline-flex h-10 items-center justify-center rounded-full bg-[var(--sky)] px-6 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.16)] transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Explore Products
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0"
                  aria-hidden
                />
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-transparent px-6 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Start a project
                <ArrowRight className="ml-2 h-4 w-4 text-white/70" aria-hidden />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={terminalReveal.initial}
            animate={terminalReveal.animate}
            transition={terminalReveal.transition}
            aria-label="Device preview"
          >
            {/* Primary browser mock */}
            <div className="rounded-2xl border border-white/10 bg-white text-slate-900 shadow-[0_12px_32px_rgba(0,0,0,0.35)] overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                <span className="ml-2 font-mono text-xs tracking-wide text-slate-500">nexmenu.my</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="h-16 rounded-xl bg-slate-50 border border-slate-100" />
                  <div className="h-16 rounded-xl bg-slate-50 border border-slate-100" />
                  <div className="h-16 rounded-xl bg-sky-50 border border-sky-100" />
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex rounded-full bg-slate-900 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white">
                    nexmenu.my
                  </span>
                  <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] tracking-wide text-slate-600">
                    POS · Kitchen · Payments
                  </span>
                </div>
              </div>
            </div>

            {/* Overlapping secondary card */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 w-[72%] max-w-[320px] rounded-2xl border border-white/10 bg-slate-900 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] overflow-hidden sm:w-[68%]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="ml-2 font-mono text-xs tracking-wide text-white/60">geraiku.my</span>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="h-2.5 w-3/4 rounded-full bg-white/10" />
                  <div className="h-2.5 w-full rounded-full bg-white/10" />
                  <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-white px-2.5 py-1 font-mono text-[11px] tracking-wide text-slate-900">
                    geraiku.my
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
