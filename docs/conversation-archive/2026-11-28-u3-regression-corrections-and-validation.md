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

## Latest browser-test diagnosis — mock panel pointer interception

The deterministic per-card review test initially still timed out. Inspecting the Playwright call log showed the test's click was blocked by the fixed `#swiftMockPanel` overlay intercepting pointer events on the “Review game” button. This was not a review RPC or snapshot persistence failure. The panel is now hidden in both the full per-card review and legacy partial-review browser tests before clicking the game-review control. This follows an existing test pattern already used in the Quiz pagination regression.

Latest application branch head is `489435a51f19b7481671d1f0a708effaff00f28f`. The latest U3.0 architecture, Flashcards, Quiz DB/Auth, U2.3, U2.6, U2.7, U2.9 and Cloudflare checks are queued or in progress; the latest browser result is still pending. Do not claim the fix is verified until the new run completes.

## Staging migration applied and RPC verified — 2026-11-28

After the local Supabase workflow completed the new migration/test step successfully, applied `swiftdictionary_update_3_0_partial_legacy_flashcard_review` to the staging project `ivatvkfrtifgfheeaelj` only.

Live RPC verification using the two historical Malay session IDs now returns:
- the Nov 27 Word Recall game: `review_status=partial`, 5 recoverable missed cards — awan, berita, berkarat, mentega, tiket masuk;
- the Nov 27 Mixed Recall game: `review_status=partial`, 4 recoverable missed cards — kekal, lintasan, muara, penyangkut.

A separate full-snapshot session still returns `review_status=full` with all 7 saved snapshots. No prompts, answer options, selected answers or correct answers were fabricated for the historical partial sessions.

Post-migration privilege verification remains unchanged: anon/authenticated cannot directly SELECT private snapshot or weak-memory tables; anon cannot execute the public game-review RPC; authenticated can execute the owner-scoped RPC. No grants were broadened.

Latest application preview for `489435a`: https://8edf4cb7.swiftdictionary.pages.dev (Cloudflare Pages deploy succeeded). U3.0 architecture passed on `489435a`; U2.3 allowance/dashboard browser + local Auth + SQL suite passed on `489435a`; U2.6 ACL, U2.7 Chinese Dictionary, U2.9 English QA passed on the immediately preceding `b0a177b`. Flashcards Chromium for `489435a` and Quiz DB/Auth integration are still running at this checkpoint. Production remains untouched.

## Cache-busting correction

The partial-review frontend and mock adapter had changed, but their script query versions were still `flashcards.js?v=3.0.0-ms19` and `mock-testing.js?v=2.8.0-r2`. Bumped them to `3.0.0-ms20` and `2.8.0-r3` respectively in `index.html` to prevent stale cached scripts on the branch preview. Latest application head is now `851d0cbd3e73055d3327a86f74b8f2ec53418cfb`; fresh CI and Pages deployment are required for this final cache-bust commit.

## Cache-version regression assertion corrected

The 6e0 cache-bust commit exposed one additional stale test expectation: `tests/update-2-5-0/check-flashcards-page.mjs` still required `flashcards.js?v=3.0.0-ms19`. Updated it to expect `ms20`. The U2.6 static assertion had already been updated. Latest application head is `3904f69abd13b2a2898354cc4449a3c1b9b32398`; fresh CI and Pages checks are in progress.

The preceding `489435a` Flashcards Chromium suite completed successfully with **37/37 tests passing**, including both the full snapshot review and legacy partial-review browser tests. Its Flashcards static/content job also passed. The 2.3.x allowance/dashboard, Auth compatibility and browser suite passed on that same head. The Quiz DB/Auth integration on `489435a` passed the SQL migration/test stage (including the partial legacy review migration) and authenticated Quiz RPC tests; its remaining browser/security advisor steps were still running at the time of this update.

The `6e0e25a` run then failed only because the page-integration static test still expected the old cache version; the assertion was corrected in `3904f69`. Await the fresh run before marking the latest head green.

## Account-isolation verification and regression

Added a SQL regression asserting that a different authenticated user cannot retrieve a legacy partial review through the public RPC (the function returns the same not-found result used for an unknown session). Ran the equivalent read-only check against staging; cross-account access was denied. The existing checks also confirm no direct private-table SELECT for anon/authenticated and authenticated-only execution of the owner-scoped RPC.

Latest application head is `fc94da1598433d0890afb05a8c7738b7d93055b5`; full CI is queued/in progress. The previous `3904f69` head had U3.0 architecture and U2.9 English QA green; its U2.6 ACL run was in progress. The `489435a` head had 37/37 Flashcards browser tests, U2.3 SQL/Auth/browser and the Quiz DB migration/authenticated RPC stages green. The cache-version assertion correction and cross-account SQL regression are included in the newest reruns.

**Malaysia privacy check:** this recovery exposes only the user's own already-recorded weak-memory card keys through the authenticated RPC; it does not introduce new personal-data collection, third-party sharing or direct table access. The owner-scoped function and least-privilege grants remain intact. PDPA 2010 and 2024 amendment/cross-border review remain release-level checks; this additive recovery does not itself approve public release.

## Post-migration Supabase security advisor review

