# Update 2.4.0 — staging bootstrap and deferred friend-testing review

**Date:** 2026-11-17  
**Repository:** `WhiteWingCat/wordbook`  
**Feature branch:** `feature/update-2-4-0-quiz`  
**PR:** #8 — remains draft and unmerged

## Owner decision

The owner chose to postpone the manual accuracy review of all 199 Quiz questions until they can invite friends to test the live/staging website and provide feedback. This defers the editorial review; it does not waive it or approve content for production.

The immediate next step is to prepare isolated authenticated staging. Do not treat the request to skip manual review as permission to publish the 199 questions to production. A separate explicit approval is still required before changing the hosted staging bank to selectable test content.

## Clean staging bootstrap

Added a one-time baseline outside `supabase/migrations`:
- `supabase/staging/bootstrap.sql`
- `supabase/staging/verify-clean-bootstrap.sql`
- `supabase/staging/verify-migration-grants.sql`
- `supabase/staging/README.md`

The baseline creates only the base app schema, owner-scoped RLS policies, public language references and initial plan-limit rows. Synthetic Auth identities and legacy learning-history fixtures were split into `tests/update-2-3-0/supabase-local-app-fixtures.sql`, which is CI-only and must never be run against hosted staging or production.

The Quiz CI workflow now applies the same clean bootstrap, verifies the empty baseline, then adds the separate synthetic fixtures and runs the ordered migrations. It also checks explicit grants for authenticated users, service-role operations, authenticated-only Quiz RPCs and no anonymous access to account-specific tables.

The baseline revokes broad default privileges for future public tables/sequences and grants explicit access. Two pre-existing lesson functions flagged by the Supabase advisor were reviewed: the personal-exemption RPC only returns the authenticated caller's own allowlist status; the replay-practice RPC validates `auth.uid()`, the lesson catalogue and completed lesson ownership before inserting a single aggregate result. Both are intentional authenticated SECURITY DEFINER RPCs. Private-schema tables are RLS-enabled without client policies and are not exposed through the Data API.

## Hosted staging migration

Target project: **SwiftDictionary Indie Staging** (`ivatvkfrtifgfheeaelj`), region `ap-southeast-1`, PostgreSQL 17.12, status ACTIVE_HEALTHY.

The clean bootstrap and all 12 ordered 2.3.x/2.4.0 migrations were successfully applied through the Supabase project connector (13 migration records including the baseline). This included:
1. Personal lesson test allowlist.
2. Saved-word privilege hardening.
3. Learning content catalogue.
4. Completion-based allowance foundation.
5. Daily Activity sessions.
6. Current-window allowance ledger.
7. Learning-history deletion.
8. Quiz question-bank foundation.
9. Authenticated Quiz RPCs.
10. Quiz-only allowance 1/3.
11. Learning-page introduction preferences.
12. Authenticated question-type extension.

Hosted grant verification passed. The staging data-boundary check confirmed:
- 0 Auth users.
- 0 Quiz question-bank rows and 0 approved questions.
- 0 Quiz sessions.
- 0 saved words and 0 learning-history rows.
- No production user data copied.

The clean-baseline verifier is intended only immediately after the bootstrap and before migrations. Running it after migrations correctly fails its assertion that only the six initial plan-limit rows exist, because the 2.3.x migrations add Daily Learning categories. Use the post-migration grant and data-boundary checks after migrations.

## Feature preview routing

The feature-branch `supabase-config.js` now points to the staging Supabase URL and its public publishable key. The production `main` configuration was not changed.

Cloudflare Pages deployed feature commit `794e8ab` successfully to:
- `https://a81b4f89.swiftdictionary-testing.pages.dev`

The separate Workers Builds check remains failed, as in earlier runs; it is distinct from the successful static Pages deployment.

Staging Google OAuth is not configured yet. The app currently uses Google OAuth only. Required Google OAuth callback URI:
`https://ivatvkfrtifgfheeaelj.supabase.co/auth/v1/callback`

A separate staging OAuth client must be configured in Google Cloud and entered in Supabase Auth provider settings. The preview origin must be added to Supabase Auth redirect URLs. Never put the OAuth client secret in GitHub or chat.

## Validation

- Quiz workflow #483 previously passed the authenticated question-type implementation suite.
- Clean staging bootstrap / grant-check workflow #44070688629 passed PostgreSQL 17, local Supabase Auth/RPC, authenticated Chromium runtime tests and Supabase security advisors.
- Companion 2.3.x regression workflow #1003 passed.
- On the hosted staging project, the post-migration grant verification passed and the data-boundary check confirmed the database remains empty.
- Hosted Supabase security advisors reported 7 INFO findings for RLS-enabled private tables without policies (intentional: private schema, no client access), and 2 WARN findings for the two reviewed authenticated SECURITY DEFINER RPCs above. No advisor ERROR was returned. Keep these documented and re-review if their function bodies or grants change.
- The latest feature branch has a newer CI run following the staging-config commit; its local Supabase/Auth job was still running at the latest status check. Reconfirm branch-head CI before inviting testers.

## Production and main-branch safeguards

An unintended set of three staging-only scaffolding commits briefly advanced `main`. Inspection confirmed they were the only three commits after the prior main head and added only staging bootstrap/verification files. The main ref was safely restored using a force-with-lease to the exact prior main SHA `90dc73a9b65fc3af713fefab4955057026089b96`. The main ref was re-read and confirmed at that SHA. The feature branch retains the staging work.

No production Supabase migration, content import, production learner-data operation, production config change, merge or production deployment occurred. PR #8 remains draft and unmerged.

## Friend-testing gates

Before friends can test authenticated Quiz:
1. Configure staging-specific Google OAuth credentials and redirect URLs.
2. Reconfirm the exact preview URL uses only the staging Supabase project.
3. Obtain explicit owner approval to import/activate the 199 questions **for staging-only testing**. They must remain draft in source control and unapproved in production. Staging test activation must be clearly distinguished from production editorial approval.
4. Create isolated tester accounts and validate account switching, RLS, session lifecycle, allowances, history deletion and feedback capture.
5. Provide testers with a short test notice explaining what data is recorded, retention/deletion, and how to report errors. Keep the intended 16+ audience in mind; collect no unnecessary sensitive information.
6. Collect friends' reports and use them as the basis for the deferred bilingual accuracy review and subsequent corrections.

Malaysia PDPA and applicable international/teen privacy review remains a release gate. This is planning guidance, not legal advice.
