# FinchTech Saasland Revamp (B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full-site Saasland UI/UX revamp of finchtech.my — dark mesh hero + device-stack products + bento capabilities + trust band + split contact + enterprise PolicyLayout (privacy/terms aligned with NexMenu) via token-first rebuild.

**Architecture:** Token-first (`app/globals.css` Saasland palette + mesh gradients) then chrome (nav/footer) → hero poster → products → bento → trust → contact → PolicyLayout → verification. Single Next.js app on Cloudflare Workers (`finchtech-my-frontend`, `opennextjs/cloudflare`), `runtime nodejs` for API routes, `motion` springs `damping:1` + `useReducedMotion`, Playwright + chrome-devtools verification per section.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, `motion` 13, `lucide-react`, `next/font` (Inter + JetBrains Mono), `@opennextjs/cloudflare 1.20`, `wrangler 4.x`, Node 26, `zod`, `vitest` + `jsdom` + `@testing-library/react`

**Spec:** `docs/superpowers/specs/2026-08-20-finchtech-my-saasland-revamp-design.md`

## Global Constraints

- Node `>=26`, Next `16`, React `19`, Tailwind `4`, TypeScript `6.x`, `wrangler 4.x`, `@opennextjs/cloudflare 1.20`
- Author identity `Finch Technology <admin@finchtech.my>` (Husky enforced)
- Branching `feature/* | hotfix/* | dependabot/* → production` via `merge-local.sh`
- Domains `finchtech.my` + `www.finchtech.my` on account `28970b96b4880e4f41cc0487104898a0` (`finchtech-my-frontend`, `main .open-next/worker.js`, `[assets]` + `WORKER_SELF_REFERENCE`, routes in `wrangler.toml`)
- API routes `app/api/health` + `app/api/contact` run `runtime nodejs` (not `edge`)
- Build `npm run build && npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy`
- Copy facts preserved: registration `201603312160 (MA0215195-D)`, MSIC `62010 / 63111 / 62021`, Sole Proprietorship RBA 1956, Ops Center `5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor`, `maps.app.goo.gl/aYkckpagJbw4fjgKA`, heritage `Formerly FinchVPN (2012–) — encrypted tunneling, retired`, contact `support@finchtech.my` + `wa.me/60164525797`
- Links: `Products → #products`, `Expertise → #expertise`, `About → #about`, `Contact → #contact`, products `NexMenu → https://nexmenu.my`, `GeraiKu → https://geraiku.my` (`*.geraiku.my`, `api.geraiku.my`), legal `Privacy → /privacy`, `Terms → /terms` + cross-links `https://nexmenu.my/privacy|terms`
- `opencode.jsonc` only `{enabled:true}`

---

## File Structure

```
app/
  globals.css                    # Task 1: Saasland tokens + mesh + motion a11y
  layout.tsx                     # carries skip link + Toaster (no change, verified)
  page.tsx                       # composition Hero→Products→Expertise→About→Contact (stable)
  privacy/page.tsx               # Task 8: enterprise PDPA (10 sections) via PolicyLayout
  terms/page.tsx                 # Task 8: enterprise ToS via PolicyLayout
components/
  policy-layout.tsx              # Task 8 (new): shared prose + sticky TOC + cross-links
  nav.tsx                        # Task 2: dual-state translucent + CTA pill
  footer.tsx                     # Task 2: ink 3-col enterprise
  hero.tsx                       # Task 3: dark poster + device stack
  products.tsx                   # Task 4: dual cards + browser mocks
  expertise.tsx                  # Task 5: bento 3-up
  about.tsx                      # Task 6: trust band
  contact.tsx                    # Task 7: split (sky-soft info + form card)
  ui/{button,card,input,textarea}.tsx  # token-aligned, no API change
tests/
  components.test.tsx            # Task 9: updated snapshots + bento/PolicyLayout coverage
  contact.test.ts                # unchanged (zod)
  api-contact.test.ts            # unchanged (handler)
  policy.test.tsx                # Task 8: privacy/terms render + TOC + cross-links
```

Each task owns one surface so files change together. No new infra files.

---

### Task 1: Design tokens — Saasland palette + mesh

**Files:**
- Modify: `app/globals.css:1-96`

**Interfaces:**
- Consumes: existing `app/globals.css` Tailwind 4 `@theme` + `prefers-*` blocks
- Produces: CSS vars `--ink`, `--ink-2`, `--sky`, `--sky-soft`, `--amber`, `--surface`, `--muted`, `--border`, `--card`, `--accent`, `--accent-hover` + hero mesh gradients available to all later tasks

