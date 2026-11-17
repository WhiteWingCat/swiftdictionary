# Update 2.4.0 — Mock Quiz draft question-bank integration (2026-11-17)

## Owner direction

The owner asked to proceed with replacing synthetic Mock Quiz placeholders with the existing 114 draft questions. The owner explicitly accepted that these questions may not be fully accurate yet and wants to use them to provide meaningful interface/content feedback. Approved learner-facing content review remains a later task.

The owner also clarified that GitHub write permission should be requested through the usual repository authorisation prompt, rather than asking them to manually change Settings. Repository write operations were performed through the connected GitHub integration; no manual permission changes were requested.

## Scope and safety boundary

- Use the existing bilingual draft file `content/quiz/questions.en-zh.draft.json` and its curriculum map `content/quiz/curriculum-map.en.json`.
- Keep the feature preview's explicit opt-in boundary: exact host `feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev` plus `?swiftMock=1`.
- Keep all mock state in sessionStorage. Mock mode continues to intercept Supabase client creation, disable Google sign-in and cloud/database operations, and use fictional Test User A (Free) / Test User B (Premium).
- Simulate Quiz sessions, answers, scoring, history, resume/abandonment and allowances locally. No staging or production database writes, imports, migrations, accounts or configuration changes are part of this task.
- Draft content remains unapproved for learner-facing use. No publication, merge to main or production deployment is authorised.

## Implementation

### Draft bank loader and validation

`mock-testing.js` now loads the question-bank JSON and curriculum map only after Mock Test Mode is activated and a Quiz availability/start RPC is called. The loader requires the content pack to remain explicitly marked `draft`, checks for exactly 114 questions, validates bilingual prompts/options/explanations, checks unique option IDs and the correct-option key, and requires every source lesson to map to a valid difficulty/topic.

The bank was independently inspected during this task:
- Beginner: 30 questions
- Intermediate: 36 questions
- Advanced: 48 questions
- Total: 114 questions
- All 114 questions had a curriculum mapping and passed the structural checks described above.

### Session selection

Mock sessions now sample without replacement from the eligible difficulty pools for each session:
- Beginner: 10 Beginner questions
- Intermediate: 12 Intermediate + 3 Beginner questions
- Advanced: 12 Advanced + 6 Intermediate + 2 Beginner questions (60% Advanced)

The overall question order and each question's answer-option order are shuffled. Original option IDs and correct-answer identity are preserved. Correct keys and explanations remain hidden in active-session RPC payloads and are returned only for completed review. The existing session and allowance simulation remains in place.

### User-facing notice

The Quiz preview notice now explains that the 114 bilingual draft questions are being used, that their accuracy is not yet approved for learners, and that sessions, answer checking, scores, history and allowances remain local simulations.

### Tests

`tests/update-2-3-1/mock-testing.test.mjs` now supplies the actual draft JSON and curriculum map to its isolated VM environment. Quiz assertions check that returned question IDs/prompts/source lessons come from the real bank, that answer keys are not exposed before submission, that correct keys are preserved after submission, and that the Advanced session uses the 12/6/2 difficulty composition. Premium session completion uses the actual correct option from each source draft.

## Files changed

- `mock-testing.js`
- `index.html`
- `tests/update-2-3-1/mock-testing.test.mjs`

No question-bank source content was edited.

## Branch, PR and validation status

- Branch: `feature/update-2-4-0-quiz`
- PR #8 remains draft, open and unmerged.
- Latest implementation commit at archive time: `2a9173abe13b3c0405a34e5267c180349e542f97`.
- GitHub Actions runs for that branch head were still in progress at the time this archive was written:
  - Quiz database foundation
  - SwiftDictionary 2.3.x allowance and dashboard regression checks
- An earlier intermediate regression run failed because the test VM did not yet provide the newly required draft-bank `fetch` stub. The test harness was subsequently updated to supply both JSON fixtures and later branch-head runs are the relevant validation evidence. Do not treat the earlier intermediate run as final validation.
- Cloudflare Pages deployment of the latest implementation commit has not yet been confirmed. Do not assume the preview URL serves these changes until a successful deployment is observed.

## Legal, privacy and release notes

This change adds no real learner data collection and keeps test state in the browser's sessionStorage under the existing isolated mock adapter. The 114 draft questions and their explanations may contain errors and are explicitly not learner-approved. Keep the existing Malaysia PDPA and applicable international/teen privacy, retention, deletion and cross-border processing review as release gates. This is planning guidance, not legal advice.

## Recovery and next steps

1. Check the latest GitHub Actions runs on `2a9173abe13b3c0405a34e5267c180349e542f97`, especially the isolated mock adapter test step.
2. Fix any failure from the actual logs and rerun CI before declaring validation complete.
3. Confirm Cloudflare Pages has deployed the latest feature-branch commit.
4. Only then provide the owner the Mock User preview link and ask them to use the two fictional identities for feedback.
5. Keep the draft content unapproved, PR #8 unmerged, and production/staging unchanged unless separately authorised.


## Follow-up implementation and validation (2026-11-17)

