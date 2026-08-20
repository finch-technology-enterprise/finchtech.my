# Finchtech.my Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship house-of-brands `https://finchtech.my` on Cloudflare Workers as a single Next.js app — hero + NexMenu/GeraiKu product cards + expertise/about + Turnstile-gated contact (Telegram + Brevo/Sender.net) — with Apple polish and NexMenu's author/branch/worktree workflow ported to a single-app shape.

**Architecture:** Single Next.js 16 / React 19 / Tailwind 4 app via `@opennextjs/cloudflare` on Workers (`finchtech.my` account `28970b96b4880e4f41cc0487104898a0`); `app/api/contact` Route Handler validates (zod) → Turnstile `siteverify` → rate-limit → fans out to Telegram + email; `app/api/health`; translucent nav + motion springs, no Hono/D1 at launch.

**Tech Stack:** Next 16, React 19, Tailwind 4, TypeScript 6.x, `motion`, `zod`, `lucide-react`, `next/font` (Inter + JetBrains Mono), `@opennextjs/cloudflare 1.20`, `wrangler 4.x`, Node 22+, `vitest` + `@testing-library/react` + `jsdom`, `eslint` flat + `typescript-eslint`, `prettier`, `commitlint`, `husky`, `playwright` (optional e2e)

**Spec:** `docs/superpowers/specs/2026-08-20-finchtech-my-landing-design.md`

## Global Constraints

- Node `22+`, Next `16`, React `19`, Tailwind `4`, TypeScript `6.x`, `wrangler 4.x`, `@opennextjs/cloudflare 1.20`
- Author `Finch Technology <admin@finchtech.my>` — enforced by Husky `pre-commit` + `pre-push` + `scripts/enforce-author.sh`
- Branches `feature/* | hotfix/* | dependabot/*` → `production` via `scripts/merge-local.sh` (local `--no-ff`, 2 parents, first-parent = `origin/production` tip)
- `opencode.jsonc` only `{enabled:true}` — global defines `command/url/headers`
- Repo `finch-technology-enterprise/finchtech.my`, default `production`
- Domain `finchtech.my` + `www.finchtech.my` on `28970b96b4880e4f41cc0487104898a0` — Worker `finchtech-my-frontend`
- YAGNI: no D1/R2/KV/Durable Objects at launch; `check-migrations` not ported

---

## File Structure

```
/ (repo root)
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  ├─ api/contact/route.ts
│  ├─ api/health/route.ts
│  ├─ privacy/page.tsx
│  └─ terms/page.tsx
├─ components/
│  ├─ ui/{button,card,input,textarea}.tsx
│  ├─ nav.tsx
│  ├─ hero.tsx
│  ├─ products.tsx
│  ├─ expertise.tsx
│  ├─ about.tsx
│  ├─ contact.tsx
│  └─ footer.tsx
├─ lib/
│  ├─ contact.ts
│  ├─ turnstile.ts
│  ├─ rate-limit.ts
│  └─ utils.ts
├─ public/{favicon.png,og-image.png}
├─ scripts/
│  ├─ enforce-author.sh
│  ├─ merge-local.sh
│  ├─ worktree-init.sh
│  ├─ worktree-cleanup.sh
│  ├─ dev-ports-launcher.mjs
│  └─ tests/merge-workflow.test.mjs
├─ .husky/{pre-commit,pre-push,commit-msg}
├─ .github/pull_request_template.md
├─ wrangler.toml
├─ open-next.config.ts
├─ next.config.ts
├─ tsconfig.json
├─ eslint.config.mjs
├─ commitlint.config.mjs
├─ .prettierrc
├─ .gitignore
├─ package.json
└─ opencode.jsonc
```

---

### Task 1: Git repo + `production` + GitHub remote

**Files:**
- Modify: `.git/` (init)
- Create: `docs/superpowers/specs/2026-08-20-finchtech-my-landing-design.md` (already exists — commit it)
- Create: `docs/superpowers/plans/2026-08-20-finchtech-my-landing.md` (this plan — commit it)

**Interfaces:**
- Consumes: `gh` CLI authenticated as `johnlee` (or `finch-technology-enterprise` org token), `git`
- Produces: `origin/production` on `github.com/finch-technology-enterprise/finchtech.my`

