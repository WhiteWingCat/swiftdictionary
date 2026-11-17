# Update 2.4.0 — production merge and 199-question Quiz release

**Date:** 2026-11-17  
**Repository:** `WhiteWingCat/wordbook`  
**Production branch:** `main`  
**Feature PR:** #8 — merged  
**Follow-up PR:** #9 — open; aligns migration filenames with production-generated migration history

## Owner decision

The owner explicitly authorized merging all of Update 2.4.0 to `main`, including the actual 199 questions, without waiting for the human bilingual accuracy review. The review is deferred until the owner and friends test the live website and report issues. It is postponed, not waived.

The 199 questions are marked `approved` in the production database so the authenticated Quiz selector can use them. In this release, database `approved` means selectable/published; it does **not** mean the questions have been independently human-reviewed. The source-controlled JSON pack remains `status: draft` for ongoing editing and correction.

## Merge and deployment

- PR #8 title: **SwiftDictionary Update 2.4.0 — Quiz feature and 199-question release**.
- PR #8 squash merge commit: `01c7c61a9d7c8c91591eeb7f184afdf5c3caf8bf`.
- Feature branch: `feature/update-2-4-0-quiz`, final pre-merge head `0b5792dd4f07476bcdb231c9898ec09bd3da6334`.
- The feature branch `supabase-config.js` was restored to the production Supabase project URL and public publishable key before merge. No service-role key or OAuth secret was committed.
- GitHub Pages workflow run #44075861937 completed successfully for the merge commit.
- Live website: `https://whitewingcat.github.io/wordbook/`.

The separate Indie Staging project remains empty and is not the friend-testing target. Its Google OAuth provider remains unconfigured. No staging questions, users or learner data were imported.

## Production Supabase migration sequence

Production project: **SwiftDictionary** (`pzymiesazmpyvnfvsbsc`), region `ap-northeast-1` (Tokyo), PostgreSQL 17.11, status ACTIVE_HEALTHY.

Preflight before applying the new Quiz schema confirmed:
- Existing 2.3.x schema and learning catalogue were present.
- All 15 permanent English lesson mappings used by the Quiz bank were active.
- Quiz tables did not yet exist.
- Quiz allowance values were already Free 1/day and Premium 3/day.
- No existing Quiz sessions or question-bank content existed.

The Supabase migration connector records generated timestamp versions. The five successfully applied production migrations are:

1. `20261117113854` — `swiftdictionary_update_2_4_0_quiz_question_bank_foundation`.
2. `20261117113904` — `swiftdictionary_update_2_4_0_quiz_authenticated_rpcs`.
3. `20261117113907` — `swiftdictionary_update_2_4_0_learning_page_introduction_preferences`.
4. `20261117113912` — `swiftdictionary_update_2_4_0_quiz_authenticated_question_types`.
5. `20261117113917` — `swiftdictionary_update_2_4_0_quiz_content_release`.

The existing Quiz allowance migration `20261116043139` was already recorded in production and was not reapplied. Existing 2.3.x migrations were also left untouched.

PR #9 renames the source migration files to the exact generated versions above and updates CI path references. Its SQL contents are unchanged. Do not merge any alternative filenames or reapply the migrations.

## Production content verification

The production import migration had an empty-question-bank precondition and verified all 15 active lesson mappings before inserting. Its postconditions check row counts, exact question-type/difficulty distribution, valid learning objectives, answer languages, four options and a matching correct option.

Post-migration verification returned:

| Question type | Beginner | Intermediate | Advanced | Total |
|---|---:|---:|---:|---:|
| Knowledge | 30 | 36 | 48 | 114 |
| Word definition | 5 | 5 | 5 | 15 |
| Chinese translation | 21 | 21 | 28 | 70 |
| **Total** | **56** | **62** | **81** | **199** |

Additional verified results:
- 199 total questions; all 199 are `approved` with non-null `approved_at`.
- 15 distinct mapped permanent lessons; all active and matching topic/difficulty.
- 0 missing learning-objective IDs.
- 0 malformed option sets or missing correct option IDs.
- 0 remaining draft rows in the production bank.
- 0 Quiz sessions at the time of verification.
- Existing Free 1/day and Premium 3/day Quiz allowances unchanged.
- The new `public.learning_page_introduction_preferences` table exists with RLS enabled.

No production user records, saved words, lesson progress or existing learning history were deleted or rewritten.

## CI and security review

The final pre-merge feature head `0b5792dd4f07476bcdb231c9898ec09bd3da6334` passed:
- Quiz database foundation / PostgreSQL 17.
- Disposable local Supabase Auth/RPC integration.
- Owner-authorized 199-question export and migration assertions in disposable local Supabase.
- Authenticated Chromium Quiz runtime tests.
- Supabase security advisors.
- Companion 2.3.x allowance/dashboard regression workflow #44075394304.

Earlier intermediate runs had failures during test stabilization; the final PR-head workflows above passed. Do not use earlier failures as the final result.

Production security advisors after migration reported:
- 7 INFO findings for RLS-enabled private-schema tables without client policies. These are intentional: the private tables are not exposed through the Data API and client access is mediated by authenticated RPCs.
- 2 WARN findings for existing lesson SECURITY DEFINER functions `public.is_personal_learning_test_access()` and `public.record_completed_lesson_practice_result(...)`. These were previously reviewed; their bodies scope access to the authenticated caller and validate lesson ownership/completion.
- 1 WARN that leaked-password protection is disabled. The current website uses Google OAuth; revisit if password-based sign-in is introduced.
- No security ERROR findings.

The public introduction-preferences table has RLS and owner-scoped policies. Quiz bank/session/answer-key data remains in the private schema; direct client table access is revoked.

## Legal, privacy and content provenance

The 199 questions are original authored SwiftDictionary learning content; no third-party question bank or external dataset was imported. This content import adds no learner personal-data fields or analytics.

The existing Quiz feature does process account-linked selected option IDs, question/lesson snapshots, scores, session history, local timezone and a temporary no-repeat reservation ledger (question ID, user ID, local date and reservation time; cleanup is designed for a 36-hour window). The production Supabase database is hosted in Tokyo, so cross-border processing/provider disclosure remains relevant.

Malaysia's PDPA Amendment Act 2024 commenced in phases on 1 January, 1 April and 1 June 2025. The project remains a free personal learning project, but actual legal applicability depends on the service/operator context; do not assume that a free service is automatically exempt. Before inviting friends to sign in, provide a concise test/privacy notice that accurately explains what Quiz data is stored, why, the deletion/retention exception, Supabase hosting/transfer and how to request deletion or report issues. Review the full Malaysia PDPA and relevant international/16+ age obligations before a broader public launch. This is planning guidance, not legal advice or compliance certification.

The current app does not yet contain a formal public Privacy Notice or Terms page. The wider Legal/Privacy/Terms milestone remains planned separately. Friend testing should be accompanied by an explicit notice rather than treating the website's current Preferences page as a privacy policy.

## Next actions

1. Owner personally tests the live production website, especially authenticated Quiz start/resume, Chinese translation preference, definition questions, 1–7 Chinese question distribution, session scoring/review, allowances and history deletion.
2. Collect friend feedback after providing the test/privacy notice. Friends are helping find usability, accuracy and regression issues that the owner may have missed.
3. Use owner/friend feedback to correct the 199 bilingual questions and mapped lessons. Human accuracy review remains deferred until that feedback phase; it is not claimed complete.
4. Merge PR #9 after its CI confirms migration filename/version alignment.
5. Keep Flashcards (2.5.0) and the dedicated Legal/Privacy/Terms foundation on their existing roadmap; do not treat this release as completion of those future items.
