# Finchtech.my Landing — Design Spec

**Date:** 2026-08-20
**Status:** Draft for review → then `writing-plans`
**Repo:** `finch-technology-enterprise/finchtech.my` (new, default branch `production`)
**Domain:** `finchtech.my` + `www.finchtech.my` on Cloudflare account `28970b96b4880e4f41cc0487104898a0`
**Source of truth (current):** `finchtech-backend/app/Domains/FinchtechMy/Views/index.blade.php:1` (hero `Custom Software Engineering & Digital Consultancy` at `index.blade.php:280`, services at `index.blade.php:340`, trust at `index.blade.php:390`, contact at `index.blade.php:430`, controller `ContactController.php:12` → `Log::channel('telegram')`, routes `Routes/web.php:16` domain `finchtech.my(.local)`)
**References:** `NexMenu/package.json:1` + `NexMenu/wrangler.toml:1` (Hono + Next + shared, `opennextjs/cloudflare 1.20`, `wrangler 4.x`), `a-multi-tenant-saas/` (`geraiku.my` / `*.geraiku.my` / `api.geraiku.my`, Hono + Next + shared), `apple-design` skill (WWDC fluid interfaces)

---

## 1. Goal

Ship a brand-new `https://finchtech.my` landing — **not a clone** of the current Blade page — as the parent brand **Finch Technology Enterprise** (MA0215195-D, MSIC 62010/63111/62021, Puchong ops center). Positioning is **house-of-brands, consultancy as proof layer**: hero sells “Software for Malaysian businesses”, portfolio drives to **NexMenu → `nexmenu.my`** and **GeraiKu → `geraiku.my`** (stores `*.geraiku.my`), consultancy is the third “Expertise” CTA. FinchVPN is retired — one-line heritage note in About, not a product card. Contact form fans out to Telegram + Brevo/Sender.net with Turnstile + rate-limit. Apple-level polish on motion/materials/typography. Deployed as a **single Next.js frontend-only app on Cloudflare Workers** (no Hono, no D1/KV at launch), with **NexMenu’s workflow** (Husky, author gate, merge-local, worktrees) ported to a single-app shape.

Success: `finchtech.my` loads fast, Lighthouse green, `POST /api/contact` works from edge, Turnstile verifies, Telegram + email deliver, repo enforces `Finch Technology <admin@finchtech.my>` and `feature/*` branching identical to `NexMenu`.

---

## 2. Architecture

### 2.1 Stack (frontend-only)

- **Runtime:** Cloudflare Workers via `@opennextjs/cloudflare 1.20` (like `NexMenu/packages/frontend` + `a-multi-tenant-saas/packages/frontend`)
- **Frontend:** Next.js `16` + React `19` + Tailwind CSS `4` + TypeScript `6.x`
- **Motion:** `motion` (Framer Motion) springs (`damping 1.0/response 0.3` default, `0.8/0.3` only for momentum/sheet)
- **UI:** `shadcn/ui` primitives, `lucide-react`, `class-variance-authority`, `clsx + tailwind-merge`
- **Fonts:** `next/font` — `Inter` + `JetBrains Mono` (keep current `index.blade.php:14` fonts, rebuilt Apple-correct: `apple-design:228` size-specific tracking/leading, `next/font` optical sizing, `rem/em` spacing for Dynamic Type)
- **Validation:** `zod` (contact schema shared between client + Route Handler)
- **Tooling:** `wrangler 4.x`, Node `22+`, `eslint` flat config (`typescript-eslint`), `prettier` (120 printWidth), `commitlint` (`@commitlint/config-conventional`), `husky 9.x`, `vitest` + `@testing-library/react` + `jsdom`, `playwright` (optional)

No `hono`, no `drizzle`, no D1/R2/KV/Bindings at launch (YAGNI). If contact audit is wanted later, add D1 + migration (reuse `NexMenu/scripts/check-migrations.sh` pattern then).

### 2.2 Hosting & routing

