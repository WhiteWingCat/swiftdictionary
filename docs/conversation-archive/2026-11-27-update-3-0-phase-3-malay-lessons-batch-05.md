# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 05

## Scope

Continue the original-authored draft Malay permanent Lessons catalogue. Human Malaysian Standard Malay review and independent EN/ZH translation review remain scheduled for owner staging review, not a prerequisite for content drafting.

## New lessons

Added 9 lessons in `data/malay-lessons-expansion-05.js`, three per difficulty:

- **Beginner:** home and household items; school and learning; feelings and simple opinions.
- **Intermediate:** conditional sentences; classifiers and quantifiers; cause-and-effect relationships.
- **Advanced:** data and statistical language; policy language and formal correspondence; ethical and inclusive language.

Each lesson includes multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions. Malay content is original draft writing; English and Simplified Chinese support strings are machine-assisted drafts.

## Integration and validation changes

- Loaded batch 05 after expansion batch 04 and before the shared content bootstrap.
- Updated the Malay manifest to `u3-ms-lessons-0.5.0`, with 15 lessons per level and 45 total.
- Updated structural regression tests to load batch 05 and assert 45 unique lesson IDs, 15 per level and 45 package lessons.
- Added a Node syntax check for the new content file to the U3.0 validation workflow.

Automated validation is pending for this batch. The previous 45/45 result applies to the earlier Batch 03 revision only; it must not be represented as validation of batch 05.

## Review and release boundaries

All 45 lessons and EN/ZH support strings remain draft for owner staging review. Automated structural checks do not certify Malaysian Standard Malay editorial quality or independent translation accuracy.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.

## Recovery point

Application branch: `feature/update-3.0-phase-0-audit`. Batch 05 content commit: `613c4b9006de20bdd109a053a1619f5207488bca`. Documentation remains on `docs/master-development-record`.
