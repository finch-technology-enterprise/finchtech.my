#!/bin/sh
# Read pending contact enquiries out of the CONTACT_INBOX KV namespace.
#
# Why this exists: until Telegram/email delivery secrets are configured, the KV
# namespace is the ONLY place an enquiry lands. A lead store nobody reads is
# barely better than losing the lead, so this gives the owner a one-command way
# to check it without building a public admin interface.
#
# Usage:
#   npm run leads            # list + print all pending enquiries
#   npm run leads -- --keys  # list keys only
#
# Requires `wrangler login` (or CLOUDFLARE_API_TOKEN) with KV read access.
set -eu

NS_ID="12ae7be74225482fbe9556d2b00748b9"

keys_json="$(npx wrangler kv key list --namespace-id "$NS_ID" --remote 2>/dev/null || echo '[]')"

count="$(printf '%s' "$keys_json" | grep -c '"name"' || true)"
if [ "$count" = "0" ]; then
  echo "No pending enquiries in CONTACT_INBOX."
  echo
  echo "Note: enquiries only reach KV after passing the Turnstile check."
  echo "If you expected one, check Workers Observability for UNNOTIFIED_LEAD_IN_KV."
  exit 0
fi

echo "$count pending enquir$( [ "$count" = "1" ] && echo y || echo ies ) in CONTACT_INBOX:"
echo

if [ "${1:-}" = "--keys" ]; then
  printf '%s' "$keys_json" | grep '"name"' | sed 's/.*"name": *"\([^"]*\)".*/  \1/'
  exit 0
fi

printf '%s' "$keys_json" \
  | grep '"name"' \
  | sed 's/.*"name": *"\([^"]*\)".*/\1/' \
  | while IFS= read -r key; do
      [ -n "$key" ] || continue
      echo "──────────────────────────────────────────────────────────────"
      echo "key: $key"
      npx wrangler kv key get "$key" --namespace-id "$NS_ID" --remote 2>/dev/null || echo "  (could not read)"
      echo
    done

echo "──────────────────────────────────────────────────────────────"
echo "Enquiries expire automatically 180 days after they are received."
echo "To remove one after handling it:"
echo "  npx wrangler kv key delete <key> --namespace-id $NS_ID --remote"