- **Single Worker** at repo root `wrangler.toml` (mirrors `NexMenu/wrangler.toml:1` shape but `main` is OpenNext output). Name e.g. `finchtech-my-frontend`, `compatibility_date` current, `compatibility_flags = ["nodejs_compat"]`, account `28970b96b4880e4f41cc0487104898a0`, `workers_dev = true`, route `finchtech.my/*` + `www.finchtech.my/*` via Cloudflare zone (Workers Builds or `wrangler deploy`).
- **Routes:**
  - `GET /` → `app/page.tsx` (static, no SSR data)
  - `GET /privacy`, `GET /terms` → stubs (current footer points to `finchvpn.com/privacy|terms` — new pages own the copy)
  - `POST /api/contact` → `app/api/contact/route.ts` (edge Route Handler: validate → Turnstile `siteverify` → rate-limit → fan-out Telegram + email)
  - `GET /api/health` → `app/api/health/route.ts` (`{ok:true}` + optional `env` check, no D1)
- **Cutover:** keep `finchtech-backend/app/Domains/FinchtechMy/Routes/web.php:16` until DNS is switched to the new Worker; then retire the Blade page + `ContactController.php:12` + domain route.

### 2.3 Apple design chassis

Translates `apple-design` to the web:

- **Nav as translucent material** — `backdrop-filter: blur(20px) saturate(180%)` + `rgba(11,12,16,0.6)` (dark) / `rgba(255,255,255,0.6)` (light), 1px bright top edge, content scrolls under (not an opaque bar). Shadow context-aware (`apple-design:184`). Never stack light-on-light translucent surfaces.
- **Springs, not timed transitions** — default `damping 1.0` (critically damped, no overshoot, `response 0.3–0.4`). Bounce `~0.8` only when gesture carried momentum (sheet/flick). All interruptible from live `transform`/`opacity` (presentation value), velocity handoff on drag end, no CSS `@keyframes` for gesture-driven motion (`apple-design:68`, `apple-design:88`).
- **Typography** — `apple-design:228`: tight on large, near `0` on body. Hero `clamp(2.2rem,5vw,3.5rem) line-height 1.05 letter-spacing -0.02em font-optical-sizing:auto`, body `1rem/1.6 tracking ~0`. Build hierarchy from `weight+size+leading`, spacing in `rem`.
- **Feedback** — highlight on `pointerdown` (`transform: scale(0.97) 100ms`), continuous 1:1 tracking with `setPointerCapture` + velocity history, hysteresis ~10px before committing direction (`apple-design:22`, `apple-design:42`).
- **Reduced motion/transparency/contrast** — `prefers-reduced-motion: reduce` → opacity cross-fade, drop blur/springs/parallax. `prefers-reduced-transparency: reduce` → solid nav. `prefers-contrast: more` → solid bg + contrasting border (`apple-design:209`). No full-viewport loops (~0.2 Hz) or brightness jumps.

### 2.4 File structure (single app)

```
/ (repo root)
├─ app/
│  ├─ layout.tsx              # <html lang>, next/font, metadata, nav+footer
│  ├─ page.tsx                # composition: Hero + Products + Expertise + About + Contact
│  ├─ globals.css             # Tailwind 4 + CSS vars (light/dark via data-theme), apple tokens
│  ├─ api/
│  │  ├─ contact/route.ts     # POST — validate, turnstile, rate-limit, telegram+email
│  │  └─ health/route.ts      # GET — {ok:true}
│  ├─ privacy/page.tsx
│  └─ terms/page.tsx
├─ components/
│  ├─ ui/                     # button, card, input, textarea, toast (shadcn copies)
│  ├─ nav.tsx                 # translucent header, mobile sheet
│  ├─ hero.tsx                # headline + 2 CTAs + terminal→product preview
│  ├─ products.tsx            # 2 equal cards: NexMenu, GeraiKu
│  ├─ expertise.tsx           # consultancy + infra
│  ├─ about.tsx               # registration, MSICs, ops center, retired VPN line
│  ├─ contact.tsx             # form (zod), Turnstile widget, toast
│  └─ footer.tsx
├─ lib/
│  ├─ contact.ts              # ContactSchema (zod), sendTelegram, sendEmail (brevo/sender)
│  ├─ turnstile.ts            # verifyTurnstile(token, ip) → siteverify
│  ├─ rate-limit.ts           # in-memory token-bucket (Workers isolate), KV-ready interface
│  └─ utils.ts                # cn()
├─ public/
│  ├─ favicon.png             # from /assets/finchtech/images/favicon.png
│  └─ og-image.png
├─ scripts/                   # workflow scripts (ported from NexMenu/scripts)
│  ├─ enforce-author.sh
│  ├─ merge-local.sh
│  ├─ worktree-init.sh
│  ├─ worktree-cleanup.sh
│  ├─ dev-ports-launcher.mjs  # single-port (next dev)
│  └─ tests/merge-workflow.test.mjs
├─ .husky/
│  ├─ pre-commit
│  └─ pre-push
├─ .github/
│  └─ pull_request_template.md
├─ wrangler.toml
├─ open-next.config.ts
├─ next.config.ts
├─ tailwind.config.ts (or CSS-first)
├─ tsconfig.json
├─ eslint.config.mjs
├─ commitlint.config.mjs
├─ .prettierrc
├─ .gitignore
├─ package.json
└─ opencode.jsonc             # {enabled:true} only — inherits command/url/headers from global
```

