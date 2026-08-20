import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-slate-500">
          © {year} Finch Technology Enterprise. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="rounded-md px-2 py-1 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="rounded-md px-2 py-1 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