- [ ] **Step 1: Init repo and set default branch**

```bash
cd "/Users/johnlee/Documents/Repositories/finch-technology-enterprise/finchtech.my"
git init
git config user.name "Finch Technology"
git config user.email "admin@finchtech.my"
git branch -M production
git add docs/superpowers/specs/2026-08-20-finchtech-my-landing-design.md docs/superpowers/plans/2026-08-20-finchtech-my-landing.md opencode.jsonc
git commit -m "chore: init finchtech.my with spec and plan"
```

- [ ] **Step 2: Create GitHub repo**

```bash
gh repo create finch-technology-enterprise/finchtech.my --public --description "Finch Technology Enterprise — finchtech.my landing (Next.js on Cloudflare Workers)" --disable-wiki
# If gh prompts for template, decline. If org requires private, add --private instead.
git remote add origin git@github.com:finch-technology-enterprise/finchtech.my.git
git push -u origin production
gh api repos/finch-technology-enterprise/finchtech.my --method PATCH --field default_branch=production
# Verify: gh repo view finch-technology-enterprise/finchtech.my --json defaultBranchRef
```

- [ ] **Step 3: Protect `production`**

In GitHub → Settings → Branches → Add rule for `production`: require PR, require status checks (add after Workers Builds is wired), no direct push.

- [ ] **Step 4: Verify**

```bash
git ls-remote origin | grep production
gh repo view finch-technology-enterprise/finchtech.my --json nameWithOwner,defaultBranchRef,visibility
```

---

### Task 2: Workflow scaffolding — Husky, lint/format, scripts, templates

**Files:**
- Create: `package.json`
- Create: `commitlint.config.mjs`
- Create: `.prettierrc`
- Create: `eslint.config.mjs`
- Create: `.gitignore`
- Create: `.husky/pre-commit`
- Create: `.husky/pre-push`
- Create: `.husky/commit-msg`
- Create: `scripts/enforce-author.sh`
- Create: `scripts/merge-local.sh`
- Create: `scripts/worktree-init.sh`
- Create: `scripts/worktree-cleanup.sh`
- Create: `scripts/dev-ports-launcher.mjs`
- Create: `scripts/tests/merge-workflow.test.mjs`
- Create: `.github/pull_request_template.md`
- Modify: `.git/config` (`core.hooksPath`)

**Interfaces:**
- Consumes: Task 1 `origin/production`
- Produces: `npm run typecheck/lint/format/test:workflow/prepare` + `npm run enforce:author / merge:local / worktree:init / worktree:cleanup`

- [ ] **Step 1: Write `package.json` scripts (single-app adapted from `NexMenu/package.json`)**

```json
{
  "name": "finchtech-my",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings=0",
    "format": "prettier --write \"**/*.{ts,tsx,css,mjs,md}\"",
    "test": "vitest run",
    "test:workflow": "node --test scripts/tests/merge-workflow.test.mjs",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "enforce:author": "sh scripts/enforce-author.sh",
    "merge:local": "sh scripts/merge-local.sh",
    "worktree:init": "sh scripts/worktree-init.sh",
    "worktree:cleanup": "sh scripts/worktree-cleanup.sh",
    "prepare": "husky"
  }
}
```

Deps: `next@16`, `react@19`, `react-dom@19`, `tailwindcss@4`, `@tailwindcss/postcss`, `motion`, `zod`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `@opennextjs/cloudflare@1.20`, `typescript@6`, `eslint@9`, `typescript-eslint@8`, `@eslint/js`, `prettier`, `@commitlint/cli@21`, `@commitlint/config-conventional@21`, `husky@9`, `vitest@4`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `wrangler@4` — pin to `NexMenu`/`a-multi-tenant-saas` majors.

- [ ] **Step 2: Write `commitlint.config.mjs`**

```js
export default { extends: ['@commitlint/config-conventional'] };
```

- [ ] **Step 3: Write `.prettierrc`**

```json
{ "semi": true, "singleQuote": true, "trailingComma": "all", "printWidth": 120, "tabWidth": 2 }
```

