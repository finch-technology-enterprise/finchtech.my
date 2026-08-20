# FinchTech.my — Saasland UI/UX Revamp (B) Design Spec

**Date:** 2026-08-20
**Status:** Draft for review → then `writing-plans`
**Repo:** `finch-technology-enterprise/finchtech.my` (`production`)
**Domain:** `finchtech.my` + `www.finchtech.my` on `28970b96b4880e4f41cc0487104898a0` (`finchtech-my-frontend`)
**Stack:** Next 16 / React 19 / Tailwind 4 / `motion 13` / `lucide-react` / `next/font` Inter + JetBrains Mono / `@opennextjs/cloudflare 1.20` / `wrangler 4.x` / Node 26
**Visual companion:** `http://localhost:50164/?key=72e17a716a4e5647cd4b50ae76d20d6cb38579168ca72ed837b65a9591760ebd` — user picked **B — Saasland-inspired** (dark mesh hero + bento + stats)
**ThemeForest references:** `Stratus` (13.2K, SaaS poster), **`Saasland` (8.9K, 56 demos, SaaS + IT Solutions — selected)**, `Engitech` (6.5K, IT Services)
**Source truth — current code:** `app/page.tsx:1` (Hero→Products→Expertise→About→Contact), `app/globals.css:1` (slate-only tokens), `components/nav.tsx:101` + `hero.tsx:1` + `products.tsx:1` + `expertise.tsx:1` + `about.tsx:1` + `contact.tsx:1` + `footer.tsx:1`, `app/privacy/page.tsx:1` + `app/terms/page.tsx:1` (stubs)
**Legal precedent:** `../NexMenu/packages/frontend/src/app/privacy/page.tsx:1` + `PolicyLayout` (10 numbered PDPA sections, FOCUS ring `privacy/page.tsx:8`, Section pattern `privacy/page.tsx:12`)

---

## 1. Goal

Full-site **Saasland** UI/UX revamp — token-first rebuild (Approach A) — transforming finchtech.my from a competent but flat light holding into a **ThemeForest-grade premium SaaS + enterprise hybrid** that sells the house truth: **two platforms in production (NexMenu `nexmenu.my` + GeraiKu `geraiku.my` / `*.geraiku.my` / `api.geraiku.my`) + we tailor, host and integrate them (printers, payments, workflows, SLAs) from Puchong**.

Light copy polish throughout (tighter headlines, same facts): registration `201603312160 (MA0215195-D)`, MSIC `62010 / 63111 / 62021`, Sole Proprietorship RBA 1956, Operations Center `5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong` + `maps.app.goo.gl/aYkckpagJbw4fjgKA`, heritage `Formerly FinchVPN (2012–) — retired`, contact `support@finchtech.my` + `wa.me/60164525797` — all preserved.

