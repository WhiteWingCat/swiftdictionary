# SwiftDictionary Update 3.0.0 — Phase 0 Audit Report

**Audit date:** 2026-11-26  
**Status:** Phase 0 read-only audit complete. Phase 1 not started.  
**Production baseline:** U2.9.1  
**Audit source commit:** `main` at `2aa44d7768fd4187d83cdd115c423ba62d92e9ed`  
**Working branch:** `feature/update-3.0-phase-0-audit`, created from that main commit.

## 1. Audit method and boundaries

Reviewed the current application source and data files, content authoring packs and validators, selected regression tests, Supabase migration files, the dedicated staging bootstrap documentation, current production and staging Supabase project metadata, table definitions, language constraints, aggregate content/session counts, migration histories and Supabase security/performance advisors.

Live Supabase inspection was read-only. Queries returned schema metadata and aggregate counts only; no personal records, credentials or secrets were retrieved. No source code, database schema, learner data, Auth configuration, migration history, build configuration or deployment was changed. No tests were executed and no browser/runtime preview was created; this phase is a static source and live-schema audit, not a runtime QA sign-off.

## 2. Environment and migration baseline

Both Supabase projects are active and healthy:

| Environment | Project | Region | PostgreSQL |
|---|---|---|---|
| Production | SwiftDictionary | Tokyo (`ap-northeast-1`) | 17.11.0.003 |
| Staging | SwiftDictionary Indie Staging | Singapore (`ap-southeast-1`) | 17.12.0.000 |

The two environments have the same 27 application tables across `public` and `private`, but they are not schema-identical.

### 2.1 Migration history is not interchangeable

- Production has 71 migration records; staging has 63.
- Staging uses a one-time, staging-only bootstrap. Production has nine U2.1 foundation migrations that are represented differently in the staging bootstrap rather than as the same migration records.
- Several U2.5.0 and U2.8.0 migration names/versions differ between environments. The semantic changes are largely corresponding migrations with environment-specific version/name history, not a reason to replay or rename migrations blindly.
- Therefore migration count or filename comparison alone cannot establish parity. Future U3.0 migrations must be tested against both actual schemas and their respective migration histories.

### 2.2 Five confirmed table-definition differences

| Table | Production | Staging |
|---|---|---|
| `public.languages` | `code`, `is_active`, `name`, `native_name`, `created_at`; code-format check | Only `code`, `is_active`; no name/native-name/timestamp fields |
| `public.learning_activity_log` | No column default for `language_code` | `language_code` defaults to `en` |
| `public.lesson_progress` | `status` defaults to `in_progress` | No status default |
| `public.profiles` | Includes created/updated timestamps, display-name length constraint and constrained/defaulted avatar icon | Minimal profile fields; those extra fields/constraints are absent |
| `public.saved_words` | Includes `created_at` | No `created_at` |

All other inspected table definitions, columns, checks, primary keys and foreign keys matched in the comparison. The differences above must be reconciled deliberately when preparing U3.0 migrations; do not assume staging is a production clone.

The staging README is stale: it still describes the initial November 17 clean state with zero Auth users, Quiz questions and learner history. Current staging has test accounts and accumulated saved-word, preference, lesson, Daily Learning, Quiz and Flashcard records. Continue treating it as isolated staging; do not copy production user data into it.

## 3. Current language registry and database restrictions

### 3.1 Registry foundations already exist

Production `public.languages` contains only `en` and `zh`. Its code-format check accepts a two- or three-letter language code, so `ms` is structurally valid. Production also has `name`, `native_name` and `created_at` columns. User preferences already reference `public.languages(code)`, as do Daily Learning session language and learning activity log language, and Quiz learning/translation language fields.

This is a useful foundation, but adding `ms` to the registry alone would not enable the application.

### 3.2 Hard-coded database checks

The following live production columns still restrict language values to `en` and `zh`:

- `public.saved_words.course`
- `public.lesson_progress.learning_language`
- `public.lesson_practice_results.learning_language`
- `private.learning_content_catalog.language_code`
- `private.lesson_practice_attempts.learning_language`
- `private.quiz_question_bank.answer_language_code`
- `private.quiz_session_questions.answer_language_code_snapshot`
- `private.quiz_session_questions.learning_language_code_snapshot`
- `private.flashcard_cards.language_code`
- `private.flashcard_sessions.learning_language_code`
- `private.flashcard_sessions.translation_language_code` (nullable, but otherwise en/zh only)