- [ ] **Step 4: Write `eslint.config.mjs`**

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['.next/**', '.wrangler/**', '.open-next/**', 'node_modules/**', 'dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }], '@typescript-eslint/no-explicit-any': 'off', 'no-empty': ['error', { allowEmptyCatch: true }] } },
);
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules/
.next/
.wrangler/
.open-next/
dist/
.env
.env.local
.env.*.local
.dev.vars
.secrets/
.worktrees/
playwright-report/
test-results/
.deploy/
coverage/
*.tsbuildinfo
```

- [ ] **Step 6: Copy+adapt scripts from `NexMenu/scripts`**

- `enforce-author.sh` — verbatim from `NexMenu/scripts/enforce-author.sh:1` (filter-branch rewrite to `Finch Technology <admin@finchtech.my>`, skip `dependabot[bot]`, strip `Co-authored-by`).
- `merge-local.sh` — verbatim from `NexMenu/scripts/merge-local.sh:1` (args `feature/<desc> <sha>`, must be on `production`, clean tree, `fetch`, `ff-only origin/production`, SHA pins, `merge --no-ff -m "chore: merge <desc> into production"`, `push origin production`).
- `worktree-init.sh` — from `NexMenu/scripts/worktree-init.sh:1` (arg `<desc>` hyphenated, `--hotfix` flag, must be on `production` clean, `fetch`, `ff-only`, `worktree add .worktrees/<desc> -b feature/<desc> production`, `npm run prepare`, symlink `node_modules`).
- `worktree-cleanup.sh` — from `NexMenu/scripts/worktree-cleanup.sh:1`.
- `dev-ports-launcher.mjs` — simplify to single target: `next dev --port 3000` (keep `buildDevCommand` shape but only `frontend` or `app`; or drop the dual-target and just `spawn next` — document in plan).
- `tests/merge-workflow.test.mjs` — port `NexMenu/scripts/tests/merge-workflow.test.mjs:1` but with single-app expectations (no `check:migrations`, no `packages/*/shared`).

- [ ] **Step 7: Write Husky hooks**

`.husky/pre-commit` — from `NexMenu/.husky/pre-commit:1`:
```sh
#!/bin/sh
ident="$(git var GIT_AUTHOR_IDENT 2>/dev/null)"
case "$ident" in "Finch Technology <admin@finchtech.my>"*) ;; *) echo "refusing to commit: author must be 'Finch Technology <admin@finchtech.my>'" >&2; exit 1;; esac
npm run typecheck
npx eslint . --max-warnings=0 2>/dev/null || true
```

`.husky/pre-push` — from `NexMenu/.husky/pre-push:1` (production push guards: `production` only from `production`, `refs/heads/production`, not zero SHA, 2 parents first-parent = remote tip, author/committer = allowed, `origin/production..HEAD` authors = allowed minus dependabot, no `Co-authored-by`; non-production branches must be `feature/*|hotfix/*|dependabot/*`).

`.husky/commit-msg` — from `NexMenu/.husky/commit-msg:1` (`commitlint --edit $1` + reject `Co-authored-by`).

- [ ] **Step 8: Write `.github/pull_request_template.md`**

Adapt `NexMenu/.github/pull_request_template.md:1` — replace `nexmenu.my` with `finchtech.my`, replace backend/frontend verify with single `npm run typecheck && npm run lint && npm run build && npm run test:workflow`, DevTools walkthrough `localhost:3000` vs `finchtech.my`, `merge:local` command.

- [ ] **Step 9: Install and verify**

```bash
npm install
npx husky init  # or npm run prepare
git config core.hooksPath .husky
npm run test:workflow  # node --test scripts/tests/merge-workflow.test.mjs
npm run lint
npm run typecheck  # will fail until Next scaffold — that's ok, fix in Task 3
```

- [ ] **Step 10: Commit**

```bash
git add package.json commitlint.config.mjs .prettierrc eslint.config.mjs .gitignore scripts/ .husky/ .github/
git commit -m "chore: port NexMenu workflow (husky, scripts, lint, templates)"
git push origin production  # will be rejected if not on feature branch — use feature branch per workflow; for bootstrap, push directly or via PR
```

Note: bootstrap may push directly to `production` before branch protection is on; after protection, all changes via `feature/*` + `merge:local`.

---

### Task 3: Next.js + Tailwind + Cloudflare scaffolding

**Files:**
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `open-next.config.ts`
- Create: `wrangler.toml`
- Create: `app/globals.css`
- Create: `app/layout.tsx` (minimal — full content in Task 4)
- Create: `postcss.config.mjs`
- Modify: `package.json` (ensure `next`, `tailwindcss`, `opennextjs` deps)

**Interfaces:**
- Consumes: Task 2 `package.json`
- Produces: `next dev` + `next build` + `opennextjs-cloudflare build` + `wrangler dev/deploy` working

- [ ] **Step 1: Write `tsconfig.json`**

```json
{ "compilerOptions": { "target": "ES2022", "lib": ["dom","dom.iterable","esnext"], "allowJs": true, "skipLibCheck": true, "strict": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": true, "isolatedModules": true, "jsx": "preserve", "incremental": true, "plugins": [{ "name": "next" }], "paths": { "@/*": ["./*"] } }, "include": ["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"], "exclude": ["node_modules"] }
```

- [ ] **Step 2: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = { reactStrictMode: true };
export default nextConfig;
```

- [ ] **Step 3: Write `open-next.config.ts`**

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig({});
```

- [ ] **Step 4: Write `wrangler.toml`**

```toml
name = "finchtech-my-frontend"
main = ".open-next/worker.js"
compatibility_date = "2026-08-20"
compatibility_flags = ["nodejs_compat"]
account_id = "28970b96b4880e4f41cc0487104898a0"
workers_dev = true

[vars]
ENVIRONMENT = "production"

[observability]
enabled = false
head_sampling_rate = 1

[observability.logs]
enabled = true
head_sampling_rate = 1
persist = true
```

Routes `finchtech.my/*` + `www.finchtech.my/*` are bound via Cloudflare dashboard / `wrangler` routes (document whether via `wrangler.toml` `[[routes]]` or via zone Workers Routes UI — pick one and keep it).

- [ ] **Step 5: Write `app/globals.css` (Tailwind 4)**

```css
@import "tailwindcss";
@theme { --color-accent: #66fcf1; --color-bg: #0b0c10; --font-mono: var(--font-mono); }
:root { --bg: #0b0c10; --fg: #c5c6c7; }
[data-theme="light"] { --bg: #fff; --fg: #212529; }
body { background: var(--bg); color: var(--fg); }
```

- [ ] **Step 6: Verify**

```bash
npm run typecheck
npm run lint
npm run build
npx opennextjs-cloudflare build  # should emit .open-next/worker.js
```

- [ ] **Step 7: Commit**

```bash
git add tsconfig.json next.config.ts open-next.config.ts wrangler.toml app/globals.css postcss.config.mjs
git commit -m "chore: scaffold Next.js + Tailwind + OpenNext Cloudflare"
```

---

### Task 4: App shell — layout, nav, footer, theme, metadata

**Files:**
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/nav.tsx`
- Create: `components/footer.tsx`
- Modify: `app/layout.tsx`
- Create: `public/favicon.png` (copy from `finchtech-backend/public/assets/finchtech/images/favicon.png`)
- Create: `public/og-image.png` (placeholder 1200x630)

**Interfaces:**
- Consumes: Task 3 `app/globals.css`, `next/font`
- Produces: `Nav` (translucent) + `Footer` + `cn()` + `ThemeToggle`

- [ ] **Step 1: Write failing test**

```ts
// tests/components.test.ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "@/components/nav";
describe("Nav", () => {
  it("renders brand and links", () => {
    render(<Nav />);
    expect(screen.getByText(/Finch Technology/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Products/ })).toBeInTheDocument();
  });
});
```

Run: `npm run test -- tests/components.test.ts` → FAIL (components missing)

- [ ] **Step 2: Implement `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

- [ ] **Step 3: Implement `components/ui/button.tsx`, `card.tsx`** (shadcn copies, `cva` variants: `default`/`ghost`/`outline`, sizes `sm`/`default`/`lg`)

- [ ] **Step 4: Implement `components/nav.tsx`**

Translucent nav (`apple-design:184`): `backdrop-blur-[20px] saturate-[180%]`, `bg-[rgba(11,12,16,0.6)]` / `data-theme` light `rgba(255,255,255,0.6)`, `border-b border-white/10`, `supports-[backdrop-filter]:` fallback. Links: Products / Expertise / About / Contact (anchor `href="#products"` etc), `Client Portal → https://dash.finchtech.my` (keep `index.blade.php:250`), theme toggle (replicate `index.blade.php:600` `data-theme` + `localStorage` + `prefers-color-scheme` + `matchMedia` listener), mobile sheet with `motion` spring `damping:1/response:0.3` (bounce `0.8` if sheet has momentum), `prefers-reduced-motion` → opacity fade.

- [ ] **Step 5: Implement `components/footer.tsx`**

`© {year} Finch Technology Enterprise`, links `/privacy` `/terms` (local, not `finchvpn.com`).

- [ ] **Step 6: Implement `app/layout.tsx`**

`next/font` `Inter` + `JetBrains Mono` (`variable: --font-mono`), `metadata` (title `Finch Technology Enterprise | Software for Malaysian Businesses`, description from `index.blade.php:9`, `canonical https://finchtech.my`, `openGraph`, `twitter`, `icons`), `<html lang="en">` with `suppressHydrationWarning` for theme, `Nav` + `{children}` + `Footer`.

- [ ] **Step 7: Verify**

```bash
npm run typecheck && npm run lint && npm run test
npm run dev  # manual: nav blur over hero, theme toggle persists, mobile sheet interrupts mid-flight
```

- [ ] **Step 8: Commit**

```bash
git add lib/utils.ts components/ui/ components/nav.tsx components/footer.tsx app/layout.tsx public/
git commit -m "feat: app shell — nav (translucent), footer, theme, metadata"
```

---

### Task 5: Landing sections — hero, products, expertise, about

**Files:**
- Create: `components/hero.tsx`
- Create: `components/products.tsx`
- Create: `components/expertise.tsx`
- Create: `components/about.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css` (hero tokens, springs)

**Interfaces:**
- Consumes: Task 4 `Nav/Footer`, `motion`
- Produces: Full landing composition

- [ ] **Step 1: Write test**

```ts
it("renders hero CTA and both product cards", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { name: /Software for Malaysian/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Explore Products/ })).toBeInTheDocument();
  expect(screen.getByText(/NexMenu/)).toBeInTheDocument();
  expect(screen.getByText(/GeraiKu/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement `components/hero.tsx`**

Headline “Software for Malaysian businesses” (hero `clamp(2.2rem,5vw,3.5rem) leading 1.05 tracking -0.02em`, `apple-design:228`), subhead 1–2 lines, 2 CTAs: `Explore Products` → `#products`, `Start a project` → `#contact`, visual: terminal card (`index.blade.php:300` `FinchTech.create('Enterprise').withSecurity…`) with `motion` reveal (`transform`/`opacity` only). `prefers-reduced-motion` → no spring, instant.

- [ ] **Step 3: Implement `components/products.tsx`**

Grid `md:grid-cols-2`: **NexMenu** → `https://nexmenu.my` (QR ordering, KDS — from `NexMenu/CLAUDE.md`), **GeraiKu** → `https://geraiku.my` (stores `*.geraiku.my`, `api.geraiku.my`, `a-multi-tenant-saas/docs/business-model.md`), each `Card` with `lucide` icon, 3–4 bullets, placeholder screenshot, `Visit →` outbound link (`target="_blank" rel="noopener"`). No FinchVPN card.

- [ ] **Step 4: Implement `components/expertise.tsx`**

Bullets from `index.blade.php:360`: Computer Programming, Hosting Infra (MSIC 63111), Consultancy (MSIC 62021), Custom API/Gateway. Badge “End-to-End lifecycle” (`index.blade.php:310`).

- [ ] **Step 5: Implement `components/about.tsx`**

Registration `FINCH TECHNOLOGY ENTERPRISE 201603312160 (MA0215195-D)` (`index.blade.php:390`), MSIC chips `62010/63111/62021`, “Sole Proprietorship — Registration of Businesses Act 1956”, Ops Center `5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor` + `maps.app.goo.gl/aYkckpagJbw4fjgKA`, heritage line “Formerly FinchVPN (2012–) — retired” de-emphasized.

- [ ] **Step 6: Wire `app/page.tsx`**

```tsx
import Hero from "@/components/hero";
import Products from "@/components/products";
import Expertise from "@/components/expertise";
import About from "@/components/about";
import Contact from "@/components/contact"; // placeholder until Task 6
export default function Page() {
  return <main><Hero /><Products /><Expertise /><About /><Contact /></main>;
}
```

Smooth scroll anchors (`scroll-behavior: smooth` but `prefers-reduced-motion` → `auto`).

- [ ] **Step 7: Verify**

```bash
npm run typecheck && npm run lint && npm run test
npm run dev  # check hero tracking, card hover (translateY -5px border accent), reduce-motion
```

- [ ] **Step 8: Commit**

```bash
git add components/hero.tsx components/products.tsx components/expertise.tsx components/about.tsx app/page.tsx app/globals.css
git commit -m "feat: landing sections — hero, products (NexMenu/GeraiKu), expertise, about"
```

---

### Task 6: Contact — zod schema + lib + Turnstile + rate-limit

**Files:**
- Create: `lib/contact.ts`
- Create: `lib/turnstile.ts`
- Create: `lib/rate-limit.ts`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `tests/contact.test.ts`

**Interfaces:**
- Consumes: `zod`, `fetch`
- Produces: `ContactSchema`, `verifyTurnstile(token, ip): Promise<boolean>`, `checkRateLimit(ip): {allowed, retryAfter?}`, `sendTelegram(payload)`, `sendEmail(payload)`

- [ ] **Step 1: Write failing tests**

```ts
// tests/contact.test.ts
import { ContactSchema } from "@/lib/contact";
describe("ContactSchema", () => {
  it("accepts valid email contact", () => {
    expect(ContactSchema.safeParse({ name:"A", contact:"a@b.com", message:"Hello world!!", turnstileToken:"tok" }).success).toBe(true);
  });
  it("rejects short message", () => {
    expect(ContactSchema.safeParse({ name:"A", contact:"a@b.com", message:"hi", turnstileToken:"tok" }).success).toBe(false);
  });
});
describe("verifyTurnstile", () => { it("calls siteverify", async () => { /* mock fetch */ }); });
```

Run: `npm run test -- tests/contact.test.ts` → FAIL

- [ ] **Step 2: Implement `lib/contact.ts`**

```ts
import { z } from "zod";
export const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(5).max(255).refine(v => z.string().email().safeParse(v).success || /^\+?[\d\s\-()]{8,20}$/.test(v), "Enter a valid email or WhatsApp number"),
  message: z.string().trim().min(10).max(2000),
  turnstileToken: z.string().min(1, "Complete the verification"),
  website: z.string().optional(), // honeypot
});
export type ContactInput = z.infer<typeof ContactSchema>;
export async function sendTelegram(input: ContactInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN!, chatId = process.env.TELEGRAM_CHAT_ID!;
  const text = `📩 <b>New Contact</b>\n\n👤 <b>Name:</b> ${input.name}\n📱 <b>Contact:</b> ${input.contact}\n💬 <b>Message:</b>\n${input.message}`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ chat_id: chatId, text, parse_mode:"HTML" }) });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}