- Updated `scripts/quiz/validate-quiz-frontend.mjs` to enforce the new mock-only draft-bank loader, draft-status guard, bilingual curriculum files, and hidden-before-submission answer-key behaviour. This replaced stale assertions that required synthetic question copy and a hard-coded correct-option variable.
- Moved the draft-bank warning out of the overview-only container so it remains visible throughout an active Mock Quiz and its results.
- The isolated Mock User test suite passed **12/12** on commit `2a9173abe13b3c0405a34e5267c180349e542f97`, including real draft content, option-key preservation, Free/Premium allowances, and the Advanced 12/6/2 mix. The later frontend validator also passed in the Quiz database foundation CI job on commit `ce606a762f7d443ff6156ac26092ee1f47ca7c84`.
- On the current application commit `ccd4bc5de796ad49fa267474cac00a26ec6c7d09`, Cloudflare Pages reports **success**. The separate Workers Builds check reports **failure**, consistent with the previously recorded distinct Workers build issue; it is not the Pages deployment result.
- On the same current commit, the PostgreSQL 17 regression job in the 2.3.x workflow passed. The 2.3.x Chromium and Supabase CLI Auth jobs and the 2.4.0 local Supabase Auth/RPC integration job were still running at the latest check. Do not mark all project CI gates passed until those jobs finish.
- Files changed now also include `scripts/quiz/validate-quiz-frontend.mjs`. Latest application commit at this follow-up: `ccd4bc5de796ad49fa267474cac00a26ec6c7d09`.

The Mock User preview may be opened after deployment using the existing feature preview URL with `?swiftMock=1`. Use only the fictional Test User A / Test User B identities. The mock is still a browser-side simulation, not a real backend or RLS test.


## Owner's Mock Quiz feedback and follow-up changes (2026-11-17)

After testing the draft-bank Mock User preview, the owner requested four improvements:

1. During the future full accuracy review, check every draft question for duplicate answer options. No duplicate answers should remain.
2. Opening a completed Quiz review from Dashboard history should enter the review directly, without first showing the Quiz overview. Returning from the review must restore the originating page; a Dashboard-originated review must return to Dashboard.
3. Dashboard Quiz history must display the real correct-answer count (for example, 10/10), not a placeholder such as --/10.
4. Learning-course and translation-language selectors must each be changeable in one interaction, without opening a separate trigger menu first.

### Duplicate-option audit finding

A structural duplicate scan was performed across all 114 draft questions. It normalised Unicode, case, whitespace and punctuation, and compared the learning and translation option text independently. It found **9 questions with duplicate Chinese translation options**; no duplicate English learning-option strings were found by this scan:

- `quiz-beginner-012` — options b and d repeat
- `quiz-beginner-015` — all four translation options repeat
- `quiz-beginner-018` — all four translation options repeat
- `quiz-beginner-019` — all four translation options repeat
- `quiz-beginner-027` — options b and d repeat
- `quiz-beginner-030` — all four translation options repeat
- `quiz-intermediate-028` — options a, b and c repeat
- `quiz-intermediate-029` — all four translation options repeat
- `quiz-advanced-019` — options a and c repeat

These are now explicit editorial blockers for the comprehensive accuracy review. Do not silently generate replacement distractors; each option must be reviewed against its question context, correct answer and bilingual meaning. The current draft content file was not changed in this follow-up.

### Implemented code changes

- `mock-testing.js`: Mock `get_my_quiz_history` now includes `correct_count`, matching the database RPC payload.
- `index.html`: Dashboard history review now opens the review state directly and skips Quiz overview initialisation. Review stores its originating page and its return control returns Dashboard when opened from Dashboard; review opened from the Quiz page returns to the Quiz overview. Language controls are now compact, always-visible native selects beside the book/globe icons, removing the extra trigger-button click.
- `tests/update-2-3-1/mock-testing.test.mjs`: asserts Mock Quiz history returns the real correct count.
- `tests/browser/update-2-4-0-quiz-runtime.spec.js`: selector helpers use the direct controls; adds checks for 10/10 Dashboard history, direct review without showing Quiz home, and return to Dashboard/Quiz as appropriate.
- `scripts/quiz/validate-quiz-frontend.mjs`: enforces the one-interaction selectors, Dashboard-origin review route/return label, and correct-count field in mock history.

### Validation at the time of this note

- GitHub Actions `quiz-db-foundation` static validation passed on commit `17ace8e5e122d791e9f1547109d6c147ef63c9c3`.
- 2.3.x regression workflow PostgreSQL 17 and Chromium regression jobs passed on the same commit. The Chromium workflow reported 23 passed, 6 skipped; the 2.4.0 runtime browser cases are among the skipped cases in that companion workflow, so do not treat those skipped cases as directly tested.
- 2.4.0 local Supabase Auth/RPC integration and 2.3.x Supabase CLI Auth compatibility were still running at the latest status check.
- Latest feature application changes are on `feature/update-2-4-0-quiz`; no merge to main or production change is authorised. Wait for current CI and Cloudflare Pages deployment status before sharing the refreshed preview.
