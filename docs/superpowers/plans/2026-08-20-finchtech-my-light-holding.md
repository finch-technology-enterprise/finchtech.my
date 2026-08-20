# Finchtech.my — Light Holding (C) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin `finchtech.my` from dark cyan to a light, trust-first enterprise holding that sells NexMenu (`nexmenu.my`) + GeraiKu (`geraiku.my`, `*.geraiku.my`) as equal SaaS cards, with custom enterprising solutions as a light strip — no Client Portal, no dark banding.

**Architecture:** Single Next.js 16 / React 19 / Tailwind 4 app via `@opennextjs/cloudflare 1.20` (latest 1.20.2) on Workers (`finchtech-my-frontend`, `finchtech.my` zone `28970b96b4880e4f41cc0487104898a0`). Light tokens replace `app/globals.css:1` dark `#0b0c10/#66fcf1`; nav/products/about/contact re-token but keep `runtime nodejs` + `[assets]` + `WORKER_SELF_REFERENCE` deploy fixes from `f6257d08`. One light-theme task: 4/42 tests stay green, `GET /api/health` 200.

**Tech Stack:** Next 16, React 19, Tailwind 4, `motion/react` 13.x, `next/font` Inter + JetBrains Mono, `zod` 4.4, , `lucide-react` 1.33, , `sonner`, `tailwind-merge` + `clsx`, `@opennextjs/cloudflare 1.20` (latest 1.20.2), `wrangler 4.124` (latest), `vitest` + `@testing-library`, Node 26

**Spec:** `docs/superpowers/specs/2026-08-20-finchtech-my-light-holding-design.md`

## Global Constraints

- Node `>=22` (`package.json:5` `engines`), Next `16`, React `19`, Tailwind `4`, TS `6.x`, `wrangler 4.124` (latest), `@opennextjs/cloudflare 1.20` (latest 1.20.2)
- Author `Finch Technology <admin@finchtech.my>` (Husky + `pre-push` production guards)
- Branches `feature/*|hotfix/*|dependabot/* → production` via `scripts/merge-local.sh` (`--no-ff`, 2 parents, first-parent = `origin/production` tip)
- Domain `finchtech.my` + `www.finchtech.my` on `28970b96b4880e4f41cc0487104898a0` — Worker `finchtech-my-frontend`, `workers_dev true`, `[assets] .open-next/assets ASSETS` + `WORKER_SELF_REFERENCE` (already in `wrangler.toml:8` since `f6257d08`)
- Runtime `nodejs` (not `edge`) on `app/api/health|contact` (Turbopack edge was 500 `Cannot read properties of undefined (reading 'default')`)
- Metadata house-of-brands: `layout.tsx:22` title `Finch Technology Enterprise | Software for Malaysian Businesses`, description `Custom software development, hosting infrastructure and IT consultancy… House of NexMenu & GeraiKu` (no leading VPN pitch)
- Tests 42/42 + `typecheck` + `lint --max-warnings=0` + `next build` + `opennextjs-cloudflare build → .open-next/worker.js` must stay green

---

## File Structure

```
/ (repo root)
├─ app/
│  ├─ globals.css              # light tokens + prefers-* a11y (modify)
│  ├─ layout.tsx               # skip link + metadata (no change — already house-of-brands)
│  ├─ page.tsx                 # main#main composition (modify — drop Expertise 4-card if present)
│  ├─ privacy/terms/           # no change
│  └─ api/health|contact/route.ts # no change (runtime nodejs already)
├─ components/
│  ├─ nav.tsx                  # light translucent nav - Client Portal + dark link integration
│  ├─ hero.tsx                 # light hero - Hero tagline color + CTA colors + card borders
│  ├─ products.tsx             # light cards - border-slate / bg-white / Visit link color
│  ├─ expertise.tsx            # replace with single "Custom where it counts" strip or delete
│  ├─ about.tsx                # light borders + strip integration
│  ├─ contact.tsx              # light borders/backgrounds
│  ├─ footer.tsx               # light border tweak
│  └─ ui/{button,card,input,textarea}.tsx # light border adjustments
├─ lib/{contact,turnstile,rate-limit}.ts # no change
├─ wrangler.toml               # already correct (assets + routes + nodejs)
└─ tests/{components,contact,api-contact}.test.ts # update snapshots for light classes + no-portal assertion
```

---

### Task 1: Light theme — nav, tokens, IA (remove Client Portal, dark)

