# 2026-11-27 — SwiftDictionary Update 3.0 Phase 3 initial implementation

## Owner direction

The owner clarified that human Malaysian Standard Malay linguistic review and independent English/Simplified Chinese translation review will happen during staging review, not before Phase 3. Phase 3 may proceed now. The 650-row editorial worksheet remains pending; no draft is to be marked human-approved.

## Implementation

Feature branch: `feature/update-3.0-phase-0-audit`.

- Added 9 Malay Lessons: 3 Beginner, 3 Intermediate and 3 Advanced. Each lesson has a stable ID, Malay primary text, English and Simplified Chinese support strings, explanations, key points, examples, common mistakes and three four-option practices.
- Added 3 Daily Topic and 3 Daily Application activities.
- Added a 93-entry Daily Discovery pool derived from the Malay Dictionary draft inventory, connected to the existing deterministic 93-item rotation scheduler.
- Connected the Malay Dictionary, Lessons and Daily Learning through the shared content-package bootstrap.
- Enabled Malay only in the feature branch for Dictionary, Lessons and Daily Learning. Quiz and Flashcards remain unsupported and are explicitly blocked in the UI.
- Added immediate refresh of lesson/daily support text when the selected translation language changes.
- Added tests for lesson difficulty coverage, bilingual content, question shape, unique Discovery IDs, shared content-package wrapping and capability boundaries.
- Added a database-impact report identifying existing en/zh-only lesson constraints and RPC guards, missing Malay approved-content catalogue entries and daily-session registry/FK checks required before a staging migration.

## Automated validation

- U3.0 architecture/adapter/content regression: **45 passed, 0 failed** — [workflow 45931107403](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45931107403), commit `ac5d8d0e2b694004686b5f4c18d9a72447dc47ee`.
- U2.9.0 English dictionary QA: passed after application wiring — [workflow 45931053784](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45931053784).
- Automated checks do not constitute human linguistic review, independent translation review, browser/device acceptance or database migration validation.

## Database, legal and release boundaries

The existing U2.7/U2.8 SQL has en/zh-only constraints and guards for lesson progress and practice results. Malay lesson progress cannot be assumed to persist until a schema-specific staging migration has been designed, reviewed and approved. The migration must also seed the lesson content catalogue while preserving the production approval guard. No migration was added to the active migration directory or applied to staging or production. A separate explicit owner approval is required before staging DB changes.

The feature reuses existing account-bound progress, practice, daily-session and allowance mechanisms; no new personal-data field or third-party processor is intentionally introduced. Before public launch, review Malaysia PDPA Amendment Act 2024 and current Commissioner guidance, including controller registration, DPO, breach notification and cross-border transfers. Assess whether privacy disclosures cover adaptive topic-level revision. Dictionary and new learning content remain draft; provenance and rights clearance are not complete.

No staging preview, production activation, main merge or deployment has occurred.

## Next work

1. Expand the Malay Lessons and Daily Learning content bank.
2. Complete language-package, browser, mobile and regression checks.
3. Design and review the environment-specific staging database migration path.
4. Complete Phase 3 internal validation before preparing the staging preview.
5. Conduct the owner's human review during staging review, using the 650-row worksheet and actual review evidence.
