const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900';

export function PolicyLayout({
  title,
  description,
  lastUpdated,
  toc,
  children,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        Finch Technology Enterprise — 201603312160
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      <p className="mt-2 text-xs text-slate-500">Last updated: {lastUpdated}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <a
          href="https://nexmenu.my/privacy"
          className={`underline underline-offset-2 hover:underline ${FOCUS}`}
        >
          nexmenu.my/privacy
        </a>
        <span className="text-slate-300">·</span>
        <a
          href="https://nexmenu.my/terms"
          className={`underline underline-offset-2 hover:underline ${FOCUS}`}
        >
          nexmenu.my/terms
        </a>
      </div>
      <nav
        aria-label="On this page"
        className="sticky top-[64px] z-10 mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">On this page</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          {toc.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`underline-offset-2 hover:underline ${FOCUS} text-slate-700`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed text-slate-600 prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-slate-900 prose-a:underline-offset-2 hover:prose-a:underline">
        {children}
      </div>
    </main>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
