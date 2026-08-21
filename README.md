# finchtech.my — Finch Technology Enterprise landing

House-of-brands landing for **Finch Technology Enterprise** (`MA0215195-D`) — hero + **NexMenu** (`nexmenu.my`) / **GeraiKu** (`geraiku.my`) product cards + expertise/about + Turnstile-gated contact (Telegram + Brevo/Sender.net). Single **Next.js 16** app on **Cloudflare Workers** via `@opennextjs/cloudflare`.

Live: `https://finchtech.my` · `https://www.finchtech.my` · account `28970b96b4880e4f41cc0487104898a0` · Worker `finchtech-my-frontend`

Spec: `docs/superpowers/specs/2026-08-20-finchtech-my-landing-design.md` · Plan: `docs/superpowers/plans/2026-08-20-finchtech-my-landing.md`

---

## Requirements

- **Node 26+** (`node -v`), **npm 11+**
- Git author must be `Finch Technology <admin@finchtech.my>` (`git config user.name` / `user.email`) — enforced by Husky `pre-commit` and `pre-push`
- Branches: `feature/* | hotfix/* | dependabot/*` → `production` via `npm run merge:local` (see `docs/git-workflow.md` / `.github/pull_request_template.md`)

---

## Setup

```bash
git clone git@github.com:finch-technology-enterprise/finchtech.my.git
cd finchtech.my
git config user.name "Finch Technology"
git config user.email "admin@finchtech.my"

npm ci

# env — .dev.vars is gitignored (Wrangler reads it), .env.example is the template
cp .env.example .dev.vars
# or: cp .dev.vars.example .dev.vars
# then edit .dev.vars with real secrets (never commit it)

npm run prepare   # husky hooks
```

### Secrets & env

| Var | Where | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public, build-time | Cloudflare Turnstile site key — baked into client bundle (`components/contact.tsx`) |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile secret (`lib/turnstile.ts` `siteverify`) |
| `TELEGRAM_BOT_TOKEN` | secret | BotFather token |
| `TELEGRAM_CHAT_ID` | secret | Channel/group ID for delivery (`lib/contact.ts:sendTelegram`) |
| `BREVO_API_KEY` | secret | Brevo SMTP API key — primary email provider |
| `SENDER_API_KEY` | secret (alternative) | Sender.net key — drop-in alternative; set only one of `BREVO_API_KEY` / `SENDER_API_KEY` (Brevo wins if both set) |
| `CONTACT_FROM_EMAIL` | secret | Sender e.g. `noreply@finchtech.my` |
| `CONTACT_TO_EMAIL` | secret | Recipient e.g. `support@finchtech.my` |
| `ENVIRONMENT` | var (`wrangler.toml [vars]`) | `production` — non-secret, set in `wrangler.toml` or dashboard Vars |

See `.env.example` and `.dev.vars.example` for placeholders. Full contract in the spec §4.4 and `lib/contact.ts` header.

**Local:** `cp .env.example .dev.vars` and fill values; `wrangler dev` / `next dev` read `.dev.vars`.

**Remote (Workers):** set each secret via Wrangler or the Cloudflare dashboard (do not run these in CI without secrets — just document):

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put BREVO_API_KEY        # or: npx wrangler secret put SENDER_API_KEY
npx wrangler secret put CONTACT_FROM_EMAIL
npx wrangler secret put CONTACT_TO_EMAIL
# Non-secret ENVIRONMENT is in wrangler.toml [vars]; or: wrangler vars via dashboard
npx wrangler secret list   # verify
```

`GET /api/health` returns `{ok:true}` without leaking env — use it as a deploy smoke check.

---

## Dev

```bash
npm run dev          # next dev on http://localhost:3000
# or: node scripts/dev-ports-launcher.mjs

