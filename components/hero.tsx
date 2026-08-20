'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const reveal = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.16 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring' as const, damping: 1, stiffness: 280, mass: 0.32 },
      };

  const terminalReveal = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.16, delay: 0.06 } }
    : {
        initial: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        transition: {
          type: 'spring' as const,
          damping: 1,
          stiffness: 240,
          mass: 0.42,
          delay: 0.14,
        },
      };

  return (
    <section aria-label="Hero" className="relative isolate mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      {/* Depth orb — behind hero, never steals focus */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 right-0 -z-10 hidden h-[520px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.06),transparent_70%)] blur-[1px] lg:block"
      />

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.p
            className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium tracking-wide text-slate-600"
            initial={reveal.initial}
            animate={reveal.animate}
            transition={reveal.transition}
          >
            House of NexMenu &amp; GeraiKu
          </motion.p>

          <motion.h1
            className="font-semibold tracking-tight text-balance"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
            }}
            initial={reveal.initial}
            animate={reveal.animate}
            transition={reveal.transition}
          >
            Two products. One partner.
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-[17px] sm:leading-7"
            initial={reveal.initial}
            animate={reveal.animate}
            transition={
              prefersReducedMotion
                ? { duration: 0.16, delay: 0.04 }
                : { type: 'spring', damping: 1, stiffness: 280, mass: 0.32, delay: 0.06 }
            }
          >
            NexMenu &amp; GeraiKu in production — we tailor them, host them, and integrate them to your
            workflow.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reveal.initial}
            animate={reveal.animate}
            transition={
              prefersReducedMotion
                ? { duration: 0.16, delay: 0.08 }
                : { type: 'spring', damping: 1, stiffness: 280, mass: 0.32, delay: 0.1 }
            }
          >
            <Link
              href="#products"
              className="group inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(15,23,42,0.12)] transition hover:bg-slate-800 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Explore Products
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0"
                aria-hidden
              />
            </Link>
            <Link
              href="#contact"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
            >
              Start a project
              <ArrowRight className="ml-2 h-4 w-4 text-slate-500" aria-hidden />
            </Link>
          </motion.div>

          <motion.p
            className="mt-4 text-xs leading-relaxed text-slate-500"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.14, delay: 0.1 }
                : { type: 'spring', damping: 1, stiffness: 280, delay: 0.16 }
            }
          >
            Enterprise holding in Puchong — custom workflows, printers, payments, SLAs.
          </motion.p>
        </div>

        <motion.div
          className="will-change-transform rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] sm:p-6"
          style={{ willChange: 'transform, opacity' as const }}
          initial={terminalReveal.initial}
          animate={terminalReveal.animate}
          transition={terminalReveal.transition}
          aria-label="Code preview"
        >
          <div className="mb-4 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
            <span className="ml-2 font-mono text-xs tracking-wide text-slate-500">finchtech · enterprise</span>
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
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] tracking-wide text-slate-600">
              nexmenu.my
            </span>
            <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] tracking-wide text-slate-600">
              geraiku.my
            </span>
            <span className="inline-flex rounded-full bg-slate-900 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white">
              api.geraiku.my
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
