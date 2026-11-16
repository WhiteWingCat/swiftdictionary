# Conversation archive — 2026-11-16 Quiz learning-page follow-up

## Owner decisions

The owner approved the Quiz translation fallback rule and confirmed the following:
- A changed translation preference should refresh an active Quiz immediately only when the requested language is already represented in that session's frozen snapshot.
- If the requested translation is absent from the snapshot, preserve the original session translation, answers and progress, explain the limitation, and apply the saved preference to the next Quiz.
- Dismissing the first-visit introduction saves that decision to the learner's account.
- Lessons, Quiz and Flashcards each need a consistently positioned ? control that reopens their introduction and FAQs.
- When Chinese is selected as the learning course, each of the three pages must clearly state that its Chinese learning course is not yet available. English content must not be misrepresented as Chinese learning content.
- Continue development normally when GitHub/Supabase tools request authorization. This does not approve merge, deployment or production Quiz schema/content changes.

## Repository implementation

Branch: feature/update-2-4-0-quiz. PR #8 remains draft and unmerged.

- index.html now contains a shared first-visit introduction/FAQ dialog, independent dismissal state for Lessons, Quiz and Flashcards, consistently positioned help controls, and explicit Chinese-course-unavailable notices.
- Dismissal state is keyed independently per account and page in local storage as a fallback; signed-in state is synchronised through public.learning_page_introduction_preferences. If a guest dismisses a guide before signing in, the guest choice is copied into the signed-in account when the account preference table is available.
- Quiz FAQ content covers session resume, answer editing, daily allowance and translation snapshot behaviour.
- Chinese selection hides the English Lessons library and Daily Learning area, hides Quiz session/results and shows a Chinese availability notice, and keeps Flashcards in its Coming Soon state with a Chinese availability notice.
- Quiz translation display now uses the learning-language text when that is the requested language, uses a non-learning translation only when the frozen snapshot contains it, and otherwise retains the original snapshot translation with a next-Quiz explanation. Quiz start waits for the existing preference write queue.
- Added migration supabase/migrations/20261116090000_swiftdictionary_update_2_4_0_learning_page_introduction_preferences.sql with a minimal page-key/dismissal timestamp table, account/page primary key, RLS and owner-scoped CRUD policies.
- Added structural/security assertions in supabase/tests/learning_page_introduction_preferences.sql.
- Extended scripts/quiz/validate-quiz-frontend.mjs and .github/workflows/quiz-db-foundation.yml to check the new feature and apply/test its migration only in disposable CI databases.
- Expanded tests/browser/update-2-4-0-quiz-runtime.spec.js to test first-visit dismissal persistence, independent page dismissals, help-button reopening, account isolation, Chinese/English course transitions and immediate Quiz display refresh when the requested language is already in the active snapshot.
- Updated docs/MASTER-DEVELOPMENT-RECORD.md with owner decisions, implementation, privacy considerations, validation boundary and next gates.

## Validation and current limits

- Static repository inspection confirmed no duplicate HTML IDs and presence of the required feature hooks and page notices. The test suite now includes dedicated authenticated runtime coverage.
- Quiz workflow run #224: PostgreSQL/frontend validation and the new migration/RLS assertions passed, but the local Supabase browser job failed because the introduction dialog markup was below the main inline script; event handlers ran before the dialog existed and stopped route initialization. Fixed by moving the dialog markup before the application scripts in commit b8830b0.
- Corrected run #234 passed its PostgreSQL/frontend validation job; its disposable local Supabase Auth/browser job was still running at the time of this archive update. Mock adapter support and validator coverage were added after that run and require the next CI execution.
- GitHub Actions was triggered for the implementation commits. At the time of this archive, the latest branch-head Quiz workflow run #224 was queued and earlier runs were still in progress; do not claim they passed until the exact latest branch-head run completes.
- No dedicated browser tests yet cover first visit, dismiss/reopen, cross-device dismissal sync, account isolation, Chinese availability transitions or Quiz translation fallback edge cases.
- Supabase project discovery returned the production SwiftDictionary project only and no development branches. The new migration remains a draft in the feature branch and has not been applied to production.
- The 114 Quiz questions remain drafts. No Quiz schema/RPC migration or content was applied to production. No website deployment, merge or production data change occurred.

## Privacy and legal notes

The new preference record is account-linked personal data even though it stores only page key and dismissal timestamp. Before release, include it in the Malaysia PDPA and international privacy review, confirm deletion cascade behaviour, add the retention purpose to the privacy notice and explain cross-device preference synchronisation. This is planning guidance, not legal advice or compliance certification.

## Next recovery steps