# optional — Workers runtime locally:
npx wrangler dev --port 8787   # serves .open-next/worker.js; needs `npx opennextjs-cloudflare build` first
```

Form posts to `POST /api/contact` (edge Route Handler: zod → honeypot → rate-limit → Turnstile `siteverify` → `Promise.allSettled([sendTelegram, sendEmail])` — `502` only if both fail, otherwise `200` with `warnings`). Get the Turnstile site key from the Cloudflare dashboard (Turnstile → Add site → domain `finchtech.my` + `localhost` for dev).

---

## Verify

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint --max-warnings=0
npm run build        # next build
npm run test         # vitest — 42 tests (contact schema + api-contact + workflow)

# OpenNext / Workers artifact:
npx opennextjs-cloudflare build   # emits .open-next/worker.js (wrangler.toml main)
ls -la .open-next/worker.js
```

All four plus `npx opennextjs-cloudflare build` must pass before requesting review.

---

## Deploy

### Manual (any branch with credentials)

```bash
npm run build
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
# equivalent: npx wrangler deploy --config wrangler.toml

# smoke:
curl https://finchtech.my/api/health
curl -X POST https://finchtech.my/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","contact":"test@example.com","message":"Hello from deploy smoke — long enough.","turnstileToken":"<real-token>"}'
```

`package.json:deploy` is `opennextjs-cloudflare build && opennextjs-cloudflare deploy`.

### Workers Builds (CI — preferred)

Connect the repo to **Cloudflare Workers Builds** (dashboard → Workers & Pages → `finchtech-my-frontend` → Settings → Builds):

- **Build command:** `npm ci && npm run build && npx opennextjs-cloudflare build`
- **Deploy command:** `npx opennextjs-cloudflare deploy`
- **Branch → env:** `production` branch → `production` environment; preview branches get preview URLs
- **Environment variables / secrets:** set the same secrets as above in the Builds environment (or via `wrangler secret put` separately — Builds deploys read Worker secrets)

On push to `production`, Workers Builds runs build + deploy and publishes to `finchtech.my` / `www.finchtech.my`.

### Routes

Worker is bound to `finchtech.my/*` + `www.finchtech.my/*` via **Cloudflare zone Workers Routes UI** (not `wrangler.toml [[routes]]`) — this is the invariant from `wrangler.toml` / spec §2.2 and plan task 3. Keep it there; do not add `[[routes]]` to `wrangler.toml` unless the team decides to manage routes in code (then document the switch and keep one source of truth). See `wrangler.toml` header comment.

`wrangler.toml` at root: `name = "finchtech-my-frontend"`, `main = ".open-next/worker.js"`, `compatibility_date = "2026-08-20"`, `compatibility_flags = ["nodejs_compat"]`, `account_id = "28970b96b4880e4f41cc0487104898a0"`, `workers_dev = true`, `observability.logs` enabled. No D1/R2/KV bindings at launch (YAGNI — spec §9).

---

## Cutover

When the Worker on `finchtech.my` is green (health `200`, contact delivers to Telegram + email):

1. Remove (or gate behind `finchtech.my.local` for rollback) `finchtech-backend/app/Domains/FinchtechMy/` — domain route `Routes/web.php:16` (`finchtech.my(.local)`) + `ContactController.php:12` + `Views/index.blade.php` (the old Blade landing). Keep the `.local` route briefly if rollback is needed.
2. Confirm DNS / Worker route still covers `finchtech.my` + `www.finchtech.my` (zone → Workers Routes).
3. Delete any legacy `finchvpn.com/privacy|terms` links (now `/privacy` + `/terms` on this app).

---

## Project layout

```
app/                     # Next.js App Router — layout, page, globals.css, api/contact, api/health, privacy, terms
components/              # nav (translucent), hero, products (NexMenu/GeraiKu), expertise, about, contact, footer, ui/*
lib/                     # contact (schema + telegram/email), turnstile (siteverify), rate-limit (token bucket), utils (cn)
public/                  # favicon.png, og-image.png
scripts/                 # enforce-author, merge-local, worktree-init/cleanup, dev-ports-launcher, tests/merge-workflow.test.mjs
.husky/                  # pre-commit (author + typecheck/lint), pre-push (production guards), commit-msg (commitlint)
.github/                 # pull_request_template.md
wrangler.toml            # Workers config — routes via UI, not [[routes]]
open-next.config.ts      # defineCloudflareConfig({})
```

---

## License

Private — Finch Technology Enterprise.
