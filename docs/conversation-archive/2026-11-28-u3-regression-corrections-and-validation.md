# SwiftDictionary U3.0 — regression corrections and validation checkpoint (2026-11-28)

## Scope and safety boundary

Continued the owner's request to finish remaining U3.0 limitations after explicitly dropping Supabase leaked-password protection. That Auth warning is not an active completion gate. No plan upgrade, billing change, Auth workaround, production migration, production deployment or PR merge was attempted.

- Application branch: `feature/update-3.0-phase-0-audit`
- Latest application head at archive creation: `87734182da7cfc55008bea658dc8b5212001ae3e`
- Staging Supabase: `ivatvkfrtifgfheeaelj`
- Production Supabase and hosting: untouched
- PR #20: open, draft and unmerged
- Staging preview for prior deployed head `0c7ae64`: https://8ada6c1d.swiftdictionary.pages.dev
- Branch preview alias: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev

## Plan and source-of-truth review

Read the latest Master Development Record, Update 3.0 Development Plan, Phase 0 audit, relevant Nov 27 staging handoff, Nov 28 continuation/content archives and Flashcard coverage audit. Updated the U3.0 plan with the verified `0c7ae64` status and the active completion checklist before implementing further corrections.

## New failures found and fixes applied

The first exact-head architecture run on `0c7ae64` had 84/87 passing tests. Three failures were diagnosed:

1. **Chinese Flashcard coverage mismatch:** the regression expected 727 Malay definitions, while the current exact runtime helper returned 895. Source category reconciliation showed 352/904 Chinese vocabulary cards have Malay definitions (not 184), with 519/519 characters and 24/24 phrases supported; total 895/1,447, leaving 552 excluded. Updated `tests/flashcard-malay-support-coverage.test.mjs` to assert 895 total, 352 vocabulary and 552 unsupported. Updated `docs/review/malay-flashcard-coverage-audit-2026-11-28.md`. The same audit correction records reviewed Malay sentence pairs for 25 English phrases and 24 Chinese phrases; earlier zero counts were stale.
2. **English Quiz option translation contamination:** `quiz-beginner-010` exposed an Indonesian string (`Aku tidak tahu.`) in a legacy option `translation` field. The override data had curated Malay option text, but the override application copied only `learning`, leaving the contaminated legacy `translation` untouched. Added explicit curated Malay translation values to the affected item and fixed the shared override application so each English Quiz option's translation field uses the curated Malay translation when supplied, otherwise the curated Malay learning text. This prevents stale Indonesian/generated text from leaking through the option translation field.
3. **Lesson practice option count:** English `i-perfect` fifth question had only two options after correction. Added a third semantically valid distractor (“Kedua-duanya berlaku pada masa yang sama.”), preserving the existing answer options and question ordering.

The Quiz regression then advanced past `quiz-beginner-010` and exposed another contaminated legacy translation field in `quiz-beginner-017` (`Aku sedang di atasnya.`). The root cause was the same incomplete override application. The shared fallback correction was committed after this failure; latest CI must verify that the entire approved English bank is now free of the flagged lexical forms.

## Commits

- `12f79bfcc9d9c1700b9b3d9ebc1b1502b7c88621` — complete Malay Quiz and Lesson practice corrections.
- `598433baee0a5fc0001cedd7f5c1beeba00b8ecb` — align Flashcard coverage regression with exact runtime fallback counts.
- `108422ef2f04fed0ccbab0ef8318cb9f7add85da` — apply curated Malay Quiz option translations.
- `87734182da7cfc55008bea658dc8b5212001ae3e` — replace contaminated Quiz option translation fallbacks with curated Malay.

## CI checkpoint

- Cloudflare build-routing guard passed on `108422e`.
- U2.9 English dictionary QA passed on `108422e`.
- U2.6 ACL drift regression passed on `108422e`.
- U3.0 architecture test on `598433b` failed only on a further Indonesian Quiz option translation in `quiz-beginner-017`; this drove the final override fallback correction.
- The new U3.0 architecture workflow on `8773418` was queued/in progress at the archive checkpoint.
- Flashcards Chromium, Quiz DB/Auth integration, U2.3 Chromium, U2.7 Chromium and other cross-version workflows were still running/queued on preceding heads. They are not accepted as passed for the latest head.
- The Cloudflare Pages preview must be redeployed/verified against the latest application head; the known deployed URL above is for the older `0c7ae64` commit and must not be represented as current.

