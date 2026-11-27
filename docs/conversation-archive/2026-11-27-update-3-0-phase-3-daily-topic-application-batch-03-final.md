# SwiftDictionary Update 3.0.0 — Phase 3 Final Daily Topic and Application Expansion (Batch 03)

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Documentation branch:** `docs/master-development-record`  
**Daily content version:** `u3-ms-daily-0.4.0`

## Owner direction

The owner requested one final expansion of 30 Daily Topics and 30 Daily Applications, then to stop growing these catalogues for U3.0 and mark Phase 3 content work complete. Future expansion may be considered in later updates. The owner also confirmed that permanent Lessons already have substantial content and that the next major U3.0 priorities after staging review are Quiz and Flashcards.

## Final content inventory

Batch 03 added exactly 30 Daily Topics and 30 Daily Applications.

| Daily category | Before batch | Added | Final |
|---|---:|---:|---:|
| Daily Topic | 30 | 30 | **60** |
| Daily Application | 30 | 30 | **60** |
| Daily Discovery | 93 | 0 | **93** |
| Daily Revision | Adaptive | — | Adaptive |

The fixed Daily Learning inventory is now **213 records** (60 Topics + 60 Applications + 93 Discovery entries). Adaptive Daily Revision is not a fixed catalogue and is excluded from this count.

Permanent Malay Lessons remain at **72** (24 Beginner, 24 Intermediate, 24 Advanced). Malay Dictionary remains at **650 headwords**, **672 senses** and **1,344 English/Simplified Chinese draft translation records**.

### Difficulty distribution

| Category | Beginner | Intermediate | Advanced | Total |
|---|---:|---:|---:|---:|
| Daily Topic | 20 | 20 | 20 | 60 |
| Daily Application | 20 | 20 | 20 | 60 |

### New Daily Topic coverage

**Beginner (10):** family relationships; rooms and spaces at home; food and mealtimes; directions and positions; pets and care; weather; clothing for activities; school equipment; personal hygiene; shopping at a store.

**Intermediate (10):** time, duration and frequency; ber- prefix; compound sentences and clause relationships; prepositions; numerals and classifiers; intensifiers and degrees; identifying a passage's main idea; discourse markers; interpreting notices; proverbs in context.

**Advanced (10):** cohesion and coherence; argument structure and evidence; literal and figurative language; source credibility; style and audience; assumptions, inferences and facts; paraphrasing; concise summaries; data description; evaluating proposals and policy effects.

### New Daily Application coverage

Thirty application activities are linked to the new topic identities. Each has a multilingual prompt and a four-option question with Malay, English and Simplified Chinese text for every choice, plus a keyed answer index. New application examples are also supplied in all three languages.

## Implementation and validation

- Updated `data/malay-daily-learning.js`; content version is `u3-ms-daily-0.4.0`.
- Updated `tests/u3-phase3-malay-learning.test.mjs` to require exactly 60 Topics and 60 Applications, 20 per difficulty, unique IDs, multilingual question and option fields, valid answer indexes and valid application-to-topic references.
- Runtime loaded the language registry, content contracts, translation registry, language adapters, package loader, Malay Dictionary, all eight Malay Lesson files and the Daily Learning source together.
- Results: 650 Dictionary entries; 72 Lessons; 60 Topics; 60 Applications; 93 Discovery entries; active shared content package; 1,344 translation records; no errors in the new batch's field, answer, reference or integration checks.
- The final batch was checked with an isolated JavaScript runtime and package integration. A new full GitHub Actions 45-test run and browser/device acceptance were not available/claimed for the final batch commit.

## Phase 3 status and staging gate

**Content authoring and feature-branch implementation are complete.** No more Daily Topic/Application expansion is planned for U3.0 unless a defect is found. Future additions can be scheduled for a later update.

A read-only inspection was performed against the dedicated **SwiftDictionary Indie Staging** Supabase project. It is healthy, but still registers only `en` and `zh`. Its lesson progress, practice results, practice attempts, content-catalogue language constraint and lesson guard/completion functions reject `ms`. The saved-word course constraint also accepts only `en` and `zh`. The staging content catalogue has no Malay records. The complete read-only findings and required staging-only migration scope are recorded in [U3.0 Phase 3 Database Impact](../U3.0-PHASE-3-DATABASE-IMPACT.md).

No staging database write or migration was made. The formal Phase 3 exit/staging-preview handoff still requires:
1. an environment-specific staging-only migration and seed plan;
2. explicit owner approval before applying staging DDL/data;
3. successful post-migration checks and the full CI regression;
4. browser/device acceptance with synthetic staging accounts.

This does not authorise or change production. Quiz and Flashcards remain later U3.0 phases (Phases 4 and 5), not a requirement for the Phase 3 staging preview. The staging preview must clearly state that these later features are not yet included.

## Legal, privacy and editorial safeguards

This is original educational drafting; no third-party dictionary passages were intentionally copied into the new records. No new personal-data fields, tracking, external processor or API dependency was introduced by the content batch. Existing account-linked progress and daily session processing remain subject to Malaysia PDPA and international privacy review before public activation. The adaptive revision model should remain explainable and limited to learning-performance signals.

All content remains draft. Human Malaysian Standard Malay review, independent English/Simplified Chinese translation review, item-level source/provenance verification and rights clearance remain pending for staging review and public-release gates. Do not label any content human-approved. No production activation, merge to `main`, production deployment or production database change occurred.