---

## 3. Information Architecture & Components

Order follows `apple-design:251` Simplicity — common path first, one job: send SME visitors to `nexmenu.my` / `geraiku.my` or to `#contact`.

1. **Nav** (`components/nav.tsx`) — `Finch Technology (MY)` brand, links Products / Expertise / About / Contact, `Client Portal → dash.finchtech.my` (keep `index.blade.php:250` target), theme toggle (keep `index.blade.php:600` `data-theme` + `localStorage` + `prefers-color-scheme` behavior), translucent blur material, mobile sheet (motion spring `0.8/0.3`, interruptible, `prefers-reduced-motion` → fade).
2. **Hero** (`components/hero.tsx`) — headline “Software for Malaysian businesses” (or approved copy — “Custom Software Engineering & Digital Consultancy” is heritage; new is product-led), subhead 1–2 lines, 2 CTAs: **Explore Products** (`#products`) + **Start a project** (`#contact`), visual: terminal code card (`index.blade.php:300` `FinchTech.create…`) evolving to product preview on scroll (springs, `transform`/`opacity` only, `will-change` hint).
3. **Products** (`components/products.tsx`) — 2 equal cards (grid `md:2`):
   - **NexMenu** → `https://nexmenu.my` (QR ordering, KDS, table management — from `NexMenu/CLAUDE.md`)
   - **GeraiKu** → `https://geraiku.my` (multi-tenant storefront SaaS, `a-multi-tenant-saas/docs/business-model.md:1`, stores at `*.geraiku.my`, `api.geraiku.my`)
   Each: icon (`lucide`), 3–4 feature bullets, screenshot/placeholder, outbound `Visit →` button. No FinchVPN card.
4. **Expertise** (`components/expertise.tsx`) — “Beyond products — we build it for you”: Computer Programming, Hosting Infra (MSIC 63111), Consultancy (MSIC 62021), Custom API/Gateway integrations (carry `index.blade.php:360` bullets). End-to-end lifecycle badge (`index.blade.php:310`).
5. **About / Trust** (`components/about.tsx`) — FINCH TECHNOLOGY ENTERPRISE `201603312160 (MA0215195-D)`, MSIC chips, “Sole Proprietorship, Registration of Businesses Act 1956”, Operations Center `5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor` (`index.blade.php:430`), heritage line: “Formerly FinchVPN (2012–) — encrypted tunneling, retired” (de-emphasized).
6. **Contact** (`components/contact.tsx` + `app/api/contact/route.ts`) — 2-column: left email `support@finchtech.my` + WhatsApp `wa.me/60164525797` (keep `index.blade.php:430` targets), right form `name`/`contact` (email or WhatsApp) / `message` + Turnstile + Send. Success/error toast, reset on success (keep `index.blade.php:600` UX but rebuilt without jQuery).
7. **Footer** (`components/footer.tsx`) — © `Finch Technology Enterprise`, Privacy / Terms link to local `/privacy` `/terms` (not `finchvpn.com`).