## Remaining work

1. Verify the U3.0 architecture suite on `8773418`; fix every further Malay quality/coverage failure rather than weakening assertions.
2. Inspect latest Flashcards Chromium results: Malay Sentence Recall must start only with supported reviewed pairs; verify completed-game persistence, per-card snapshots, Review weak memory and correct/incorrect answer records. The prior test-timeout root cause was fake-clock advancement stopping before the delayed persistence callback; a 63-second advancement was added, but browser evidence is still required.
3. Inspect Quiz DB/Auth and Chromium results. A prior `user_preferences` permission error was isolated to the disposable fixture; resolve the fixture/migration contract without broadening RLS or grants.
4. Complete full latest-head U3.0/U2.3/U2.5/U2.6/U2.7/U2.9 regression matrix and authenticated account/OAuth checks.
5. Verify the current Cloudflare Pages preview and staging Google OAuth redirect; manually test authenticated desktop/mobile flows, account switching and account isolation.
6. Preserve private-schema RPC boundaries and `auth.uid()` ownership checks. Do not expose secrets or add broad direct table grants/policies.
7. Keep all model-assisted Malay material draft pending competent Malaysian Standard Malay editorial review and independent translation review. Resolve model artefact/corpus licence, attribution, Malaysia Copyright Act 1987, PDPA 2010/2024 amendments and cross-border processing review before public activation.
8. Keep PR #20 draft/unmerged and production untouched until explicit release approval.

## Recovery point

Continue from application branch `feature/update-3.0-phase-0-audit` at `87734182da7cfc55008bea658dc8b5212001ae3e`. First inspect the new U3.0 architecture run and latest Flashcards/Quiz jobs. Do not claim U3.0 completion from static tests or staging preview availability alone.

## Flashcard per-card review browser failure and test repair

The 2.5 Flashcards static job passed on `8773418`, and its Chromium suite passed 35/36 tests. The remaining test, “Completed Flashcard games save per-card snapshots and missed answers for review”, timed out after 30 seconds. The same test also caused the U2.3 browser matrix to fail; its PostgreSQL migration/allowance tests and local Auth compatibility passed, and the U2.7 PostgreSQL/static/browser matrix passed.

Inspection of the test found a race: it clicked the next phase action without waiting for the previous answer feedback/phase transition. When the feedback had not rendered yet, the action button was hidden and Playwright waited for it until the entire test timed out. The test was rewritten to:
- use a 60-second per-test timeout;
- wait explicitly for “Pick your answers”, “Correct!/Not quite”, “Next” and “Memorise the card” at each transition;
- require an actual incorrect answer before completion;
- advance the fake clock through the challenge deadline and the separate two-second persistence callback;
- then verify Weak Memory, game review snapshots and the saved incorrect result.

This is a test-synchronisation repair; it does not weaken the review assertions or alter the runtime/SQL persistence contract. Latest application test commit is now `72c63d8e948294876e64371353f864b0861440d9`. GitHub created new pull-request workflow runs for this commit but marked them `action_required` with no jobs started. The prior app-head workflow `8773418` had the architecture suite green and Pages deployment successful; the per-card review browser result remains unverified until the new run is approved/executed. The pending Quiz DB run on `8773418` also still needs to finish its local Auth/RPC integration job.

## Deterministic per-card review test update — 2026-11-28

The explicit-wait version at `72c63d8` still timed out, so I did not keep increasing the timeout or treat that as solved. The browser test was redesigned to isolate the review contract deterministically:
- start a mock Flashcard session through the same RPC interface;
- complete it with one correct and one incorrect result, each containing a complete four-option snapshot;
- verify the RPC returns the correct totals and the review RPC returns the selected and correct answers;
- refresh the page's authenticated mock data and verify the weak-memory list includes the missed card;
- open the completed game from Recent games and verify both per-card cards, incorrect status, selected answer and correct answer.

