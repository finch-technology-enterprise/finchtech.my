#!/bin/sh
# Create a task worktree the documented way: fetch, fast-forward the main
# checkout's `production`, branch from it, add the worktree, install Husky
# hooks inside it (without this `core.hooksPath` points at a missing
# directory and NO hooks run there), and symlink the root node_modules.
#
# Usage: npm run worktree:init -- <desc> [--hotfix]
#   <desc>   lowercase-hyphenated task description, e.g. `fix-login-500`
#   --hotfix branch as hotfix/<desc> instead of feature/<desc>
#
# Run from the main checkout (must be clean, on `production`).
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DESC="${1:-}"
[ -n "$DESC" ] || { echo "usage: npm run worktree:init -- <desc> [--hotfix]" >&2; exit 1; }
case "$DESC" in
  *[!a-z0-9-]*|--*|*-) echo "error: <desc> must be lowercase, hyphenated, and not start or end with '-'" >&2; exit 1;;
esac
case "$2" in
  --hotfix) PREFIX="hotfix" ;;
  "")       PREFIX="feature" ;;
  *)        echo "error: unknown option '$2' (only --hotfix)" >&2; exit 1 ;;
esac

gitdir="$(git rev-parse --git-dir)"
case "$gitdir" in
  .git|/.git) ;;
  *) echo "error: run worktree:init from the main checkout, not a worktree" >&2; exit 1 ;;
esac

branch="$(git symbolic-ref --short HEAD 2>/dev/null || true)"
if [ "$branch" != "production" ]; then
  echo "error: main checkout must be on 'production' (currently on '$branch')" >&2
  exit 1
fi
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "error: main checkout must be clean" >&2
  exit 1
fi

if git rev-parse --verify -q "refs/heads/$PREFIX/$DESC" >/dev/null 2>&1; then
  echo "error: branch '$PREFIX/$DESC' already exists" >&2
  exit 1
fi
if [ -d ".worktrees/$DESC" ]; then
  echo "error: .worktrees/$DESC already exists" >&2
  exit 1
fi

git fetch origin
git merge --ff-only origin/production

git worktree add ".worktrees/$DESC" -b "$PREFIX/$DESC" production

echo "installing Husky hooks inside the worktree..."
( cd ".worktrees/$DESC" && npm run prepare )

if [ -d node_modules ]; then
  ln -s ../../node_modules ".worktrees/$DESC/node_modules"
  echo "linked root node_modules into the worktree"
else
  echo "note: root node_modules missing — run 'npm install' inside the worktree" >&2
fi

echo
echo "worktree ready: .worktrees/$DESC on branch '$PREFIX/$DESC'"
echo "next:  cd .worktrees/$DESC"
echo "       npm run typecheck && npm run lint"
git worktree list