Some language columns use a foreign key to `public.languages`; others rely on local CHECK constraints and have no registry foreign key. U3.0 should establish one deliberate, validated language-identity strategy without weakening content approval or session integrity.

### 3.3 Database functions with two-language assumptions

Live function definitions contain explicit `en`/`zh` checks or course-specific branches, including:

- `private.guard_lesson_progress_insert`
- `private.record_completed_lesson_practice_result_for_language_impl`
- `private.record_my_lesson_practice_attempt_impl`
- `private.start_my_chinese_quiz_impl`
- `private.start_my_quiz_impl` (language-aware overloads and legacy overload)
- `private.start_my_flashcard_game_impl`
- `private.complete_my_flashcard_game_impl`
- `public.complete_permanent_lesson_for_language`

The Chinese Quiz runtime is partly separate from the English Quiz implementation. Preserve its server-side answer-key protection, question reservation, snapshots, scoring and authenticated RPC boundaries while moving to a shared language-aware engine.

## 4. Frontend architecture and legacy code paths

The main application is still concentrated in a large `index.html` (approximately 1.25 MB) with extensive inline JavaScript, inline dictionary data and inline English lesson data. Feature modules and language datasets are loaded as separate scripts. There is no complete, explicit language-package registry/adapter boundary yet.

### 4.1 Dictionary

Relevant sources:
- `index.html`
- `data/english-expansion.js`
- `data/english-baseline-categories.js`
- `data/chinese-characters.js`
- `english-category-filters.js`

Current source inventory:
- English: 810 inline baseline headwords plus 506 expansion headwords = **1,316**. The combined source contains 519 entries with multiple senses.
- Simplified Chinese: 206 inline base characters plus 519 external character records = **725**. The source records include pinyin, English glosses and Simplified Chinese definitions; 72 entries have multiple senses.

The two data sets have overlapping but inconsistent field semantics. For example, `phonetic` represents English IPA in English records and pinyin in Chinese records. Chinese character records include pinyin, character breakdowns and single-character metadata; English records use word-level categories and IPA. Related terms are frequently stored as display strings rather than structured relationships.

The dictionary state currently selects either `chineseWords` or `englishWords`. The Chinese search path filters to one Han character, uses pinyin initial/category behaviour and renders square character cards. The English path uses ordinary headword search, alphabet/topic/POS filters and rectangular word cards. Course and translation selectors only offer English and Simplified Chinese. Unknown saved language values are coerced to English rather than resolved from a registry.

U3.0 must preserve the Chinese character-grid/pinyin experience and English headword behaviour while adding a normal Malay headword dictionary with Malay-specific search/morphology. Do not force Malay through Chinese character-grid rules.

### 4.2 Lessons and progress

Relevant sources:
- `index.html`
- `data/chinese-lessons.js`
- `data/english-lessons-expansion.js`
- `permanent-lesson-confirmation.js`

English lesson content is primarily inline in `index.html`; Chinese translations are stored in a separate `lessonZh` map keyed by English lesson IDs. Chinese lessons are stored in `SWIFT_CHINESE_LESSONS` and use structured bilingual/pinyin fields. Rendering, topic lookup and lesson selection contain explicit Chinese-versus-English branches.

Current catalogue:
- English: **20 lessons** (8 Beginner, 6 Intermediate, 6 Advanced), including the U2.9.0 expansion.
- Simplified Chinese: **17 lessons** (7 Beginner, 5 Intermediate, 5 Advanced), with 112 practice questions.

Progress is language-aware in the database, but both its constraints and the client logic remain two-language-specific. Preserve existing lesson IDs and progress rows when normalising the schema.

### 4.3 Daily Learning

Relevant sources:
- `daily-learning.js`
- `data/chinese-daily-learning.js`
- `private.learning_content_catalog`
- `public.daily_activity_sessions`

English topics/applications/discovery data are authored in `daily-learning.js`; Chinese data are in a separate global object in `data/chinese-daily-learning.js`. Runtime selection is effectively “Chinese if `zh`, otherwise English”. The Chinese renderer expects Chinese text, pinyin and optional English support; the English renderer uses English content and optional Chinese support.

