'use client';

import { motion, useReducedMotion } from 'motion/react';

export default function About() {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.16, delay } }
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' as const },
          transition: { type: 'spring' as const, damping: 1, stiffness: 280, mass: 0.32, delay },
        };

  return (
    <section id="about" aria-label="About" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={
          prefersReducedMotion ? { duration: 0.16 } : { type: 'spring', damping: 1, stiffness: 280, mass: 0.32 }
        }
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Enterprise</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">About</h2>
      </motion.div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <motion.div className="space-y-4 text-sm leading-relaxed" {...reveal(0.06)}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-900">
            Finch Technology Enterprise
          </p>
          <p className="text-slate-600">
            Registration No. 201603312160 (MA0215195-D)
            <br />
            Sole Proprietorship — Registration of Businesses Act 1956
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs tracking-wide text-slate-700">
              MSIC 62010
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs tracking-wide text-slate-700">
              MSIC 63111
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs tracking-wide text-slate-700">
              MSIC 62021
            </span>
          </div>

          <p className="pt-2 font-mono text-xs tracking-wide text-slate-500">
            Formerly FinchVPN (2012–) — encrypted tunneling, retired.
          </p>
        </motion.div>

        <motion.div
          className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-6"
          {...reveal(0.1)}
        >
          <h3 className="font-semibold tracking-tight">Operations Center</h3>
          <address className="not-italic leading-relaxed text-slate-600">
            5B, Jalan BPU 5, Bandar Puchong Utama,
            <br />
            47100 Puchong, Selangor, Malaysia
          </address>
          <a
            href="https://maps.app.goo.gl/aYkckpagJbw4fjgKA"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            View on Google Maps
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0"
            >
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
