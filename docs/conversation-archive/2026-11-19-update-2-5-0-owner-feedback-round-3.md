# SwiftDictionary Update 2.5.0 — owner feedback round 3

Date: 2026-11-19

## Purpose

Record the owner's nine feedback items after testing the Update 2.5.0 Flashcards preview, implementation changes, automated validation and remaining owner-testing gates. This is a structured summary, not a verbatim transcript.

## Owner feedback

1. Move the 60/120-second challenge choice out of the setup prompt and into pills to the right of “Choose your Flash Recall”.
2. Improve the game-selection modal, dropdown controls, and Cancel/Begin buttons.
3. Apply the same visual improvement to the game-results prompt.
4. Fix translation changes automatically opening the Dictionary definition panel on Lessons, Quiz and Flashcards.
5. Preserve Weak Memory review scrolling when selecting an item, remove “missed 1 time(s)” copy, and improve the Close button.
6. Count a question as Weak Memory when the challenge ends before the learner can answer it.
7. Prevent the main navigation hover lift from clipping at the top.
8. Align the Flashcards help control consistently with Lessons and Quiz.
9. Center the Flashcards main-navigation icon consistently with the other icons.

## Implementation

Changes were made on the existing `feature/update-2-5-0-flashcards` branch.

- Moved 60s/120s choice into stateful pills beside the Flash Recall heading; setup now contains difficulty and card-set choices only.
- Restyled setup and results prompts, selects, action buttons and close controls with consistent spacing, contrast, hover and focus states.
- Guarded dictionary translation refresh with the actual definition-modal open state. A closed modal is no longer reopened because `activeWord` remains in memory.
- Captured and restored Weak Memory list/detail scroll positions during selection re-render; removed missed-count descriptions.
- Added `roundRecorded` state so a live question is saved once as unanswered when challenge time expires during memory/answer phase. The existing authenticated completion RPC already writes incorrect/unanswered results to `private.flashcard_review_items` and `private.flashcard_mastery`; no SQL migration was necessary.
- Increased main-navigation top padding, moved Flashcards help into its banner's flex layout, and normalized nav icon centering.

## Files changed

- `flashcards.js`
- `index.html`
- `tests/browser/update-2-5-0-flashcards.spec.js`
- `tests/update-2-5-0/check-flashcards-page.mjs`

Three new Chromium Mock User regression tests cover:
- A challenge ending before answer records unanswered Weak Memory.
- Translation changes do not reopen a previously closed Dictionary definition panel on Lessons, Quiz or Flashcards.
- Selecting a Weak Memory item preserves the list scroll position and no longer shows missed-count copy.

## Validation status at handoff

- Dedicated static/Mock checks passed in GitHub Actions workflow #44481421287:
  - JavaScript syntax.
  - Flashcards page integration and inline script syntax.
  - Mock account, allowance, collection and timer regression tests.
- Chromium Mock User browser job for workflow #44481421287 was still in progress when this archive was written. It must pass before this feedback round is considered ready for owner retesting.
- The earlier workflow attempts were cancelled by subsequent commits and are not evidence of a browser-test pass.
- Latest branch head at handoff: `2aa1dc0eb4b81c452475910eb5f134a665455347`.
- PR #12 remains open and unmerged.

## Data, privacy and legal planning

- No new personal-data category, processor, analytics or raw-answer telemetry was introduced.
- The existing private, account-scoped Weak Memory and mastery records are reused. Existing learning-history deletion continues to cover these records.
- No new migration is required for these changes.
- Continue Malaysia PDPA and general international privacy review before wider public/commercial expansion. This is planning, not legal advice or a compliance certification.

## Safety and next steps

- No production deployment or production/staging database operation was performed.
- Wait for the dedicated Chromium Mock User browser job to pass.
- Once green, provide the owner the latest Cloudflare Pages branch preview URL copied from the Deployments UI; never guess the hostname.
- Owner must retest the nine points and existing Flashcards/Quiz/Lessons/navigation/account-switching regressions.
- Do not merge PR #12, deploy production or apply migrations without explicit owner approval.
