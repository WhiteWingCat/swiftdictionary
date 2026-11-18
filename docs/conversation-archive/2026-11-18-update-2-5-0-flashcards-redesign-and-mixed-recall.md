# SwiftDictionary Update 2.5.0 — Flashcards redesign and Mixed Recall

Date: 2026-11-18

## Owner feedback and approved direction

Following the first Mock User test, the owner requested a cleaner Flashcards experience:
- Dedicated Flashcards banner.
- Four large recall navigation cards with shadows, pill-shaped controls and distinct readable colours.
- Remove difficulty, card-set and game-start controls from the home page; show them in a compact setup overlay after choosing a recall mode.
- Recall modes: Word, Definition, Mixed, Sentence. Translation Recall is replaced by Mixed Recall, which combines Word, Definition and Sentence prompts in randomized rounds.
- Game view keeps the flashcard and four answer choices visible together. Options are hidden during memory, then shown while the flashcard is blurred with “Pick your answers” over it.
- A yellow/orange combined timer gauge appears beneath the flashcard.
- Three-second answer feedback reveals the card and marks the correct choice green and a selected incorrect choice red, without resizing the game layout.
- A results overlay appears at 60 seconds and must be closed before returning home.
- Hide My Collections for now without deleting its existing underlying data.
- Add contextual dictionary card sets.
- Replace the large Weak Memory section with a compact Review Weak Memory prompt and read-only mode tabs/detail review.

## Implementation

Feature branch: `feature/update-2-5-0-flashcards`

Latest feature commit: `cb9a87eed12c1f8a8a055d5a7095fbc546f118d8`

### Home and setup

- Added a dedicated banner and four colour-coded navigation cards: Word (light blue), Definition (blue), Mixed (magenta), Sentence (purple).
- Added shadows matched to each card's darker base colour and pill-shaped setup controls.
- Added setup prompt with Beginner/Intermediate/Advanced and card-set selection.
- Added card sets: All available words, Common words, Nouns, Verbs, Adjectives, Adverbs, Everyday phrases and Subject/technical terms.
- Part-of-speech filters use the dictionary's `part` property.
- Hid My Collections UI. Existing collections/cards and management functions remain in code/data but are not shown in the learner UI.

### Gameplay and results

- Reworked the game view to keep the flashcard and four options on screen.
- Memory phase renders answer slots blacked out and hides their text.
- Answer phase blurs the flashcard and displays “Pick your answers”.
- Added yellow memory and orange answer gauge beneath the card.
- Added a fixed 3-second feedback interval with correct/incorrect colour coding and the original card revealed again.
- Added end-of-game result prompt with attempted, correct, incorrect, unanswered and accuracy figures. Closing it returns to the home page.
- Existing approved timer starts, reductions and floors, 60-second duration, daily allowance and abandon-without-charge rules remain unchanged.

### Mixed Recall and weak-memory review

- Mixed Recall randomly selects Word, Definition or Sentence mechanics each round.
- Added private per-user review records keyed by card and recall mode.
- Review prompt tabs: Word, Definition, Mixed and Sentence.
- Selecting a missed item shows its detail in a second panel. This is read-only; it never starts a game and does not consume allowance.
- Extended the authenticated data/start/complete RPCs for Mixed Recall and mode-specific review.
- Extended learning-history deletion to remove the new review metadata.

## Staging database changes

Applied only to the isolated SwiftDictionary Indie Staging project:
- `20261118143000_flashcards_mixed_recall_and_review_history.sql`
- `20261118150000_flashcards_review_history_deletion.sql`

Verification confirmed:
- Private review table exists.
- Flashcard session mode constraint accepts Mixed Recall.
- Data RPC returns review items.
- Completion RPC records mode-specific misses.
- Learning-history deletion includes review records.

Production database and production `main` were not changed.

## Automated validation

GitHub Actions workflow #89 passed:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44282805958

- JavaScript syntax checks passed.
- Flashcards page integration checks passed.
- Mock account/allowance/collection/timer regression tests passed.
- Chromium Mock User browser tests: 4/4 passed.
  1. Redesigned home and compact setup overlay.
  2. Word Recall answer masking, reveal and three-second feedback.
  3. Mixed Recall session and mode-specific weak-memory review.
  4. 60-second result prompt and close-to-return behaviour.

These tests use local static pages and the isolated Mock User adapter; they are not owner acceptance or live-authenticated Supabase browser testing.

## Legal/privacy planning

The new review metadata is account-linked learning activity data. It is minimal, stored in the private schema, and included in the authenticated learning-history deletion flow. Malaysia's PDPA amendment provisions came into force in stages during 2025. Review JPDP guidance on DPO appointment, breach notification and cross-border transfers before public/commercial expansion or introducing subscriptions. Applicability depends on actual controller/processor circumstances and statutory thresholds; this record is not legal advice or compliance certification.

Official references:
- https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024/
- https://www.pdp.gov.my/en/faq/
- https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-data-breach-notification-dbn/

## Owner Mock User handoff

Expected preview URL:
https://feature-update-2-5-0-flashca.swiftdictionary-testing.pages.dev/?swiftMock=1

The shortened hostname is allowlisted in the feature branch. Cloudflare's current deployment was not independently verified in this session; wait for the latest branch deployment to finish before testing. No production merge, PR or production SQL change is authorised by this work.

Suggested owner test focus:
- All four modes and all three difficulties.
- All card sets and availability of four distinct choices.
- Timer reductions/floors and timeout feedback.
- 60-second results prompt.
- Abandonment and daily allowance.
- Weak Memory tabs and detail panel.
- Account switching and responsive/mobile layout.
