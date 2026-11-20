# Update 2.6.0 — Account deletion auth freshness and failure feedback fix (2026-11-20)

## Owner request
The owner reported that deleting their own account on Singapore staging appeared to do nothing: the page refreshed, the session remained signed in, and saved words/progress remained visible. They authorised the assistant to fix the issue and asked to avoid manual file/configuration steps.

## Diagnosis
- Read the current Master Development Record and account-deletion foundation / owner-feedback archives before making changes.
- Singapore staging project: `ivatvkfrtifgfheeaelj`; Tokyo production remains `pzymiesazmpyvnfvsbsc`.
- Staging Edge Function logs recorded two POST requests to `delete-account`, both HTTP 401. The JWTs were valid Google OAuth sessions, but the logs showed no `auth_time` claim.
- The existing Edge Function required `auth_time` within 15 minutes. Current Supabase JWT Claims Reference documents `amr` entries with `method` and `timestamp`, while `auth_time` is not listed as a standard Supabase access-token claim. This explains why the valid Google session was rejected before deletion began.
- Supabase JWT Claims Reference: https://supabase.com/docs/guides/auth/jwt-fields
- The frontend already had 401 feedback logic, but the owner observed a refresh and no feedback. Client failure handling was hardened to prevent default event navigation, keep the dialog visible and explicitly state that account/data were not deleted on a 401.

## Implementation
Application changes remain on `feature/update-2-6-0-legal-privacy-security`, not `main`.

- `supabase/functions/delete-account/security.ts`: replaced the unsupported `auth_time` check with Supabase `amr[].timestamp` freshness validation. `token_refresh` entries are excluded so refreshing an old session cannot make it appear recently authenticated. The 15-minute requirement remains; missing, stale, malformed and future timestamps fail closed.
- `supabase/functions/delete-account/index.ts`: invokes the new AMR freshness guard. Existing verified-user lookup, UID derivation from the bearer session, global refresh-session revocation, Auth Admin deletion and final user-absence verification remain intact.
- `supabase/functions/delete-account/deno.test.ts`: tests recent/stale OAuth timestamps, token-refresh exclusion, missing/invalid/future timestamps and the unchanged 15-minute maximum.
- `account-deletion.js`: prevents default click navigation and propagation; 401 and other failures remain visible in the in-site dialog, with explicit non-deletion wording and reauthentication action.
- `index.html`: bumped account-deletion module cache key to `v=2.6.0-r4`.
- `tests/update-2-6-0/account-deletion-static.test.mjs`: adds assertions for failure visibility/no navigation and updates AMR helper/cache-key expectations.

## Commits and validation
Feature branch commits made during this correction:
- `c9907276b3f9b9da1c524b39da81e36da2d01422` — AMR freshness helper.
- `3609ee36b07be456a3c26f64bca2d32595fb03a7` — AMR unit tests.
- `e5036114ea81adaa336592570c2cf5f55e1fb2c2` — Edge Function integration.
- `d2660f587fed1db073262b027e7d3d9843d28d4a` — frontend failure feedback/no-navigation handling.
- `8f08431268bc741cdf610a91b06c5313e1c2ed6f` — static regression checks.
- `cce8f196dd8222ddc3448e8138aa4b1304780252` — cache-bust r4.
- `2e662bfcae58cacf5b569ee7e2631cd51475013e`, `dc8ad010116783440d20ca816614ac4fef7f926a`, `1676e65f19decb935e05f0aa26c78d8657fe623b` — test assertion corrections and final test/cache expectation alignment.
- Final feature branch head at archive time: `1676e65f19decb935e05f0aa26c78d8657fe623b`.
- Cloudflare build-routing guard run `44714423795` completed successfully on the final head; JavaScript/static safeguards, Deno type check/unit tests and environment routing all passed. Earlier intermediate failures were test expectation mismatches, corrected in later commits.
- Singapore staging Edge Function `delete-account` deployed as version 3, ACTIVE, `verify_jwt=true`. No production function was deployed or changed.
- Quiz database foundation workflow for the final head was still in progress at the time of archive; it is separate from the account-deletion guard.
- Cloudflare Pages preview deployment triggered by the feature-branch push; its exact deployed commit was not independently confirmed during this session.

## Safety and legal/privacy status
- The owner’s personal account must not be used for another destructive test. The failed requests were rejected before the deletion logic, so available logs support that no deletion was performed in those attempts; saved words/progress remaining is consistent with that.
- Do not repeat destructive tests until a disposable synthetic Singapore-staging account is created. Seed only synthetic rows, verify cascade deletion and session revocation, then verify browser sign-out and UI feedback.
- No Tokyo production changes, production data changes, migrations, schema changes, provider settings, or legal-document publication occurred.
- Malaysia PDPA applicability, controller identity, 16–17-year-old safeguards, cross-border transfers, provider contracts, DPIA and legal approval remain open. Account deletion is not a substitute for those release gates.

## Recovery point / next steps
1. Verify the Cloudflare Pages preview is serving the final feature-branch commit and the Singapore staging Supabase URL.
2. Create a disposable synthetic Google account in Singapore staging and seed synthetic saved-word/progress records.
3. Test fresh OAuth sign-in acceptance, stale-session rejection, refresh-token exclusion, global refresh-session revocation, Auth deletion, all application cascades, and truthful browser sign-out/status.
4. Test optional anonymous local-word clearing checked/unchecked in a synthetic browser profile.
5. Keep production untouched; do not merge or deploy production without explicit owner approval and completion of all existing U2.6.0 legal/release gates.
