#!/bin/sh
# Rewrite the current branch's commits (everything not yet on
# origin/production) so every author AND committer is the single allowed
# identity: Finch Technology <admin@finchtech.my>. Dependabot-authored
# commits are left untouched (the one permitted exemption), and any
# Co-authored-by trailers are stripped from messages.
#
# Usage: npm run enforce:author   (from the repo root, on a feature/hotfix
# branch; the branch must not be checked out in another worktree)
#
# After the rewrite, re-verify and push (the pre-push hook re-audits).
set -e

if ! git rev-parse --verify -q origin/production >/dev/null 2>&1; then
  echo "error: origin/production not found — run 'git fetch origin' first" >&2
  exit 1
fi

case "$(git symbolic-ref --short HEAD)" in
  production|main)
    echo "error: run this on a feature/hotfix branch, not '$(git symbolic-ref --short HEAD)'" >&2
    exit 1
    ;;
esac

git filter-branch --force \
  --env-filter '
if [ "$GIT_AUTHOR_NAME" != "dependabot[bot]" ] && [ "$GIT_AUTHOR_EMAIL" != "49699333+dependabot[bot]@users.noreply.github.com" ]; then
  export GIT_AUTHOR_NAME="Finch Technology"
  export GIT_AUTHOR_EMAIL="admin@finchtech.my"
  export GIT_COMMITTER_NAME="Finch Technology"
  export GIT_COMMITTER_EMAIL="admin@finchtech.my"
fi
' \
  --msg-filter 'sed -e "/^[Cc]o-[Aa]uthored-[Bb]y:/d"' \
  -- origin/production..HEAD

rm -rf .git/refs/original
git reflog expire --expire=now --all

echo "done. Authors on this branch now:"
git log --format='%an <%ae>' origin/production..HEAD | sort -u
echo "push with: git push (force-with-lease if the branch was already pushed)"