The production content catalogue currently contains:
- Daily Topic: 28 English, 6 Chinese.
- Daily Application: 25 English, 7 Chinese.
- Daily Discovery: 93 English, 93 Chinese.
- Permanent Lessons: 20 English, 17 Chinese.
- Daily Revision is adaptive and derived from learner history rather than a separate fixed catalogue.

The daily activity session and activity-log language columns already reference the language registry. The content catalogue still has an en/zh CHECK constraint. The current allowance model is shared by activity type rather than split by language; retain that behaviour and all current limits.

### 4.4 Quiz

Relevant sources:
- `content/quiz/questions.en-zh.draft.json`
- `content/quiz/questions.zh-en.draft.json`
- `content/quiz/curriculum-map.en.json`
- `content/quiz/curriculum-map.zh.json`
- `scripts/quiz/validate-question-bank.mjs`
- `scripts/quiz/validate-chinese-question-bank.mjs`
- Quiz RPC migrations and SQL tests

The two authored packs and validators are tied to fixed language pairs:
- English learning / Simplified Chinese support.
- Simplified Chinese learning / English support.

The English validator hard-codes `en` learning, `zh` translation and question types including `chinese_translation`. The Chinese validator hard-codes `zh` learning, `en` support and Chinese answer rules. The database has language-pair fields and immutable session snapshots, but answer-language and question-type constraints still encode the current pair.

Production Quiz bank aggregates:
- **199 approved English-learning questions** (knowledge, word-definition and Chinese-translation types).
- **145 approved Chinese-learning questions**.
- Retired records are retained for history/eligibility reasons.
- The English source pack currently has 229 questions (199 in the previously approved release subset plus 30 draft-only additions). Its `content/quiz/README.md` still says 214; that documentation is stale.
- The Chinese source pack contains 145 questions but still labels the pack `draft`, while the live database contains 145 approved Chinese-learning records. Reconcile source-pack status, owner approval evidence and release-export provenance before U3.0 content migration.

Preserve secure server-side answer keys, approved-content gates, same-day no-repeat reservations, session snapshots and server-side scoring. Future question types must be represented generically enough to support the separate U3.1 typing-question scope without implementing that feature in U3.0.

### 4.5 Flashcards

Relevant sources:
- `flashcards.js`
- `data/chinese-flashcards.js`
- `content/flashcards/chinese-cards.draft.json`
- `scripts/flashcards/validate-chinese-card-bank.mjs`
- Flashcard session migrations/tests

English Flashcards derive cards from the English dictionary and add 25 curated multiword expressions. The Chinese generated bank contains:
- 519 single-character cards.
- 904 multi-character vocabulary cards.
- 24 useful-expression cards.
- **1,447 total Chinese cards.**

The Chinese data file and source pack mark the bank as `draft`, and entries carry `contentStatus: "draft"`. However, the current `flashcards.js` `words("zh")` function maps all three arrays into runtime cards without checking the bank-level status or per-card `contentStatus`. This is a content-governance discrepancy that must be explicitly resolved; do not silently change approval status or discard cards during U3.0 refactoring.

The database supports custom cards, collections, mastery and session/review snapshots. Its language columns still enforce en/zh. The two courses expose different recall modes (for example, English Mixed Recall versus Chinese Translation Recall), so U3.0 should use declared language capabilities rather than force identical modes. Existing sessions and review snapshots must remain intact.

### 4.6 Saved words, Collections, account deletion and Dashboard

Relevant sources:
- `index.html`
- `favorite-collections.js`
- `account-deletion.js`
- `tests/browser/u2-9-0-favorite-collections.spec.js`

Several shared workflows also reject or misclassify a third language:
- Saved-word local-storage parsing accepts only `en` and `zh`.
- Cloud-synced saved-word rendering and Dashboard Favorite Words group only English and Chinese.
- `favorite-collections.js` groups folders by `en`/`zh`, labels everything else as English, and applies square character-grid geometry only to Chinese.
- `account-deletion.js` anonymous saved-word parsing/writing accepts only `en` and `zh`.
- Collection event handlers validate only those two course codes.

These paths are part of language compatibility, not isolated Malay UI tasks. Preserve saved words, collection membership/order, account isolation, local anonymous saves and account-deletion behaviour while making course codes registry-driven.