1. Confirm CI on the latest feature branch head, including inline JavaScript parsing and the new RLS assertions.
2. Add automated browser tests for first visit, dismiss persistence, ? reopen, per-page independence, account switching and guest fallback.
3. Test Quiz translation changes when the requested language is present and absent in the snapshot; verify answers/session are unchanged and the next session uses the new preference.
4. Test Chinese/English course switching on all three pages and verify no English learning content leaks into a Chinese-course state.
5. Keep PR #8 draft. Do not merge, deploy or apply production schema/content without explicit owner approval.

## Second browser validation and recovery

Quiz workflow run #234 (commit b8830b0) passed the PostgreSQL/frontend job. In its disposable local Supabase browser job:
- Passed: account-scoped independent introductions, Dismiss persistence and help-button reopening.
- Passed: Chinese/English availability transitions across Lessons, Quiz and Flashcards.
- Passed: existing Premium Quiz allowance, abandonment and active-session enforcement.
- Failed: the first Free Quiz test did not render the account's saved Chinese translation; the signed-out route exposed an empty Quiz session panel.

Repairs:
- Added an explicit signed-in user_preferences read before Quiz initialization so Quiz uses the account's saved learning and translation language.
- Session and results panels are now hidden unless the corresponding authenticated session/result exists.
- Added an English-only synthetic Quiz fixture and a dedicated browser test for the unavailable-snapshot fallback: preserve current English snapshot and answers, explain the next-Quiz preference, abandon without allowance use, then start a new session using the saved Chinese preference.
- Added static validator checks for account preference sync and translation notice updates.

Mock User support:
- The isolated mock adapter now supports account/page introduction dismissal rows in each simulated user's sessionStorage.
- Added a Node unit test confirming per-page persistence and account isolation. The 2.3.x workflow run #893 PostgreSQL job passed, including the expanded mock adapter unit suite. Its local Auth/Chromium jobs were still in progress at the last check.

The follow-up Quiz browser suite containing the preference sync and English-only snapshot fallback test is awaiting CI. No production schema or website deployment was changed.

## Translation fallback runtime result and test refinements

Quiz workflow run #254 (commit d2eacc0) passed the dedicated English-only snapshot fallback test end-to-end:
- Started a Quiz with an English-only translation snapshot.
- Changed the account preference to Chinese while the Quiz was active.
- Preserved the active English snapshot and saved answer, and displayed the next-Quiz fallback notice.
- Abandoned the session without consuming the daily allowance.
- Started the next Quiz using the updated Chinese preference; Chinese translation appeared.

The same run passed the Chinese-course availability transitions, Premium allowance/active-session test and signed-out gating. The PostgreSQL/frontend job also passed.

Two remaining browser failures were test assertion issues:
- The Free-session test checked a saved answer on question 2 although the answer had been saved on question 1. It now navigates back to question 1 before checking persistence.
- The introduction test checked the Flashcards dismissal row before waiting for the asynchronous dismissal dialog to close after persistence. It now waits for the dialog to close before querying the database.

Corrected assertions were committed in 67a8254. Quiz workflow run #262 was queued to re-run the complete corrected suite. The overall browser gate remains pending until that run completes.

## Third runtime validation and fixture-capacity repair

Quiz workflow run #262 (commit 67a8254):
- The disposable local Supabase/Auth/RPC/browser job passed.
- The browser suite passed all six tests on final attempts, including the unavailable-snapshot fallback, answer persistence, independent page introductions, account isolation, Chinese availability, Premium allowance and signed-out gating.
- One navigation assertion was flaky on its first attempt because the asynchronous answer save took longer than the default five-second expectation; it passed on retry.
- Supabase security advisors passed.

The separate PostgreSQL foundation job failed in the Premium multi-session RPC assertion on the third 15-question session with topic_coverage_unavailable. This exposed insufficient synthetic fixture topic diversity/capacity for repeated sessions. The test-only fixture was expanded to ten topics and sixty questions per difficulty, plus thirty English-only Beginner questions for the translation fallback case (commit f753e40). No production content/schema was changed.

The Quiz browser navigation assertions now allow up to 15 seconds for async answer persistence (commit e9ca861). Both jobs must be rerun on the latest branch head before the CI gate can be considered green.

## Full green Quiz CI run

Quiz workflow run #269 (commit f753e40) completed successfully across both jobs:
- PostgreSQL 17 foundation, migration, Quiz RPC, draft-content and allowance validation passed.
- Disposable local Supabase Auth/RPC and authenticated Chromium browser tests passed.
- Account-scoped introduction preference migration and RLS assertions passed.
- First-visit dismissal, account isolation, FAQ reopening and Chinese availability tests passed.
- The unavailable-translation snapshot fallback test passed, including saved answer preservation and applying the new preference to the next Quiz.
- Supabase security advisors passed.

This is the first complete green CI run for the new learning-page feature set. Run #271 re-runs the suite with extended Playwright navigation timeouts; it was in progress when this note was written. Latest branch-head run #274 was queued after documentation-only updates.
