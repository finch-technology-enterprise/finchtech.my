import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 py-8 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-muted-foreground">
          © {year} Finch Technology Enterprise. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-4">
          <Link href="/privacy" className="opacity-70 hover:opacity-100 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="opacity-70 hover:opacity-100 hover:underline">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