## 5. Current allowances and historical data to preserve

Production plan-limit rows currently define:

| Activity | Free | Premium |
|---|---:|---:|
| Permanent Lessons | 5/day | 15/day |
| Quiz | 1/day | 3/day |
| Flashcards | 3/day | 10/day |
| Each Daily Learning category | 1/day | 3/day |

Daily Topic, Daily Application, Daily Discovery and Daily Revision are separate activity categories, but their allowance buckets are shared across learning languages. Do not multiply limits by adding Malay or create language-specific allowance pools. Keep the configured local-timezone midnight reset and existing completion/abandonment semantics.

Live aggregate records confirm existing English and Chinese saved words, preferences, lesson progress, practice results, Daily Learning sessions, Quiz sessions, Flashcard mastery and completed sessions. U3.0 migrations must preserve those records and all stable content/session IDs. Production and staging naturally have different user/test data; do not synchronise personal records between them.

## 6. Security, access and performance observations

- All 27 inspected application tables have RLS enabled.
- Supabase reports ten private-schema tables with RLS enabled but no table policies. This appears consistent with the intended private-schema/RPC design: `anon` has no `private` schema usage; neither `anon` nor `authenticated` has direct SELECT on `private.quiz_question_bank` or `private.learning_content_catalog`. Do not add broad client table access or remove RLS to silence the informational lint.
- Public wrappers inspected for Lessons, Daily Learning, Quiz and Flashcards deny anonymous execution and grant authenticated execution. Preserve the current RPC/grant boundaries and carefully review all SECURITY DEFINER functions.
- The security advisor reports leaked-password protection disabled. The current product sign-in flow uses Google OAuth; confirm whether password-based Auth is enabled or intended before treating this as a direct exposure or changing the setting.
- Production performance advisor reports 16 unused indexes and one duplicate-index warning on `public.learning_activity_log`; staging reports 15 unused indexes. This is non-blocking audit information. Do not drop indexes without workload/query-plan review, especially while designing U3.0 schema changes.

## 7. Content provenance and legal/privacy review

### 7.1 Existing source notices

The repository has `THIRD_PARTY_NOTICES.md`, `data/CHINESE-DICTIONARY-SOURCES.md` and `data-sources.html`. They document:
- CC-CEDICT-derived Chinese dictionary/Flashcard glosses under CC BY-SA 4.0, with attribution and share-alike obligations.
- Unicode Unihan pronunciation data under Unicode License v3.
- `mozillazg/pinyin-data` extraction files under MIT.
- HSK 3.0 candidate character list under MIT.
- Hanzi Writer library under MIT and its stroke data under the Arphic Public License.

The CC-CEDICT notice expressly says its derived dictionary content must remain freely and unrestrictedly accessible and must not be placed behind a subscription or additional access restriction. This aligns with the standing rule that dictionary search remains free and unlimited.

### 7.2 Provenance gaps

The Chinese source record expressly warns that the original 206 inline Chinese entries are not cleared merely because the newer 519-entry expansion has source notices. The audit did not find a complete provenance register for those original records, the 810-entry English baseline, the 506-entry English expansion, all English lesson examples, or all pre-existing educational text. Resolve these gaps before treating all historical content as cleared for broader distribution. New Malay content must have clear authorship/source and licence records from the start; do not copy commercial dictionary, textbook or quiz material.

### 7.3 Privacy and Malaysian legal readiness

- `terms.html` is explicitly a publication placeholder; it says the Terms & Conditions are not yet published and that legal/privacy review has not been completed.
- No separate privacy-notice page was found in the inspected repository.
- Production Supabase is in Tokyo and staging is in Singapore. Review actual processor/subprocessor arrangements, international transfer mechanisms, notices and security safeguards for both environments.
- Malaysia's Personal Data Protection (Amendment) Act 2024 (Act A1727) commenced in stages on 1 January, 1 April and 1 June 2025. The current official JPDP site lists the 2025 DPO and breach-notification circulars, cross-border transfer guidance and a 2026 data-controller registration circular. Determine applicability, thresholds, deadlines and controller/processor responsibilities rather than assuming every requirement applies identically to this small personal project.
- Assess privacy notice requirements, data minimisation, purposes, retention, access/correction/deletion, data portability, breach response, DPO obligations where applicable, processor contracts, cross-border processing, Google sign-in, intended 16+ audience and international age/privacy rules.
- No translation-provider integration was found in the current code. If future machine-assisted translation is introduced, assess provider terms, data transfer and whether learner data is sent externally.
- This checklist is planning, not legal advice or legal clearance. A competent Malaysian privacy/legal review is needed before wider public or commercial onboarding.

