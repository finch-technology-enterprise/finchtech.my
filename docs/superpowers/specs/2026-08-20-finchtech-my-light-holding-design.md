# Finchtech.my — Light Holding (C) Design Spec

**Date:** 2026-08-20
**Status:** Draft for review → then `writing-plans`
**Repo:** `finch-technology-enterprise/finchtech.my` (`production`)
**Domain:** `finchtech.my` + `www.finchtech.my` on `28970b96b4880e4f41cc0487104898a0` (`finchtech-my-frontend`)
**Replaces visual direction from:** `docs/superpowers/specs/2026-08-20-finchtech-my-landing-design.md` (dark #0b0c10 / cyan #66fcf1, Client Portal in nav)
**Visual companion session:** `http://localhost:50164/?key=72e17a716a4e5647cd4b50ae76d20d6cb38579168ca72ed837b65a9591760ebd` — user picked **C — Light SaaS hub** (2026-08-20)
**Stack (unchanged):** Next 16 / React 19 / Tailwind 4 / `motion 13` / `next/font` Inter + JetBrains Mono / `@opennextjs/cloudflare 1.20` / `wrangler 4.x` / Node 26

---

## 1. Goal

Re-skin `https://finchtech.my` from a dark holding to a **light, trust-first enterprise holding** that sells **NexMenu (`nexmenu.my`) + GeraiKu (`geraiku.my`, `*.geraiku.my`, `api.geraiku.my`)** as equal SaaS products. Custom "enterprising solutions" (tailoring NexMenu/GeraiKu per tenant — printers, payments, workflows, SLAs) is a light add-on strip, not a hero. **No Client Portal link** in nav (per owner request). Palette references top Malaysian enterprise/tech peers (Exabytes light/outcome-led, StoreHub/EasyStore product-card), not a dark terminal theme. Keep Apple polish (springs, translucent materials, `prefers-reduced-motion 13`) retuned for light.

Success: `finchtech.my` reads as a credible enterprise holding at a glance (light, ink-blue, slate), both SaaS are one click away, holding credentials (MA0215195-D, MSIC 62010/63111/62021, Puchong ops center) anchor credibility low without competing with the product story, and all functional behavior from the deployed `f6257d08` build (routes, `GET /api/health`, `POST /api/contact` Turnstile+Telegram+Brevo, 42/42 tests, `[assets]` + `WORKER_SELF_REFERENCE`) stays green.

## 2. Architecture (no infra change)

- **Worker:** `finchtech-my-frontend`, `main .open-next/worker.js`, `compatibility_date 2026-08-20`, `nodejs_compat`, `account 28970b96b…`, `workers_dev true`, `routes finchtech.my/* + www.finchtech.my/*` (declarative in `wrangler.toml:8`, not UI), `[assets] directory .open-next/assets binding ASSETS` + `WORKER_SELF_REFERENCE` (fixes the `/_next/static/* 404` seen in deploy `18e4174d` — now resolved in `f6257d08`).
- **API routes:** `app/api/health` + `app/api/contact` run `runtime nodejs` (not `edge` — Turbopack edge + OpenNext was `TypeError: Cannot read properties of undefined (reading 'default')` on `GET /api/health`).
- **Build:** `npm run build && npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` → `finchtech.my`.
- **Constraint carried forward:** `engines node >=22`, author `Finch Technology <admin@finchtech.my>`, `feature/*|hotfix/*|dependabot/* → production`.

## 3. IA — C (Light SaaS hub)

Order: house-of-brands where the **products are the business**.

1. **Nav** — `Finch Technology Enterprise` | `Products · Company · Contact` (no `Client Portal`, no `Expertise` as top-level). Light translucent material (see §4). Theme toggle removed or kept as subtle affordance (preference: keep but de-emphasized — light is default, dark optional via `data-theme` not hero).
2. **Hero** — "Two products. One partner." (or approved sibling: "Platform for Malaysian businesses. Plus the team to customize it."). Equal weight to NexMenu + GeraiKu, not a capability pitch. One-line enterprise line *below* the products is optional, not hero.
3. **Products** — 2 equal cards **NexMenu → `nexmenu.my`** (QR ordering, KDS, table ops) + **GeraiKu → `geraiku.my`** (stores `*.geraiku.my`, `api.geraiku.my`, orders/catalog/tenancy). Cards are the most decorated elements on the page (border, `aspect-[16/9]` placeholder, `Visit →`). No FinchVPN card.
4. **Custom strip** — single row "Custom where it counts — onboarding NexMenu? We adapt printers/payments/workflows/SLAs." Links to `#contact`. Replaces the full `Expertise` 4-card section; keep MSIC + lifecycle detail for About if needed, but not as a top section.
5. **About** — FINCH TECHNOLOGY ENTERPRISE `201603312160 (MA0215195-D)`, MSIC `62010/63111/62021`, Sole Proprietorship (RBA 1956), Ops Center `5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong` + `maps.app.goo.gl/aYkckpagJbw4fjgKA`, heritage `Formerly FinchVPN (2012–) — retired` de-emphasized `text-xs opacity-50`. This is the sole credible-enterprise anchor.
6. **Contact** — `support@finchtech.my` + `wa.me/60164525797` + form (`name/contact/message` + Turnstile + honeypot + `sonner` toast, `fetch /api/contact`). Same `ContactSchema` / `checkRateLimit` / `verifyTurnstile` / `sendTelegram+sendEmail` as deployed `98225d8`.
7. **Footer** — `© Finch Technology Enterprise` + `Privacy` → `/privacy` + `Terms` → `/terms` (no `finchvpn.com` links).

Anchors `href="#products"` / `#contact` etc remain for smooth scroll (`prefers-reduced-motion: reduce` → `auto`).

## 4. Visual system — light-first

Replaces `app/globals.css:1` dark tokens and `components/nav.tsx:131` dark nav. Components (`components/ui/card.tsx:1`, `hero.tsx:33`, `products.tsx:30`, `about.tsx:1`) keep structure; only tokens shift.

- **Tokens:**
  - `--bg: #FFFFFF` (paper), `--fg: #0f172a` (slate-900 ink), `--muted: #64748b` (slate-500), `--border: #e2e8f0` (slate-200), `--card: #f8fafc` (slate-50), `--accent: #0f172a` (ink-blue — primary CTA `bg-[var(--accent)] text-white`, not cyan), `--accent-hover: #1e293b`. Accent cyan `#66fcf1` only as faint card hover `border-slate-900/10 → /20`. No dark section banding — all sections stay white/slate-50; `About`/`Contact` are not `bg #0b0c10`.
- **Type:** keep `next/font` `Inter` + `JetBrains_Mono variable --font-mono` (`app/layout.tsx:8`). Retune `apple-design:228`: hero `clamp(2.2rem,5vw,3.5rem) lh 1.05 tracking -0.02em` stays; body uses `text-slate-600` not `opacity-70` wash (better on light); muted helpers use `text-slate-500`.
- **Nav material (light):** `bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] saturate-[120%]` (not `rgba(11,12,16,0.6) saturate 180%`), `shadow-sm`, `border-slate-200`. Content scrolls under. Keep `supports-[backdrop-filter]` fallback from `nav.tsx:131`.
- **Cards:** `border-slate-200 bg-white` with `hover:-translate-y-[3px] hover:shadow-md` (not `hover:-translate-y-[5px] hover:border-[var(--accent,#66fcf1)]/40` on dark). Keep `transition` on `transform`/`opacity` only for motion.
- **Motion (apple-design:184, 88):** springs `damping 1.0 / response 0.3`, bounce `0.8` only for sheet — unchanged. On light, blur reads heavier, so `saturate` down to `120%`, `shadow` up. `prefers-reduced-motion: reduce` → opacity cross-fade + drop springs (keep `app/globals.css:23` `0.01ms` rule), `prefers-reduced-transparency` → solid nav.

## 5. Components & files touched

- `app/globals.css` — replace `:root` / `[data-theme]` / `--color-*` with light tokens; keep `scroll-behavior` + `prefers-*` a11y.
- `app/layout.tsx` — metadata description stays house-of-brands `Custom software development, hosting infrastructure… House of NexMenu & GeraiKu` (`layout.tsx:25`), OG/twitter already 1200×630, skip link stays.
- `components/nav.tsx` — delete `Client Portal` link, replace nav class to light translucent, keep `Products · Company · Contact` anchors + mobile sheet.
- `components/hero.tsx` — retitle to "Two products. One partner." sibling, recolor to light tokens, keep `motion/react` reveal (`transform`/`opacity` only, `useReducedMotion` fade).
- `components/products.tsx` — re-token borders/cards to light; keep `md:grid-cols-2` + `Visit →` outbound `target _blank`.
- `components/expertise.tsx` — replaced by the single "Custom where it counts" strip (either collapse this component to the strip or inline in `products.tsx`/`about.tsx` — YAGNI: one strip, not 4 cards).
- `components/about.tsx` + `components/contact.tsx` + `components/footer.tsx` — light borders (`border-slate-200`), same copy/validation.
- `wrangler.toml` — already correct (`assets` + `WORKER_SELF_REFERENCE` + `routes`); no change beyond prior `f6257d08` deploy fixes.
- `public/og-image.png` + `favicon.png` — remain placeholders until branded assets (spec §6 out of scope).

## 6. Data flow & error handling (unchanged)

`ContactSchema` (`lib/contact.ts:8` — `name` 1–100, `contact` 5–255 email|phone, `message` 10–2000, `turnstileToken`, honeypot `website`) → `app/api/contact/route.ts:10` honeypot silent `200` → zod `400` `fieldErrors` → `checkRateLimit` (`lib/rate-limit.ts:27` 5/min 20/hour) `429` `Retry-After` → `verifyTurnstile` (`lib/turnstile.ts:5`) `400` → `Promise.allSettled([sendTelegram, sendEmail])` `502` only if both reject else `200 {warnings?}`. Secrets from `.dev.vars` / `wrangler secret put` (TURNSTILE_SECRET_KEY etc). Same 42/42 test surface.

## 7. Testing & acceptance

- Unit: `vitest` `tests/components.test.tsx` + `tests/contact.test.ts` + `tests/api-contact.test.ts` — update snapshots for light classes where asserted; nav test asserts **no** `Client Portal` link. Keep 42/42 green.
- Visual: Playwright `https://finchtech.my/` — 0 console errors (was 12 before `[assets]`), `/_next/static` 200 via ASSETS, `GET /api/health` 200, `POST /api/contact` validation + Turnstile gating, theme drift only light variant.
- Manual: `npm run typecheck && npm run lint --max-warnings=0 && npm run build && npx opennextjs-cloudflare build` → `.open-next/worker.js` 2.2K.

## 8. Out of scope

Dark mode toggle polish, branded OG/fav, i18n, blog/CMS, D1/R2/KV, `check-migrations` — all deferred from the original `2026-08-20` spec.

## 9. Global constraints

Node 26, Next 16, React 19, Tailwind 4, TS 6.x, `wrangler 4.x`, `@opennextjs/cloudflare 1.20`, author `Finch Technology <admin@finchtech.my>`, `feature/*|hotfix/*|dependabot/* → production` via `merge-local.sh`, domain `finchtech.my` on `28970b96…`.

---

## Spec self-review

- **Placeholder scan:** no `TBD/TODO` — all tokens, routes, secrets (`TURNSTILE_SECRET_KEY`, `TELEGRAM_*`, `BREVO_API_KEY`/`SENDER_API_KEY`), file paths, and copy lines are concrete.
- **Internal consistency:** C direction is consistent: hero sells products, custom is one strip, expertise 4-card is intentionally removed, About holds all trust signals, no portal in nav — no contradiction with the live `finchtech.my:1` IA (current `Products/Expertise/About/Contact` → new `Products/Company/Contact`). `wrangler.toml` / `open-next.config.ts` invariants match the fixed `f6257d08` deploy (assets + routes + nodejs runtime).
- **Scope check:** focused — re-skin + IA tweak to light holding, not a new app. One implementation plan suffices.
- **Ambiguity check:** "Enterprise holding vs SaaS hub" resolved to **holding that looks like a SaaS hub** — hero is product-led, holding language lives in About/footer only.
