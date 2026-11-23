# SwiftDictionary Update 2.8.0 — second owner feedback remediation

Date: 2026-11-23  
Repository: WhiteWingCat/swiftdictionary  
Feature branch: feature/update-2-8-0-chinese-quiz-flashcards  
Pull request: #16 (draft)  
Staging project: SwiftDictionary Indie Staging (ivatvkfrtifgfheeaelj)  
Production: unchanged

## Owner feedback scope

The owner requested twelve corrections:

1. Redesign Answer Review to match the current Quiz appearance.
2. Review Chinese Quiz questions that expose or overly hint at their answers.
3. Finish redesigning Choose a Difficulty, Daily Quiz Allowance and Quiz History containers.
4. Warn before starting a Quiz that a daily allowance will be consumed, following the Permanent Lesson pattern.
5. Give Beginner, Intermediate and Advanced distinct colors.
6. Make Translation Recall orange.
7. Show an immediate exhausted-allowance notification when a Flashcard recall game is attempted.
8. Improve Dashboard tabs with individual colors/icons, readable labels, panel backgrounds, shadows and transitions.
9. Add a custom Dashboard hero banner containing the Profile icon, title and description.
10. Fix Chinese topic rendering in Daily History.
11. Separate Daily History into Lessons, Quiz and Flashcards.
12. Move Dashboard Quiz History out of Analytics and into Daily History.

## Implementation record

### Quiz

- Replaced the old Answer Review block with a summary header, score display, per-question correctness pill, clearer option rows and explanation panels.
- Restyled the difficulty, allowance and history containers. Difficulty cards use independent green/blue/purple colors.
- Quiz start shows a bilingual confirmation. A cancelled prompt creates no session and consumes no allowance. A successfully created Quiz session is charged immediately; abandonment does not refund it.
- Removed option Pinyin and English translation hints from active Chinese Quiz choices. These were able to reveal the correct option even when the prompt itself was fixed. Pronunciation and translation remain available in Answer Review.
- The Chinese question bank initially contained multiple prompt-language answer leaks. A first pass rewrote 68 question rows and cleared answer-matching Pinyin; normalized scans then identified five additional Chinese phrase leaks and 52 English translation-prompt leaks, plus one final English gloss wording. These were corrected through new question revisions rather than overwriting historical revisions.
- Structural checks found all 145 approved questions have exactly four options, a valid correct-option reference and an explanation; no duplicate Chinese learning-option sets. A targeted distractor audit identified and revised five weak sets. The server randomises option order for each session. Five targeted distractor sets were revised to use grammatical, plausible alternatives, covering the advanced 把 construction, state/result particles, 得 complements and measure words. The server randomises option order per session, so the source bank's correct-option position does not determine the displayed position.
- Final staging SQL audit: 145 approved Chinese questions; zero normalized correct-answer matches in Chinese knowledge prompts; zero normalized correct-answer matches in English translated prompts; zero correct-option Pinyin matches in question Pinyin. The 129 retired rows are retained historical revisions, not deleted questions.

### Flashcards

- Translation Recall now has an orange card.
- Opening a recall setup or attempting to start a game while the daily allowance is exhausted immediately shows the existing daily allowance toast.
- If a stale client allowance is rejected by the server, the client refreshes allowance data and displays the exhausted notification.

### Dashboard and history

- Added a custom hero banner around the avatar/Profile icon, “Your Dashboard” title and description.
- Added unique tab colors and icons, readable labels, panel backgrounds, shadows and transition animations.
- Rebuilt Daily History into three distinct groups: Lessons (permanent lessons and Daily Learning), Quiz, and Flashcards.
- Chinese daily activity content IDs, including revision-prefixed IDs, are resolved against the Chinese daily catalogue. Chinese permanent lessons resolve against the Chinese lesson catalogue.
- Removed the Dashboard Quiz History card from Analytics and added Quiz records/review actions to the Quiz group in Daily History. The standalone Quiz page retains its own history.

## Supabase staging changes

Applied:
- 20261123140000_swiftdictionary_update_2_8_0_quiz_start_allowance_and_chinese_question_quality
- 20261123141000_swiftdictionary_update_2_8_0_chinese_quiz_revision_preservation
- 20261123142000_swiftdictionary_update_2_8_0_final_chinese_quiz_prompt_cleanup
- 20261123143000_swiftdictionary_update_2_8_0_chinese_quiz_translation_prompt_quality
- 20261123144000_swiftdictionary_update_2_8_0_final_quiz_translation_prompt_revision
- 20261123145000_swiftdictionary_update_2_8_0_learning_intro_rls_initplan_optimization
- 20261123146000_swiftdictionary_update_2_8_0_chinese_quiz_distractor_quality

The Quiz limit values remain Free 1 / Premium 3 per local day. Only the charging event changed from completion to successful session start. Existing usage was retained. No in-progress Quiz session was present at migration time.

The RLS performance advisory for the four learning-introduction preference policies was removed by wrapping auth.uid() in a scalar subquery. The remaining security advisor notices require interpretation:
- Private-schema tables have RLS enabled and no client policies by design; the private schema is not exposed through the public API.
- Leaked-password protection remains disabled in the staging Auth configuration. This is a project-level setting, not a SQL migration, and was not altered through the database connection.
- Unused-index INFO notices were not “fixed” by dropping indexes without workload evidence.

## Legal/privacy check

No new personal-data category, analytics vendor, advertising or third-party recipient was introduced. The start event is recorded in the existing account-scoped activity log/allowance ledger. Malaysia PDPA and general international privacy obligations remain under review; this implementation is not legal clearance. Guardian/consent handling for ages 16–17, cross-border processing, retention/deletion and DPO/DPIA applicability remain outstanding.

## Validation status at archive creation

Staging migrations and SQL prompt-leak audits completed. Browser/static/CI runs for the latest PR head were queued or in progress; the latest-head conclusions must be checked before presenting the preview as ready. The stable branch preview URL is:

https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev

PR #16 remains draft. Owner testing and approval are still required. Production branch/database/site remain unchanged.
