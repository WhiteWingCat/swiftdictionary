# SwiftDictionary Update 2.7.0 — Singapore Staging Migration and Preview Validation

Date: 2026-11-21

## Owner approval and target confirmation

The owner approved proceeding with the Update 2.7.0 language-aware Lessons migration to Singapore staging, preferring automated execution where possible.

Supabase project discovery confirmed the correct target:
- Name: `SwiftDictionary Indie Staging`
- Project ref: `ivatvkfrtifgfheeaelj`
- Region: `ap-southeast-1` (Singapore)
- Status before migration: `ACTIVE_HEALTHY`
- Production project is separate (Tokyo, `pzymiesazmpyvnfvsbsc`) and was not targeted.

## Pre-migration read-only checks

Before applying the migration, inspected staging migration history, tables, and data:
- The preceding U2.6.0 migrations were present through `20261120023718`.
- `public.languages` already contained `zh`.
- `public.lesson_progress` and `public.lesson_practice_results` each contained one existing row.
- No duplicate progress identities or duplicate practice-result identities would conflict with the new language-scoped unique keys.
- Existing learning content catalogue was English-only (163 rows); no Chinese Daily Learning entries existed.
- No destructive reset or schema rebuild was used.

## Migration applied

Applied the exact committed source migration:
`supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql`

Supabase returned success. The hosted migration history recorded it as:
- Version: `20261121074834`
- Name: `swiftdictionary_update_2_7_0_language_aware_lessons`

The platform-assigned version differs from the repository filename timestamp; the applied SQL content was fetched from the feature branch and passed directly to the staging migration operation.

## Post-migration verification

Read-only checks on Singapore staging confirmed:
- 17 active Chinese permanent lessons.
- 17 active English permanent lessons.
- Zero Chinese Daily Learning activities.
- `learning_language` columns exist on both lesson progress and practice results.
- The language-scoped practice-result unique index exists.
- Existing rows remain and are still assigned to English.
- Language-aware completion RPC is SECURITY INVOKER, rejects anon execution, permits authenticated execution, and explicitly checks `auth.uid()`.
- The language-aware replay-summary RPC is SECURITY DEFINER, rejects anon execution, permits authenticated execution, and explicitly checks `auth.uid()`. This matches the current migration design and is surfaced by Supabase Security Advisor; keep the explicit ownership/catalogue checks and search-path hardening under regression coverage. Do not change it casually without a security review.

Security Advisor additionally reports existing private-schema RLS-without-policy INFO findings and an Auth leaked-password protection WARN; the latter is unrelated to this migration and should be reviewed separately if password authentication is introduced. Performance Advisor reports existing unindexed FK and RLS initplan warnings, plus the new language-scoped indexes as unused on the small staging dataset. No unrelated advisor remediation was applied.

No production schema, migration, secrets, OAuth settings or deployment was changed.

## Draft PR and automated checks

Created draft PR #14:
https://github.com/WhiteWingCat/swiftdictionary/pull/14

Initial head: `e7d911f72d443e07eb6aa47a80229711a9288c05`.

The initial PR CI exposed a stale Update 2.3.0 frontend assertion expecting English-only RPC names. The application now correctly calls:
- `complete_permanent_lesson_for_language`
- `record_completed_lesson_practice_result_for_language`

Updated `tests/update-2-3-0/check-frontend.mjs` to assert the language-aware RPCs. New commit:
`ff4c1c4bda297a58bc0403d9795c0dbd75c2f254`.

The stale test failure was:
`Frontend integration check failed: missing rpc("complete_permanent_lesson"`.
This was a test expectation mismatch, not a failure in the app RPC itself. The earlier run's other Chromium smoke job passed.

At the updated head, the U2.7.0 workflow run #44882082850 has started. Static dictionary checks, Chinese Lessons content/pinyin checks, and full Lessons/Daily Learning browser regression already passed at the preceding head. The new run must finish before declaring final CI success. The 2.3.x, 2.5.0, 2.6.0 and Quiz integration workflows are also running for PR #14.

The Cloudflare Pages bot has started a new preview build for commit `ff4c1c4`; at the latest check it was still in progress and had not yet published a preview URL. A separate older Cloudflare Workers build for `e7d911f` had failed, but this was not the current Pages preview deployment. The Cloudflare build-routing guard passed on the initial PR head and is running again on the updated head.

Cloudflare dashboard build logs are not accessible through the currently connected GitHub/Supabase tools. If the current Pages build fails, inspect the Cloudflare Pages build log before changing build configuration.

## Current release boundary

- Singapore staging language-aware migration: applied and post-verified.
- Production: untouched.
- PR #14: draft/open/unmerged.
- Merge to `main`: not approved.
- Production migration/deployment: not approved.
- Cloudflare preview: latest Pages build in progress; no verified preview URL yet.
- Manual native-speaker linguistic review of the Chinese dictionary and lesson pinyin remains outstanding.
- Malaysia/general legal and privacy review remains deferred, not cleared.

## Next actions

1. Wait for CI on latest PR head `ff4c1c4` and fix any genuine failures.
2. Confirm the Cloudflare Pages preview build result. If it fails, inspect Cloudflare build logs; do not infer the cause from the unrelated older Workers build failure.
3. Once preview is live, test signed-out browsing and dictionary filters; sign in with a disposable synthetic staging account for Chinese Lessons, course-specific progress, shared allowance, replay summaries and account switching. Avoid destructive testing with the owner's personal account.
4. Keep PR #14 draft until manual content review and owner testing are complete.
5. Request separate explicit approval before marking PR ready/merging, and separate approval for any production migration or deployment.




## Final follow-up — Pages preview deployed; CI regression suite status

- Cloudflare Pages bot confirmed successful deployment for latest application head `ff4c1c4`:
  - Deployment: https://06110066.swiftdictionary.pages.dev
  - Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev
- Cloudflare build-routing guard run #44882082871 passed.
- U2.7.0 dictionary static/data, Chinese Lessons content/pinyin, full Lessons/Daily Learning browser regression, isolated dictionary browser checks and bilingual layout browser check all passed in run #44882082850.
- Update 2.3.x PostgreSQL 17 migration/allowance, Supabase CLI local Auth compatibility, and Chromium smoke jobs all passed in run #44882082837. This also confirms the stale frontend RPC assertion fix.
- Update 2.5.0 Flashcards jobs passed in run #44882082822.
- Update 2.6.0 ACL drift regression passed in run #44882082838.
- Quiz database foundation job passed in run #44882082923. Its companion Local Supabase Auth/RPC integration job was still running the authenticated Chromium Quiz runtime tests at the latest check; the complete run is not yet green.
- Cloudflare's separate Workers Builds check for the retired `swiftdictionary-testing` Worker failed again. This is distinct from the successful `swiftdictionary` Cloudflare Pages preview and is not treated as the active app deployment.
- The Pages deployment's private build log was not accessible through the current GitHub/Supabase connectors. The build-routing guard passes and the branch preview is deployed, but the exact generated backend config for this specific build was not independently read from the Cloudflare log. Keep the staging-only environment routing check in the final preview verification before signing in.