**Files:**
- Modify: `app/globals.css:1-60`
- Modify: `components/nav.tsx:1-100`
- Modify: `components/hero.tsx:1-100`
- Modify: `components/products.tsx:1-100`
- Modify: `components/about.tsx:1-80`
- Modify: `components/contact.tsx:1-50`
- Modify: `components/ui/card.tsx:1-30` (if needed)
- Modify: `app/page.tsx:1-20` (drop Expertise 4-card, keep single strip in products/about)
- Modify: `components/expertise.tsx:1` (collapse to strip or delete + wire strip elsewhere)
- Modify: `tests/components.test.tsx:1-30` (assert light classes, no Client Portal)
- Modify: `components/footer.tsx:1` (border tweak if needed)

**Interfaces:**
- Consumes: Spec §4 light tokens, spec §3 IA (no portal), existing `tailwind-merge` `cn()` + `motion/react`
- Produces: Light paper `bg #FFFFFF`, ink `#0f172a`, muted `#64748b`, border `#e2e8f0`, card `#f8fafc`, accent ink-blue `#0f172a` (CTA), nav `bg-white/85 blur 20px saturate 120% shadow-sm`, cards `border-slate-200 bg-white hover:-translate-y-[3px] shadow-md`, hero/product/contact light borders

- [ ] **Step 1: Write the failing test for light IA**

```ts
// tests/components.test.tsx — add/adjust
describe("Light IA", () => {
  it("nav has no Client Portal link", () => {
    render(<Nav />);
    expect(screen.queryByRole("link", { name: /Client Portal/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });
  it("landing has hero + products + contact on light paper", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: /Two products\. One partner\./i })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("bg-white"); // or check main bg
  });
});
```

Run: `npm run test -- tests/components.test.tsx -v`
Expected: FAIL — nav still has Client Portal, hero still "Software for Malaysian businesses", globals still dark.

- [ ] **Step 2: Run to confirm failure**

```bash
npm run test -- tests/components.test.tsx -v
```

- [ ] **Step 3: Implement `app/globals.css` — light tokens**

```css
@import "tailwindcss";
@theme { --color-accent: #0f172a; --color-bg: #ffffff; --font-mono: var(--font-mono); }
/* Light paper */
:root { --bg: #ffffff; --fg: #0f172a; --muted: #64748b; --border: #e2e8f0; --card: #f8fafc; --accent: #0f172a; --accent-hover: #1e293b; }
[data-theme="light"] { --bg: #ffffff; --fg: #0f172a; } /* keep for parity, light is default */
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
@media (prefers-reduced-transparency: reduce) { header, header nav { backdrop-filter: none !important; background: var(--bg) !important; } }
@media (prefers-contrast: more) { header, header nav, .card { border-color: currentColor !important; } }
body { background: var(--bg); color: var(--fg); }
```

Keep existing `prefers-*` + `scroll-behavior` from `globals.css:23,37,45`; replace `:root --bg #0b0c10 --fg #c5c6c7` with light above. Card tokens: `bg-white border-slate-200`.

- [ ] **Step 4: Implement `components/nav.tsx` — light nav + no portal**

```tsx
// header class: was bg-[rgba(11,12,16,0.6)] backdrop-blur-[20px] saturate-[180%] border-white/10
// now: bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] saturate-[120%] border-slate-200 shadow-sm
// [html[data-theme=light]_&]:bg-… removed — default is light
// Links: keep Products / Expertise? → map Expertise anchor to the custom strip (#custom or #about), or keep Expertise label for the strip: "Solutions" or "Custom"
// Delete: <a href="https://dash.finchtech.my">Client Portal</a>
// Keep: Products, Expertise/Solutions, About, Contact (4 items is fine; or drop one to Products·Company·Contact per spec §3 alt — pick 4-item with Expertise as strip)
```

Also keep `supports-[backdrop-filter]` fallback (`nav.tsx:131`) and `ThemeToggle` (optional — light default; keep but de-emphasized).

- [ ] **Step 5: Implement `components/hero.tsx` — light hero**

- Heading: `Two products. One partner.` (or approved sibling from spec §3 — keep one source of truth)
- Sub: `NexMenu & GeraiKu in production — and we tailor them, host them, and integrate them to your workflow.`
- CTA primary: `bg-[var(--accent,#0f172a)] text-white hover:bg-[var(--accent-hover,#1e293b)]` (was `bg-[var(--accent,#66fcf1)] text-[var(--bg,#0b0c10)]`)
- Card preview: `border-slate-200 bg-slate-50 backdrop-blur` (was `border-white/10 bg-white/[0.04]`)
- Keep `motion/react` `transform/opacity` reveal + `useReducedMotion` fade, `clamp(2.2rem,5vw,3.5rem) lh 1.05 tracking -0.02em`.

- [ ] **Step 6: Implement `components/products.tsx` + custom strip + `components/about.tsx` + `components/contact.tsx` light**

