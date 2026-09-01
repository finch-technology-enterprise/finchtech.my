import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 bg-[var(--ink,#0f172a)] text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">Finch Technology Enterprise</p>
            <p className="mt-2 text-xs font-light text-slate-400">MSIC 62010 · 63111 · 62021</p>
            <p className="mt-1 text-xs font-light text-slate-400">201603312160</p>
            <p className="mt-3 text-xs text-slate-500">
              5B, Jalan BPU 5, Bandar Puchong Utama,
              <br />
              47100 Puchong, Selangor
            </p>
            <a
              href="mailto:support@finchtech.my"
              className="mt-2 inline-block text-xs text-sky-400 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              support@finchtech.my
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Products</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="https://nexmenu.my" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu
                </a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="https://geraiku.my" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  GeraiKu
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Refund &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/service-delivery" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Service Delivery
                </Link>
              </li>
              <li>
                <Link href="/payment-policy" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Payment Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">NexMenu Policies</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="https://nexmenu.my/terms" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu Terms
                </a>
              </li>
              <li>
                <a href="https://nexmenu.my/privacy" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu Privacy
                </a>
              </li>
              <li>
                <a href="https://nexmenu.my/refund" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu Refund
                </a>
              </li>
              <li>
                <a href="https://nexmenu.my/payment-policy" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu Payment
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6">
          <p className="text-xs font-light text-slate-500">
            © {year} Finch Technology Enterprise · 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor
          </p>
        </div>
      </div>
    </footer>
  );
}
