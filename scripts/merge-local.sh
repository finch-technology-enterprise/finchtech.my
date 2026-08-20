#!/bin/sh
# Merge an owner-confirmed PR locally and push production exactly once.
#
# Usage: npm run merge:local -- feature/<desc> <reviewed-head-sha>
#
# GitHub MCP remains responsible for opening, reviewing, and recording the PR.
# This local merge creates the final Finch-authored merge commit, so the
# production push is the only ref update that can trigger Workers Builds.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

branch="${1:-}"
reviewed_sha="${2:-}"
[ "$#" -eq 2 ] || { echo "usage: npm run merge:local -- feature/<desc> <reviewed-head-sha>" >&2; exit 1; }
case "$branch" in
  feature/*|hotfix/*|dependabot/*) ;;
  *) echo "error: branch must be feature/<desc>, hotfix/<desc>, or dependabot/*" >&2; exit 1 ;;
esac
case "$reviewed_sha" in
  [0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]*) ;;
  *) echo "error: reviewed head must be a commit SHA" >&2; exit 1 ;;
esac

current_branch="$(git symbolic-ref --short HEAD 2>/dev/null || true)"
[ "$current_branch" = "production" ] || {
  echo "error: run merge:local on production (currently on '$current_branch')" >&2
  exit 1
}

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "error: working tree must be clean before merge:local" >&2
  exit 1
fi

git fetch origin
git merge --ff-only origin/production

if ! git rev-parse --verify -q "refs/remotes/origin/$branch" >/dev/null 2>&1; then
  echo "error: remote branch origin/$branch not found — push the reviewed branch first" >&2
  exit 1
fi

remote_branch_sha="$(git rev-parse "origin/$branch")"
if [ "$remote_branch_sha" != "$reviewed_sha" ]; then
  echo "error: origin/$branch no longer points to the reviewed head $reviewed_sha" >&2
  exit 1
fi

if git merge-base --is-ancestor "origin/$branch" HEAD; then
  echo "error: origin/$branch is already merged into production" >&2
  exit 1
fi

git merge --no-ff -m "chore: merge ${branch#*/} into production" "origin/$branch"
git push origin production

echo "done. production was updated once with a Finch-authored local merge commit."
echo "next: confirm Workers Build for finchtech-my-frontend queued and green, then run the production walkthrough."
