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
