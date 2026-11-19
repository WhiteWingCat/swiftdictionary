# SwiftDictionary Update 2.5.0 — Owner feedback round 2 (2026-11-19)

## Context and safety boundary

The owner tested the redesigned Flashcards feature on `feature/update-2-5-0-flashcards` and supplied nine additional changes. Development continued on that feature branch. Production `main`, production Cloudflare deployment and production Supabase were not changed. Pull request #12 remains open and unmerged.

Current branch commit at archive time: `3a96ba41e65da00b0cf5827ac6bbb71159f7c7f3`.

## Owner feedback and implementation

1. **Duplicate questions**
   - Deduplicate source cards and answer choices.
   - Track selected target card keys for the duration of a game.
   - Do not repeat a target until the eligible pool is exhausted.
   - Mixed Recall now considers the unused-target pool across Word, Definition and Sentence sub-modes, so a random mode switch cannot prematurely reset the cycle.

2. **Chinese translation**
   - Follow the existing Quiz pattern: English learning course with Simplified Chinese selected as translation language.
   - Translate the Flashcards home, setup, game phases, feedback, results and Weak Memory interface.
   - Word Recall: English target with Chinese meaning choices.
   - Definition Recall: Chinese meaning prompt with English word choices.
   - Sentence Recall: English sentence with a Chinese meaning hint.
   - Chinese learning course itself remains unavailable, matching current Quiz scope. If the owner intended a full Chinese learning-course Flashcards game, that is a separate expansion requiring a new content/data design.

3. **60/120-second challenge**
   - Shared 60- or 120-second selection in the setup prompt for all four recall modes.
   - Store the selected duration in the private session row.
   - Completion RPC validates against the selected session duration.
   - New migration: `20261119130000_flashcards_60_120_second_challenges.sql`.
   - Existing sessions default to 60 seconds.

4. **Time's Up transition**
   - On timeout, blur the game behind an animated “Time's Up!” overlay.
   - Hold the transition for two seconds before saving/displaying the results prompt.

5. **Dashboard statistics and Weak Memory**
   - Dashboard shows recent games completed, questions attempted, recent accuracy and weak-memory summary.
   - Weak Memory opens a prompt overlay from Dashboard; closing it leaves Dashboard active.
   - Flashcards overlay root moved outside the hidden page container so the same prompt can be opened from Dashboard.
   - Statistics degrade gracefully if the Flashcards data RPC is not deployed yet.

6. **Lessons and Quiz banners**
   - Replace standalone headings with shared banner headers in the Flashcards visual family.
   - Preserve help and Quiz refresh controls.

7. **Navigation visual design**
   - Main navigation uses bold white labels, contextual icons and drop shadows.
   - Secondary navigation/filter controls receive consistent drop shadows.

8. **Dictionary Filters**
   - Group category, saved-word and alphabet filters into a single Filters navigation button.
   - Open all available filters in a modal overlay on top of the Dictionary page.

9. **Dashboard markup compatibility**
   - Corrected section nesting after adding Flashcard statistics.
   - Strengthened tests to ensure allowance details and practice-insight content remain within Dashboard.

## Validation

- GitHub Actions Flashcards workflow run [#44471295332](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44471295332) passed on commit `3a96ba41e65da00b0cf5827ac6bbb71159f7c7f3`.
- Both the static/Mock regression job and Chromium Mock User browser job passed. All **10 Chromium Mock User browser tests** passed. Coverage includes:
  - 12 approved timing schedules and 0.2-second reductions/caps.
  - 60-second results flow and two-second Time's Up transition.
  - 120-second challenge remaining active after 60 seconds.
  - Chinese interface and translated English-learning prompts.
  - Dashboard statistics and Weak Memory overlay staying on Dashboard.
  - Lessons/Quiz banners and Dictionary Filters overlay.
- GitHub Actions local Supabase workflow run [#44471295226](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44471295226) passed both jobs. The `quiz-db-foundation` job applied the new duration migration in its isolated database and passed the authenticated Flashcard RPC SQL test; the companion local Auth/RPC job also passed the authenticated Chromium Quiz runtime tests.
- The separate 2.3.x regression workflow remains non-green because it expects an internal SQL draft to exist on `main` even though project documentation is maintained on `docs/master-development-record`, and it contains a local test-server Mock-mode expectation. The Dashboard nesting issue was corrected; the dedicated 2.5.0 browser suite passes.
- Cloudflare Pages branch preview URL was not independently verified. Retrieve the exact latest preview URL from Cloudflare Pages → project → Deployments for `feature/update-2-5-0-flashcards`; do not rely on a guessed hostname.

## Legal and privacy planning

- No new personal-data category, third-party processor, analytics event or raw-answer telemetry was introduced.
- `duration_seconds` is a gameplay setting attached to an existing private session row. Dashboard statistics aggregate existing session and Weak Memory records. Chinese translation uses existing dictionary content.
- Dashboard statistics and Weak Memory constitute limited educational performance monitoring/profiling but do not make high-stakes decisions. Keep the purpose transparent, retain account-scoped access and existing deletion behaviour, and screen for DPIA/DPO requirements before broader public expansion.
- Completed session retention remains undecided. The 120-second mode does not change retention.
- Malaysia PDPA scope, personal/household exemption, 16+ age scope, cross-border processing and JPDP DPO/DPIA/breach requirements remain fact-specific legal review items. This is planning, not legal advice or a compliance conclusion.
- The new migration was applied only to the disposable CI Supabase environment. It has not been applied to staging or production.

## Remaining owner gates

- Owner Mock User testing is now ready from the code/CI side.
- Test all four modes, all difficulties/card sets, 60/120 seconds, duplicate prevention (especially Mixed Recall), translated prompts, Time's Up transition, Dashboard stats/review, navigation, banners, Filters overlay, account switching and responsive layouts.
- Do not merge PR #12, deploy production, or apply the new migration to staging/production until the owner has reviewed the Mock User build and explicitly approves the relevant next step.
- Keep the rolling three-feature-branch policy and keep project records on `docs/master-development-record`.
