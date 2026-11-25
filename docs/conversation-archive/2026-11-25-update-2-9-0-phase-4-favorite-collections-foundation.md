# 2026-11-25 — Update 2.9.0 Phase 4 Favorite Collections foundation

## Owner instruction and authority

The owner instructed development to begin Phase 4 after reviewing the latest Master Development Record, U2.9.0 plan and relevant conversation archive. Phase 3 was formally complete. The approved scope remains the Favorite Collections implementation in docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md.

The owner’s staging-preview restriction remains active: do not prepare or provide a staging preview until Phase 4 is fully implemented and internally validated.

## Branch and implementation

- Application branch: feature/update-2-9-0-english-dictionary-collections.
- Added favorite-collections.js with the initial collection panel, in-site create/rename/delete dialogs, collection detail view, mixed-language saved-word selection, membership add/remove, loading/error/empty states, account-aware refresh and optional Realtime refresh.
- Updated account-deletion.js to load the collections module after the main application script. No core dictionary data, learning allowance, Premium entitlement or payment code was intentionally changed.
- Added tests/browser/u2-9-0-favorite-collections.spec.js for mocked browser interaction coverage of collection creation, English/Chinese membership, rename, membership removal and collection deletion without deleting saved words.
- Extended .github/workflows/u2-9-0-dictionary-qa.yml to include the new browser spec and relevant source paths.
- Added supabase/migrations/20261125041816_swiftdictionary_update_2_9_0_favorite_collections.sql and supabase/tests/favorite_collections.sql.

## Data model and staging migration

The isolated staging Supabase project ivatvkfrtifgfheeaelj received the U2.9.0 collections foundation migration:

- public.favorite_collections stores a UUID folder ID, owner user_id, name and timestamps.
- public.favorite_collection_items links a folder to an existing public.saved_words.id, allowing both English and Chinese saved words without copying word data.
- Case-insensitive per-user folder-name uniqueness is enforced by a unique index. Names are trimmed and limited to 1–48 characters.
- Both tables have RLS enabled. Collections have owner-scoped SELECT/INSERT/UPDATE/DELETE policies. Membership SELECT/INSERT/DELETE policies require ownership of both the collection and the saved-word row.
- Foreign keys cascade membership deletion when a collection or saved word is deleted. Deleting a collection does not delete the saved-word record.
- Authenticated grants are limited to the required CRUD operations; anonymous table access is revoked.
- No folder-count quota is enforced. The proposed 16-Free/40-Premium capacities remain future policy only.

Staging migration application succeeded and the staging migration ledger records version 20261125041816. Read-only post-checks confirmed RLS enabled on both tables, seven owner-scoped policies (four collection and three membership), the case-insensitive unique index, the supporting membership index and both cascading foreign keys. Existing staging saved-word rows remained at 14; collection and membership tables remained empty after the schema checks.

The post-migration Supabase security advisor returned the same existing findings as before: ten informational RLS-enabled/no-policy findings on private tables and one warning that leaked-password protection is disabled. No new collections-specific advisor finding appeared.

## Validation status

- Migration application: passed on isolated staging.
- Schema/policy/index/grant inspection: passed.
- Existing saved-word preservation check: passed (14 rows before/after; no collection test data persisted).
- The SQL regression script was executed successfully against isolated staging and rolled back. It verifies RLS enablement, policy counts, owner-predicate structure, cascading foreign keys, name uniqueness and grants.
- A transactional cross-account RLS impersonation test was not completed; direct adversarial RLS behaviour remains an explicit outstanding validation item.
- The new Playwright test and workflow integration were committed, but no successful GitHub Actions run for the new collections spec has yet been verified in this checkpoint. Do not represent mocked browser coverage as live Supabase integration testing.
- The module’s actual placement relative to the rendered Favorite words heading still needs verification against the full browser DOM, along with authenticated CRUD against the isolated staging project.
- No staging preview has been created.

## Legal, privacy and release boundaries

- Collections add user-generated folder names and references to already-account-owned saved words. No new identity fields, tracking or third-party processor are introduced.
- Keep collection access private to the owner; do not add public sharing or analytics. Account deletion cascades through collection ownership, and saved-word deletion removes only associated membership rows.
- Malaysia PDPA and general international privacy obligations remain relevant, including transparency, purpose limitation, minimisation, retention, access/deletion and processor/cross-border review where applicable. Privacy/terms copy should explain collections before release. This is planning, not legal clearance.
- Intended global 16+ audience safeguards remain applicable.
- Production Supabase, production data, main, deployment, checkout/payment/subscription and entitlement enforcement remain untouched.
- Dictionary search remains free and unlimited; learning allowances remain unchanged.

## Recovery point and next work

Continue on feature/update-2-9-0-english-dictionary-collections.

Next:
1. Verify the Favorite words anchor and collections panel in a real browser DOM; adjust the mounting point if needed.
2. Run and fix the new Playwright suite and existing U2.9.0 regressions.
3. Complete authenticated staging CRUD and adversarial RLS tests for two distinct accounts, including direct API attempts to cross-link another account’s saved words.
4. Verify cross-device refresh/Realtime fallback, account switching, empty states, duplicate names, long names, failures, keyboard accessibility and mobile/desktop layouts.
5. Run Supabase advisors and database regression checks; document any accepted findings.
6. Only after Phase 4 is fully implemented and internally validated may the first staging preview be prepared. Production changes remain separately gated by explicit owner approval.


## Follow-up — SQL schema regression passed