Scope is **full-site reskin**: landing (`/`) + shared chrome (`nav`/`footer`) + **enterprise policy system** (`/privacy` + `/terms` via shared `PolicyLayout` aligned with NexMenu's structure, cross-linking `nexmenu.my/privacy|terms` for product-specific data).

Success: at a glance the holding reads as a platform house (dark hero + device mocks + bento capabilities + trust band), both products are one click away (`Visit →` with `ArrowUpRight` retained), legal pages carry PDPA rigor matching NexMenu, motion stays Apple-grade (`motion` springs + `useReducedMotion`), and Playwright + Chrome DevTools audits are green (no visual regression, LCP <2.5s, WCAG AA, 0 console errors).

---

## 2. Architecture (no infra change)

- **Worker:** `finchtech-my-frontend`, `main .open-next/worker.js`, `compatibility_date 2026-08-20`, `nodejs_compat`, `account 28970b96…`, `workers_dev true`, `routes finchtech.my/* + www.finchtech.my/*`, `[assets] directory .open-next/assets binding ASSETS` + `WORKER_SELF_REFERENCE` (as fixed in prior `f6257d08` deploy).
- **API routes:** `app/api/health` + `app/api/contact` remain `runtime nodejs` (not `edge` — avoids Turbopack edge + OpenNext `TypeError: Cannot read properties of undefined (reading 'default')`).
- **Build:** `npm run build && npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` → `finchtech.my`.
- **Constraint:** `engines node >=26`, author `Finch Technology <admin@finchtech.my>`, `feature/*|hotfix/*|dependabot/* → production`.

---

## 3. Information Architecture — Saasland

1. **Nav** — `Finch Technology Enterprise` | `Products · Expertise · About · Contact` + primary CTA pill `Start a project → #contact` (Saasland always shows conversion). `Client Portal` not reintroduced. Sticky translucent material with scrolled state.
2. **Hero — dark Saasland poster** — ink mesh band, eyebrow pill `House of NexMenu & GeraiKu — Puchong, MY`, tightened H1 (e.g. *"One house. Two platforms. Built for Malaysian commerce."*), sublead (*"NexMenu & GeraiKu in production — we tailor, host and integrate payments, printers, workflows, SLAs."*), dual CTA (`Explore products → #products` sky solid + `Start a project → #contact` ghost on ink), right device stack (primary browser mock `nexmenu.my` QR/KDS + overlapping `geraiku.my` storefront/API card) replacing terminal code block.
3. **Products — dual SaaS cards with device mocks** — header `House brands / Platforms in production`, 2-up `md:grid-cols-2`, **NexMenu** (`QrCode` → `https://nexmenu.my`: QR, KDS, live table tracking) + **GeraiKu** (`Store` → `https://geraiku.my`: `*.geraiku.my` storefronts, `api.geraiku.my`, orders/catalog/tenancy). Each: gradient browser mock replacing `Screenshot — nexmenu.my` placeholder, mono pill tags, `Visit →` with `ArrowUpRight`.
4. **Expertise — bento 3-up** — headline keeps current line as H2: *"Custom where it counts"*, 3 cards with amber rule + `lucide` icons: Integrations (printers/payments/hardware), Hosting & Operations (Cloudflare infra — echo `NexMenu privacy/page.tsx:110`), Tailoring & SLAs (workflows, KDS rules, support). `grid md:grid-cols-3`.
5. **About — enterprise trust band** — H2 *"Built in Puchong. Shipped across Malaysia."*, left registration/MSIC/heritage block, right Operations Center card (`5B, Jalan BPU 5…` + `View on Google Maps →`) with elevated map/plinth texture.
6. **Contact — split** — header `Get in touch / Let's build your workflow`, left info card on `sky-soft` tint (`support@finchtech.my` + `wa.me/60164525797` + address + SLA badge), right form card (same `ContactSchema` + honeypot + Turnstile + `Button`/`Input`/`Textarea` + `sonner` toast).
7. **Footer — enterprise ink strip** — `bg-ink` 3-col: brand + MSIC thin, product column (`NexMenu`/`GeraiKu`/`api.geraiku.my`), legal column (`Privacy`/`Terms` + cross-links `nexmenu.my/privacy|terms`), bottom bar `© 2026 Finch Technology Enterprise · 201603312160 · Puchong`.
8. **Legal — `/privacy` + `/terms` via `PolicyLayout`** — see §6.

Anchors `href="#products"` etc retain smooth scroll; `prefers-reduced-motion: reduce` → instant jump.

---

## 4. Visual system — Saasland tokens

Replaces `app/globals.css:1` flat slate tokens; components keep structure, only tokens shift.

- **Palette:** `--ink: #0f172a` (hero/footer), `--ink-2: #1e293b`, `--sky: #0ea5e9` (primary CTA/accents), `--sky-soft: #e0f2fe` (contact info tint), `--amber: #f59e0b` (bento rule/stats accent), `--surface: #ffffff`, `--muted: #64748b`, `--border: #e2e8f0`, `--card: #f8fafc`.
- **Mesh hero:** `radial-gradient(800px at 20% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(600px at 90% 0%, rgba(245,158,11,0.10), transparent 50%)` on `var(--ink)`.
- **Type:** keep `next/font` `Inter` + `JetBrains_Mono variable --font-mono` (`app/layout.tsx:8`). Display tracking `-0.025em` on `h1/h2` (`globals.css:41` tightened to `-0.03em` for hero), hero `clamp(2.2rem,5vw,3.6rem) lh 1.02`, body `text-slate-600` `leading-relaxed`.
- **Radii/shadows:** `rounded-2xl` (cards), `rounded-full` (pills), `shadow-[0_1px_3px_rgba(15,23,42,0.06),0_12px_32px_rgba(15,23,42,0.08)]` layered for hero/device stack.
- **Nav material (dual-state):** at rest `bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] saturate-[120%] border-slate-200 shadow-sm` (`nav.tsx:133`), on `scrolled` (`nav.tsx:104`) → `bg-[rgba(255,255,255,0.92)] border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)]` — preserves `saturate[120%]` + `supports-[backdrop-filter]` fallback (`nav.tsx:131`).
- **Motion tokens:** `--ease-spring: cubic-bezier(0.2,0.8,0.2,1)`, `--ease-out: cubic-bezier(0.16,1,0.3,1)` (`globals.css:21`), `will-change-transform` for card lifts.

---

## 5. Component plan

- **`app/globals.css`** — rebuild `:root` + `[data-theme]` + `@theme --color-*` to Saasland tokens + mesh vars; keep `scroll-behavior` + `prefers-reduced-motion/transparency` + `prefers-contrast:more` a11y blocks (`globals.css:59–91`) + `::selection` + `focus-visible` rings.
- **`app/layout.tsx`** — keep `Inter`/`JetBrains_Mono` + `metadata` (title *Finch Technology Enterprise | Software for Malaysian Businesses*, OG `1200×630`), `Skip to content` (`layout.tsx:62`), `Toaster`.
- **`components/nav.tsx`** — dual-state translucent nav, brand wordmark refined (tight tracking + mono dot), `NAV_LINKS:9` as pill-hover, `ThemeToggle:28` kept, add primary CTA pill `Start a project → #contact`, retain mobile `AnimatePresence` drawer (`nav.tsx:187`) spring `stiffness:300` + `prefers-reduced-motion` fallback (`nav.tsx:105`).
- **`components/hero.tsx`** — rebuild to Saasland poster per §3; replace terminal block (`hero.tsx:122–167`) with device stack; keep `reveal`/`terminalReveal` spring pattern (`hero.tsx:10–30`) + `useReducedMotion` + `will-change-transform`.
- **`components/products.tsx`** — dual cards with browser mocks replacing placeholders (`products.tsx:42–44`), feature bullets `57–60`/`95–99` as mono pills + `list-disc` fallback, keep `cardMotion` spring (`products.tsx:10–18`) + `ArrowUpRight` CTAs.
- **`components/expertise.tsx`** — replace single banner (`expertise.tsx:20`) with bento 3-up per §3; keep `motion + useReducedMotion` pattern (`expertise.tsx:7`).
- **`components/about.tsx`** — trust band per §3; keep `reveal` (`about.tsx:7`) + registration/MSIC pills (`about.tsx:42–52`) + heritage line (`about.tsx:54`) + map CTA (`about.tsx:69`).
- **`components/contact.tsx`** — split per §3; keep `ContactSchema` + honeypot `website` (`contact.tsx:247`) + Turnstile `cf-turnstile` explicit render (`contact.tsx:328–351`) + `aria-invalid/describedby` (`contact.tsx:271`) + `sonner` toasts; reskin to `sky-soft` + Saasland borders/radii.
- **`components/policy-layout.tsx` (new)** — see §6.
- **`components/footer.tsx`** — rebuild to ink 3-col per §3; expand from single line (`footer.tsx:5–27`) to enterprise chrome.
- **`components/ui/*`** — `button.tsx`/`card.tsx`/`input.tsx`/`textarea.tsx` — no API change, only token alignment (border `slate-200` → Saasland `border`, radius `xl`).

---

## 6. Legal — `/privacy` + `/terms` via `PolicyLayout`

Current `app/privacy/page.tsx:1` + `app/terms/page.tsx:1` are stubs (amber `Stub — owner to fill` + minimal sections). Rebuilt as **enterprise policy system** aligned with `NexMenu/src/app/privacy/page.tsx:1`:

- **Shared `PolicyLayout`** (`components/policy-layout.tsx`) — centered `max-w-[720px]` prose, sticky TOC anchor nav (hash list of `Section id`s), `Last updated` date, enterprise header (`Finch Technology Enterprise — 201603312160`), cross-link bar to product policies (`NexMenu Privacy → https://nexmenu.my/privacy`, `NexMenu Terms → https://nexmenu.my/terms`, `GeraiKu` when live). Mirrors NexMenu `Section` pattern (`privacy/page.tsx:12` h2 `text-xl font-bold text-ink` + `text-sm leading-relaxed text-gray-600` body) reskinned to ink/sky + `Inter` tight tracking. Preserves `FOCUS` ring pattern (`NexMenu privacy/page.tsx:8`).

- **`/privacy` — enterprise parent PDPA policy** (finchtech.my inquiries only, *not* platform merchant/customer data):
  1. What we collect — inquiry data (name/contact/message + IP + Turnstile token + server logs), *not* NexMenu merchant/customer fields — link to NexMenu policy for platform data (`NexMenu privacy/page.tsx:35–67`)
  2. How we use — respond to enquiries, operate/secure site, legal/fraud prevention
  3. Who we share with — Cloudflare infra (`NexMenu privacy/page.tsx:110` precedent), messaging providers for replies, regulators where required; product gateways/delivery providers stay in NexMenu policy
  4. Storage & security — Cloudflare global infra, encrypted secrets at rest, hashed passwords/short-lived tokens
  5. Retention — enquiry retention tied to request + legal/accounting, provider logs per provider policy
  6. Your rights under PDPA 2010 — access/correction/withdrawal/deletion (mirrors `NexMenu privacy/page.tsx:138–152`)
  7. Cookies & local storage — functional only, cart/table session where applicable
  8. Children's privacy — adult business service (mirrors `NexMenu privacy/page.tsx:162`)
  9. Changes — post updated policy + `Last updated` bump
  10. Contact — `support@finchtech.my` + `5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor` — same as `NexMenu privacy/page.tsx:179`.

- **`/terms` — enterprise Terms of Service** — same `PolicyLayout` + TOC: Services (custom dev/hosting/consultancy + NexMenu/GeraiKu products; scope via proposal/SOW), Intellectual property (pre-existing IP retained, deliverables licensed/assigned per agreement), Liability (as-is to extent permitted, aggregate cap tied to fees paid in 3 months — matches current stub `terms/page.tsx:45`), Governing law Malaysia, Contact (`support@finchtech.my` + Puchong address). Cross-reference `nexmenu.my/terms` + `nexmenu.my/customer-terms` for product-specific terms.

- **Behaviour:** static rendering (`export const metadata` title/description per route), anchor scroll with offset for sticky nav, no new data collection, `focus-visible` rings preserved. Stubs' `prose` + `text-slate-600` body kept but elevated to enterprise policy density.

---

## 7. Motion, accessibility & verification

**Motion** — preserve existing `motion` system: springs `type:spring damping:1 stiffness:280 mass:0.32` (`hero.tsx:15`, `products.tsx:17`) + `useReducedMotion` opacity-only fallbacks (`hero.tsx:11`, `products.tsx:12`), `AnimatePresence` drawer (`nav.tsx:187`) + `prefers-reduced-motion:reduce` global kill-switch (`globals.css:59` `animation-duration 0.01ms` + `transition-duration 0.01ms`) + per-component branches. Only `transform`/`opacity` (compositor-friendly, `will-change-transform` where imminent).

**Accessibility**
- Contrast: ink `#0f172a` on white + sky `#0ea5e9` pills validated to WCAG AA 4.5:1; amber `#f59e0b` as rule/icon only, never text-on-white.
- `prefers-reduced-transparency: reduce` → solid nav (`globals.css:73`), `prefers-contrast:more` → solid + `border-color: currentColor` (`globals.css:85`).
- Semantic: `section aria-label`, `nav aria-label="Primary"` (`nav.tsx:146`), `Skip to content` (`layout.tsx:62`), H1 once (hero) → H2 sections → H3 cards.
- Form: `aria-invalid`/`aria-describedby` (`contact.tsx:271`), honeypot `website` hidden (`contact.tsx:247`), Turnstile fallback message.

**Verification (Playwright / chrome-devtools)**
- Snapshot: `playwright_browser_snapshot` + `take_screenshot` (fullPage) before/after per section — hero, products, bento, about, contact, `PolicyLayout` privacy/terms (TOC anchoring).
- Functional (Playwright): `fill_form` + `click` for nav scroll, CTAs `#products`/`#contact`, `ThemeToggle`, mobile drawer, contact zod validation + honeypot silent `200` + Turnstile gating, privacy/terms anchor nav.
- Performance (chrome-devtools): `performance_start_trace` on hero load (LCP <2.5s, no CLS from `hover:-translate-y` lifts), check `prefers-reduced-motion` disables springs.

**Testing**
- Keep `vitest` suite: `ContactSchema` + `api/contact` (200/400/429/502) + component renders. Add: token/contrast checks, bento 3-up render, `PolicyLayout` TOC + cross-links, privacy/terms 10-section render.
- No breaking API: `app/page.tsx:7` composition order stable.

---

## 8. Deployment

No change beyond current `wrangler.toml` invariants: `finchtech-my-frontend`, `[assets]` + `WORKER_SELF_REFERENCE`, `routes finchtech.my/* + www.finchtech.my/*` (fixes `/_next/static/* 404` from `18e4174d` → resolved `f6257d08`). `open-next.config.ts` default, `npm run deploy` → `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. Secrets via `wrangler secret put` (Turnstile/Telegram/Brevo). Fonts via `next/font` (no external CSS), images via `next/image`.

---

## 9. Out of scope / deferred (YAGNI)

D1 persistence for contacts, R2/KV/AI/Durable Objects/cron, auth/dashboard, i18n (EN only, BM/ZH later), blog/changelog CMS, branded `og-image.png`/`favicon.png` beyond placeholders — all deferred as in `2026-08-20-finchtech-my-landing-design.md:217` + `2026-08-20-finchtech-my-light-holding-design.md:75`. Privacy/terms are static enterprise policies (no CMS).

---

## 10. Global constraints

Node 26, Next 16, React 19, Tailwind 4, TS 6.x, `wrangler 4.x`, `@opennextjs/cloudflare 1.20`, author `Finch Technology <admin@finchtech.my>`, `feature/*|hotfix/*|dependabot/* → production` via `merge-local.sh`, domain `finchtech.my` on `28970b96…`, `opencode.jsonc` `{enabled:true}` only.

---

## Spec self-review

- **Placeholder scan:** no `TBD/TODO` — all tokens (`#0f172a`/`#0ea5e9`/`#f59e0b`/`#e0f2fe`), mesh gradients, radii/shadows, file paths, MSICs, registration, addresses, routes, secrets, and copy tightenings are concrete.
- **Internal consistency:** Saasland B is consistent end-to-end — dark poster hero → device-led products → bento capabilities → trust band → split contact → ink footer → enterprise `PolicyLayout` with NexMenu cross-links. Single-app shape holds (no D1/KV), `wrangler.toml`/`open-next.config.ts` match fixed `f6257d08` deploy, motion/a11y reuse existing `globals.css:59–91` + `useReducedMotion` contracts.
- **Scope check:** focused — one revamp (tokens + 6 landing sections + chrome + 2 policy pages) — one implementation plan suffices after `C — Light SaaS hub` (`2026-08-20-finchtech-my-light-holding-design.md`) lineage.
- **Ambiguity check:** "house-of-brands vs consultancy" resolved — hero is platform-led (two products), consultancy lives as bento + contact SLA, not competing hero; enterprise legal is parent-only (inquiry data) with cross-links to `nexmenu.my/privacy|terms` for platform merchant/customer data — no ambiguity at implementation.

---

## Next: `writing-plans`

Spec approved → `docs/superpowers/plans/2026-08-20-finchtech-my-saasland-revamp.md` — task order: tokens (`globals.css`) → chrome (`nav`/`footer`) → hero (poster + device stack) → products (mocks) → bento (`expertise`) → trust (`about`) → contact split → `PolicyLayout` + `/privacy` + `/terms` → polish + Playwright/chrome-devtools verification.

