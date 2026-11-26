# SwiftDictionary Update 3.0.0 — Phase 0 audit (2026-11-26)

## Purpose

The owner asked to begin Phase 0 of the final U3.0 plan. The audit is read-only and covers the legacy English/Simplified Chinese implementation, frontend modules, content sources/validators, production and staging Supabase schemas/migration histories, security/performance advisories and legal/privacy/content provenance risks.

## Branch and baseline

- Production baseline: U2.9.1.
- Audit source: `main` commit `2aa44d7768fd4187d83cdd115c423ba62d92e9ed`.
- Created `feature/update-3.0-phase-0-audit` from that main commit.
- Phase 0 completed as an audit only; no Phase 1 code was written.

## Key findings

### Architecture

The application has a 1.25 MB `index.html` with inline JavaScript/data and language-specific script globals. There is no complete language-package/capability layer. Course selectors only expose English and Simplified Chinese; preference loading and cloud sync coerce unknown languages to English.

The dictionary has two distinct display/processing paths: English word-grid/IPA/topic/POS features and Chinese single-character grid/pinyin/stroke-order features. This distinction must be preserved through adapters rather than forcing Malay through Chinese rules.

English lessons are mostly inline with a separate Chinese translation map; Chinese lessons are a separate structured bilingual/pinyin package. Daily Learning uses English arrays in `daily-learning.js` and a Chinese package in `data/chinese-daily-learning.js`. Quiz uses fixed en-zh and zh-en packs/validators. Flashcards derive English cards from the English dictionary and Chinese cards from a separate generated pack. Saved words, Collections, Dashboard and account deletion contain explicit en/zh-only logic.

### Content inventory

- English Dictionary: 810 inline baseline + 506 expansion = 1,316 headwords; 519 multi-sense entries.
- Simplified Chinese Dictionary: 206 inline base + 519 external = 725 characters; 72 multi-sense entries.
- English Lessons: 20 (8/6/6); Chinese Lessons: 17 (7/5/5), 112 practice questions.
- Daily catalogue: English 28 topics, 25 applications, 93 discovery; Chinese 6 topics, 7 applications, 93 discovery. Daily Revision is adaptive.
- Production Quiz bank: 199 approved English-learning questions and 145 approved Chinese-learning questions. The English draft JSON has 229 questions (199 approved-subset +30 draft-only) while its README still says 214. Chinese Quiz source pack has 145 and is marked draft, while production DB has 145 approved Chinese questions; reconcile source status/provenance.
- English Flashcards use dictionary entries plus 25 curated expressions. Chinese generated bank has 519 character, 904 vocabulary and 24 phrase cards (1,447 total), marked draft. Current frontend runtime maps the three Chinese arrays without checking bank/card draft status; resolve the content-governance mismatch rather than silently approving it.

### Supabase and migration drift

- Production: Tokyo `ap-northeast-1`, PostgreSQL 17.11.0.003, 71 migration records.
- Staging: Singapore `ap-southeast-1`, PostgreSQL 17.12.0.000, 63 migration records.
- Both have 27 application tables; migration history is not identical because staging uses a separate bootstrap and environment-specific migration version/name mappings.
- Five confirmed schema differences: `public.languages` (production has name/native_name/created_at; staging does not); `public.learning_activity_log` language default; `public.lesson_progress` status default; `public.profiles` metadata/check constraints; `public.saved_words` created_at.
- Production `public.languages` has only en/zh. Its code-format check allows `ms`, but many downstream tables/functions still enforce en/zh.
- En/zh restrictions occur in saved words, lesson progress/results, content catalogue, practice attempts, Quiz answer-language/snapshots, Flashcard cards/sessions and eight language-specific function definitions.
- Preserve secure server-side answer keys, RPC grants, immutable session snapshots, progress, history and RLS.

### Shared usage and data preservation

Current production limits are Free: Lessons 5/day, Quiz 1/day, Flashcards 3/day, each Daily Learning category 1/day; Premium: Lessons 15/day, Quiz 3/day, Flashcards 10/day, each Daily category 3/day. Allowance buckets are shared across courses. Do not create per-language quotas or change limits. Dictionary search remains free and unlimited.

### Security/performance

All 27 inspected tables have RLS enabled. Ten private tables have no policies, but direct private-schema/table access is not granted to anon/authenticated for the inspected content tables; this is consistent with private RPC-only access and should not be “fixed” by broadening grants. Supabase reports leaked-password protection disabled (current app sign-in is Google OAuth; verify password Auth applicability). Production has 16 unused-index advisories and one duplicate-index warning; staging has 15 unused-index advisories. No settings or indexes were changed.

### Legal/privacy/licensing

- `terms.html` is a non-contract placeholder; no separate privacy notice page was found.
- Production Supabase is in Tokyo and staging in Singapore; cross-border data transfer, processor terms, notices and safeguards require review.
- Malaysia PDPA Amendment Act 2024 commenced in stages in Jan/Apr/Jun 2025. Current official JPDP materials include DPO, breach-notification and cross-border guidance, plus a 2026 data-controller registration circular. Assess applicability and thresholds; do not assume all requirements automatically apply.
- Existing notices document CC-CEDICT-derived content under CC BY-SA 4.0, Unicode Unihan License v3, MIT datasets/libraries and Arphic-licensed stroke data. Keep CC-CEDICT-derived dictionary content free and unrestricted.
- The provenance document explicitly warns that the original 206 Chinese base entries are not cleared by the newer source notices. Complete provenance review for old Chinese/English dictionaries and existing lesson examples. Record sources/licences for new Malay content from the beginning.
- This is not legal advice or legal clearance.

## Phase 0 status

**Complete as a read-only audit.** No code, data, schema, Auth settings, migrations, staging preview, merge or deployment changed. No tests were executed; source review and live schema/advisor inspection only.

## Next action

Start Phase 1 on `feature/update-3.0-phase-0-audit`: implement the language registry/capability contract, versioned content schemas, translation/provenance model and legacy English/Chinese refactor before Malay integration. Preserve the approved U3.0 phase sequence and do not provide staging preview before Phase 3 completion.
