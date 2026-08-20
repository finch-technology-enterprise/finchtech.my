#!/bin/sh
# Remove a task worktree after its PR merged: fast-forward the main
# checkout's `production`, remove the worktree, delete the local branch,
# then delete the remote branch — from a checkout of that branch, since
# the pre-push hook admits feature-branch deletion pushes but refuses any
# push issued from a checkout on `production`.
#
# Usage: npm run worktree:cleanup -- <desc>
#
# Run from the main checkout (a worktree cannot remove itself).
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DESC="${1:-}"
[ -n "$DESC" ] || { echo "usage: npm run worktree:cleanup -- <desc>" >&2; exit 1; }
case "$DESC" in
  *[!a-z0-9-]*|--*|*-) echo "error: <desc> must be lowercase, hyphenated, and not start or end with '-'" >&2; exit 1;;
esac

gitdir="$(git rev-parse --git-dir)"
case "$gitdir" in
  .git|/.git) ;;
  *) echo "error: run worktree:cleanup from the main checkout, not a worktree" >&2; exit 1 ;;
esac

WT=".worktrees/$DESC"
if [ ! -d "$WT" ]; then
  echo "error: $WT does not exist" >&2
  exit 1
fi

branch="$(git -C "$WT" symbolic-ref --short HEAD)"
echo "cleaning up worktree '$WT' (branch '$branch')..."

git switch production
git fetch origin
git merge --ff-only origin/production

git worktree remove "$WT"

if ! git branch -d "$branch"; then
  echo "error: local branch '$branch' not deleted — check its commits before forcing" >&2
  exit 1
fi

if git rev-parse --verify -q "refs/remotes/origin/$branch" >/dev/null 2>&1; then
  echo "deleting remote branch origin/$branch..."
  git switch "$branch"
  git push origin --delete "$branch"
  git switch production
fi

git fetch origin --prune
git worktree prune

echo "done. remaining worktrees:"
git worktree list
