# SwiftDictionary — Live Supabase staging synchronization (2026-11-18)

## Purpose

The owner approved the recommendation to bring the separate SwiftDictionary staging database up to the current Quiz backend/content state, after a read-only comparison with production and the current main branch migration directory.

## Safety boundary

- Production project pzymiesazmpyvnfvsbsc was read-only throughout this task.
- All database writes were confined to staging project ivatvkfrtifgfheeaelj (SwiftDictionary Indie Staging, Singapore).
- No production learner records, authentication users, profiles, saved words, preferences or learning history were copied.
- No application code, production configuration or production deployment was changed.

## Initial staging gap

The staging database had the core 2.4.0 Quiz schema/RPCs but did not contain the production Quiz question content. It was missing the 2.4.0 content-release migration and the 2.4.1 translation-language function update. Staging already had 15 active permanent lesson mappings, so the guarded content-release preflight could be satisfied.

Staging was otherwise clean: zero auth users and zero application learner rows in profiles, saved words, preferences, lesson progress/practice, learning activity log and daily activity sessions.

## Changes made

1. Applied supabase/migrations/20261117113917_swiftdictionary_update_2_4_0_quiz_content_release.sql from main (source blob fdaee41888ca50c35163a6c9d08de5e21a892f3e). The migration's empty-question-bank and 15-lesson mapping checks passed. It inserted all 199 approved questions.
2. Applied supabase/migrations/20261117132100_swiftdictionary_update_2_4_1_quiz_translation_language_fix.sql from main (source blob 887b635c494a66d2bc36ed53060babae0160099d).
3. Reconciled the staging supabase_migrations.schema_migrations tracking records to the canonical migration versions and names in main. The staging-only bootstrap record 20261117110818 was retained.
4. Added 20261110041007_swiftdictionary_update_2_2_0_reconciliation_baseline as an applied history marker without replaying its verification SQL. That migration checks historical trigger names that have since been superseded by the 2.3.0 completion-based implementation. The current tables, RLS, functions and evolved triggers were inspected. Replaying the historical name checks against the newer schema would incorrectly fail.

The history repair changed migration tracking metadata only; it did not recreate tables, rewrite learner data or replay earlier application migrations.

## Validation

- Staging migration history now includes all current main migration versions/names, plus its retained staging-only bootstrap.
- Quiz bank: 199 total; 199 approved; zero draft/retired.
- Active permanent lesson mappings: 15.
- Learning content catalogue: 161 entries.
- Production and staging content checksums match (timestamps excluded):
  - Quiz bank: 39f935c9266f228b0074e290d103b551
  - Learning catalogue: 9eb1f62b808f33e5cbe7b52050a53df1
- Hashes for the Quiz public RPC wrappers and private availability/start implementations match production exactly, including both start_my_quiz overloads.
- All four private Quiz tables have RLS enabled and no direct table grants to authenticated.
- Staging auth users: 0; application learner rows: 0.
- Staging health advisor: no findings.
- Security/performance notices remain: private RLS tables with no policies (fail closed), two authenticated SECURITY DEFINER functions also present in production, ten unindexed foreign keys, four RLS init-plan notices, and eight unused indexes. Do not remove indexes solely because staging has no usage history.
- No authenticated browser end-to-end test was performed because staging has no test account.

## Outcome and remaining work

Staging's 2.3.x/2.4.0/2.4.1 database migration set and Quiz content are now aligned with the current repository/production Quiz backend state. Update 2.4.2 had no database migration. Production remained untouched.

Before authenticated staging tests, configure a dedicated staging test user and staging OAuth redirect/callback settings. Do not copy production user data. Treat index/performance cleanup as a separate evidence-based task. Update 2.5.0 Flashcards remains unstarted.
