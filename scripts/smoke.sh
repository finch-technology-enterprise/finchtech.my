#!/bin/sh
# Post-deploy production smoke test.
#
# Exists because production silently drifted a full commit behind the repository
# and four pages 404'd while every local test passed. Route-level verification
# against the deployed origin is the only thing that catches that class of
# failure, so it is a required deploy step (see README "Deploy + verify").
#
# Usage:  sh scripts/smoke.sh [base-url]
#         npm run smoke
set -eu

BASE="${1:-https://finchtech.my}"
FAILURES=0
CHECKS=0

red()   { printf '\033[31m%s\033[0m\n' "$1"; }
green() { printf '\033[32m%s\033[0m\n' "$1"; }

# expect_status <path> <expected-code>
expect_status() {
  path="$1"; want="$2"
  CHECKS=$((CHECKS + 1))
  got="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "${BASE}${path}" || echo 000)"
  if [ "$got" = "$want" ]; then
    printf '  ok    %-34s %s\n' "$path" "$got"
  else
    red "  FAIL  $path — expected $want, got $got"
    FAILURES=$((FAILURES + 1))
  fi
}

# expect_redirect <path> <expected-location-substring>
expect_redirect() {
  path="$1"; want="$2"
  CHECKS=$((CHECKS + 1))
  got="$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 20 "${BASE}${path}" || echo '')"
  case "$got" in
    *"$want"*) printf '  ok    %-34s -> %s\n' "$path" "$got" ;;
    *) red "  FAIL  $path — expected redirect containing '$want', got '${got:-none}'"
       FAILURES=$((FAILURES + 1)) ;;
  esac
}

# expect_body <path> <substring>
expect_body() {
  path="$1"; want="$2"
  CHECKS=$((CHECKS + 1))
  if curl -sS --max-time 20 "${BASE}${path}" | grep -q -- "$want"; then
    printf '  ok    %-34s contains %s\n' "$path" "$want"
  else
    red "  FAIL  $path — body missing '$want'"
    FAILURES=$((FAILURES + 1))
  fi
}

# expect_absent <path> <substring>
expect_absent() {
  path="$1"; bad="$2"
  CHECKS=$((CHECKS + 1))
  if curl -sS --max-time 20 "${BASE}${path}" | grep -q -- "$bad"; then
    red "  FAIL  $path — leaked '$bad' into page output"
    FAILURES=$((FAILURES + 1))
  else
    printf '  ok    %-34s free of %s\n' "$path" "$bad"
  fi
}

echo "Smoke testing ${BASE}"

echo "\nPages"
for path in / /products /products/nexmenu /products/geraiku /capabilities /company /contact /legal; do
  expect_status "$path" 200
done

echo "\nLegal / compliance routes"
for path in /legal/privacy /legal/terms /legal/refund /legal/service-delivery /legal/payment-policy; do
  expect_status "$path" 200
done

echo "\nAPI"
expect_status /api/health 200
expect_body   /api/health '"ok":true'

echo "\nSEO"
expect_status /sitemap.xml 200
expect_status /robots.txt 200
expect_body   /sitemap.xml '/products/nexmenu'
expect_body   /robots.txt 'Sitemap:'

echo "\nRedirects"
expect_redirect /pricing 'nexmenu.my/product'
expect_redirect /privacy '/legal/privacy'
expect_redirect /terms '/legal/terms'
expect_redirect /refund '/legal/refund'
expect_redirect /service-delivery '/legal/service-delivery'
expect_redirect /payment-policy '/legal/payment-policy'
expect_redirect /about '/company'

echo "\nRegressions"
# The previous build printed an environment variable name to visitors when the
# anti-bot widget was unconfigured.
expect_absent /contact 'NEXT_PUBLIC'
expect_absent /contact 'not configured'
# Content must be present in server HTML, not hidden behind hydration.
expect_body / 'Software built for how Malaysian businesses'
expect_absent / 'opacity:0'

echo "\nOutbound product destinations"
for url in https://nexmenu.my/demo https://nexmenu.my/product https://nexmenu.my/auth/signup https://geraiku.my/; do
  CHECKS=$((CHECKS + 1))
  got="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$url" || echo 000)"
  if [ "$got" = "200" ]; then
    printf '  ok    %-42s %s\n' "$url" "$got"
  else
    red "  FAIL  $url — expected 200, got $got"
    FAILURES=$((FAILURES + 1))
  fi
done

echo ""
if [ "$FAILURES" -eq 0 ]; then
  green "All $CHECKS checks passed."
  exit 0
fi
red "$FAILURES of $CHECKS checks FAILED."
exit 1
