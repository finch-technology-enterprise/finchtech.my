## Summary
- What changed and why.

## Docs Cleanup (required — plan/spec/handoff docs are ephemeral; see docs/git-workflow.md)
- [ ] Superpowers plan/spec/design/handoff docs for this feature deleted; work recorded in `docs/CHANGELOG.md` (+ `docs/BACKLOG.md` statuses/debt table and module docs when applicable)

## Local Verification (required — run before opening this PR)
- [ ] Deterministic suites pass: `npm run typecheck && npm run lint && npm run build && npm run test:workflow`
- [ ] Chrome DevTools MCP walkthrough of the changed surface against localhost (`npm run dev` on `http://localhost:3000`): steps taken + outcome

## Production Verification (required — after the local merge push deploys)
- [ ] Chrome DevTools MCP walkthrough of the same path on `https://finchtech.my`: steps taken + outcome
- [ ] If this fails: hotfix revert/fix-forward PR opened immediately

## Risks
- Known risks and edge cases.

## Deployment Notes
- Secrets/vars needed (if any), or nothing.
- Local merge command after owner confirmation: `npm run merge:local -- feature/<desc> <reviewed-head-sha>`.
