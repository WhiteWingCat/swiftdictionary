# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 04

## Scope

Continue expanding the original-authored draft Malay permanent Lessons catalogue. Owner linguistic review and independent EN/ZH translation review remain scheduled for staging review; this batch does not claim human approval.

## New lessons

Added 9 lessons in `data/malay-lessons-expansion-04.js`, three per difficulty:

- **Beginner:** weather and clothing; transport and travel; health-related language and appointments.
- **Intermediate:** direct and reported speech; modal expressions for ability, permission, intention and obligation; relative clauses using “yang”.
- **Advanced:** register and audience; systematic editing and error correction; proposal and persuasive writing.

Each lesson includes multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions. Malay content is original draft writing; English and Simplified Chinese support strings are machine-assisted drafts.

## Integration and validation changes

- Loaded batch 04 after expansion batch 03 and before the shared content bootstrap.
- Updated the Malay manifest to `u3-ms-lessons-0.4.0`, with 12 lessons per level and 36 total.
- Updated structural regression tests to load batch 04 and assert 36 unique lesson IDs, 12 per level and 36 package lessons.
- Added a Node syntax check for the new content file to the U3.0 validation workflow.

## Review and release boundaries

Automated tests validate structure, package integration and syntax; they do not certify Malaysian Standard Malay quality or independent translation accuracy. All 36 lessons and EN/ZH support strings remain draft for owner staging review.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.

## Recovery point

Application branch: `feature/update-3.0-phase-0-audit`. Latest application commit at archive creation: `8daab34f69e32e2a94f3a024ce949bc8c235d269`. Documentation remains on `docs/master-development-record`.
