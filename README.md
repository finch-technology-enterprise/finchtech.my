# finchtech.my — Finch Technology Enterprise landing

House-of-brands landing for **Finch Technology Enterprise** (`MA0215195-D`) — hero + **NexMenu** (`nexmenu.my`) / **GeraiKu** (`geraiku.my`) product cards + expertise/about + Turnstile-gated contact (Telegram + Brevo/Sender.net). Single **Next.js 16** app on **Cloudflare Workers** via `@opennextjs/cloudflare`.

Live: `https://finchtech.my` · `https://www.finchtech.my` · account `28970b96b4880e4f41cc0487104898a0` · Worker `finchtech-my-frontend`

Spec: `docs/superpowers/specs/2026-08-20-finchtech-my-landing-design.md` · Plan: `docs/superpowers/plans/2026-08-20-finchtech-my-landing.md`

---

## Requirements

- **Node 26+** (`node -v`), **npm 11+** — enforced by `package.json` `engines`
- Git author must be `Finch Technology <admin@finchtech.my>` (`git config user.name` / `user.email`) — enforced by Husky `pre-commit` and `pre-push`
- Branches: `feature/* | hotfix/* | dependabot/*` → `production` via `npm run merge:local` (see `AGENTS.md` / `.github/pull_request_template.md`)
- Dependencies are at the latest published versions (`npm outdated` clean); **TypeScript stays at `^6.0.3`** until `typescript-eslint` supports TS 7 (lint currently fails with `typescript-eslint does not support TS 7.0` — `https://github.com/typescript-eslint/typescript-eslint/issues/10940`)

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

> **Deployment is MANUAL. There is no CI.**
>
> This section previously described Cloudflare Workers Builds as the "preferred"
> mechanism and claimed that pushing to `production` deploys automatically. That
> was not true, and the gap caused a real incident: `production` was pushed on
> 2026-09-02 while the last deploy was from 2026-09-01, so four newly added
> compliance pages (`/pricing`, `/refund`, `/service-delivery`,
> `/payment-policy`) returned 404 in production while passing every local test.
>
> Verified 2026-09-02 via the Cloudflare API: the Worker has **no Workers Builds
> repository connection** and **zero build records**. Every deployment to date
> has `source: "wrangler"` — i.e. run by hand.
>
> **Pushing to `production` does nothing on its own. You must run the deploy.**

### Deploy + verify

```bash
# 1. Verify before deploying
npm run typecheck && npm run lint -- --max-warnings=0 && npm run test && npm run build

# 2. Deploy
npm run deploy          # opennextjs-cloudflare build && opennextjs-cloudflare deploy

# 3. Smoke-test production — REQUIRED, and must be run every time
npm run smoke
```

`npm run smoke` (`scripts/smoke.sh`) checks every public route, the redirects,
the API endpoints and the outbound NexMenu destinations. It exits non-zero on the
first failure, which is what would have caught the incident above.

### Reading contact enquiries

```bash
npm run leads            # print pending enquiries from KV
npm run leads -- --keys  # list keys only
```

Every enquiry is written to the `CONTACT_INBOX` KV namespace and expires after
180 days. **Until `TELEGRAM_*` / email secrets are set, KV is the only place a
lead lands** — nothing notifies you. When that happens the Worker logs
`UNNOTIFIED_LEAD_IN_KV` at error level, so it is visible in Workers
Observability and can be alerted on.

Delete an enquiry once handled:

```bash
npx wrangler kv key delete "<key>" --namespace-id 12ae7be74225482fbe9556d2b00748b9 --remote
```

Deleting is also how you mark an enquiry as read: the KV namespace holds only
**pending** enquiries, so an empty `npm run leads` means nothing is outstanding.
There is deliberately no read/unread flag and no admin UI — the store is a
safety net, not an inbox.

### Alerting on unnotified leads

An email notification policy already exists on the account:

- **Name:** `Unnotified contact lead in KV`
- **Type:** `workers_observability_alert` → **Destination:** `support@finchtech.my`
- **Policy ID:** `e895ff7d1ace4684826c4a387b0a0dfb`

That is the *delivery* half. The *rule* that fires it must be created once in the
dashboard (the alert-rule API is undocumented, so it is not scripted here):

1. **Workers & Pages → Observability → Investigate**
2. Filter: `$metadata.service = finchtech-my-frontend` **AND**
   `$metadata.level = error`, with the search needle `UNNOTIFIED_LEAD_IN_KV`
3. **Create alert** from that query — threshold `count >= 1` over `5 minutes`
4. Attach the existing notification policy above

Until step 3 is done, detection is manual: run `npm run leads`, or query the
same filter in the dashboard.

### If you want real CI

Connect the repo in the dashboard (Workers & Pages → `finchtech-my-frontend` →
Settings → Builds) with build `npm ci && npm run build && npx opennextjs-cloudflare build`
and deploy `npx opennextjs-cloudflare deploy`. **Until that connection exists,
this README must keep saying deployment is manual.** Do not document intent as
if it were fact.

### Routes

Worker is bound to `finchtech.my/*` + `www.finchtech.my/*`. Note both
`wrangler.toml [[routes]]` and the zone Workers Routes UI currently declare
these; they agree, so behaviour is correct, but `wrangler.toml` is the source of
truth because `opennextjs-cloudflare deploy` reconciles from it.

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
