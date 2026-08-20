'use client';

import { motion, useReducedMotion } from 'motion/react';

export default function Expertise() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="expertise" aria-label="Custom" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={
          prefersReducedMotion
            ? { duration: 0.16 }
            : { type: 'spring', damping: 1, stiffness: 280, mass: 0.32 }
        }
      >
        <p className="text-sm leading-relaxed text-slate-700">
          <strong className="font-semibold tracking-tight text-slate-900">Custom where it counts</strong> — onboarding
          NexMenu? We adapt printers, payments, workflows, SLAs.
        </p>
        <a
          href="#contact"
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-900 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 active:scale-[0.98]"
        >
          Talk to us
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0"
          >
            →
          </span>
        </a>
      </motion.div>
    </section>
  );
}