The collections SQL regression was strengthened to inspect the owner predicates in all collection and membership policies, then executed successfully against the isolated staging project. The transaction rolled back with no assertion failures. This confirms schema/policy structure and grants, but does not replace authenticated two-account API testing. The frontend module also gained a one-time initialization guard, dialog focus handling and signed-out create-button disabling. CI and real browser verification remain outstanding.


## Follow-up — mocked browser regression passed

GitHub Actions run 45547406099 completed successfully on application commit e4a605bc4ee880882b2b7ed998450e7f014eb27d. All 12 browser tests passed, including the new Favorite Collections mocked interaction test; the English expansion validator, Phase 3 audit and whole-catalogue editorial audit also passed, and the audit artifact uploaded successfully. The new test covers create, mixed English/Chinese membership, rename, removing a selected word, and deleting a folder without deleting saved-word records. Two earlier failures were corrected: hidden section styling on the panel/modal and an incorrect test assumption about membership ordering. The test uses a mocked Supabase client, so live authenticated CRUD and adversarial cross-account authorization remain outstanding. The browser logs confirm the app loaded favorite-collections.js through the account-deletion.js loader; actual placement on the real Favorite words dashboard and live staging API verification remain open. No staging preview was created.


## Follow-up — Realtime and cache-safe loader

A staging inspection showed supabase_realtime initially had no public tables. Added and applied staging migration 20261125043448_swiftdictionary_update_2_9_0_favorite_collections_realtime.sql to publish only favorite_collections and favorite_collection_items. RLS remains the authorization boundary. Read-only inspection confirmed both tables are in the publication, and the strengthened SQL regression including this assertion passed with rollback. The module loader was moved to supabase-config.js and deferred to DOMContentLoaded so it runs after core app bindings exist; the module URL is versioned (?v=2.9.0-p4) for cache safety. A new Playwright test checks module loading in the real app shell. The previous 12-test run 45547652317 passed before this additional test and Realtime change; a fresh run is being triggered. Live authenticated CRUD, two-account RLS API testing, dashboard placement and actual cross-device Realtime event delivery remain outstanding.


## Final CI correction — loader and Realtime tests passed

The real-app-shell loader test was included in GitHub Actions run 45547652317, which passed all 13 Playwright tests. Run 45547784739 also passed all 13 tests after the SQL regression was extended to assert that both collection tables belong to supabase_realtime. Run 45547828600 passed after workflow path filters were corrected. The earlier note that run 45547652317 preceded the loader test was inaccurate; this addendum is authoritative. These browser tests still use a mocked Supabase client for CRUD; live authenticated operations, two-account RLS testing and actual Realtime event receipt between authenticated sessions remain outstanding.


## Follow-up — dashboard placement verified

GitHub Actions run 45548152492 passed all 13 tests. Its real application-shell DOM assertion confirmed the existing Favorite words profile card is found and the new Your collections panel is its immediate next sibling, before Learning progress. The versioned module loader also passed its app-shell check. Temporary DOM diagnostics were removed while retaining the placement assertion. This verifies structural placement, not visual review in a signed-in device session. Live authenticated CRUD, two-account RLS/API tests, actual Realtime event receipt and responsive/accessibility review remain outstanding.


## Follow-up — expanded collection/account-switch tests passed

GitHub Actions run 45548503961 succeeded on commit f8abf9ee71963d8c3d625ba0cd608579767e9bdd with all 13 Playwright tests passing. The mocked collections regression now covers blank-name validation, case-insensitive duplicate-name rejection, create/rename/delete, mixed English/Chinese memberships, removing a membership without deleting the saved word, and switching between two mocked accounts while ensuring the folder list is isolated. An earlier failure came from the test mock capturing a fixed account ID; it was corrected to follow the active account. The collection count display was also optimized to use one membership query. This remains mocked CRUD coverage, not live Supabase API/RLS verification.

A post-Realtime staging inspection confirmed 14 saved_words rows, zero collections and zero memberships; both new tables are in supabase_realtime. The Supabase security advisor still reports ten informational private-schema RLS/no-policy notices and one leaked-password-protection warning, with no collections-specific finding. Remaining: live authenticated CRUD, adversarial two-account RLS/API denial, actual Realtime event delivery, signed-in visual desktop/mobile and accessibility review. No staging preview or production change has been made.


## Follow-up — saved_words schema alignment

Direct staging inspection confirmed public.saved_words has id (bigint), user_id (uuid), course (text) and word (text), with no created_at column. The collection picker was corrected to order by id descending, the mocked saved-word fixtures were aligned to the real columns, and the SQL regression now asserts these column names/types. The strengthened SQL regression passed against staging. The browser workflow for the schema-aligned module/test fixture is running. This caught a real query compatibility issue before any staging preview or production deployment.


## Follow-up — schema-aligned browser QA passed

GitHub Actions run 45548857974 succeeded on commit db5ec1c3702a0410e4a4c6e9109ae8eb91792a62 with all 13 browser tests passing. Coverage includes blank/duplicate names, create/rename/delete, mixed English/Chinese membership, removal without deleting the saved word, two-account UI switching, the real-app-shell loader and immediate placement beneath Favorite words. The picker was corrected to order by the real saved_words.id column (there is no saved_words.created_at); the SQL regression now asserts the actual saved_words schema and passed separately. Latest staging checks confirm 14 saved words remain, collection/membership tables are empty, and both tables are in supabase_realtime. Security advisor findings are unchanged (10 informational private-schema RLS/no-policy findings and one leaked-password-protection warning). Performance advisor shows the two new indexes unused while collections are empty; they remain justified by the intended owner/order and FK-cascade query patterns. Live authenticated CRUD, two-account API RLS denial, actual Realtime event delivery, signed-in device visual and accessibility checks remain open. No staging preview or production change has been made.
