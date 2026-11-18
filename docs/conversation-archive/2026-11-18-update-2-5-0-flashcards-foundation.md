# Update 2.5.0 — Flashcards foundation implementation (2026-11-18)

## Purpose and scope

The owner asked to initiate Update 2.5.0 after approving the Flashcards design and timer rules in the preceding planning conversation. This archive records the initial implementation and staging validation. It is not a release sign-off.

## Confirmed product rules

- Four Flash Recall modes: Word, Definition, Translation and Sentence Recall.
- Three difficulty levels for every mode.
- 60-second total game duration and four answer choices.
- Starting memory/answer durations:
  - Beginner: 5s / 12s.
  - Intermediate: 3s / 9s.
  - Advanced: 2s / 6s.
- Fixed reduction after every selected answer, whether correct or incorrect; timeout is incorrect and also shortens the next timers:
  - Beginner: −0.5s memory / −1s answer.
  - Intermediate: −1.5s memory / −4s answer.
  - Advanced: −0.7s memory / −3s answer.
- Minimum floors:
  - Beginner: 2s memory / 5s answer.
  - Intermediate: 1.5s memory / 4s answer.
  - Advanced: 0.7s memory / 3s answer.
- Results: words seen, correct, incorrect and unanswered; unanswered contributes to incorrect.
- Mastery: per-card correct/incorrect counts, current streak, last result and last-seen time.
- Three collection areas only: Learning Collections, Weak Memory and My Collections.
- My Collections supports user-named collections, dictionary entries and fully custom question/answer cards; editing, moving, reordering, removing, renaming, deleting and account sync.
- Free allowance 3 completed games/day; Premium 10. Abandoning a game does not consume allowance.
- Current Flashcards learning course is English; Translation Recall uses the selected translation language. Chinese learning-course Flashcards remain unavailable for 2.5.0.

## Implementation work

Repository: `WhiteWingCat/swiftdictionary`

Production baseline: `main` at `65d0a35bab577adc15a0b1911661c222ed625739` (Update 2.4.2).

Feature branch: `feature/update-2-5-0-flashcards`

Latest implementation commit at this archive: `4e65a3cf32fdd536533ef536adb9c99f6db3c129`.

### Frontend

- Added `flashcards.js` and loaded it from `index.html`.
- Replaced the Flashcards Coming Soon placeholder.
- Added the four recall modes, difficulty selection, game timer, memory and answer phases, fixed reductions/floors, shuffled distinct answer choices, timeout handling and final result submission.
- Added Learning Collections (all available English dictionary words), Weak Memory prioritisation and My Collections.
- Added custom collection/card CRUD, dictionary-word additions, move and reorder controls.
- Translation Recall snapshots the selected translation language when the game begins.
- Profile allowance display includes Quiz and Flashcards from today's completed activity rows.
- Help copy describes the timer rules, modes and allowance.
- Privacy notice clarifies that deleting learning history removes Flashcard sessions/mastery but preserves collections and custom cards.

### Database

Migration: `supabase/migrations/20261118090000_swiftdictionary_update_2_5_0_flashcards_foundation.sql`.

Private tables:
- `private.flashcard_collections`
- `private.flashcard_cards`
- `private.flashcard_mastery`
- `private.flashcard_sessions`

All four tables have RLS enabled and no direct table grants to authenticated/anon. Public SECURITY INVOKER wrappers call private SECURITY DEFINER implementations, which derive the owner from `auth.uid()`. Anonymous RPC execution is revoked.

Server-side controls:
- Owner checks on collections/cards and custom-card mastery keys.
- Result payload bounded to 30 entries.
- Game start checks the private allowance ledger under the effective user timezone.
- Completion uses the existing learning activity log and allowance trigger; server refuses completion before the 60-second window.
- Abandoned games do not insert a completion event.
- Deleting a custom card/collection clears its custom-card mastery.
- Learning-history deletion clears game sessions/mastery but preserves user-authored collections/cards.
- Account deletion cascades via `auth.users`.

## Mock User and automated testing

