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
