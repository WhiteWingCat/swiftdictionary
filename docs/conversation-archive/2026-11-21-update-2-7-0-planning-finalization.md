# SwiftDictionary Update 2.7.0 — Planning Finalization and Development Handover

Date: 2026-11-21

## Purpose

Finalize the owner-approved scope for Update 2.7.0 and prepare a clean application feature branch, following the Master Development Record's branch-separation and archive rules.

## Source-of-truth review

- Repository: `WhiteWingCat/swiftdictionary`.
- Documentation branch: `docs/master-development-record`.
- Application base: `main`, current merge commit `ba580c3f43e8b34f79205b69ae9f858186759036` (U2.6.0 PR #13 merge).
- The Master Development Record and November 20–21 U2.6.0 handover were reviewed before branch preparation.
- The roadmap identifies U2.7.0 as Chinese Dictionary Expansion & Chinese course lessons, followed by U2.8.0 Chinese Course Quiz & Flashcards.

## Owner-approved U2.7.0 scope

1. Expand the Simplified Chinese single-character dictionary. Initial target at least 500–700 new unique characters, no hard cap if quality and validation permit.
2. Replace the ineffective Chinese filter with Pinyin A–Z initial filtering and useful character categories. Allow filters to be combined. Suggested categories: Actions, People, Objects, Nature, Places, Time & Numbers, Emotions & States, Descriptions, Grammar & Function, Communication. Characters may have multiple valid categories.
3. Preserve one character per grid card and existing character/pinyin search.
4. Permanent layout rule: character above pinyin, pinyin directly underneath. Never left, right or above. This applies to desktop, mobile and responsive layouts.
5. Add a Simplified Chinese course to the existing Lessons framework; do not rebuild the framework.
6. Initial minimum 15 lessons and 52 practice questions, at least five lessons per Beginner/Intermediate/Advanced difficulty; may exceed if quality permits.
7. English support is guaranteed for Chinese lessons regardless of selected translation language.
8. Pinyin is mandatory throughout Chinese lesson content, including sentences, expressions, idioms, proverbs, quotations and poetry; align pinyin clearly with longer passages.
9. Include grammar, vocabulary, common expressions, 成语, 谚语, 名言警句 and selected 诗词; distinguish each content type and verify quote attribution.
10. Integrate English-to-Chinese exercises and English/Chinese structural comparisons.
11. Reuse existing lesson reader, practice, progress, completion, translation refresh, allowance and account-synchronisation behavior. No timer or time pressure.
12. Prepare structured content for U2.8.0 Chinese Quiz and Flashcards.

## Development preparation

- Created application branch `feature/update-2-7-0-chinese-dictionary-lessons` from `main`.
- No application files, database, production configuration or deployment were changed in this session.
- A read attempt for `index.html` through the GitHub connector returned empty content, including line-range requests. Do not infer that the file is empty; use an alternate source retrieval workflow during Phase 0.
- The README on `main` reports the old 2.2.0 baseline and should not be treated as a complete specification for the current deployed app.
- Phase 0 must audit the current app source, actual dictionary catalogue/data shape and counts, Chinese filter implementation, Lessons architecture, translation refresh, progress/allowance integration, tests, CI and third-party notices before implementation.

## Implementation sequence

1. Phase 0: source/data/architecture baseline audit and technical design.
2. Phase 1: character metadata, A–Z/category/combined filters and strict character-over-pinyin layout.
3. Phase 2: sequential Chinese dictionary content expansion with uniqueness, linguistic and licensing validation.
4. Phase 3: integrate Chinese course into existing Lessons architecture.
5. Phase 4: author bilingual/pinyin-rich Chinese curriculum and practice bank.
6. Phase 5: automated, browser, responsive, linguistic, translation and owner preview QA.
7. Phase 6: consolidated release readiness, documentation and package.

Do not start bulk content work before Phase 0 is complete. Do not provide intermediate ZIPs; provide one consolidated package per completed phase/task when requested.

## Legal, privacy and content licensing

- Include Malaysia-specific and general international legal/privacy risk planning for the expansion.
- Formal legal/privacy review remains deferred, not cleared; do not claim legal compliance.
- Avoid new personal-data collection or tracking.
- Review licensing/provenance for dictionaries, explanations, examples, pinyin data, idioms, quotes, poems and translations. Prefer original, public-domain or appropriately licensed texts. Verify quote attribution and avoid substantial unlicensed modern copyrighted material.
- Preserve dictionary lookup as free and unlimited.

## Exact recovery point

- Application branch: `feature/update-2-7-0-chinese-dictionary-lessons`.
- Base: `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Documentation branch: `docs/master-development-record`.
- Plan document: `docs/UPDATE-2.7.0-DEVELOPMENT-PLAN.md`.
- Next task: Phase 0 baseline audit only. Do not modify production or merge/deploy without explicit owner approval.


## Owner correction — pinyin display scope (2026-11-21)

The owner clarified that pinyin must **not** be added to Chinese Dictionary grid cards. Keep the existing character-only grid presentation. The vertical character-above-pinyin requirement applies specifically to Chinese Lessons content and readers. The development plan was corrected accordingly before implementation; no application source was changed for this clarification.
