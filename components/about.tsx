export default function About() {
  return (
    <section id="about" aria-label="About" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">About</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="font-medium">FINCH TECHNOLOGY ENTERPRISE</p>
          <p className="text-slate-600">
            Registration No. 201603312160 (MA0215195-D)
            <br />
            Sole Proprietorship — Registration of Businesses Act 1956
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
              MSIC 62010
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
              MSIC 63111
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
              MSIC 62021
            </span>
          </div>

          <p className="pt-2 text-xs text-slate-500">
            Formerly FinchVPN (2012–) — encrypted tunneling, retired.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h3 className="font-semibold">Operations Center</h3>
          <address className="not-italic leading-relaxed text-slate-600">
            5B, Jalan BPU 5, Bandar Puchong Utama,
            <br />
            47100 Puchong, Selangor, Malaysia
          </address>
          <a
            href="https://maps.app.goo.gl/aYkckpagJbw4fjgKA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-medium text-slate-900 hover:underline"
          >
            View on Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
