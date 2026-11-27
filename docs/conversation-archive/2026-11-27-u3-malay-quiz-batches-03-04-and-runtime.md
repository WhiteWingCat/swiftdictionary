# SwiftDictionary U3.0 — Malay Quiz batches 03–04 and secure runtime

**Date:** 2026-11-27  
**Feature branch:** `feature/update-3.0-phase-0-audit`  
**Staging Supabase project:** `ivatvkfrtifgfheeaelj`  
**Production:** untouched

## Owner instruction

The owner clarified that Malay Quiz authoring should use 36 new questions per batch, not 12. Batch 03 and batch 04 have each been authored at 36 questions per support-language pair.

## Question inventory

Each support-language pack (Malay→English and Malay→Simplified Chinese) now contains 120 questions:

| Batch | Beginner | Intermediate | Advanced | Total per pair |
|---|---:|---:|---:|---:|
| 01 | 4 | 4 | 4 | 12 |
| 02 | 12 | 12 | 12 | 36 |
| 03 | 10 | 10 | 16 | 36 |
| 04 | 10 | 10 | 16 | 36 |
| **Total** | **36** | **36** | **48** | **120** |

Combined across the two support-language packs: 240 draft records. Batch 03 adds IDs b049–b084 and batch 04 adds IDs b085–b120.

All questions are independently authored in Malaysian Standard Malay, mapped to Malay permanent lesson IDs, topics and learning objectives, and include four Malay answer choices plus support-language glosses. The question packs, curriculum map and manifest were updated. The validator checks cumulative and per-batch distribution, metadata, source lesson/topic/difficulty/objective mapping, unique question IDs/prompts/options, and draft-only state. The SQL import assertion now expects 240 draft records (120 per support language), with 36 Beginner, 36 Intermediate and 48 Advanced per pair.

No question is release-approved. Human Malaysian Standard Malay and independent English/Chinese translation review remain required. The 36-per-batch authoring target is now reflected in the content README and Malay language manifest.

## Secure server-side runtime

The feature branch already contains `supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql`, which:
- adds Malay to the constrained Quiz answer/snapshot language codes;
- routes Quiz availability and session start to Malay-specific private functions only when the saved learning course is Malay;
- resolves Malay self-translation to Malay-only display using an internal English support snapshot;
- uses `auth.uid()`, per-user advisory transaction locks, server-owned preferences/timezone/plan/allowance, active-session guard, approved-catalogue joins, fresh-question checks, topic diversity and daily no-repeat reservations;
- snapshots prompts/options/correct IDs/explanations into private session tables and returns a payload with answer keys and explanations redacted until completed review;
- reuses the existing authenticated save-answer, submit, abandon, history and review RPCs; server-side scoring occurs on submit, and the existing Quiz-start trigger charges the allowance exactly once;
- retains public SECURITY INVOKER wrappers and private SECURITY DEFINER implementations with fixed empty search paths and explicit execute grants.

No service-role key or client-supplied user ID is involved. The migration is additive and does not alter existing English/Chinese question selection logic. The local integration test checks all three session sizes (10/15/20), both support languages, Malay self-translation, answer-key privacy, server scoring, review authorization, account isolation, allowance charging and no-repeat behavior.

## Validation status

A previous full disposable local Supabase run on feature head `2e494543821a1489d5d63f5adb20a5489c2bc35c` passed:
- U3.0 Malay baseline and secure Quiz migration;
- authenticated Malay Quiz RPC integration tests;
- 96-question draft import at that earlier inventory stage;
- existing 199-question release export validation;
- synthetic approved-bank seeding;
- Chromium Quiz browser tests;
- Flashcards/preferences, permanent Lesson allowance, Chinese Dictionary and local Supabase security-advisor checks.

The batch 03/04 expansion updates the draft importer assertion from 96 to 240 records and updates the validator and unit tests. A fresh CI run for the 120-question-per-pair inventory is pending on current feature head `06778339a692d0a1f9818b8d62aebdfd0b623f39`. Do not claim this newer inventory passed until the latest U3.0 and Quiz DB workflows complete successfully.

## Staging boundary

The connected staging project is healthy, but the staging database migration registry does not contain the Malay Quiz runtime migration. No connected staging database changes were made. The feature-branch migration has only been applied to disposable local Supabase during CI. Production remains untouched. PR #20 remains draft and unmerged.

The Malay manifest deliberately retains `capabilities.quiz:false`; the course is not playable until human linguistic review, approved content import, connected staging migration, end-to-end staging acceptance and owner authorization.

## Legal and privacy review

- **Copyright:** The new Quiz prompts and distractors are original SwiftDictionary-authored material; no DBP/PRPM/Kamus Dewan or third-party question bank was copied. Malaysia's Copyright Act 1987 s.8 protects translations/adaptations as derivative works, so any future source-derived content or machine-translated material requires rights and model-license review. Keep provenance and license evidence. Official MyIPO Act text: https://www.myipo.gov.my/wp-content/uploads/2025/09/Copyright-Act-1987-Act-332.pdf
- **Privacy:** Quiz sessions retain user ID, language/difficulty, selected answers, score and timestamps. Keep access owner-scoped, answer keys private, retention proportionate and history deletion semantics clear. The existing project uses Singapore staging and Tokyo production; review cross-border transfer safeguards, processor terms, privacy notice, breach response and whether PDPA DPO/notification requirements apply before public launch. The official Commissioner portal lists the PDPA 2010 and 2024 amendment materials: https://www.pdp.gov.my/en/akta/pdp-act-2010-en/
- **Scope:** The project is intended as a free personal learning service, but applicability and obligations should be checked against actual operations, hosting, processing and any future commercial activity. This is planning guidance, not a legal opinion.

No production deployment, migration, release approval or merge was performed.


### Updated content-import and CI checkpoint — 2026-11-27

The draft-import assertion was updated from 96 to 240 records (120 per support-language pair), with exact per-difficulty targets of 36 Beginner, 36 Intermediate and 48 Advanced. On application head `06778339a692d0a1f9818b8d62aebdfd0b623f39`, the PostgreSQL Quiz foundation job passed: application syntax/Quiz frontend validation, Malay validator, 240-record draft import assertions, and existing Quiz RPC/session/allowance tests all succeeded. The full disposable local Supabase Auth/RPC/browser/security job is still running; U3.0 architecture, Cloudflare routing and cross-version jobs remain pending/in progress. Do not claim complete latest-head acceptance until those workflows finish.

The connected staging database was queried directly: no migration record exists for the Malay Quiz runtime migration. No connected staging or production migration was applied. PR #20 remains draft and unmerged.
