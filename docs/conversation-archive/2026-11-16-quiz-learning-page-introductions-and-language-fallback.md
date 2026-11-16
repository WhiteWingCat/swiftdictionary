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
- Dismissal state is keyed independently per account and page in local storage as a fallback; signed-in state is synchronised through public.learning_page_introduction_preferences.
- Quiz FAQ content covers session resume, answer editing, daily allowance and translation snapshot behaviour.
- Chinese selection hides the English Lessons library and Daily Learning area, hides Quiz session/results and shows a Chinese availability notice, and keeps Flashcards in its Coming Soon state with a Chinese availability notice.
- Quiz translation display now uses the learning-language text when that is the requested language, uses a non-learning translation only when the frozen snapshot contains it, and otherwise retains the original snapshot translation with a next-Quiz explanation. Quiz start waits for the existing preference write queue.
- Added migration supabase/migrations/20261116090000_swiftdictionary_update_2_4_0_learning_page_introduction_preferences.sql with a minimal page-key/dismissal timestamp table, account/page primary key, RLS and owner-scoped CRUD policies.
- Added structural/security assertions in supabase/tests/learning_page_introduction_preferences.sql.
- Extended scripts/quiz/validate-quiz-frontend.mjs and .github/workflows/quiz-db-foundation.yml to check the new feature and apply/test its migration only in disposable CI databases.
- Updated docs/MASTER-DEVELOPMENT-RECORD.md with owner decisions, implementation, privacy considerations, validation boundary and next gates.

## Validation and current limits

- Static repository inspection confirmed no duplicate HTML IDs and presence of the required feature hooks and page notices.
- GitHub Actions was triggered for the implementation commits. At the time of this archive, the newest CI runs were still in progress; do not claim they passed until the exact latest branch-head run completes.
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
