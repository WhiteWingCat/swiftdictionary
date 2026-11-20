#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cp "$ROOT/build.sh" "$TMP/build.sh"
cd "$TMP"
printf '%s\n' 'local-config-sentinel' > supabase-config.js

# Local development must not overwrite the checked-in configuration.
bash build.sh >/dev/null
grep -q '^local-config-sentinel$' supabase-config.js

# Preview branches must receive the Singapore staging project.
env CF_PAGES=1 CF_PAGES_BRANCH=feature/test \
  SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test bash build.sh >/dev/null
grep -q 'ivatvkfrtifgfheeaelj.supabase.co' supabase-config.js
if grep -q 'account-deletion.js' supabase-config.js; then
  echo "ERROR: build injected account-deletion.js before the main app script" >&2
  exit 1
fi
grep -q 'swiftdictionary-anonymous-saved' supabase-config.js

# The production branch must receive the Tokyo production project.
env CF_PAGES=1 CF_PAGES_BRANCH=main \
  SWIFT_SUPABASE_URL=https://pzymiesazmpyvnfvsbsc.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test bash build.sh >/dev/null
grep -q 'pzymiesazmpyvnfvsbsc.supabase.co' supabase-config.js
if grep -q 'account-deletion.js' supabase-config.js; then
  echo "ERROR: build injected account-deletion.js before the main app script" >&2
  exit 1
fi
grep -q 'swiftdictionary-anonymous-saved' supabase-config.js

# Cross-environment mistakes and invalid keys must fail closed.
if env CF_PAGES=1 CF_PAGES_BRANCH=main \
  SWIFT_SUPABASE_URL=https://ivatvkfrtifgfheeaelj.supabase.co \
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test bash build.sh >/dev/null 2>&1; then
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
  SWIFT_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test bash build.sh >/dev/null 2>&1; then
  echo "ERROR: build accepted a missing branch identifier" >&2
  exit 1
fi

if env CF_PAGES=1 CF_PAGES_BRANCH=feature/test bash build.sh >/dev/null 2>&1; then
  echo "ERROR: build accepted missing environment variables" >&2
  exit 1
fi

echo "PASS: local preservation, staging routing, production routing, and fail-closed configuration checks"
