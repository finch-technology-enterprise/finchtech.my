# AGENTS.md

Guidance for any coding agent working in this repo.

## Requirements

- **Node 26+ / npm 11+** (`node -v` / `npm -v`) — enforced by `package.json` `engines`.
- Git author must be `Finch Technology <admin@finchtech.my>` — enforced by Husky `pre-commit` / `pre-push` + `scripts/enforce-author.sh`. Use `git config user.name/user.email` before committing.
- Branches: `feature/* | hotfix/* | dependabot/*` → `production` only (see `.github/pull_request_template.md`, `README.md`).

## Workflow

1. `git clone` → `git config user.name "Finch Technology" && git config user.email "admin@finchtech.my"` → `npm ci` → `cp .env.example .dev.vars` → `npm run prepare`.
2. Develop on `feature/*` or `hotfix/*` (branched from latest `production`).
3. Verify locally: `npm run typecheck && npm run lint -- --max-warnings=0 && npm run build && npm run test` and `npx opennextjs-cloudflare build`. Browser walkthrough via Chrome DevTools MCP against `npm run dev` on `http://localhost:3000`.
4. Open PR against `production` using `.github/pull_request_template.md`; auto-review → owner confirmation → `npm run merge:local -- feature/<desc> <reviewed-head-sha>` then push `production` once (`production` has no GitHub branch protection — hook + confirmation are the gate).
5. Production deploy is Cloudflare Workers Builds on each `production` push → `finchtech.my/*` + `www.finchtech.my/*` (zone routes, not `wrangler.toml [[routes]]`). Smoke: `curl https://finchtech.my/api/health`.

## Dependencies

- All dependencies are kept at the latest published versions (`npm outdated` / `npx npm-check-updates` should show no `Wanted ≠ Latest`).
- Exception: **TypeScript pinned at `^6.0.3`**. `typescript@7` is available but `typescript-eslint` does not yet support it (lint fails with `typescript-eslint does not support TS 7.0` — tracked at `https://github.com/typescript-eslint/typescript-eslint/issues/10940`). Bump to TS 7 only after `typescript-eslint` adds TS 7 support.
- Stack pins: Next 16, React 19, Tailwind 4, `motion` 13, `@opennextjs/cloudflare` 1.20, `wrangler` 4.x — follow `README.md:Requirements` and `package.json` as source of truth for versions.

## Gotchas

- Worker is `finchtech-my-frontend` (`main .open-next/worker.js`, account `28970b96b4880e4f41cc0487104898a0`); routes are managed in the Cloudflare zone → Workers Routes UI — do not add `[[routes]]` to `wrangler.toml`.
- `opencode.jsonc` enables Chrome DevTools, Cloudflare, Context7, and GitHub MCPs — keep it.