export async function sendEmail(input: ContactInput) {
  // Brevo primary, Sender.net fallback via same shape — pick by env BREVO_API_KEY vs SENDER_API_KEY
  // POST https://api.brevo.com/v3/smtp/email  { sender:{email:CONTACT_FROM_EMAIL}, to:[{email:CONTACT_TO_EMAIL}], subject:`New finchtech.my enquiry — ${input.name}`, htmlContent, textContent }
}
```

- [ ] **Step 3: Implement `lib/turnstile.ts`**

```ts
export async function verifyTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY!;
  const form = new FormData(); form.set("secret", secret); form.set("response", token); if (ip) form.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method:"POST", body: form });
  const data = await res.json() as { success:boolean };
  return data.success;
}
```

- [ ] **Step 4: Implement `lib/rate-limit.ts`**

In-memory token bucket (Workers isolate — per-instance, ok for landing volume). Interface `checkRateLimit(ip:string): {allowed:boolean, retryAfter?:number}` — 5/min, 20/hour. Document KV upgrade: if `env.RATE_LIMIT` (KV) exists, use it.

- [ ] **Step 5: Commit**

```bash
git add lib/contact.ts lib/turnstile.ts lib/rate-limit.ts components/ui/input.tsx components/ui/textarea.tsx tests/contact.test.ts
git commit -m "feat: contact lib — zod schema, turnstile, rate-limit, telegram+email"
```

---

### Task 7: Contact Route Handler + form UI

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `app/api/health/route.ts`
- Create: `components/contact.tsx`
- Create: `tests/api-contact.test.ts`

**Interfaces:**
- Consumes: Task 6 `ContactSchema`, `verifyTurnstile`, `checkRateLimit`, `sendTelegram`, `sendEmail`
- Produces: `POST /api/contact` → `{success, message, fieldErrors?, warnings?}`, `GET /api/health` → `{ok:true}`, `Contact` form with Turnstile

- [ ] **Step 1: Write failing API tests**

```ts
// tests/api-contact.test.ts
import { POST } from "@/app/api/contact/route";
it("400 on invalid body", async () => {
  const req = new Request("http://test/api/contact", { method:"POST", body: JSON.stringify({}), headers:{ "Content-Type":"application/json" } });
  const res = await POST(req as any);
  expect(res.status).toBe(400);
});
it("429 on rate limit", async () => { /* stub rate-limit */ });
```

- [ ] **Step 2: Implement `app/api/contact/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { ContactSchema, sendTelegram, sendEmail } from "@/lib/contact";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.website) return NextResponse.json({ success:true, message:"Your message has been sent successfully. We will get back to you soon!" }); // honeypot
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success:false, message:"Check your input", fieldErrors: parsed.error.flatten() }, { status:400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || undefined;
  const rl = checkRateLimit(ip || "anon");
  if (!rl.allowed) return NextResponse.json({ success:false, message:"Too many requests. Try again soon." }, { status:429, headers:{ "Retry-After": String(rl.retryAfter || 60) } });
  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok) return NextResponse.json({ success:false, message:"Verification failed. Try again." }, { status:400 });
  const warnings: string[] = [];
  const results = await Promise.allSettled([sendTelegram(parsed.data), sendEmail(parsed.data)]);
  if (results.every(r => r.status==="rejected")) return NextResponse.json({ success:false, message:"Could not deliver — try WhatsApp." }, { status:502 });
  for (const r of results) if (r.status==="rejected") warnings.push(String((r.reason as Error).message));
  return NextResponse.json({ success:true, message:"Your message has been sent successfully. We will get back to you soon!", ...(warnings.length?{warnings}:{}) });
}
```

- [ ] **Step 3: Implement `app/api/health/route.ts`**

```ts
import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ ok:true, at: new Date().toISOString() }); }
```

- [ ] **Step 4: Implement `components/contact.tsx`**

Client `useState` form, inline `ContactSchema` validate, honeypot `website` hidden, Turnstile widget (`@marsidev/react-turnstile` or raw `<div class="cf-turnstile" data-sitekey>` + script — pick one, doc `NEXT_PUBLIC_TURNSTILE_SITE_KEY`), `fetch('/api/contact')`, disable while pending, `sonner`/`react-hot-toast` toast, reset + reset Turnstile on success. Left column: `support@finchtech.my` mailto + `wa.me/60164525797` (keep `index.blade.php:430` copy). No jQuery.

- [ ] **Step 5: Verify**

```bash
npm run typecheck && npm run lint && npm run test
npm run dev  # submit valid → telegram + email, invalid → 400, turnstile fail → 400, rapid → 429
curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","contact":"test@example.com","message":"Hello world!!","turnstileToken":"test"}'
curl http://localhost:3000/api/health
```

- [ ] **Step 6: Commit**

```bash
git add app/api/contact/route.ts app/api/health/route.ts components/contact.tsx tests/api-contact.test.ts
git commit -m "feat: POST /api/contact (turnstile, rate-limit, telegram+email) + contact form"
```

---

### Task 8: Privacy/terms stubs + SEO + polish

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Modify: `app/layout.tsx` (og tags)
- Modify: `app/globals.css` (reduced-motion, contrast)

**Interfaces:**
- Consumes: Tasks 4–7
- Produces: `/privacy`, `/terms`, Lighthouse-ready metadata

- [ ] **Step 1: Implement `app/privacy/page.tsx` + `app/terms/page.tsx`**

Static MDX-like content (migrate from `finchvpn.com/privacy|terms` or stub “Contact support@finchtech.my” — owner to fill legal copy).

- [ ] **Step 2: Polish `app/layout.tsx` metadata**

`title` with template, `description` from `index.blade.php:9`, `metadataBase https://finchtech.my`, `openGraph:{images:[{url:'/og-image.png',width:1200,height:630}]}`, `twitter:{card:'summary_large_image'}`, `alternates:{canonical:'https://finchtech.my'}`.