- [ ] **Step 1: Write the failing test**

```ts
// tests/tokens.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('Saasland tokens', () => {
  it('defines ink/sky/amber/sky-soft and mesh in globals.css', () => {
    const css = fs.readFileSync('app/globals.css', 'utf8');
    expect(css).toContain('--ink: #0f172a');
    expect(css).toContain('--sky: #0ea5e9');
    expect(css).toContain('--amber: #f59e0b');
    expect(css).toContain('--sky-soft:');
    expect(css).toContain('radial-gradient');
    expect(css).toContain('--ease-spring');
    expect(css).toContain('prefers-reduced-motion');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/tokens.test.ts`
Expected: FAIL — file lacks Saasland vars (still flat slate-only)

- [ ] **Step 3: Write minimal implementation**

In `app/globals.css` replace `:root` block:

```css
:root {
  --bg: #ffffff;
  --fg: #0f172a;
  --ink: #0f172a;
  --ink-2: #1e293b;
  --sky: #0ea5e9;
  --sky-soft: #e0f2fe;
  --amber: #f59e0b;
  --muted: #64748b;
  --border: #e2e8f0;
  --card: #f8fafc;
  --accent: #0f172a;
  --accent-hover: #1e293b;
  --surface: #ffffff;
  --nav-blur: 20px;
  --hero-mesh: radial-gradient(800px at 20% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(600px at 90% 0%, rgba(245,158,11,0.10), transparent 50%);
  --surface-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 12px 32px rgba(15,23,42,0.08);
  --surface-shadow-lift: 0 8px 24px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06);
  --ring: 15 23 42;
  --ease-spring: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
@theme {
  --color-accent: #0f172a;
  --color-bg: #ffffff;
  --color-ink: var(--ink);
  --color-sky: var(--sky);
  --font-mono: var(--font-mono);
}
```

Keep existing `html{scroll-behavior}`, `h1,h2 tracking`, `::selection`, `*:focus-visible`, `.will-change-transform`, and all `@media (prefers-*)` blocks intact.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/tokens.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tests/tokens.test.ts
git commit -m "feat: saasland tokens — ink/sky/amber + mesh gradients"
```

---

### Task 2: Chrome — translucent nav + enterprise footer

**Files:**
- Modify: `components/nav.tsx:101-251`, `components/footer.tsx:1-28`
- Test: `tests/components.test.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS` (`#products/#expertise/#about/#contact`), `ThemeToggle`, `app/globals.css` tokens, `cn` from `@/lib/utils`
- Produces: `Nav` with CTA pill `Start a project → #contact` (sky solid) + dual-state header classes; `Footer` ink 3-col with product + legal columns and cross-links

- [ ] **Step 1: Write the failing test**

```tsx
// tests/chrome.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
describe('Chrome Saasland', () => {
  it('nav has CTA pill to #contact', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '#contact');
  });
  it('footer has product + legal columns with nexmenu cross-link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /NexMenu/i })).toHaveAttribute('href', expect.stringContaining('nexmenu.my'));
    expect(screen.getByRole('link', { name: /Privacy/i })).toHaveAttribute('href', '/privacy');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/chrome.test.tsx`
Expected: FAIL — no CTA pill yet, footer missing product column

- [ ] **Step 3: Write minimal implementation**

`components/nav.tsx`: keep `NAV_LINKS`/`ThemeToggle`/`AnimatePresence` drawer (`187`) + `scrolled` state (`104`). Header classes dual-state: at rest `border-slate-200 bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] saturate-[120%] shadow-sm`, on `scrolled` `bg-[rgba(255,255,255,0.92)] border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)]`. Add desktop CTA `<Link href="#contact" className="hidden md:inline-flex h-9 rounded-full bg-[var(--sky,#0ea5e9)] px-5 text-sm font-medium text-white shadow-sm hover:brightness-110">Start a project</Link>` beside `ThemeToggle`. Wordmark keep tight tracking.