- `mock-testing.js` supports collection/card/game/mastery RPCs, account isolation, Free/Premium allowance limits and a separate allowance ledger that survives learning-history deletion.
- `tests/update-2-3-1/mock-testing.test.mjs` gained tests for Flashcard limits, timer rules, account isolation, custom cards, collection edits/moves/deletes and history deletion.
- `tests/update-2-5-0/check-flashcards-page.mjs` syntax-checks inline scripts and verifies the Flashcards integration.
- `.github/workflows/update-2-5-0-flashcards-test.yml` runs the checks on the feature branch and PRs to main.
- Latest CI run #44258066606 passed:
  - JavaScript syntax checks.
  - Inline application script/page integration checks.
  - Mock account, allowance, collection and timer regression tests.
- Some early CI attempts failed due checker regex escaping and a stale 60-second assertion; both were corrected. The latest workflow passed.

## Staging validation

Staging project: `ivatvkfrtifgfheeaelj` (Singapore). Production project: `pzymiesazmpyvnfvsbsc` (Tokyo).

Staging migration applied and final migration history reconciled to:
- Version `20261118090000`
- Name `swiftdictionary_update_2_5_0_flashcards_foundation`

Staging authenticated SQL integration test `supabase/tests/flashcards_authenticated_rpcs.sql` passed. It checked:
- Authenticated collection and custom-card creation.
- Flash Recall start and completion.
- Correct, incorrect and unanswered result totals.
- Abandoned-game no-charge behaviour.
- Free allowance blocks the fourth completed game.

The test uses a transaction and rolls back. Follow-up checks confirmed:
- CI auth users: 0.
- Flashcard collections/cards/sessions/mastery rows: all 0.
- Staging Free/Premium limits: 3/10.
- RLS enabled on all four private tables.
- Authenticated direct table SELECT/INSERT denied; anon SELECT denied.
- Six public RPC wrappers executable by authenticated and not executable by anon.
- No Flashcard-specific unindexed foreign key remained after adding the card-owner index.

The staging performance advisor still reports existing Quiz/application unindexed foreign keys, RLS init-plan notices and unused indexes on an empty test database. No speculative cleanup was performed.

Production remains untouched:
- No Flashcard tables.
- Existing Flashcard allowance values remain Free 5/Premium 12.
- No production migration, merge or deployment.

## Legal and privacy planning

This is a feature-specific planning review, not legal advice.

- Collections/custom cards store user-authored text and optional examples/translations, scoped to the signed-in account and not shared publicly.
- Mastery stores aggregate counts/streak/last result/last-seen time; raw per-question answer streams are not retained.
- Game sessions store mode, difficulty, counts and timestamps. No separate retention period for completed sessions has been approved; they currently remain until learning-history deletion or account deletion.
- Learning-history deletion preserves user-authored collections/cards, and the UI now says so.
- Production primary DB region is Tokyo; staging is Singapore. The staging test used no retained user data.
- Malaysia PDPA applicability remains fact-specific for a free individually operated public service. Review controller registration, breach notification, DPO thresholds, cross-border transfers, privacy notice, retention and account/user-rights processes.
- Weak-memory prioritisation is adaptive processing of learner performance and should be included in DPO/DPIA screening.
- The intended audience remains 16+. EU GDPR Article 8 age thresholds vary between 13 and 16 by Member State; a global country-by-country child-privacy screen remains necessary.

Official references:
- JPDP Act 709 and Amendment Act 2024: https://www.pdp.gov.my/en/akta/pdp-act-2010-en/
- JPDP Data Breach Notification guidance: https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-data-breach-notification-dbn/
- JPDP DPO guidance: https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-the-appointment-of-data-protection-officer-dpo/
- JPDP Cross-Border Transfer guidance: https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-cross-border-transfer-of-personal-data-cbpdt/
- European Commission child-data safeguards: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en

## Current status and remaining work

Update 2.5.0 is still in development. The branch is not merged and no PR or production deployment has been created.

Outstanding:
1. Owner's manual Mock User browser testing of all modes/difficulties/timers/timeout/abandonment.
2. Verify the Cloudflare Pages branch preview is available; it was not browser-verified in this session.
3. Owner review of collection flows, custom cards, ordering, Weak Memory, account switching, responsive UI and translations.
4. Decide retention for completed Flashcard sessions.
5. Complete Malaysia/global privacy review and update the public privacy notice before friend onboarding.
6. Prepare production migration/release only after explicit owner approval.

The rolling three-branch policy remains active. The current GitHub integration does not expose branch-ref deletion, so no old branch is claimed deleted. Previously protected unique work remains protected.
