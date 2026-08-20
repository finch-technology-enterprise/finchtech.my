import { QrCode, Store } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function Products() {
  return (
    <section id="products" aria-label="Products" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Products</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-70">
        Two house brands we ship and operate — used by businesses across Malaysia.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* NexMenu */}
        <Card className="flex flex-col overflow-hidden transition hover:-translate-y-[5px] hover:border-[var(--accent,#66fcf1)]/40">
          <div className="aspect-[16/9] w-full border-b border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4">
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] text-xs opacity-50">
              Screenshot — nexmenu.my
            </div>
          </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent,#66fcf1)]/15 text-[var(--accent,#66fcf1)]">
                <QrCode className="h-4 w-4" aria-hidden />
              </span>
              <CardTitle>NexMenu</CardTitle>
            </div>
            <CardDescription>QR ordering for F&B — scan, order, pay.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
              <li>QR code ordering — no app install</li>
              <li>Kitchen Display System (KDS)</li>
              <li>Table management & live order tracking</li>
            </ul>
            <a
              href="https://nexmenu.my"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm font-medium text-[var(--accent,#66fcf1)] hover:underline"
            >
              Visit →
            </a>
          </CardContent>
        </Card>

        {/* GeraiKu */}
        <Card className="flex flex-col overflow-hidden transition hover:-translate-y-[5px] hover:border-[var(--accent,#66fcf1)]/40">
          <div className="aspect-[16/9] w-full border-b border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4">
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] text-xs opacity-50">
              Screenshot — geraiku.my
            </div>
          </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent,#66fcf1)]/15 text-[var(--accent,#66fcf1)]">
                <Store className="h-4 w-4" aria-hidden />
              </span>
              <CardTitle>GeraiKu</CardTitle>
            </div>
            <CardDescription>Multi-tenant storefront SaaS for sellers.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
              <li>Stores at *.geraiku.my — instant storefronts</li>
              <li>API at api.geraiku.my</li>
              <li>Orders, catalog & store management</li>
              <li>Subscriptions & tenancy built-in</li>
            </ul>
            <a
              href="https://geraiku.my"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm font-medium text-[var(--accent,#66fcf1)] hover:underline"
            >
              Visit →
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
