'use client';

import { QrCode, Store, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function Products() {
  const prefersReducedMotion = useReducedMotion();

  const cardMotion = (delay: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.18, delay } }
      : {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' as const },
          transition: { type: 'spring' as const, damping: 1, stiffness: 260, mass: 0.38, delay },
        };

  return (
    <section id="products" aria-label="Products" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={prefersReducedMotion ? { duration: 0.16 } : { duration: 0.22, ease: 'easeOut' as const }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">House brands</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Products</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          Two house brands we ship, host and operate — used by businesses across Malaysia.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <motion.div {...cardMotion(0.06)}>
          <Card className="group flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition will-change-transform hover:-translate-y-1 hover:border-slate-900/10 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.06)] active:scale-[0.99]">
            <div className="aspect-[16/9] w-full border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden />
                  <span className="ml-auto font-mono text-[10px] tracking-wide text-slate-400">nexmenu.my</span>
                </div>
                <div className="flex flex-1 gap-3 p-3">
                  <div className="flex flex-col items-center gap-1.5" aria-hidden>
                    <div className="grid grid-cols-4 gap-0.5 rounded-md border border-slate-200 bg-slate-50 p-1.5">
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-300" />
                      <span className="h-2 w-2 rounded-[1px] bg-slate-900" />
                    </div>
                    <span className="font-mono text-[9px] tracking-wide text-slate-400">QR</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5" aria-hidden>
                    <div className="h-2 w-3/4 rounded bg-slate-900/10" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-2 py-1">
                        <span className="h-1.5 w-16 rounded bg-slate-300" />
                        <span className="h-1.5 w-8 rounded bg-slate-200" />
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-2 py-1">
                        <span className="h-1.5 w-20 rounded bg-slate-300" />
                        <span className="h-1.5 w-8 rounded bg-slate-200" />
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-2 py-1">
                        <span className="h-1.5 w-14 rounded bg-slate-300" />
                        <span className="h-1.5 w-8 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
                  <QrCode className="h-4 w-4" aria-hidden />
                </span>
                <CardTitle>NexMenu</CardTitle>
              </div>
              <CardDescription>QR ordering for F&B — scan, order, pay.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="flex flex-wrap gap-1.5" aria-hidden>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">
                  QR ordering
                </span>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">KDS</span>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">
                  Table management
                </span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                <li>QR code ordering — no app install</li>
                <li>Kitchen Display System (KDS)</li>
                <li>Table management &amp; live order tracking</li>
              </ul>
              <a
                href="https://nexmenu.my"
                target="_blank"
                rel="noopener noreferrer"
                className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Visit NexMenu
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(0.12)}>
          <Card className="group flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition will-change-transform hover:-translate-y-1 hover:border-slate-900/10 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.06)] active:scale-[0.99]">
            <div className="aspect-[16/9] w-full border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden />
                  <span className="ml-auto font-mono text-[10px] tracking-wide text-slate-400">geraiku.my</span>
                </div>
                <div className="flex flex-1 gap-3 p-3" aria-hidden>
                  <div className="flex w-16 flex-col gap-1.5 border-r border-slate-100 pr-3">
                    <div className="h-2 w-10 rounded bg-slate-900" />
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded bg-slate-200" />
                      <div className="h-1.5 w-3/4 rounded bg-slate-200" />
                      <div className="h-1.5 w-5/6 rounded bg-slate-200" />
                    </div>
                    <div className="mt-1 h-6 rounded bg-slate-900/90" />
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-2 content-start">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                      <div className="h-8 rounded bg-white shadow-sm" />
                      <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-200" />
                      <div className="mt-1 h-1.5 w-1/2 rounded bg-slate-200" />
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                      <div className="h-8 rounded bg-white shadow-sm" />
                      <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-200" />
                      <div className="mt-1 h-1.5 w-1/2 rounded bg-slate-200" />
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                      <div className="h-8 rounded bg-white shadow-sm" />
                      <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-200" />
                      <div className="mt-1 h-1.5 w-1/2 rounded bg-slate-200" />
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                      <div className="h-8 rounded bg-white shadow-sm" />
                      <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-200" />
                      <div className="mt-1 h-1.5 w-1/2 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
                  <Store className="h-4 w-4" aria-hidden />
                </span>
                <CardTitle>GeraiKu</CardTitle>
              </div>
              <CardDescription>Multi-tenant storefront SaaS for sellers.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="flex flex-wrap gap-1.5" aria-hidden>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">
                  *.geraiku.my
                </span>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">
                  api.geraiku.my
                </span>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">
                  Orders &amp; catalog
                </span>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700">
                  Subscriptions
                </span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                <li>Stores at *.geraiku.my — instant storefronts</li>
                <li>API at api.geraiku.my</li>
                <li>Orders, catalog &amp; store management</li>
                <li>Subscriptions &amp; tenancy built-in</li>
              </ul>
              <a
                href="https://geraiku.my"
                target="_blank"
                rel="noopener noreferrer"
                className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Visit GeraiKu
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
