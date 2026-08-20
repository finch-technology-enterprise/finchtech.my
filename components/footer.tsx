import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 bg-[var(--ink,#0f172a)] text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">Finch Technology Enterprise</p>
            <p className="mt-2 text-xs font-light text-slate-400">MSIC 62010 · 63111 · 62021</p>
            <p className="mt-1 text-xs font-light text-slate-400">201603312160</p>
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
                <a href="https://geraiku.my" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  GeraiKu
                </a>
              </li>
              <li>
                <a href="https://api.geraiku.my" className="font-mono text-xs hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  api.geraiku.my
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  Terms
                </Link>
              </li>
              <li>
                <a href="https://nexmenu.my/privacy" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu privacy
                </a>
              </li>
              <li>
                <a href="https://nexmenu.my/terms" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  NexMenu terms
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