The staging security advisor reported 10 INFO findings for private-schema tables with RLS enabled and no policies, including `flashcard_review_items` and `flashcard_session_items`. This is intentional for the current design: these tables are in the non-API private schema, direct SELECT privileges remain denied to anon/authenticated, and access is through narrowly scoped SECURITY DEFINER RPCs that enforce `auth.uid()`. No broad policies or direct table grants were added. The remediation reference is [Supabase database linter — RLS enabled with no policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

The advisor also reports the leaked-password protection warning. This remains intentionally excluded by the owner's explicit scope change; do not attempt to enable it or make plan/billing changes unless the owner revisits the decision.

## Final automated validation checkpoint — 2026-11-28

Latest application head: `fc94da1598433d0890afb05a8c7738b7d93055b5`. Latest deployed staging preview: https://0007ac35.swiftdictionary.pages.dev (branch alias: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev).

The latest-head checks have now passed:
- U3.0 architecture/content parity;
- U2.9 English dictionary QA;
- U2.7 Chinese dictionary/static/Chromium checks;
- U2.6 ACL regression;
- U2.3 allowance/dashboard PostgreSQL, local Auth and Chromium browser regression;
- U2.5 Flashcard static/content and Chromium browser regression (**37/37**);
- Quiz database foundation SQL;
- Quiz local Supabase Auth/RPC integration (one full run completed successfully, including the partial-review migration, account ownership regression, authenticated Quiz RPC tests, signed-out Flashcards/Preferences tests, Lesson allowance notification, Chinese pinyin/course switching and security advisors);
- Cloudflare Pages deployment and build-routing guard.

A duplicate Quiz Auth integration run for the same head was still executing after the successful run; it is not a failing check. The only red check is the Cloudflare **Workers Builds** integration for the legacy `swiftdictionary-testing` Worker service. The current product host is Cloudflare Pages, and its deployment is green. The old Worker path is not the active staging/production hosting path and has not been changed or deleted.

The new partial-review SQL ownership test passed in the successful local Supabase integration run. The staging migration is applied and verified; two historical Malay games return partial review with 5 and 4 known missed cards, while full-snapshot sessions still return full review. Private table grants/RLS remain unchanged.

**Remaining owner/release gates (not CI defects):** manually test the current staging preview on desktop and mobile, verify Google OAuth redirect and account switching/isolation against the deployed preview, obtain competent human Malaysian Standard Malay/independent translation review, complete model/corpus licence and attribution review, and finish Malaysia Copyright Act 1987 and PDPA 2010/2024-amendment/cross-border processing review. PR #20 remains draft/unmerged. Production hosting/database remain untouched. Leaked-password protection remains excluded by the owner's explicit instruction.


## Latest staging feedback and polish checkpoint — 2026-11-28 (evening)

Latest application change set: `12a4b58715b060702a14045f535c228387b7f3fd` (feature branch `feature/update-3.0-phase-0-audit`). This is a staging-only change set; PR #20 remains draft/unmerged and production remains untouched.

### Feedback fixes

1. **Quiz course-switch preference race:** the Dictionary course-change handler previously started `syncCurrentCourseFromCloud({mergeLocal:false})` immediately after queuing the user's preference upsert. The cloud read could therefore race the write and restore the previous learning course before the Quiz handler refreshed. The cloud sync now runs only after `preferenceWriteQueue` settles, and only if the same account and requested course are still active. The Quiz handler continues to wait for the preference queue and rejects stale course/request responses. The authenticated browser regression now waits for each preference write and verifies both Quiz availability and the persisted `user_preferences.learning_language` for English → Chinese → Malay → English.
2. **Weak Memory review latency:** the review list previously resolved each dictionary card through the full game-deck path, which also built the translation-enriched Flashcard inventory before the list could render. The review index now builds lightweight per-language records directly from each language's source bank; list labels are taken from stable card keys, and Malay support enrichment is performed only for the single card whose detail panel is opened. Existing 80-card Chinese/English review tests remain in the browser suite. Flashcards script cache key is now `3.0.0-ms25`.

### Automated validation and correction

- The first architecture run on the feedback work failed one stale static assertion in `tests/u3-phase3-malay-feedback.test.mjs`: it expected an obsolete “Malay support translations ... not available yet” warning that had already been removed when Quiz support moved to the translation registry. Updated the test to assert the registry wiring and absence of the obsolete warning. This was a test expectation correction, not a relaxation of content or security checks.
- The authenticated Quiz browser regression now explicitly checks persisted course preferences after every switch. The latest workflow batch for application head `12a4b587` has been queued/in progress; no overall pass is claimed until the new U3.0 architecture, Quiz DB/Auth, Flashcards browser and cross-version workflows complete.
- The previous architecture run's other 88/89 tests passed; the single failure was the stale assertion above.

### Translation/content status — still a required automated gate

- Lessons remain English 17 / 112 practice questions; Simplified Chinese 17 / 112; Malay 72 / 216.
- Quiz source inventory is English 229, Simplified Chinese 145, and Malay 120 unique questions in each of its English- and Chinese-support packs (240 staging support records).
- Daily Learning remains 60 Topics, 60 Applications and 93 Discovery entries.
- English Flashcard Malay support remains 1,341/1,341.
- Chinese Flashcard Malay support remains incomplete: 895/1,447 runtime definitions and 603 direct generated support rows at the latest content checkpoint. The exporter/validator require all 1,447 source cards and complete output. Do not report this as complete until the generated file is committed and runtime coverage/lexical tests pass.
- Dictionary translation output and broader support translation generation remain pending validation. Automated lexical, distinct-answer, duplicate and missing-string checks remain required.
- Sentence Recall remains restricted to the 85 curated Malay sentence pairs.

### Owner review instruction and release boundaries

The owner has explicitly instructed that human linguistic/editorial/translation review is skipped before this update and will be conducted on the live website. Do not block this update on human review, and do not describe machine-assisted content as human-reviewed or approved. Automated structural, coverage, lexical and answer-quality checks remain mandatory. This instruction does not waive source provenance, exact model/corpus licensing and attribution, Malaysia Copyright Act 1987, PDPA 2010/2024 amendment or cross-border processing requirements before public release.

No production migration, database mutation, merge or production deployment is authorised. Leaked-password protection remains excluded by prior owner instruction.