Live timer/phase transitions remain covered by the other existing Flashcard browser tests; SQL integration separately validates the real database completion RPC and snapshot persistence. This avoids random answer ordering and a long wall-clock loop in the specific UI rendering/persistence test without weakening the review assertions.

Latest application head is now `75a9d4b5f450452943294a6d9abea6750a4c1734`. Its U3.0 architecture, Flashcards static, Flashcards Chromium, U2.3, U2.7, U2.6, U2.9, Quiz DB/Auth and Cloudflare Pages checks have been queued or are in progress; none is accepted until completed. The previous `72c63d8` U3.0 architecture suite passed, but U2.5 and U2.3 browser suites still failed on the old timeout test. The latest Cloudflare Pages deployment for `75a9d4b` is also still in progress at this checkpoint.

### Read-only staging data/security evidence

On the staging Supabase project `ivatvkfrtifgfheeaelj` (PostgreSQL 17), current schema/migration inventory includes the Flashcard session snapshot, completion repair and snapshot-hardening migrations. Read-only counts:
- 8 completed sessions;
- 66 per-card snapshots across 6 sessions;
- 34 weak-memory rows and 34 mastery rows whose last result is incorrect;
- 0 mastery rows with last incorrect but no weak-memory entry.

All 8 sessions are dated Nov 23–27, 2026; the two Malay sessions on Nov 27 (10:58 and 11:04 UTC) have no per-card snapshots, while the six earlier Chinese sessions have snapshots. Therefore the observed Malay session review issue is real historical data loss in those two completed sessions, not merely a test-only message. The migration's snapshot repair improves future games but cannot reconstruct exact prompts, option ordering, selected answer or correct answer for those already-completed Malay games from summary/mastery counts alone. Do not fabricate per-card review content. The game summary should remain available with an accurate explanation that per-card details were not stored; weak-memory cards from the two sessions are present in the review list.

Read-only privilege checks confirm anon and authenticated have no direct SELECT on private snapshot/review tables; anon cannot execute the public game-review RPC, while authenticated can. Do not add direct table grants or weaken RLS to fix UI issues.

## Historical partial-review recovery implementation — latest checkpoint

The two Nov 27 Malay sessions had 5 and 4 weak-memory rows respectively whose `last_session_id` still points to those sessions. These are known missed cards, but they are not a complete record of all missed cards and do not contain original prompts, answer options, selected answers or correct answers.

Added a safe partial-review path:
- `flashcards.js` now distinguishes full, partial and unavailable review states. Partial review explicitly says the list may be incomplete and that original prompts/options/answers were not saved; it displays only known missed cards and their recall mode, with no invented answers.
- New migration `20261128133000_swiftdictionary_update_3_0_partial_legacy_flashcard_review.sql` updates the owner-scoped review RPC. Full snapshot sessions retain their exact prior review output. Snapshotless completed sessions can return only weak-memory entries linked to their `last_session_id`; otherwise review remains unavailable.
- The disposable SQL regression now seeds a legacy completed session and asserts the RPC returns `review_status='partial'`, known card key and label, and no selected answer, correct answer or answer options.
- The mock adapter now models the same partial fallback, and a browser regression verifies partial legacy sessions render without inventing answer details.
- `.github/workflows/quiz-db-foundation.yml` now applies the new migration before running the Flashcard review SQL regression.

Application commits after `75a9d4b`:
- `6e092cf` — render partial legacy game review.
- `253f7b7` — add partial legacy review RPC migration.
- `61f7802` — test SQL partial review behaviour.
- `90cc375` — mock partial review fallback.
- `63e20e2` — browser partial review regression.
- `b0a177b` — wire migration and regression into the local Supabase CI workflow.

The latest workflow checks on `b0a177b` are queued/in progress; no migration or UI change is accepted until the SQL/Auth and browser workflows pass. The current staging database has not yet received this new migration. No production database was changed.
