# SwiftDictionary U3.0 — remaining work continuation (2026-11-28)

## Owner request
Complete the remaining U3.0 work listed by the owner: 163 approved English Quiz translations, 133 approved Chinese Quiz translations, translation-quality correction for 112 English and 112 Chinese Lesson practice questions, complete Malay Flashcard coverage audit, and final automated/authenticated/OAuth/security validation. Read the current Master Development Record, U3.0 plan and relevant November 27 archives before proceeding.

## Repository and staging checkpoint
- Application branch: `feature/update-3.0-phase-0-audit`
- Latest application commit during this session: `f9af1aa5b855f93462022e6feb5b6f34b3c9a4e5`
- Draft PR #20 remains open and unmerged.
- Staging Supabase project `ivatvkfrtifgfheeaelj` is ACTIVE_HEALTHY, PostgreSQL 17.
- Staging migration registry includes U3.0 Malay Quiz, Flashcard runtime, per-card review repair and evaluation hardening migrations through `20261127120741`.
- Production database and hosting remain untouched.

## Audit findings
- Existing Malay Quiz support packs have 229 English IDs (199 release-approved questions plus 30 draft-only) and 145 Chinese IDs. The existing override file has only 36 English and 12 Chinese hand-corrected records. The remaining owner-listed approved work is 163 English and 133 Chinese questions.
- Lesson support records cover 17 lessons per course / 112 questions per course, but the generated practice prompts/options remain flagged for quality issues and need contextual correction.
- The generated learning support pack is explicitly machine-assisted draft material, not human-approved. Heuristic scan flagged likely Indonesian contamination, malformed text and duplicate options; coverage is not a quality certificate.
- Flashcard generated support corpus has 1,341 English and 603 Chinese entries, but English generated standalone Malay definitions are populated for only 25 rows; examples exist but require Malaysian Standard Malay quality review. Curated glossary has 73 English and 124 Chinese keys. Dictionary-derived, phrase, sentence and custom card eligibility must be measured separately.
- The 2026-11-27 authenticated Quiz workflow's database/content foundation passed, but Chromium failed because the old test attempted to start English/Chinese Quiz with Malay support despite the runtime intentionally failing closed while packs are incomplete.
- U2.3 Chromium and U2.5 Flashcards Chromium also failed in the prior latest-head run. Flashcards sentence recall could not start with the incomplete Malay support set; the per-card snapshot/review test timed out. These are not accepted as passing.
- U3.0 architecture workflow failed on a case-sensitive assertion even though the translation begins with “Dapatan awal”. The assertion was corrected to case-insensitive matching in commit `9b44ca9833aebcf8769e807a5ea7e169670d4c7c`.
- Quiz browser coverage was changed to assert the current fail-closed behaviour for unsupported Malay support pairs in commit `f9af1aa5b855f93462022e6feb5b6f34b3c9a4e5`. This does not complete the missing translations; it ensures unsupported content is not presented as translated.

## CI evidence and current reruns
On prior feature head `204709d180862bb43ed630b8381005670b02007d`:
- U2.6 ACL, U2.7 Chinese Dictionary, U2.9 English Dictionary and Cloudflare routing passed.
- U3.0 architecture failed only at the case-sensitive Malay text assertion described above.
- Quiz database foundation passed; authenticated Chromium failed because the test expected an unsupported English/Chinese-to-Malay session to start.
- U2.3 PostgreSQL and local Supabase CLI checks passed; Chromium failed in an older browser assertion path.
- U2.5 static checks passed; Chromium failed on English Sentence Recall Malay support and timed out in the per-card review test.
On latest commit `f9af1aa5`, U3.0 architecture and Cloudflare routing have passed. U2.3, U2.6, U2.7 and U2.9 workflows were running; Quiz DB was pending/in progress; Flashcards was queued at the last check. Refresh all results before acceptance.

## Security and privacy audit
- Staging security advisor reports leaked-password protection disabled (WARN). This is a release hardening action; it has not been changed.
- Ten private-schema tables have RLS enabled without policies. These are documented as private/server-mediated tables; verify function grants and exposure boundaries rather than adding broad policies.
- Performance advisor reports unused indexes. Do not remove them without query-plan/workload review.
- Do not expose service-role keys, weaken RLS or enable client access to private tables to make tests pass.
- Legal/privacy release checks remain: Malaysian Standard Malay editorial review, exact Argos model artefact and upstream corpus licences/attribution, Malaysia Copyright Act 1987, PDPA 2010 and 2024 amendments, international user/cross-border processing and age-appropriate privacy safeguards. This is planning guidance, not legal advice.

## Changes made in this session
- Test-only case-insensitive assertion correction (commit `9b44ca9`).
- Quiz browser test updated to assert the current fail-closed behaviour until English/Chinese Malay Quiz packs are completed (commit `f9af1aa`).
- No translation content, production code, database schema or deployment was changed in this session.

## Remaining work — still open
1. Curate and validate Malay translations for all 163 approved English and 133 approved Chinese Quiz questions, preserving question IDs, option IDs, answer keys and type-specific fields.
2. Correct all 112 English and 112 Chinese Lesson practice prompts, options and explanations, with option mapping and answer semantics preserved.
3. Complete Flashcard Malay coverage for dictionary, phrase, sentence and custom cards; remove malformed/Indonesian drafts or replace them with reviewed Malay. Keep missing translations unavailable rather than silently substituting.
4. Re-run the full U3.0/U2.3/U2.5/U2.6/U2.7/U2.9 matrix on the latest head, including authenticated browser tests and per-card review.
5. Verify staging Google OAuth redirect for the preview hostname and enable/check leaked-password protection through the appropriate staging Auth setting.
6. Verify the latest Cloudflare Pages deployment and perform real authenticated desktop/mobile staging acceptance.
7. Keep PR #20 draft/unmerged and production untouched pending explicit owner release approval.

## Recovery point
Continue from `feature/update-3.0-phase-0-audit` at `f9af1aa5b855f93462022e6feb5b6f34b3c9a4e5`. First refresh latest CI jobs, then continue content corrections in small batches. Do not mark U3.0 complete based on the test-only fixes.
