# Update 2.6.0 — Account-deletion foundation implementation (20 November 2026)

## Owner decision

The owner approved the following account-deletion UX:

- The optional local saved-word clearing checkbox appears only when signed-out local saved words exist in the current browser.
- It is unchecked by default.
- It clears only the designated signed-out local saved-word collection for the current browser.
- It must not clear another account's cloud data or unrelated browser storage.
- Account deletion is independent of optional local clearing. If account deletion succeeds but local clearing fails, report that the account was deleted while local words may remain.

## Repository implementation

Implementation was made on `feature/update-2-6-0-legal-privacy-security`, not `main`.

Files added/changed:
- `account-deletion.js` — Profile → Preferences deletion card/dialog, optional local clearing checkbox, session freshness handling, client invocation and post-delete messaging.
- `supabase-config.js` and `build.sh` — load the account-deletion module in local/Cloudflare builds and preserve the anonymous local saved-word collection before the legacy Auth handler clears the old key.
- `supabase/functions/delete-account/index.ts` and `security.ts` — server-side account deletion function and testable auth-time/origin guards.
- `supabase/functions/delete-account/deno.test.ts` — unit tests for JWT payload parsing, 15-minute auth-time gate and allowed origins.
- `tests/update-2-6-0/account-deletion-static.test.mjs` — static checks for local-storage scope, user derivation, session revocation and privileged-key exclusion.
- `.github/workflows/cloudflare-build-routing.yml` and `tests/cloudflare-build-routing.sh` — syntax, unit, static and build-routing checks.

## Important existing app behaviour discovered and preserved

The pre-existing app used `swiftdictionary-saved` for signed-out local words, but the Auth refresh handler cleared that legacy key when a user signed in or signed out. Signed-in saved words were loaded from Supabase and were not cached in that shared key.

The implementation introduces `swiftdictionary-anonymous-saved` as a separate local collection. It is kept hidden while signed in, is restored to the dictionary after sign-out, and is never merged into a signed-in account. The optional deletion checkbox targets this anonymous key only (plus removal of the legacy compatibility key), never a blanket browser-storage clear.

## Server-side deletion safeguards

The Edge Function:
- Has platform JWT verification enabled.
- Requires POST and explicit `confirm: true`.
- Requires an `auth_time` claim no older than 15 minutes.
- Verifies the supplied bearer token with Supabase Auth and derives the target UID from the verified user; no client UID is accepted.
- Uses the server-provided service-role environment secret only inside the Edge Function.
- Revokes refreshable sessions globally before deleting the Auth user.
- Calls Auth Admin `deleteUser` and verifies the user is no longer returned before reporting success.
- Reports retryable partial failure if session revocation succeeded but deletion failed.
- Warns that already-issued access JWTs remain valid until expiry.

## Staging deployment and validation status

- Deployed `delete-account` Edge Function to Singapore staging project `ivatvkfrtifgfheeaelj`, version 2, ACTIVE, `verify_jwt=true`.
- No Edge Function was deployed to production.
- A read-only inspection of staging foreign keys found all SwiftDictionary application-table references to `auth.users` configured with `ON DELETE CASCADE`. The affected data includes saved words, profile/preferences/entitlements, lesson progress and practice, learning activity, daily sessions, Quiz records/reservations, Flashcard collections/cards/mastery/review/session records, and the private learning allowance/test-access records. Supabase-owned Auth identities/MFA/tokens/sessions also cascade. The only Auth-schema exception returned was Supabase's own SCIM user reference using `ON DELETE SET NULL`; SwiftDictionary does not use SCIM.
- GitHub Actions run for commit `cdfef0b6090935bae04c8f7c853855c93356bb6d` passed: JavaScript syntax check, account-deletion static safeguards, Deno helper tests, Deno type check and Cloudflare environment-routing tests.
- Earlier CI failures were investigated and corrected; do not treat the failed intermediate runs as current status.
- Existing staging security advisor notices remain: eight private tables with RLS/no direct policies (intended server-only pattern pending final advisor review) and two existing SECURITY DEFINER RPC warnings. They were not changed in this account-deletion implementation.

## Not yet completed

- The Cloudflare preview has not yet been manually exercised for the new UI.
- No synthetic Auth user was deleted in hosted staging yet. Before destructive end-to-end testing, confirm the preview's staging backend routing, create a disposable synthetic account and seed synthetic rows, then verify recent-auth rejection, global refresh-session revocation, all cascades, success verification, partial-failure handling, and checkbox checked/unchecked behaviour.
- The owner must perform the interactive Google reauthentication and deletion test with a disposable staging account. Never use the owner's personal/production accounts for destructive testing.
- Verify that signed-out anonymous saved words survive sign-in/account switching and are restored after sign-out on the preview. Test optional clearing only on a synthetic browser profile.
- Production ACL review/remediation, remaining provider/data-flow checks, full DPIA, legal decisions, privacy-contact verification and legal-document approval remain outstanding.
- No legal drafts were published; no production data, settings, schema, function, or deployment were changed.

## Recovery point

Continue from the current feature branch and deployed Singapore staging Edge Function version 2. Check the latest GitHub Actions run and current branch head before making further edits. Keep destructive tests limited to synthetic staging accounts. Do not merge or deploy to production without explicit owner approval and completion of legal/release gates.