```tsx
// products card: was border-white/10 bg-white/[0.03] hover:border-[var(--accent,#66fcf1)]/40
// now: border-slate-200 bg-white hover:-translate-y-[3px] hover:shadow-md hover:border-slate-900/10
// Visit link: was text-[var(--accent,#66fcf1)] -> text-slate-900 hover:text-slate-700
// product icon bg: was bg-[var(--accent,#66fcf1)]/15 text-[var(--accent)] -> bg-slate-900 text-white / or bg-slate-100 text-slate-900
// Keep: md:grid-cols-2, aspect-[16/9] placeholder Screenshot — nexmenu/geraiku, outbound Visit →

// Custom strip (replaces 4-card Expertise): single row
// <section aria-label="Custom">
//   <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4">
//     <p className="text-sm"><strong>Custom where it counts</strong> — onboarding NexMenu? We adapt printers, payments, workflows, SLAs.</p>
//     <a href="#contact" className="shrink-0 text-sm font-medium text-slate-900 hover:underline">Talk to us →</a>
//   </div>
// </section>
// Either keep components/expertise.tsx as this strip (simplify to ~30 lines) or inline in products.tsx/about.tsx — YAGNI: keep the file as the strip, drop 4-card grid.

// about/contact/footer: border-white/10 -> border-slate-200, bg-white/[0.03] -> bg-slate-50 or bg-white, muted was opacity-70 -> text-slate-600
```

- [ ] **Step 7: Wire `app/page.tsx`**

```tsx
import Hero from "@/components/hero";
import Products from "@/components/products";
import CustomStrip from "@/components/expertise"; // now the single strip, not 4-card
import About from "@/components/about";
import Contact from "@/components/contact";
export default function Page() {
  return (
    <main id="main">
      <Hero />
      <Products />
      <CustomStrip />
      <About />
      <Contact />
    </main>
  );
}
```

If stripping the file instead, delete `components/expertise.tsx` and inline the strip in `products.tsx` — either satisfies spec §5 (single strip, not 4 cards). Keep `main#main` for skip link.

- [ ] **Step 8: Update `tests/components.test.tsx` snapshots**

- Assert no `Client Portal` link.
- Assert hero heading `Two products. One partner.` (update from `Software for Malaysian businesses`).
- Assert product cards still `NexMenu → nexmenu.my`, `GeraiKu → geraiku.my` (unchanged).
- Assert nav header has light class `bg-[rgba(255,255,255,0.85)]` or `border-slate-200`.
- Keep 42/42 green — update any `toHaveClass("bg-[rgba(11,12,16,0.6)]")` assertions to light.

- [ ] **Step 9: Run tests and fix**

```bash
npm run typecheck && npm run lint -- --max-warnings=0
npm run test -- tests/components.test.tsx -v
npm run build
npx opennextjs-cloudflare build
```

Expected: PASS — typecheck/lint/build + opennextjs `Worker saved in .open-next/worker.js`. If snapshot mismatch, update `getByRole` text or `toHaveClass` to new tokens.

- [ ] **Step 10: Commit**

```bash
git add app/globals.css components/nav.tsx components/hero.tsx components/products.tsx components/expertise.tsx components/about.tsx components/contact.tsx components/ui/card.tsx components/footer.tsx app/page.tsx tests/components.test.tsx
git commit -m "feat: light holding — ink-blue paper, no portal, product-led hero + custom strip"
```

---

## Self-Review

**Spec coverage:** Spec §4 light tokens → Task 1 Steps 3-6; §3 IA (no portal, hero product-led, strip not 4-card, About trust anchor) → Steps 4,5,7; §2 infra unchanged (assets + nodejs runtime already deployed in `f6257d08`); §6 data flow / §7 testing acceptance → Step 9 `npm run ...` + 42/42. No gaps.

**Placeholder scan:** No `TBD/TODO` — all tokens (`#ffffff`, `#0f172a`, `#64748b`, `#e2e8f0`, `#f8fafc`), file paths (`app/globals.css:1`, `components/nav.tsx:1`, `wrangler.toml:8` already `assets`), copy lines (`Two products. One partner.`, `Custom where it counts — onboarding NexMenu?…`), and acceptance (`GET /api/health 200`, `/_next/static 200 via ASSETS`, `42/42`) are concrete.

**Type consistency:** `cn()` in `lib/utils.ts:4`, `ContactSchema` in `lib/contact.ts:8`, `verifyTurnstile` in `lib/turnstile.ts:5`, `checkRateLimit` in `lib/rate-limit.ts:27` unchanged — no cross-task rename between original plan (2026-08-20 landing) and this holding plan.