All sections `id` anchored for smooth scroll (respect `prefers-reduced-motion` — instant jump vs `smooth`).

---

## 4. Contact flow (data & error handling)

### 4.1 Schema (zod, shared client+server)

```ts
ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(5).max(255) // email or WhatsApp — accept both, validate at least one shape
    .refine(v => z.string().email().safeParse(v).success || /^\+?[\d\s\-()]{8,20}$/.test(v), "Enter a valid email or WhatsApp number"),
  message: z.string().trim().min(10).max(2000),
  turnstileToken: z.string().min(1, "Complete the verification"),
});
```
Mirrors `ContactController.php:12` (`name 255, contact 255, message 2000`) tightened (name 100, message min 10) + added Turnstile field. Server re-validates — never trust client.

### 4.2 Route Handler `POST /api/contact`

1. Parse JSON, `ContactSchema.safeParse` → `400 {success:false, message, fieldErrors}` on fail.
2. **Rate-limit** — in-memory token bucket per IP (`lib/rate-limit.ts`: ~5/min, 20/hour, KV-ready `check(ip)` interface; Workers isolates are per-instance, acceptable for low volume landing — document upgrade path to KV `RATE_LIMIT` binding if abused).
3. **Turnstile verify** — `lib/turnstile.ts` `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret` (Workers secret `TURNSTILE_SECRET_KEY`) + `response` + `remoteip`. On fail → `400` “Verification failed”.
4. **Fan-out** (best-effort, parallel):
   - **Telegram** — `POST https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage` to `TELEGRAM_CHAT_ID` (same payload as `ContactController.php:16` `Log::channel('telegram')` — `Name/Contact/Message`). Keep HTML parse_mode.
   - **Email** — Brevo `POST https://api.brevo.com/v3/smtp/email` (or Sender.net equivalent) — from `CONTACT_FROM_EMAIL`, to `CONTACT_TO_EMAIL` (`support@finchtech.my`), subject `New finchtech.my enquiry — ${name}`, text+html body. Secrets: `BREVO_API_KEY` (or `SENDER_API_KEY`), `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.
   - If one channel fails, still `200` if at least one succeeded; include `warnings` array. If both fail → `502` “Could not deliver — try WhatsApp”.
5. Response shape: `{success:true, message:"Your message has been sent…"}` (keep `ContactController.php:18` copy) or `{success:false, message, fieldErrors?, warnings?}`.

### 4.3 Client

`components/contact.tsx` — controlled form, `zodResolver`-style inline validate, Turnstile widget (`@marsidev/react-turnstile` or raw script — pick one, document `NEXT_PUBLIC_TURNSTILE_SITE_KEY`), honeypot field (hidden `website` — if filled → silent success, no send), submit via `fetch('/api/contact')`, disable button while pending, toast via `sonner`/`react-hot-toast`, reset + clear Turnstile on success. No jQuery.

### 4.4 Secrets / env

- Public: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (exposed to client)
- Secrets (Workers `wrangler secret put` / `.dev.vars`): `TURNSTILE_SECRET_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `BREVO_API_KEY` (or `SENDER_API_KEY`), `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`
- `.env.example` documents all; `.dev.vars` gitignored (like `NexMenu/.gitignore`).
- `GET /api/health` checks env presence (without leaking values) — useful for deploy smoke.

---

## 5. Workflow to clone (NexMenu → single app)

Port `NexMenu`’s author/branch/worktree discipline to a single Next.js app (no D1):

- **Git** — new repo `finch-technology-enterprise/finchtech.my`, default branch `production` (like `NexMenu`). No `main` (or keep as mirror if GitHub forces it, but CI deploys from `production`). Protect `production` (require PR, no direct push except local merge commit).
- **Husky**
  - `pre-commit` — enforce `git var GIT_AUTHOR_IDENT === "Finch Technology <admin@finchtech.my>"` (like `NexMenu/.husky/pre-commit:1`), then `tsc --noEmit` + `eslint --max-warnings=0` (no `packages/*/shared` build).
  - `pre-push` — port `NexMenu/.husky/pre-push:1` verbatim but simplify non-production branch check (still `feature/*|hotfix/*|dependabot/*`), production-push guards: must be on `production`, local ref is `refs/heads/production`, not zero SHA, merge commit with 2 parents, first parent = `origin/production` tip, merge author/committer = allowed, all `origin/production..HEAD` authors = allowed (minus `dependabot[bot]`), no `Co-authored-by` trailers. Also audit non-production pushes author.
