# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 08

## Scope

Continue original-authored draft Malay permanent Lessons. Human Malaysian Standard Malay review and independent English/Simplified Chinese translation review remain reserved for the owner's staging review. No human approval is claimed.

## New lessons

Added 9 lessons in `data/malay-lessons-expansion-08.js`, three per difficulty:

- **Beginner:** transport and directions; shopping and prices; time and daily routines.
- **Intermediate:** active and passive sentences; compound sentences and clause relationships; formal letters and emails.
- **Advanced:** evaluating source credibility; adapting register and genre; coherent argument structure.

Each lesson contains multilingual topic/title/summary support, at least two explanations, learning points, an example, a common-mistake note and three four-option practice questions. Malay is the primary authored language; English and Simplified Chinese support text is machine-assisted draft content.

## Integration

- Loaded batch 08 after expansion batch 07 in `index.html`.
- Updated Malay lesson content version to `u3-ms-lessons-0.8.0`.
- Expanded Phase 3 tests to load batch 08 and assert 24 lessons per difficulty, 72 unique lesson IDs and 72 shared-package lesson records.
- Application branch: `feature/update-3.0-phase-0-audit`.
- Content commit: `dca534560aa2c422c7d4ef10a9f8372f31baf216`.
- Final loader/test integration commit: `b844cc58838baaebb13217ddd41cc23707e0f2b0`.

## Daily Learning inventory checkpoint

The Malay Daily Learning data currently contains **99 authored activity records**: 3 Daily Topics, 3 Daily Applications and 93 Daily Discovery entries. Daily Revision is an adaptive category driven by learner progress/weak areas, not a fixed catalogue of authored records; it is not included in the 99. Batch 08 adds permanent Lessons only and does not change the Daily Learning inventory.

## Validation

Final U3.0 architecture/content regression is running as [workflow run 45937654497](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45937654497) on commit `b844cc58838baaebb13217ddd41cc23707e0f2b0`. Record the actual result here before calling Batch 08 validated. The earlier passing run on the content-only commit preceded final loader and test changes and is not sufficient for sign-off.

## Catalogue count

| Difficulty | Lessons |
|---|---:|
| Beginner | 24 |
| Intermediate | 24 |
| Advanced | 24 |
| **Total** | **72** |

## Review and release boundaries

All 72 lessons and EN/ZH support strings remain draft for staging review. Automated validation does not certify Malaysian Standard Malay editorial quality, translation accuracy, source/provenance or item-level rights.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.
