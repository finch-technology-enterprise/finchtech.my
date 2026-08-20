'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const reveal = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring' as const, damping: 1, stiffness: 260, mass: 0.35 },
      };

  const terminalReveal = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15, delay: 0.05 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring' as const, damping: 1, stiffness: 220, mass: 0.4, delay: 0.12 },
      };

  return (
    <section
      aria-label="Hero"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.h1
            className="font-semibold tracking-tight text-balance"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
            initial={reveal.initial}
            animate={reveal.animate}
            transition={reveal.transition}
          >
            Two products. One partner.
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
            initial={reveal.initial}
            animate={reveal.animate}
            transition={
              prefersReducedMotion
                ? { duration: 0.15, delay: 0.04 }
                : { type: 'spring', damping: 1, stiffness: 260, mass: 0.35, delay: 0.06 }
            }
          >
            NexMenu &amp; GeraiKu in production — and we tailor them, host them, and integrate them
            to your workflow.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reveal.initial}
            animate={reveal.animate}
            transition={
              prefersReducedMotion
                ? { duration: 0.15, delay: 0.08 }
                : { type: 'spring', damping: 1, stiffness: 260, mass: 0.35, delay: 0.1 }
            }
          >
            <Link
              href="#products"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--accent,#0f172a)] px-6 text-sm font-medium text-white hover:bg-[var(--accent-hover,#1e293b)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Explore Products
            </Link>
            <Link
              href="#contact"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
            >
              Start a project
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {/* terminal card — transform/opacity only, will-change hint */}
        <motion.div
          className="will-change-transform rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6"
          style={{ willChange: 'transform, opacity' }}
          initial={terminalReveal.initial}
          animate={terminalReveal.animate}
          transition={terminalReveal.transition}
          aria-label="Code preview"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 font-mono text-xs text-slate-500">index.blade.php</span>
          </div>
          <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-slate-800">
            <code>
              <span className="text-slate-500">{`// FinchTech — Enterprise`}</span>
              {'\n'}
              <span className="text-slate-900">FinchTech</span>
              <span>{`.create(`}</span>
              <span className="text-slate-700">&apos;Enterprise&apos;</span>
              <span>{`)`}</span>
              {'\n'}
              {'  '}
              <span className="text-slate-600">.withSecurity()</span>
              {'\n'}
              {'  '}
              <span className="text-slate-600">.withScale()</span>
              {'\n'}
              {'  '}
              <span className="text-slate-600">.deploy()</span>
              <span className="text-slate-500">{` // malaysia-ready`}</span>
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
