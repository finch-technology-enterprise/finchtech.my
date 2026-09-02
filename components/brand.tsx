/**
 * Finch wordmark glyph.
 *
 * A geometric "F" built from a solid stem and two offset bars, suggesting a
 * bird's wing without resorting to literal illustration. Rendered as inline SVG
 * so it is crisp at any size, inherits currentColor, costs no network request,
 * and never blocks LCP.
 *
 * Replaces the previous favicon/OG assets, which still carried the abandoned
 * teal palette (#66FCF1 / #1C242E) from an earlier design direction.
 */
export function FinchMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" className="fill-brand-600" />
      <path d="M11 8.5h12.5L21 13H11V8.5Z" className="fill-white" />
      <path d="M11 15h9l-2.5 4.5H11V15Z" className="fill-white/85" />
      <path d="M11 8.5h4.5v15H11v-15Z" className="fill-white" />
    </svg>
  );
}