- **Scripts** (`scripts/`)
  - `enforce-author.sh` — rewrite `origin/production..HEAD` to allowed author (same as `NexMenu/scripts/enforce-author.sh:1`)
  - `merge-local.sh` — `feature/<desc> <sha>` → `git merge --no-ff -m "chore: merge <desc> into production" origin/<branch>` → `git push origin production` (same guards)
  - `worktree-init.sh` / `worktree-cleanup.sh` — same flow, symlinks `node_modules` if present, `npm run prepare` inside worktree
  - `dev-ports-launcher.mjs` — simplified: `next dev -p 3000` (single port; keep readiness wait + colored prefix like `NexMenu` version)
  - `check-migrations.sh` — **not ported** (no D1)
  - `tests/merge-workflow.test.mjs` — port `NexMenu/scripts/tests/merge-workflow.test.mjs:1` but with single-app branch set (drop `check:migrations` expectations)
- **Lint/format/commit** — `commitlint.config.mjs` (`@commitlint/config-conventional`), `.prettierrc` (`semi:true, singleQuote:true, trailingComma:all, printWidth:120, tabWidth:2` — same as `NexMenu/.prettierrc`), `eslint.config.mjs` (flat, `typescript-eslint`, ignores `.next/.wrangler/.open-next/node_modules`)
- **Docs/templates** — `.gitignore` (`.next/.wrangler/.open-next/node_modules/.dev.vars/.secrets/.worktrees/playwright-report/test-results/.deploy`), `.github/pull_request_template.md` (adapt NexMenu template: Summary / Docs Cleanup / Local Verification [build+lint+typecheck+DevTools localhost] / Production Verification [DevTools on `finchtech.my`] / Risks / Deployment Notes + `merge:local` command)
- **Package scripts** — `dev`, `build`, `typecheck`, `lint`, `format`, `test`, `deploy` (`opennextjs-cloudflare build && opennextjs-cloudflare deploy`), `enforce:author`, `worktree:init`, `worktree:cleanup`, `merge:local`, `test:workflow`, `prepare` (`husky`)

---

## 6. SEO / Performance / Accessibility

- **Metadata** (`app/layout.tsx`): title `Finch Technology Enterprise | Software for Malaysian Businesses`, description from `index.blade.php:9` adapted (custom software + hosting + consultancy), `canonical https://finchtech.my`, `og:url/type/title/description/site_name`, `og:image` (1200×630), `twitter:card summary_large_image`. `favicon.png` from `public/assets/finchtech/images/favicon.png`.
- **Performance** — images via `next/image` (optimized, AVIF/WebP), fonts via `next/font` (no external CSS), `motion` only for `transform`/`opacity` (compositor-friendly, `will-change` where imminent), no jQuery/Bootstrap JS bundle, Tailwind purge. Target Lighthouse 95+ performance.
- **Accessibility** — semantic landmarks (`nav/main/section/footer`), `h1` once (hero), skip link, focus visible, `aria-label` on theme toggle, form `label` associations, error `aria-describedby`, color contrast AA for both themes, `prefers-reduced-motion` honored everywhere.

---

## 7. Testing

- **Unit** (`vitest` + `jsdom` + `@testing-library/react`): `ContactSchema` validation (valid/invalid email vs WhatsApp, length bounds, Turnstile required, honeypot), `verifyTurnstile` (mock fetch), `rate-limit` (bucket), `sendTelegram`/`sendEmail` (mock fetch — assert payload shape matching `ContactController.php:16` message), component render (nav/hero/products/contact form states).
- **API** (`vitest` fetch handler or `next-test-api-route-handler`-style): `POST /api/contact` — 200 on valid, 400 on zod/turnstile, 429 on rate-limit, 502 when both channels fail, warnings when one fails.
- **Workflow** (`node --test scripts/tests/merge-workflow.test.mjs`): same as `NexMenu/scripts/tests/merge-workflow.test.mjs` but single-app.
- **E2E (optional, playwright)** — DevTools MCP walkthrough: localhost `next dev` + Workers `wrangler dev` for contact flow, then `finchtech.my` post-deploy (as `NexMenu/CLAUDE.md` prescribes).

