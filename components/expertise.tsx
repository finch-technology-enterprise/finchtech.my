import { Code2, Server, Lightbulb, Plug } from 'lucide-react';

const ITEMS = [
  { icon: Code2, title: 'Computer Programming', desc: 'Custom software built for your workflow.' },
  { icon: Server, title: 'Hosting Infrastructure', desc: 'Reliable hosting & ops — MSIC 63111.' },
  { icon: Lightbulb, title: 'Consultancy', desc: 'Strategy, architecture & delivery — MSIC 62021.' },
  { icon: Plug, title: 'Custom API / Gateway', desc: 'Integrations, gateways & automation.' },
] as const;

export default function Expertise() {
  return (
    <section id="expertise" aria-label="Expertise" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Expertise</h2>
        <span className="inline-flex items-center rounded-full border border-[var(--accent,#66fcf1)]/30 bg-[var(--accent,#66fcf1)]/10 px-3 py-1 text-xs font-medium text-[var(--accent,#66fcf1)]">
          End-to-End lifecycle
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-70">
        Beyond products — we build it for you. From idea to deployment and ongoing care.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm opacity-70">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
