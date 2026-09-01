import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NexMenu Pricing',
  description:
    'NexMenu pricing — QR ordering, kitchen display and restaurant management plans in Malaysian Ringgit (RM). From free to RM149/month. No order commission.',
};

const PLANS = [
  {
    name: 'Lite',
    price: 'RM0',
    period: '/month',
    note: 'Free forever',
    staff: '1 staff login',
    orderLimit: 'Up to 100 orders/month',
    features: [
      'Online storefront with menu & checkout',
      'QR code table ordering',
      'WhatsApp customer login',
      'Unlimited menu items',
      'Connect your own payment gateway',
    ],
    cta: { label: 'Get started free', href: 'https://nexmenu.my' },
    highlight: false,
  },
  {
    name: 'Essential',
    price: 'RM29',
    period: '/month',
    note: 'Billed monthly',
    staff: '1 staff login',
    orderLimit: 'Up to 500 orders/month',
    features: [
      'Everything in Lite',
      '500 orders per month',
    ],
    cta: { label: 'Choose Essential', href: 'https://nexmenu.my' },
    highlight: false,
  },
  {
    name: 'Starter',
    price: 'RM59',
    period: '/month',
    note: 'Billed monthly',
    staff: '2 staff accounts',
    orderLimit: 'Unlimited orders',
    features: [
      'Everything in Essential',
      'Unlimited orders',
      'Taking payment at the counter',
      'Receipt & kitchen printing',
      'e-Invoice export',
      'Sales reports',
    ],
    cta: { label: 'Choose Starter', href: 'https://nexmenu.my' },
    highlight: false,
  },
  {
    name: 'Growth',
    price: 'RM109',
    period: '/month',
    note: 'Billed monthly — Most popular',
    staff: '5 staff accounts',
    orderLimit: 'Unlimited orders',
    features: [
      'Everything in Starter',
      'Kitchen Display System',
      'Runner Display System',
      'Stock tracking',
      'Reservations & waitlist',
      'Delivery zones',
      'Automatic courier booking',
    ],
    cta: { label: 'Choose Growth', href: 'https://nexmenu.my' },
    highlight: true,
  },
  {
    name: 'Pro',
    price: 'RM149',
    period: '/month',
    note: 'Billed monthly',
    staff: '7 staff accounts',
    orderLimit: 'Unlimited orders',
    features: [
      'Everything in Growth',
      'Loyalty & rewards',
      'Gift cards',
      'Promotions & discount codes',
      'Marketing campaigns',
      'Advanced analytics & export',
    ],
    cta: { label: 'Choose Pro', href: 'https://nexmenu.my' },
    highlight: false,
  },
] as const;

export default function PricingPage() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          Finch Technology Enterprise — 201603312160
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          NexMenu Pricing
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          NexMenu is a Finch Technology product — a cloud-based QR ordering and restaurant management platform for
          Malaysian cafes and restaurants. All prices are in Malaysian Ringgit (RM). No commission on orders. No
          hidden fees.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            No credit card required for Lite
          </span>
          <span className="text-slate-300">·</span>
          <span>Cancel anytime</span>
          <span className="text-slate-300">·</span>
          <span>Paid plans billed monthly in advance</span>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
              plan.highlight
                ? 'border-slate-900 ring-1 ring-slate-900/5'
                : 'border-slate-200'
            }`}
          >
            {plan.highlight && (
              <span className="mb-3 inline-flex w-fit rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-white">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">{plan.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">{plan.period}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{plan.note}</p>
            <div className="mt-4 space-y-1 text-xs text-slate-600">
              <p className="font-medium text-slate-700">{plan.staff}</p>
              <p className="font-medium text-slate-700">{plan.orderLimit}</p>
            </div>
            <ul className="mt-4 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm leading-snug text-slate-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-900" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-medium transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                plan.highlight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'border border-slate-200 text-slate-900 hover:bg-slate-50'
              }`}
            >
              {plan.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Important notes</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            All prices are in Malaysian Ringgit (RM) and include applicable taxes where required.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            Paid subscriptions are billed monthly in advance. Unless stated otherwise at checkout, subscription fees are
            non-refundable for partial billing periods.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            NexMenu charges zero commission on customer orders. Payment gateway fees are separate and governed by your
            agreement with the gateway provider.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            Plan features and limits may change with reasonable prior notice.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            NexMenu supports payment through Billplz, Fiuu, ChipIn, Revenue Monster, and Curlec — each licensed or
            registered with Bank Negara Malaysia.
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="https://nexmenu.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Visit NexMenu
          </Link>
          <Link
            href="/refund"
            className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Refund &amp; Cancellation Policy
          </Link>
          <Link
            href="/payment-policy"
            className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Payment Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
