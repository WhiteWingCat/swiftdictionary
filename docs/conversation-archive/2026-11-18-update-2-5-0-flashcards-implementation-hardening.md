# Update 2.5.0 — Flashcards implementation hardening and automated Mock User validation (2026-11-18)

## Purpose

Continue implementation after reviewing the latest Master Development Record and Flashcards foundation archive. The owner asked development to continue until an approval dependency or a Mock User testing handoff. This archive records the implementation hardening and automated validation completed in this session.

## Source of truth and recovery point

- Master Development Record: `docs/MASTER-DEVELOPMENT-RECORD.md` on `docs/master-development-record`.
- Initial foundation archive: `docs/conversation-archive/2026-11-18-update-2-5-0-flashcards-foundation.md`.
- Previous preflight follow-up: `docs/conversation-archive/2026-11-18-update-2-5-0-flashcards-preflight-validation.md`.
- Implementation branch: `feature/update-2-5-0-flashcards`.
- Latest implementation commit: `b48933a2bef3a5affa6b7224c43521fdb3370be3`.
- Production baseline remains Update 2.4.2 at `65d0a35bab577adc15a0b1911661c222ed625739`.

## Owner-approved product rules preserved

No product decisions changed:
- Word, Definition, Translation and Sentence Recall.
- Beginner, Intermediate and Advanced.
- 60-second game with four distinct shuffled choices.
- Initial memory/answer durations: Beginner 5s/12s; Intermediate 3s/9s; Advanced 2s/6s.
- Fixed reductions after every answer, including incorrect answers and timeouts:
  - Beginner: −0.5s memory / −1s answer.
  - Intermediate: −1.5s memory / −4s answer.
  - Advanced: −0.7s memory / −3s answer.
- Floors: Beginner 2s/5s; Intermediate 1.5s/4s; Advanced 0.7s/3s.
- Free 3 completed games/day; Premium 10. Abandonment does not consume an allowance.
- Learning Collections, Weak Memory and My Collections. Custom cards, dictionary cards and collection management remain account-scoped.
- Flashcards currently use the English learning course; Translation Recall uses the selected translation language. Chinese learning-course Flashcards remain unavailable in 2.5.0.

## Implementation changes

### Round generation

- Preflight validates the selected mode and four distinct choices before the server session is created.
- Every eligible target is checked for three distinct distractors in that mode; only viable targets can be selected during play.
- This prevents later rounds from failing due to duplicate-heavy definitions/translations after the session has already started.
- Failed preflight clears the temporary deck and does not create a session or consume allowance.

### Dictionary-card content

- Selected collection dictionary cards now use their saved front, back, example and translation fields during gameplay.
- The canonical dictionary word remains the stable mastery key, so editing the visible front text does not fragment learning history.
- Translation Recall continues to use the selected language snapshot captured at game start.

### Collection management

- Deleting the currently selected collection resets the manager to the neutral selection before data reload.
- Moving a card appends it to the destination collection.
- Added browser regression coverage for deletion and edited dictionary-card gameplay.

### Session lifecycle and course handling

- Prevented duplicate start requests while the server session is being created.
- Disabled the start action while its request is pending.
- Replaced the active game view with a saving state while completion or abandonment is being finalised.
- Refreshes account-scoped data after the session is finalised.
- Chinese learning-course selection now displays a clear English-course requirement instead of an empty Flashcards page.

## Automated validation

GitHub Actions workflow run **#77** passed on commit `b48933a2bef3a5affa6b7224c43521fdb3370be3`:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44270148241

Both jobs passed:
1. Static/mock job: JavaScript syntax, inline/page integration, Mock User account isolation, allowance, collection and timer regression tests.
2. Chromium Mock User browser job: **4/4 passed**:
   - Create collection/custom card/dictionary card; play Flash Recall; verify four distinct options and timer reduction; abandon without allowance use; verify completed allowance and Profile.
   - Switch Free/Premium Mock Users and verify collection isolation.
   - Delete selected collection and verify manager resets.
   - Edit dictionary-card front/back and verify saved content is used in selected gameplay.

This browser suite runs against the local static app with the isolated Mock User adapter. It does not establish live Cloudflare preview reachability, real Supabase integration or owner acceptance.

## Deployment and database boundaries

- The staging Flashcards foundation migration and authenticated SQL integration had already passed, as documented in the foundation archive. No database migration or staging write was required for this frontend hardening pass.
- Production remains at Update 2.4.2; no Flashcard schema or production allowance change was applied.
- No PR, merge, production deployment or destructive action was performed.
- The expected branch preview host is `feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev` with explicit `?swiftMock=1`. This session could not independently verify Cloudflare preview reachability.

## Legal/privacy notes and outstanding approvals

- No new personal-data category, external data source, analytics or raw-answer telemetry was introduced.
- Existing private user-authored card/collection text, aggregate mastery and session metadata remain in scope.
- Completed-session retention remains undecided.
- Malaysia PDPA and international/16+ privacy review, cross-border processing review and public test/privacy notice remain gates before public friend onboarding. This is planning, not legal advice or compliance certification.
- Production release, PR/merge and production database changes require explicit owner approval.

## Next action

The code and automated suite are ready for owner Mock User testing once the expected Cloudflare preview is reachable. Owner testing should cover all four modes and three difficulties, timer reductions/floors, timeout, 60-second completion, abandonment, Weak Memory, dictionary/custom card management, account switching, selected translation language, allowance display and responsive layouts.

## Recovery point

Continue from `feature/update-2-5-0-flashcards` at `b48933a2bef3a5affa6b7224c43521fdb3370be3`. Documentation remains on `docs/master-development-record`; production `main` remains unchanged.