Official references reviewed:
- JPDP, [Personal Data Protection (Amendment) Act 2024](https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024/).
- Gazette, [P.U. (B) 522 — commencement dates for Act A1727](https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2024/12/PENETAPAN-TARIKH-PERMULAAN-KUAT-KUASA-1.pdf).
- JPDP, [Cross-Border Transfer Guidelines](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-cross-border-transfer-of-personal-data-cbpdt/).
- Attorney General's Chambers, [Act 709 reprint 2026](https://lom.agc.gov.my/ilims/upload/portal/akta/outputaktap/3301061_BI/Act%20709%20%28Reprint%202026%29.pdf).

## 8. Phase 1 design requirements and implementation order

The audit establishes the following implementation requirements. These are design inputs, not code changes already performed:

1. Create a canonical language registry/capability contract for `en`, `zh` and `ms`. The registry describes display/native names, script, locale, search/input behaviour, reading/pronunciation model, grid/card presentation, supported activity types and available recall modes.
2. Create independently authored language packages. Do not treat English as the master curriculum or make every language's content a translation of English.
3. Define versioned schemas and stable IDs for dictionary entries/senses, lessons/objectives/practice, Daily Learning, Quiz questions/options/answer language, Flashcards/recall modes, translations, source provenance and editorial approval.
4. Separate learning language from support/translation language. Use explicit source/target pairs and translation status/version records. Missing translations must have an explicit state; never silently show text in the wrong language.
5. Refactor English and Simplified Chinese to the same shared schema before or alongside Malay integration. Preserve Chinese-specific pinyin/stroke-order/character-grid behaviour and English word-level features through adapters/capabilities.
6. Make frontend preference parsing, dictionary selection, saved-word local state/cloud sync, Favorite Words, Collections, account deletion, Dashboard, Lessons, Daily Learning, Quiz and Flashcards registry-driven. Unknown language values must fail safely rather than being coerced to English.
7. Replace en/zh CHECK constraints and PL/pgSQL assumptions only through a tested, additive migration design. Use the actual production and staging schema differences in migration preflight; preserve all existing records and RPC security.
8. Build generic validators and regression tests for language-agnostic contracts plus language-specific linguistic validators. Existing English/Chinese validators should remain as regression coverage during transition.
9. Resolve the English Quiz pack count discrepancy, Chinese Quiz draft/approved provenance discrepancy, Chinese Flashcard draft/runtime discrepancy and historical dictionary/lesson provenance gaps before content is represented as approved U3.0 material.
10. Keep allowance limits and shared cross-language buckets unchanged. No Premium payment activation, dictionary paywall, U3.1 typing implementation or U3.2 Games/Wordmine work in U3.0.

## 9. Phase 0 conclusion

**Phase 0 audit is complete.** The existing English/Chinese implementation and the production/staging differences are now sufficiently inventoried to design Phase 1 without assuming that adding a language-registry row is enough.

The highest-impact technical risks are:
- widespread en/zh coercion and branching in the client;
- en/zh CHECK constraints and stored-function validations across progress, catalogues, Quiz and Flashcards;
- different content shapes and authoring/validation pipelines for the two current languages;
- production/staging schema and migration-history drift;
- saved-word, Collections and account-deletion paths that reject a third language.

The highest-impact content/legal risks are the unresolved provenance for older content, the conflicting draft/approved status signals for Quiz and Chinese Flashcards, and the unpublished Terms/privacy disclosures alongside cross-border processing.

**No implementation or database work was performed.** No migrations were applied, no user data was changed, no staging preview was produced, no merge/deployment occurred, and the new feature branch contains no Phase 1 code changes.

**Next action:** begin Phase 1 on `feature/update-3.0-phase-0-audit`: design and implement the shared multilingual contract and legacy English/Chinese modernisation first. Phase 2–7 remain in the approved U3.0 plan, and the staging-preview restriction remains unchanged (no preview before Phase 3 is complete).
