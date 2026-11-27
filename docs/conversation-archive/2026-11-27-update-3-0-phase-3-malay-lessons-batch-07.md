# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 07

## Scope

Continue original-authored draft Malay permanent Lessons content. Human Malaysian Standard Malay review and independent English/Simplified Chinese translation review remain reserved for the owner's staging review. No human approval is claimed.

## New lessons

Added 9 lessons in `data/malay-lessons-expansion-07.js`, three per difficulty:

- **Beginner:** places in the community; hobbies and free time; asking for and offering help.
- **Intermediate:** word order and emphasis; idioms and fixed expressions; cause, concession and contrast.
- **Advanced:** counterarguments and rebuttals; ethical use of quotations; ambiguity and linguistic precision.

Each lesson includes multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions. Malay is primary; EN/ZH support is machine-assisted draft text.

## Integration

- Loaded batch 07 after expansion batch 06 in `index.html`.
- Updated content version to `u3-ms-lessons-0.7.0`.
- Expanded the Phase 3 test fixture to load batch 07 and assert 21 lessons per level, 63 unique IDs and 63 shared-package lesson records.
- Application branch: `feature/update-3.0-phase-0-audit`.
- Batch 07 content commit: `003d7b133dc71fb5c098e8d6cc23fb2b1f4f9cba`.
- Latest integration/test commit: `3b51313af422ee34e418cd68e87c1d884156816e`.

## Validation status

The workflow on the content-only commit passed 45/45 tests, but that run preceded the final loader/test-fixture updates. The workflow for the final integration commit is running as [U3.0 architecture regression run 45936478798](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45936478798). Its result is pending at archive time. Do not mark Batch 07 validated until that final run completes successfully. U2.9 English Dictionary QA is also running on the same final integration head.

## Catalogue count

| Difficulty | Lessons |
|---|---:|
| Beginner | 21 |
| Intermediate | 21 |
| Advanced | 21 |
| **Total** | **63** |

## Review and release boundaries

All 63 lessons and EN/ZH support strings remain draft for staging review. Automated checks do not certify linguistic quality, translation accuracy, provenance or rights.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.