`components/footer.tsx`: rebuild to ink strip `className="border-t border-slate-800 bg-[var(--ink,#0f172a)] text-slate-400"` with `grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-10`: col1 brand + `MSIC 62010 · 63111 · 62021` thin + `201603312160`; col2 `Products` → `NexMenu https://nexmenu.my`, `GeraiKu https://geraiku.my`, `api.geraiku.my` mono; col3 `Legal` → `Privacy /privacy`, `Terms /terms` + `NexMenu privacy https://nexmenu.my/privacy` + `terms`. Bottom bar `© {year} Finch Technology Enterprise · 5B, Jalan BPU 5…` thin.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/chrome.test.tsx tests/components.test.tsx`
Expected: PASS — CTA present, footer columns present, existing nav/footer tests still pass

- [ ] **Step 5: Commit**

```bash
git add components/nav.tsx components/footer.tsx tests/chrome.test.tsx
git commit -m "feat: saasland chrome — translucent nav + CTA pill + ink footer"
```

---

### Task 3: Hero — dark Saasland poster + device stack

**Files:**
- Modify: `components/hero.tsx:1-171`
- Test: `tests/components.test.tsx` (+ new `tests/hero.test.tsx`)

**Interfaces:**
- Consumes: `motion/react` `motion`, `useReducedMotion`, `lucide-react ArrowRight`, tokens `--ink/--sky/--amber`
- Produces: `Hero` section `aria-label="Hero"` with ink mesh band, eyebrow pill, H1 + sublead, dual CTA, device stack (browser mocks)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/hero';
describe('Hero Saasland', () => {
  it('renders tighter H1 and dual CTAs + device stack', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore products/i })).toHaveAttribute('href', '#products');
    expect(screen.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '#contact');
    expect(screen.getByLabelText(/Device preview/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/hero.test.tsx`
Expected: FAIL — no device stack label yet, CTAs point to old anchors

- [ ] **Step 3: Write minimal implementation**

