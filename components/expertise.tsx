'use client';

import { Plug, Server, Wrench } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const CARDS = [
  {
    icon: Plug,
    title: 'Integrations',
    desc: 'Printers, payments and peripherals — ESC/POS, thermal and hardware that just works.',
    tag: 'ESC/POS \u00b7 thermal',
  },
  {
    icon: Server,
    title: 'Hosting & Operations',
    desc: 'Cloudflare edge, global deploys — private by design, always on.',
    tag: 'Cloudflare \u00b7 global',
  },
  {
    icon: Wrench,
    title: 'Tailoring & SLAs',
    desc: 'Workflows, KDS and hands-on support from Puchong — backed by SLAs.',
    tag: 'SLA \u00b7 Puchong',
  },
] as const;

export default function Expertise() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="expertise" aria-label="Expertise" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={
          prefersReducedMotion
            ? { duration: 0.16 }
            : { type: 'spring', damping: 1, stiffness: 280, mass: 0.32 }
        }
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Capabilities</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Custom where it counts</h2>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CARDS.map(({ icon: Icon, title, desc, tag }, i) => (
          <motion.div
            key={title}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={
              prefersReducedMotion
                ? { duration: 0.16, delay: i * 0.04 }
                : { type: 'spring', damping: 1, stiffness: 280, mass: 0.32, delay: i * 0.06 }
            }
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition will-change-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="h-1 w-8 rounded-full bg-[var(--amber)]" aria-hidden />
            <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <h3 className="mt-3 text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
            <p className="mt-3 font-mono text-[11px] tracking-wide text-slate-500">{tag}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
