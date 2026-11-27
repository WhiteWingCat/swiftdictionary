#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# U2.9.1 regression: Collections must load explicitly after the main app.
COLLECTION_TAG='<script src="favorite-collections.js?v=2.9.1"></script>'
if [[ ! -f "$ROOT/favorite-collections.js" ]] || ! grep -Fq "$COLLECTION_TAG" "$ROOT/index.html"; then
  echo "ERROR: Dashboard Collections is not explicitly included in index.html" >&2
  exit 1
fi
account_line="$(grep -nF '<script src="account-deletion.js' "$ROOT/index.html" | tail -n1 | cut -d: -f1)"
collections_line="$(grep -nF "$COLLECTION_TAG" "$ROOT/index.html" | tail -n1 | cut -d: -f1)"
if [[ -z "$account_line" || -z "$collections_line" || "$collections_line" -le "$account_line" ]]; then
  echo "ERROR: Collections must load after the main app and account-deletion script" >&2
  exit 1
fi
if grep -q 'loadFavoriteCollections\|swiftFavoriteCollectionsScript' "$ROOT/supabase-config.js"; then
  echo "ERROR: Collections must not depend on the generated Supabase config loader" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$ROOT/build.sh" "$TMP/build.sh"
cp "$ROOT/index.html" "$TMP/index.html"
cp "$ROOT/favorite-collections.js" "$TMP/favorite-collections.js"
cd "$TMP"

write_sample_config() {
  cat > supabase-config.js <<'EOF'
window.SWIFT_SUPABASE_CONFIG = {
  url: "https://ivatvkfrtifgfheeaelj.supabase.co",
  anonKey: "sb_publishable_preview_test"
};
window.SWIFT_SUPABASE_PRODUCTION_CONFIG = {
  url: "https://pzymiesazmpyvnfvsbsc.supabase.co",
  anonKey: "sb_publishable_production_test"
};
EOF
}

# Local development must not overwrite the checked-in configuration.
printf '%s\n' 'local-config-sentinel' > supabase-config.js
bash build.sh >/dev/null
grep -q '^local-config-sentinel$' supabase-config.js

# Preview branches use the Singapore staging project and its checked-in key.
write_sample_config
env CF_PAGES=1 CF_PAGES_BRANCH=feature/test \
  SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_preview_test bash build.sh >/dev/null
grep -q 'ivatvkfrtifgfheeaelj.supabase.co' supabase-config.js
grep -q 'sb_publishable_preview_test' supabase-config.js
grep -q 'swiftdictionary-anonymous-saved' supabase-config.js
grep -Fq "$COLLECTION_TAG" index.html
test -f favorite-collections.js
if grep -q 'favorite-collections.js' supabase-config.js; then
  echo "ERROR: generated preview config should not load Collections" >&2
  exit 1
fi

# Production requires its explicit environment variables and project URL.
env CF_PAGES=1 CF_PAGES_BRANCH=main \
  SWIFT_SUPABASE_URL=https://pzymiesazmpyvnfvsbsc.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_production_test bash build.sh >/dev/null
grep -q 'pzymiesazmpyvnfvsbsc.supabase.co' supabase-config.js
grep -q 'sb_publishable_production_test' supabase-config.js
grep -q 'swiftdictionary-anonymous-saved' supabase-config.js
grep -Fq "$COLLECTION_TAG" index.html

# Cross-environment mistakes and invalid keys must fail closed.
if env CF_PAGES=1 CF_PAGES_BRANCH=main \
  SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_production_test bash build.sh >/dev/null 2>&1; then
  echo "ERROR: production accepted the staging project URL" >&2
  exit 1
fi
if env CF_PAGES=1 CF_PAGES_BRANCH=feature/test \
  SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=legacy-anon-key bash build.sh >/dev/null 2>&1; then
  echo "ERROR: preview accepted a non-publishable key" >&2
  exit 1
fi
if env CF_PAGES=1 SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_preview_test bash build.sh >/dev/null 2>&1; then
  echo "ERROR: build accepted a missing branch identifier" >&2
  exit 1
fi

# Preview builds can omit optional Cloudflare variables and still resolve staging safely.
write_sample_config
env -u SWIFT_SUPABASE_URL -u SWIFT_SUPABASE_PUBLISHABLE_KEY \
  CF_PAGES=1 CF_PAGES_BRANCH=feature/test bash build.sh >/dev/null
grep -q 'ivatvkfrtifgfheeaelj.supabase.co' supabase-config.js
grep -q 'sb_publishable_preview_test' supabase-config.js

# A preview must not accept a key that differs from the checked-in staging key.
write_sample_config
if env CF_PAGES=1 CF_PAGES_BRANCH=feature/test \
  SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_production_test bash build.sh >/dev/null 2>&1; then
  echo "ERROR: preview accepted the production publishable key" >&2
  exit 1
fi

# Missing staging key and missing production variables both fail closed.
printf '%s\n' 'no-staging-key' > supabase-config.js
if env -u SWIFT_SUPABASE_URL -u SWIFT_SUPABASE_PUBLISHABLE_KEY \
  CF_PAGES=1 CF_PAGES_BRANCH=feature/test bash build.sh >/dev/null 2>&1; then
  echo "ERROR: preview accepted a missing staging publishable key" >&2
  exit 1
fi
if env -u SWIFT_SUPABASE_URL -u SWIFT_SUPABASE_PUBLISHABLE_KEY \
  CF_PAGES=1 CF_PAGES_BRANCH=main bash build.sh >/dev/null 2>&1; then
  echo "ERROR: production accepted missing environment variables" >&2
  exit 1
fi

echo "PASS: local preservation, staging preview fallback, production routing, and fail-closed configuration checks"
