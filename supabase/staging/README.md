# SwiftDictionary staging environment

## Purpose and non-negotiable isolation

This directory contains the one-time foundation for the separately hosted **SwiftDictionary Indie Staging** Supabase project. It is not a Supabase Development Branch.

- Staging project ref: `ivatvkfrtifgfheeaelj`
- Production project ref: `pzymiesazmpyvnfvsbsc` — do not target it.
- Never connect the staging app to the production Supabase URL or production data.
- Do not create a Supabase Development Branch or activate paid infrastructure.
- Do not copy production user records, saved words, entitlements, or learning history.
- Never place service-role keys, database passwords, Google OAuth secrets, or access tokens in GitHub.
- Only the public staging anon/publishable key may be used in the browser after the staging schema and RLS are validated.

## Current staging state (2026-11-17)

- The clean bootstrap has been applied to the hosted staging project.
- All 12 ordered 2.3.x/2.4.0 migrations have been applied successfully after the bootstrap (13 migration records including the baseline).
- The staging project is healthy in `ap-southeast-1`.
- The staging database currently has **zero Auth users, zero Quiz questions, zero approved content, zero Quiz sessions and zero learner history**. No production data was copied.
- The feature-branch `supabase-config.js` now points to the staging project and its public publishable key. Production `main` configuration is unchanged.
- Cloudflare Pages successfully deployed feature commit `794e8ab` to [the isolated preview](https://a81b4f89.swiftdictionary-testing.pages.dev).
- Google OAuth is not yet configured in staging. Do not invite testers or expect sign-in to work until a staging-specific Google OAuth client is configured and its redirect URLs are allowlisted.
- The current branch CI validates the same clean bootstrap, migration order, authenticated RPCs, draft import, browser runtime and security advisors. Check the latest branch-head run before any tester onboarding.

The one-time `verify-clean-bootstrap.sql` is only for the moment immediately after the baseline and **before** application migrations. Do not run it after migrations; its six initial plan-limit-row assertion is expected to change when the 2.3.x migrations add Daily Learning categories. After migrations, use `verify-migration-grants.sql` and the hosted staging data-boundary checks instead.

## Fresh-project bootstrap

`bootstrap.sql` is a one-time, staging-only app-schema baseline. It is intentionally outside `supabase/migrations`, because it must not be swept into a production migration push.

The bootstrap:
- Creates the base application tables and owner-scoped RLS policies needed by the 2.3.x/2.4.0 migrations.
- Seeds only public reference rows (English/Simplified Chinese and initial plan-limit rows).
- Contains no synthetic users, no user-specific rows, and no production data.
- Uses least-privilege browser grants and explicit server-only `service_role` grants.
- Revokes broad default privileges for future public tables and sequences, matching Supabase's post-2026-10-30 Data API security model. Public RPCs receive explicit function grants; lesson trigger functions are explicitly revoked from client roles.
- Is checked by `verify-clean-bootstrap.sql` before CI-only synthetic fixtures are loaded.
- Is followed by `verify-migration-grants.sql`, which checks explicit `service_role` access, owner-scoped authenticated access, no anonymous access, and authenticated-only Quiz RPC execution.

Only run it against the verified empty staging project. Do not rerun it after the application schema exists. If any application table is already present, stop and inspect rather than dropping or resetting anything.

## Migration sequence after bootstrap

Use the existing tested sequence from `.github/workflows/quiz-db-foundation.yml`, with the clean-staging exception that the 2.2.0 **reconciliation-only** migration is skipped. That reconciliation migration asserts objects already deployed in the historical production schema; it is not a fresh-schema installer.

1. `202611090001_swiftdictionary_personal_lesson_testing_allowlist.sql`
2. `20261114082303_swiftdictionary_update_2_3_0_saved_words_privilege_hardening.sql`
3. `20261114082311_swiftdictionary_update_2_3_0_learning_content_catalog.sql`
4. `20261114082324_swiftdictionary_update_2_3_0_completion_based_allowance.sql`
5. `20261114082328_swiftdictionary_update_2_3_0_daily_activity_sessions.sql`
6. `20261114082332_swiftdictionary_update_2_3_0_current_window_allowance_ledger.sql`
7. `20261114082335_swiftdictionary_update_2_3_0_learning_history_deletion.sql`
8. `20261114120000_swiftdictionary_update_2_4_0_quiz_question_bank_foundation.sql`
9. `20261114160000_swiftdictionary_update_2_4_0_quiz_authenticated_rpcs.sql`
10. `20261116043139_swiftdictionary_update_2_4_0_quiz_allowance_1_3.sql`
11. `20261116090000_swiftdictionary_update_2_4_0_learning_page_introduction_preferences.sql`
12. `20261117180000_swiftdictionary_update_2_4_0_quiz_authenticated_question_types.sql`

The sequence must be run in the same order in staging and CI. Any change to it requires rerunning the clean-bootstrap integration checks.

## Content and friend-testing gate

All 199 authored questions remain draft and unapproved. Structural import is not publication. Before friend testing can use the authored bank, obtain explicit owner approval for a **staging-only test release**. That would make the questions available only in this isolated staging environment for feedback; it must not approve or publish them in production.

Until that separate approval:
- Do not import the authored bank into hosted staging.
- Do not change any question status to approved.
- Synthetic CI-only fixtures may be approved only inside disposable local CI.

## Authentication and preview

The app currently uses Google OAuth. To enable real staging sign-in, configure a **separate staging Google OAuth client** (do not paste its secret into this repository or chat):

- Supabase Auth provider callback URI to register in Google Cloud: `https://ivatvkfrtifgfheeaelj.supabase.co/auth/v1/callback`.
- Supabase Auth Site URL: `https://a81b4f89.swiftdictionary-testing.pages.dev`.
- Add the exact preview origin above to Supabase Auth's additional redirect URLs. If the stable branch alias is used, add `https://feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev/**` as well.
- Enter the Google client ID and client secret only in the Supabase Dashboard's Google provider settings.

Before inviting friends:
- Configure a staging-only Google OAuth client and exact staging callback/allowed URLs.
- Configure the exact Cloudflare Pages preview hostname to use the staging Supabase URL and public anon/publishable key.
- Confirm the preview never falls back to production credentials for any route, query parameter, or account state.
- Create separate disposable tester accounts and verify account isolation, RLS, history deletion, daily allowances, Quiz sessions and feedback handling.
- Clearly label the preview as a test environment and do not invite users until the staging security checks and privacy wording are complete.

## CI and safety

The Quiz CI workflow applies this bootstrap to a disposable local Supabase stack, then loads synthetic legacy-state fixtures in a separate CI-only SQL file before running the existing migrations and tests. The fixtures must never be run against hosted staging or production.
