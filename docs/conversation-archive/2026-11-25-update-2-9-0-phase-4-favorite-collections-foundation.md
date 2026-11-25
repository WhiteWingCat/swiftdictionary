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
- Static SQL regression test added for RLS enablement, policy counts, cascading foreign keys, name uniqueness and grants.
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
