export default function Expertise() {
  return (
    <section
      id="expertise"
      aria-label="Custom"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
        <p className="text-sm leading-relaxed text-slate-700">
          <strong className="font-semibold text-slate-900">Custom where it counts</strong> — onboarding
          NexMenu? We adapt printers, payments, workflows, SLAs.
        </p>
        <a
          href="#contact"
          className="inline-flex shrink-0 items-center text-sm font-medium text-slate-900 hover:underline"
        >
          Talk to us →
        </a>
      </div>
    </section>
  );
}