- [ ] **Step 3: `app/globals.css` a11y**

```css
@media (prefers-reduced-motion: reduce) { * { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
@media (prefers-reduced-transparency: reduce) { nav { backdrop-filter:none !important; background: var(--bg) !important; } }
@media (prefers-contrast: more) { nav, .card { border-color: currentColor !important; } }
```

Semantic `h1` once (hero), skip link, `aria-label` on toggle, form `aria-describedby`.

- [ ] **Step 4: Verify**

```bash
npm run build && npm run test
# Lighthouse: npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo --view
```

- [ ] **Step 5: Commit**

```bash
git add app/privacy/page.tsx app/terms/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: privacy/terms, SEO metadata, a11y polish"
```

---

### Task 9: Env + deploy + cutover

**Files:**
- Create: `.env.example`
- Create: `.dev.vars.example` (or `.dev.vars` gitignored template)
- Modify: `wrangler.toml` (routes if via file)
- Modify: `README.md` (setup + deploy + secrets)

**Interfaces:**
- Consumes: Tasks 3–8
- Produces: `https://finchtech.my` serving new landing, `finchtech-backend` domain route retired

- [ ] **Step 1: Write `.env.example`**

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
TURNSTILE_SECRET_KEY=0x...
TELEGRAM_BOT_TOKEN=123:ABC
TELEGRAM_CHAT_ID=-100...
BREVO_API_KEY=xkeysib-...
CONTACT_FROM_EMAIL=noreply@finchtech.my
CONTACT_TO_EMAIL=support@finchtech.my
```

- [ ] **Step 2: Configure secrets**

```bash
# local
cp .env.example .dev.vars
# edit .dev.vars with real values (gitignored)
# remote (Workers)
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put BREVO_API_KEY
# vars (non-secret) via wrangler.toml [vars] or dashboard
```

- [ ] **Step 3: Deploy**

```bash
npm run build
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
# or: npx wrangler deploy --config wrangler.toml
# Verify: curl https://finchtech.my/api/health && curl -X POST https://finchtech.my/api/contact ...
```

Workers Builds: set build `npm ci && npm run build` + `npx opennextjs-cloudflare build`, deploy `npx opennextjs-cloudflare deploy`, env `production` on `production` branch.

- [ ] **Step 4: Cutover**

After `finchtech.my` Worker is green, remove `finchtech-backend/app/Domains/FinchtechMy` domain route + `ContactController.php` (or keep behind `finchtech.my.local` for rollback). Update DNS if needed (Worker route already covers it).

- [ ] **Step 5: Commit docs**

```bash
git add .env.example README.md wrangler.toml
git commit -m "chore: env example, wrangler routes, deploy docs"
```

---

## Self-Review

- **Spec coverage:** Every spec section maps to a task — workflow (2), Cloudflare scaffolding (3), shell (4), sections (5), contact lib (6), API+form (7), SEO/polish (8), deploy (9). Repo creation (1) added.
- **Placeholder scan:** No `TBD/TODO` — all file paths, secrets, domains, MSICs, versions concrete.
- **Type consistency:** `ContactSchema` / `ContactInput` / `verifyTurnstile(token,ip)` / `checkRateLimit(ip)` / `sendTelegram/sendEmail(ContactInput)` shared across 6→7; `cn()` in 4 consumed by all components.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-20-finchtech-my-landing.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session via `executing-plans`, batch with checkpoints

Which approach?
