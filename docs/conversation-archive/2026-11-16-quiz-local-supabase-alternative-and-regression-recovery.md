# Conversation archive — 2026-11-16 Update 2.4.0 continuation and environment decision

## Owner decision

The owner explicitly declined using a Supabase Development Branch and instructed development to continue with an alternative. No Supabase Development Branch may be created or used, and this decision does not authorize a paid plan, billing activation or new recurring infrastructure.

## Approved alternative

Continue Update 2.4.0 on `feature/update-2-4-0-quiz` and keep PR #8 draft. Use:
- Disposable local Supabase through Supabase CLI and Docker for Auth, RPC, RLS, migration and authenticated browser integration tests.
- PostgreSQL 17 in GitHub Actions for deterministic schema/foundation and migration assertions.
- Fresh synthetic Free/Premium Auth users and test-only approved question fixtures.
- Existing Cloudflare Pages branch preview with explicit `?swiftMock=1` for fictional UI-only Mock User testing, only after deployment/hostname is verified.

The Cloudflare preview frontend must still be treated as connected to production Supabase unless a verified separate backend is configured. Do not use real accounts or data-changing preview flows. The 114 authored Quiz questions remain draft; this environment decision does not approve their publication.

## Repository and CI investigation

- Repository: `WhiteWingCat/wordbook`.
- Feature branch: `feature/update-2-4-0-quiz`.
- PR: [#8 — Draft: SwiftDictionary Update 2.4.0 — Quiz backend and content pipeline](https://github.com/WhiteWingCat/wordbook/pull/8).
- Previous branch head: `a51e0ee2111e65a03541911298157c9896dc2c28`.
- Quiz workflow #314 (run ID 43848032541): PostgreSQL foundation passed; local Supabase Auth/RPC job failed one authenticated browser test. The failed test navigated from Quiz to Lessons and clicked a lesson while the newly added first-visit Lessons introduction overlay was still intercepting pointer events. The other Quiz browser tests passed, including translation fallback, introduction persistence/account isolation, Chinese-course gating, Premium allowance/session enforcement and signed-out restrictions.
- Companion 2.3.x workflow #926: PostgreSQL and local Supabase compatibility jobs passed; Chromium regression failed 13 unrelated Lessons/Daily Learning tests for the same reason—the new guide overlay was not dismissed by the older suite setup.

## Changes made

1. `tests/browser/update-2-3-0-smoke.spec.js`: added test-suite setup to dismiss the new learning introduction overlay for this legacy regression suite. Dedicated Quiz runtime tests continue to own the introduction behaviour assertions.
   - Commit: `f1ffc99d387899af8e06ff71a63196188b31bc8e`.
2. `tests/browser/update-2-4-0-quiz-runtime.spec.js`: the authenticated lesson translation/Quiz test now explicitly waits for and dismisses the separate Lessons introduction before clicking a permanent lesson.
   - Commit: `47ed08907d0b91dcb41d2f9cd196309326a997b7`.

These were test-only changes. No application source, database migration, question content, production Supabase configuration/data, main branch, merge or deployment was changed.

## Validation state at archive time

New checks for branch head `47ed08907d0b91dcb41d2f9cd196309326a997b7` were observed running. Follow-up status: Quiz PostgreSQL 17 foundation passed; 2.3.x PostgreSQL migration/allowance tests passed; 2.3.x local Supabase Auth compatibility passed; Quiz local Supabase Auth/RPC/Chromium and 2.3.x Chromium regression remained in progress at the latest check. Cloudflare Pages successfully deployed the branch preview at `https://feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev` (latest preview commit `283d2e0`). A separate Cloudflare Workers Builds check failed; it is distinct from the successful Pages deployment and still requires diagnosis. The overall browser validation gate remains open.

## Legal, privacy and release safeguards

Use only synthetic identities and synthetic test data in disposable environments. Do not copy production personal data or expose service-role/OAuth secrets. Quiz progress, answer selections, scores, history and temporary no-repeat reservations remain account-linked learning data; Malaysia PDPA and relevant international/teen privacy, retention and deletion review remains a release gate. This is planning guidance, not legal advice.

## Next recovery steps

1. Inspect all current CI checks on `47ed08907d0b91dcb41d2f9cd196309326a997b7` and fix any remaining failures.
2. Continue Quiz backend/frontend edge-case validation against disposable local Supabase only.
3. Verify the Cloudflare Pages preview build and exact hostname before sharing an owner-facing Mock User link. Use only the explicit `?swiftMock=1` mode and fictional Free/Premium identities.
4. Keep the 114 authored questions as drafts pending separate owner content approval.
5. Keep PR #8 draft. No production schema/content migration, merge or deployment without explicit owner approval.


## Follow-up — authenticated Quiz test and Mock User readiness (2026-11-16)

- Test-only commit `8b70b0765395bd726e797d0313c42293ad55c1d1` adds an explicit disposable-DB preference update before the Free-user Quiz snapshot test. This removes a possible race between the UI's queued preference upsert and the following Quiz navigation. No app/runtime code or production settings changed.
- On branch head `0b44b852b9f62f14b3b28e2c30bbc79f10247f74`, Quiz workflow `43868129521` passed its PostgreSQL foundation and all local Supabase setup/migration/RPC/draft-content steps. The Chromium job failed one Free-user lesson-to-Quiz flow; five other tests passed. The first attempt timed out waiting for the session panel; retry did not find the Chinese translation node. The security-advisor step was skipped due to the failed browser step. This is still an open CI gate.
- The companion 2.3.x workflow on that same branch head passed Chromium, local Auth compatibility and PostgreSQL allowance jobs.
- A successful Pages deployment was verified at commit `0b44b852b9f62f14b3b28e2c30bbc79f10247f74`. The subsequent `8b70b07` change is confined to a test file, so deployed app assets are unchanged. The exact feature-preview hostname is `feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev`.
- The preview mock adapter was inspected. It activates only on that exact preview hostname with `?swiftMock=1`, presents fictional Test User A (Free) and Test User B (Premium), intercepts Supabase JS client creation for mock table/RPC simulation, and disables Google OAuth while mock mode is active. This is UI-only simulation and does not validate backend, RLS, real Auth, cross-device sync or production isolation. The source preview config still references production Supabase; never use real accounts or data-changing flows on the preview.
- Owner may begin limited Mock User UI testing at `https://feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev/?swiftMock=1`, using only Test User A/B. This permission does not mean the authenticated CI/security gate has passed, does not approve the 114 authored draft questions, and does not authorize production work.
- The Cloudflare Workers Builds failure remains separate from the successful Pages deployment and is not yet shown to be required by this static Pages application.

## Current next steps

1. Verify CI runs/checks on the latest branch head after the test-only fix and documentation commits; resolve the authenticated browser failure based on actual logs.
2. Pass the local Supabase security advisor after the browser job passes.
3. Collect the owner's Mock User UI feedback; keep it separate from backend validation.
4. Complete Malaysia PDPA and applicable international/teen privacy, retention and deletion review before release.
5. Keep PR #8 draft/unmerged and do not migrate/import to live Supabase, merge main, or deploy production without separate explicit approval.


## Owner feedback and implementation follow-up — 2026-11-17

The owner tested the Mock User preview and requested: permanent lesson translations refresh reliably; smaller Profile-style course/translation controls with contextual icons and labels inside dropdowns; Daily Quiz allowance moved to the right of “Choose a difficulty”; Quiz history shown in Dashboard learning progress; and a path to real Quiz testing instead of synthetic mock questions.

### Implementation

- Global language controls are now compact Profile-style pills: 📘 Learning Course and 🌐 translation language. The selected language appears next to the icon; the descriptive labels are inside the dropdown panels.
- Daily Quiz allowance moved into the right side of the Quiz difficulty heading; it stacks on mobile.
- Dashboard > Learning progress now contains recent Quiz history with difficulty, correct/total, date, percentage and a Review action.
- Permanent lesson translation refresh directly re-renders the active lesson reader, preserving selected practice answers/progress. Daily Learning and permanent lessons use separate renderers but share the global translation preference; the page-boundary theory was not the actual cause.

### Bugs found and corrected

- Dashboard's profile bootstrap performed a redundant upsert on `user_preferences` every time. Postgres still evaluated INSERT RLS policies even when the upsert conflict path would not insert, causing a valid existing account to fail Dashboard loading. `ensureProfileRows()` now checks for the owner row first and inserts only if absent.
- Disposable CI's minimal `profiles` table lacks the optional `avatar_icon` column. Dashboard now falls back to `display_name` when that column is unavailable.
- Authenticated Quiz test navigation now waits for the saved question position after each Next action to avoid racing answer persistence.

### Validation at commit `525e160a00dc8c0febf648dff6bca133df44725e`

- Authenticated local Supabase runtime: passed, 6/6 Chromium tests. The permanent lesson translation switch (both directions) preserved the selected practice answer; completed Quiz history appeared in Dashboard and its Review action opened the correct answer review.
- Supabase security advisors: passed, no issues found.
- Quiz PostgreSQL 17 foundation and RPC/session/allowance tests: passed.
- Companion 2.3.x PostgreSQL, Chromium regression and local Auth compatibility jobs: all passed.
- Cloudflare Pages preview deployed successfully for commit `525e160`: `https://feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev`.
- Separate Workers Builds check still fails; Pages deployment succeeds independently and the static Pages app has not been shown to require that Worker.

### Real Quiz website testing boundary

The current preview remains Mock User UI simulation. Turning off the mock adapter would use the production Supabase configuration, so it is not safe to simply switch it off. Real end-to-end testing requires a separate temporary Supabase staging project (not a Supabase Development Branch), isolated test accounts and the 2.4.0 schema/content there. This needs owner approval and appropriate Supabase write permissions. The 114 authored questions (30 Beginner, 36 Intermediate, 48 Advanced) remain draft; using them in staging for test-only evaluation also needs the owner's explicit approval. No staging project or new cloud environment has been created.

PR #8 remains draft/open/unmerged. No production Quiz schema/content changes, production deployment or main merge occurred. Quiz progress and scores are account-linked learning data; Malaysia PDPA and applicable international/teen privacy, retention and deletion review remains a release gate.