---

## 8. Deployment

- **Wrangler** — `wrangler.toml` at root: `name = "finchtech-my-frontend"`, `compatibility_date` today, `compatibility_flags = ["nodejs_compat"]`, account `28970b96b4880e4f41cc0487104898a0`, `workers_dev = true`, `observability` logs enabled (like `NexMenu/wrangler.toml:30`). No `d1_databases/r2/kv/ai/durable_objects` at launch.
- **Build** — `open-next.config.ts` default (like `NexMenu/packages/frontend/open-next.config.ts` + `a-multi-tenant-saas`), `npm run deploy` → `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. Workers Builds: build command `npm ci && npm run build` (or `npx opennextjs-cloudflare build`), deploy command `npx opennextjs-cloudflare deploy` (or `wrangler deploy` on `.open-next/worker`).
- **Secrets** — `wrangler secret put TURNSTILE_SECRET_KEY / TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID / BREVO_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL` (or via Cloudflare dashboard). Staging: use `.dev.vars` locally (gitignored, never committed — recovery copy in `.secrets/` if you follow `NexMenu` pattern).
- **DNS** — `finchtech.my` zone on account `28970b96…` — Worker route `finchtech.my/*` + `www.finchtech.my/*`. Keep `finchtech-backend` domain route until cutover, then DNS points to Worker.

---

## 9. Out of scope / deferred (YAGNI)

- D1 persistence for contacts, R2 assets bucket, KV rate-limit, Durable Objects, AI binding, cron triggers (all in `NexMenu/wrangler.toml` — not needed for a landing).
- Auth, dashboard, i18n (copy is EN only at launch — BM/ZH later if needed).
- Blog / changelog / legal CMS — privacy/terms are static stubs.

---

## 10. Global constraints

- Node `22+`, Next `16`, React `19`, Tailwind `4`, TypeScript `6.x`, `wrangler 4.x`, `@opennextjs/cloudflare 1.20`
- Author identity `Finch Technology <admin@finchtech.my>` (Husky + pre-push + `enforce-author.sh`)
- Branching `feature/* | hotfix/* | dependabot/*` → `production` via `merge-local.sh` (local `--no-ff` merge, 2 parents, first-parent = remote tip)
- `opencode.jsonc` only `{enabled:true}` overrides (global defines `command/url/headers`)
- Repo `finch-technology-enterprise/finchtech.my`, default `production`

---

## Spec self-review

- **Placeholder scan:** no `TBD/TODO` — all values concrete (accounts, domains, secrets, MSICs, file paths, versions). Turnstile+Brev o/Sender choice is explicit (Brevo primary, Sender.net alternative via same interface); `*.geraiku.my` stores documented.
- **Internal consistency:** single-app shape is consistent (no backend package, no `check-migrations`, Route Handler owns contact, `wrangler.toml` at root). Apple tokens match `apple-design`. Cutover note matches `Routes/web.php:16` domain routing.
- **Scope check:** focused — landing + contact + workflow. No auth/D1/R2 scope creep. Workflow clone is bounded to single-app adaptation.
- **Ambiguity check:** copy is product-led (“Software for Malaysian businesses”) with fallback to heritage line; resolved by making hero copy a plan variable with that default. Email provider is Brevo primary, Sender.net swappable via `lib/contact.ts` sender abstraction — no ambiguity at implementation time.

---

## Next: `writing-plans`

Spec approved → `docs/superpowers/plans/2026-08-20-finchtech-my-landing.md` — tasks lead with **repo + workflow scaffolding** (git init, `production`, Husky, scripts, lint/format, wrangler) before landing slices (layout → hero/products → expertise/about → contact+API → polish + deploy).