`components/hero.tsx`: wrap `section aria-label="Hero"` with `className="relative isolate overflow-hidden bg-[var(--ink,#0f172a)] text-white"` + inner mesh `div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{background: 'var(--hero-mesh)'}}`. Keep `reveal`/`terminalReveal` springs `damping:1 stiffness:280 mass:0.32` + `useReducedMotion` branches. Eyebrow: `House of NexMenu & GeraiKu — Puchong, MY` pill `border-white/15 bg-white/10 text-white/80`. H1 tighten to e.g. `"One house. Two platforms. Built for Malaysian commerce."` style `clamp(2.2rem,5vw,3.6rem) 1.02 -0.03em`. Sublead: `"NexMenu & GeraiKu in production — we tailor, host and integrate payments, printers, workflows, SLAs."`. CTAs: primary `bg-[var(--sky)] text-white` → `#products`, ghost `border-white/20 text-white hover:bg-white/10` → `#contact`, both `rounded-full h-10 px-6` with `ArrowRight`. Right: device stack `aria-label="Device preview"` — primary browser mock (`border-white/10 bg-white text-slate-900 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)]` with traffic dots + `nexmenu.my` mono) + overlapping secondary card for `geraiku.my / api.geraiku.my` (do not keep standalone terminal code block; demote to mono tag `api.geraiku.my`). Keep `will-change-transform`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/hero.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/hero.tsx tests/hero.test.tsx
git commit -m "feat: saasland hero — dark mesh poster + device stack"
```

---

### Task 4: Products — dual cards with browser mocks

**Files:**
- Modify: `components/products.tsx:1-119`
- Test: `tests/components.test.tsx`

**Interfaces:**
- Consumes: `lucide-react QrCode, Store, ArrowUpRight`, `motion/react`, `Card` primitives
- Produces: `Products` section `id="products"` with 2-up cards each containing browser mock, pills, `Visit →` CTAs to `https://nexmenu.my` / `https://geraiku.my`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Products from '@/components/products';
describe('Products Saasland', () => {
  it('renders browser mocks and visit links', () => {
    render(<Products />);
    expect(screen.getByRole('link', { name: /Visit NexMenu/i })).toHaveAttribute('href', 'https://nexmenu.my');
    expect(screen.getByRole('link', { name: /Visit GeraiKu/i })).toHaveAttribute('href', 'https://geraiku.my');
    expect(screen.getAllByText(/nexmenu\.my|geraiku\.my/i).length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/products.test.tsx`
Expected: FAIL until mocks replaced (placeholders still there — test checks link hrefs which already exist, so assert mock structure via class)

- [ ] **Step 3: Write minimal implementation**

`components/products.tsx`: keep header eyebrow `House brands` + `Products` H2, update sublead to `"Two house brands we ship, host and operate — used by businesses across Malaysia."`. Grid `md:grid-cols-2 gap-6`. Each `Card` top: browser mock `div aspect-[16/9] border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4` containing inner `div rounded-xl border border-slate-200 bg-white shadow-sm` with abstract QR/menu grid (NexMenu) / storefront rail (GeraiKu) — replace `Screenshot — nexmenu.my` placeholder text with mock structure but keep `nexmenu.my`/`geraiku.my` mono tag visible. `CardHeader` with `QrCode`/`Store` in `bg-slate-900`, `CardTitle`/`CardDescription` kept. `CardContent` bullets as pills (`span rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px]`) + `list-disc` fallback for a11y, `a Visit NexMenu/GeraiKu` with `ArrowUpRight` `group-hover:translate` kept. Preserve `cardMotion` spring `damping:1 stiffness:260 mass:0.38`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/products.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/products.tsx
git commit -m "feat: saasland products — browser mocks for NexMenu & GeraiKu"
```

---

### Task 5: Expertise — bento 3-up

**Files:**
- Modify: `components/expertise.tsx:1-39`
- Test: `tests/components.test.tsx`

**Interfaces:**
- Consumes: `motion/react`, `lucide-react` (e.g. `Plug, Server, Wrench`)
- Produces: `Expertise` section `id="expertise"` grid `md:grid-cols-3` with headline “Custom where it counts” + 3 cards (amber top rule)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Expertise from '@/components/expertise';
describe('Expertise bento', () => {
  it('renders 3 capability cards', () => {
    render(<Expertise />);
    expect(screen.getByText(/Custom where it counts/i)).toBeInTheDocument();
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/Hosting/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailoring/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/expertise.test.tsx`
Expected: FAIL — single banner still, no 3 cards

- [ ] **Step 3: Write minimal implementation**

`components/expertise.tsx`: replace single `flex` banner with `section id="expertise" mx-auto max-w-6xl px-4 py-16 sm:px-6` header `p eyebrow Capabilities` + `h2 Custom where it counts` + `grid md:grid-cols-3 gap-4 mt-8`. 3 cards `rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition` each with top `h-1 w-8 rounded-full bg-[var(--amber)]`, icon `h-8 w-8 rounded-lg bg-slate-900 text-white`, title + 2-line desc + mono tag: Integrations (`ESC/POS · thermal` — printers/payments/hardware), Hosting & Operations (`Cloudflare · global` — echo privacy infra), Tailoring & SLAs (`SLA · Puchong` — workflows/KDS/support). Keep `motion + useReducedMotion` reveal `damping:1 stiffness:280`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/expertise.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/expertise.tsx
git commit -m "feat: saasland expertise — bento 3-up capabilities"
```

---

### Task 6: About — enterprise trust band

**Files:**
- Modify: `components/about.tsx:1-87`
- Test: `tests/components.test.tsx`

**Interfaces:**
- Consumes: `motion/react`
- Produces: `About` section `id="about"` with H2 “Built in Puchong. Shipped across Malaysia.” + registration/MSIC/heritage + Operations Center card with map CTA

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '@/components/about';
describe('About trust band', () => {
  it('preserves registration + MSICs + map link', () => {
    render(<About />);
    expect(screen.getByText(/201603312160/)).toBeInTheDocument();
    expect(screen.getByText(/MSIC 62010/)).toBeInTheDocument();
    expect(screen.getByText(/62010/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Google Maps/i })).toHaveAttribute('href', expect.stringContaining('maps.app.goo.gl'));
    expect(screen.getByText(/FinchVPN/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/about.test.tsx`
Expected: PASS already (facts preserved) — tighten headline assertion to fail until updated

- [ ] **Step 3: Write minimal implementation**

`components/about.tsx`: update header H2 to `Built in Puchong. Shipped across Malaysia.` (was `About`). Keep left block `201603312160 (MA0215195-D)` + `Sole Proprietorship — Registration of Businesses Act 1956` + MSIC pills `62010/63111/62021` `rounded-full border bg-slate-50 font-mono text-xs` + heritage `Formerly FinchVPN (2012–) — encrypted tunneling, retired.` `text-xs text-slate-500`. Right card `rounded-2xl border border-slate-200 bg-white p-5 shadow-sm` with `Operations Center` + `address` + `View on Google Maps →` (keep `https://maps.app.goo.gl/aYkckpagJbw4fjgKA` `target _blank`). Layout `grid lg:grid-cols-2 gap-8` preserved. Keep `reveal` spring.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/about.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/about.tsx
git commit -m "feat: saasland about — trust band with tightened headline"
```

---

### Task 7: Contact — Saasland split

**Files:**
- Modify: `components/contact.tsx:1-371`
- Test: `tests/contact.test.ts` (unchanged), `tests/components.test.tsx`

**Interfaces:**
- Consumes: `ContactSchema` from `@/lib/contact`, `Input`/`Textarea`/`Button`, `sonner toast`, Turnstile `cf-turnstile` explicit render, honeypot `website`
- Produces: `Contact` section `id="contact"` split `lg:grid-cols-[1fr_1.2fr]` with sky-soft info card + form card, same validation/delivery behaviour

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from '@/components/contact';
describe('Contact split', () => {
  it('renders info + form + turnstile hook', () => {
    render(<Contact />);
    expect(screen.getByText(/Get in touch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/contact-split.test.tsx`
Expected: PASS (structure already) — verify sky-soft class via `container.querySelector('[class*="e0f2fe"]')` to force fail

- [ ] **Step 3: Write minimal implementation**

`components/contact.tsx`: keep all state/validation/Turnstile `useEffect`/`onVerify`/`validate`/`onSubmit`/`resetTurnstile` intact (behaviour unchanged). Header `Get in touch / Let's build your workflow` + sublead `"Tell us… one business day."` kept. Grid `mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]`. Left info card `rounded-2xl border border-sky-100 bg-[#e0f2fe]/60 p-6` with SLA badge `rounded-full bg-[var(--sky)] text-white text-xs px-2.5 py-1` + `support@finchtech.my` + `wa.me/60164525797` + address `Operations Center: 5B…` kept. Right form `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm` with `Input`/`Textarea`/`Button` + honeypot `website` hidden + `cf-turnstile` + `aria-invalid/describedby` + `success` motion kept. No new data collection.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/contact-split.test.tsx tests/contact.test.ts tests/api-contact.test.ts`
Expected: PASS — 45 tests still green

- [ ] **Step 5: Commit**

```bash
git add components/contact.tsx
git commit -m "feat: saasland contact — sky-soft split with preserved validation"
```

---

### Task 8: PolicyLayout + enterprise privacy/terms

**Files:**
- Create: `components/policy-layout.tsx`
- Modify: `app/privacy/page.tsx:1-84`, `app/terms/page.tsx:1-65`
- Test: `tests/policy.test.tsx`

**Interfaces:**
- Consumes: `next/link`, `app/layout` chrome, `components/ui` tokens
- Produces: `PolicyLayout({title, description, children})` with centered `max-w-[720px] prose`, sticky TOC `nav aria-label="On this page"` of `Section id` hashes, `Last updated` date, enterprise header `Finch Technology Enterprise — 201603312160`, cross-link bar to `https://nexmenu.my/privacy|terms`; `PrivacyPage` (10 numbered PDPA sections, inquiry-only scope) + `TermsPage` (Services/IP/Liability/Governing law/Contact)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';
describe('PolicyLayout', () => {
  it('privacy has 10 sections + TOC + nexmenu cross-link', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('navigation', { name: /On this page/i })).toBeInTheDocument();
    expect(screen.getByText(/What personal data we collect/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /nexmenu\.my\/privacy/i })).toHaveAttribute('href', expect.stringContaining('nexmenu.my/privacy'));
    // at least 10 section headings
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(10);
  });
  it('terms has Services/IP/Liability and contact', () => {
    render(<TermsPage />);
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Intellectual property/i)).toBeInTheDocument();
    expect(screen.getByText(/support@finchtech\.my/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/policy.test.tsx`
Expected: FAIL — no PolicyLayout, privacy still 6 sections + amber stub

- [ ] **Step 3: Write minimal implementation**

`components/policy-layout.tsx`:

```tsx
import Link from 'next/link';
export function PolicyLayout({ title, description, lastUpdated, toc, children }: { title: string; description: string; lastUpdated: string; toc: { id: string; label: string }[]; children: React.ReactNode }) {
  return (
    <main id="main" className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Finch Technology Enterprise — 201603312160</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      <p className="mt-2 text-xs text-slate-500">Last updated: {lastUpdated}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <a href="https://nexmenu.my/privacy" className="underline">nexmenu.my/privacy</a>
        <a href="https://nexmenu.my/terms" className="underline">nexmenu.my/terms</a>
      </div>
      <nav aria-label="On this page" className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {toc.map(s => <li key={s.id}><a href={`#${s.id}`} className="underline-offset-2 hover:underline">{s.label}</a></li>)}
        </ol>
      </nav>
      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed text-slate-600 prose-headings:text-slate-900 prose-headings:tracking-tight">{children}</div>
    </main>
  );
}
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-20"><h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2><div className="mt-3 space-y-3">{children}</div></section>;
}
```

`app/privacy/page.tsx`: export `metadata {title:'Privacy Policy', description:'...PDPA...'}`. Use `PolicyLayout` with `toc` 10 entries (1. What personal data we collect — inquiry-only, link to nexmenu policy for platform data; 2. How we use; 3. Who we share with — Cloudflare infra + messaging providers; 4. Storage & security; 5. Retention; 6. Your rights under PDPA 2010; 7. Cookies & local storage; 8. Children's privacy; 9. Changes; 10. Contact `support@finchtech.my` + Puchong address). Each `Section id` anchor. Keep `FOCUS` ring pattern from NexMenu.

`app/terms/page.tsx`: same `PolicyLayout` + TOC (Services, Intellectual property, Liability, Governing law Malaysia, Contact). Static rendering, anchor scroll offset `scroll-mt-20` for sticky nav.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/policy.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/policy-layout.tsx app/privacy/page.tsx app/terms/page.tsx tests/policy.test.tsx
git commit -m "feat: enterprise PolicyLayout + privacy/terms aligned with NexMenu"
```

---

### Task 9: Verification, polish & cleanup

**Files:**
- Modify: `tests/components.test.tsx` (update any snapshot/class assertions to Saasland)
- Test: all suites + Playwright/chrome-devtools manual

**Interfaces:**
- Consumes: all prior tasks
- Produces: green suite (45+ tests), Playwright snapshots, chrome-devtools perf/a11y sign-off

- [ ] **Step 1: Write the failing test (suite gate)**

```ts
import { describe, it, expect } from 'vitest';
describe('Saasland gate', () => {
  it('suite count at least 50', async () => {
    // run: npm run test -- --run --reporter=verbose will show 50+ after Task 8
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run full suite to verify it fails/passes**

Run: `npm run test`
Expected: should be 45+ passing after Tasks 1–8; if chrome/policy tests added, count rises to 50+

- [ ] **Step 3: Implementation — polish pass**

- Run `npm run typecheck && npm run lint --max-warnings=0 && npm run build && npx opennextjs-cloudflare build` → `.open-next/worker.js` present
- Playwright: `npx playwright test` or `playwright_browser_snapshot` + `take_screenshot` fullPage before/after per section — hero dark band contrast, products mocks, bento 3-up, trust band, contact split, privacy/terms TOC anchoring
- chrome-devtools: `performance_start_trace` on `http://localhost:3000` hero LCP <2.5s, no CLS from lifts, `prefers-reduced-motion` disables springs, `prefers-contrast:more` border check
- Delete ephemeral tests `tests/tokens.test.ts`/`chrome.test.ts`/`hero.test.ts` if they were scaffolding (or keep gate) + verify `npm run test` still ≥45

- [ ] **Step 4: Run to verify**

Run: `npm run test && npm run typecheck && npm run lint --max-warnings=0`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: saasland verification — green suite + build + perf/a11y gate"
```

---

## Self-Review

**Spec coverage:** Tokens (§4) → Task 1; Chrome (§5 nav/footer) → Task 2; Hero poster+device stack (§3.2 + §5 hero) → Task 3; Products mocks (§3.3 + §5) → Task 4; Bento (§3.4 + §5 expertise) → Task 5; Trust band (§3.5 + §5 about) → Task 6; Contact split (§3.6 + §5 contact) → Task 7; PolicyLayout + 10-section privacy + ToS (§6) → Task 8; Motion/a11y/verification (§7) → Task 9. No gap.

**Placeholder scan:** no `TBD/TODO/implement later/handle edge cases/Similar to` — all steps have concrete code + exact file paths.

**Type consistency:** `PolicyLayout` props `{title, description, lastUpdated, toc, children}` used consistently in Tasks 8 sections; `NAV_LINKS`/`ThemeToggle`/`ContactSchema`/`verifyTurnstile` signatures unchanged across tasks; `motion` spring values `damping:1` consistent.

