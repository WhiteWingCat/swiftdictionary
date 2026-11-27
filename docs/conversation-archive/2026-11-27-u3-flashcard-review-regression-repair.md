# SwiftDictionary U3.0 — Flashcard review regression repair (2026-11-27)

## Owner feedback

The owner tested staging and reported two regressions:

1. Incorrect answers from a completed Flashcard game did not appear in Review weak memory. Opening a recent game showed the inaccurate message that it had been completed before per-card review was introduced.
2. Recent games did not identify which learning course had been played.

## Root cause

The earlier Update 2.5 completion routine wrote both `private.flashcard_review_items` and `private.flashcard_session_items` snapshots. Later U3.0 language-support migrations replaced `private.complete_my_flashcard_game_impl` with a reduced implementation that still updated aggregate mastery and session scores but omitted both per-card snapshot insertion and weak-memory queue insertion. The review RPC correctly reported no snapshots, but the UI's old fallback text incorrectly implied that the session predated the feature. This was a regression introduced during the language-support migration, not an old game-format limitation.

The history payload already contained `learning_language_code` and `translation_language_code`; the Flashcards page simply did not render the learning-course field.

## Repair applied

- Added migration `20261127200000_swiftdictionary_update_3_0_flashcard_review_persistence_repair.sql`.
- Restored account-scoped per-card snapshot insertion in `private.complete_my_flashcard_game_impl`, preserving prompt, card, four options, selected answer, correct answer, mode and correctness.
- Restored incorrect and unanswered answer insertion into `private.flashcard_review_items`, and retained mastery counters.
- Preserved completed-session idempotency, user ownership checks, server-side allowance logging, and authenticated-only execution on the private SECURITY DEFINER implementation.
- Added validation for snapshot shape, mode, option count and selected/correct indices. Older clients that submit no snapshot remain completable, but are not falsely marked as fully reviewable.
- Added a cautious backfill for existing recent incorrect mastery rows that can be associated with a completed session within ten minutes. No per-card details are fabricated for old sessions that never stored snapshots.
- Updated the legacy game-review message to explain that per-card details were not saved for that particular game; it no longer claims that the game predates the feature.
- Recent games now display English course, Simplified Chinese course or Malay course using the saved session language, not the user's current course selection.
- Bumped the Flashcards runtime cache from `3.0.0-ms13` to `3.0.0-ms14`.
- Added static assertions and a browser regression for missed-answer review, per-card review, and mixed-course recent-game labels. The browser test exercises a wrong answer, completes the timed game, and checks both review surfaces.

## Staging database action and verification

The repair migration was applied to staging project `ivatvkfrtifgfheeaelj` only. A post-application read confirmed the repaired completion function exists and the weak-memory table contains 34 items for one account after the cautious backfill. This is a database-state check, not a full authenticated browser acceptance test. No production database was queried or modified.

The database schema confirms:
- `flashcard_sessions.mode` accepts word, definition, translation, mixed and sentence.
- Session snapshots have four-option, valid-index, per-session unique-position and owner/session foreign-key constraints.
- The weak-memory mode constraint includes translation and mixed.

## Latest application branch

- Branch: `feature/update-3.0-phase-0-audit`
- Latest application commit at this checkpoint: `cfa7c51cdb3cd0fc1e612364e993e7ccf7c7d0a6`
- PR #20 remains draft/unmerged.
- Cloudflare Pages reported the build for `cfa7c51` as in progress at the latest check. Do not assume the preview alias has the repair until the deployment completes and the deployed bundle is verified.
- No production deployment, merge or production migration is authorised.

## Remaining U3.0 limitations

The Flashcard review regression is repaired at code/database level, but full latest-head automated and browser acceptance is still required. Other previously documented Malay translation gaps remain:
- English and Simplified Chinese lesson practice prompts/options/feedback still need Malay support packs.
- English and Simplified Chinese Quiz banks still need Malay support-language packs.
- English/Chinese Flashcards still have partial Malay support for non-dictionary/custom/phrase content; dictionary-derived support must be measured by actual card eligibility.
- Staging Google OAuth preview redirect and the staging leaked-password protection setting remain to be checked before public launch.

Do not mark U3.0 complete or production-ready based on this repair. Continue with the remaining translation coverage and the full cross-version regression matrix. Keep machine-assisted Malay content as editorial drafts pending competent Malaysian Standard Malay review. Preserve source provenance and exact model licences; complete Malaysia Copyright Act 1987 and PDPA 2010/2024-amendment/cross-border processing review with qualified counsel before public release.
