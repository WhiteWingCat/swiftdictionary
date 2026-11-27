# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 06

## Scope

Continue the original-authored draft Malay permanent Lessons catalogue. Human Malaysian Standard Malay review and independent English/Simplified Chinese translation review remain scheduled for the owner's staging review. This batch does not claim human approval.

## New lessons

Added 9 lessons in `data/malay-lessons-expansion-06.js`, three per difficulty:

- **Beginner:** food and drinks; daily activities; weather and natural conditions.
- **Intermediate:** pronouns and reference; derived nouns and verbs; paragraph development.
- **Advanced:** meaning nuance and authorial stance; comparing and synthesising sources; systematic editing and final proofreading.

Each lesson includes multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions. Malay is the primary content; English and Simplified Chinese support strings are machine-assisted drafts.

## Integration

- Added `data/malay-lessons-expansion-06.js` after expansion batch 05 in the application script loading order.
- Updated the Malay lesson content version to `u3-ms-lessons-0.6.0`.
- Expanded the Phase 3 test fixture to load batch 06 and assert 18 lessons at each difficulty, 54 unique lesson IDs and 54 package lesson records.
- Application branch: `feature/update-3.0-phase-0-audit`.
- Final validated application commit: `5eb2cde78c4b4c2b9532e11e80df7191b2b47fbd`.

## Automated validation

The first two runs found test-fixture issues rather than lesson-content failures: the new source file was initially absent from the test VM loader; after adding it, the shared package assertion still expected 45 lessons instead of 54. Both were corrected.

The latest U3.0 architecture, adapter, translation and content-parity workflow passed **45/45 tests**: [run 45936240420](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45936240420).

This validates automated syntax, integration and structural content contracts. It does not certify Malaysian Standard Malay editorial quality, independent translation accuracy, source/licensing status or browser/device acceptance.

## Catalogue count

| Difficulty | Lessons |
|---|---:|
| Beginner | 18 |
| Intermediate | 18 |
| Advanced | 18 |
| **Total** | **54** |

## Review and release boundaries

All 54 lessons and EN/ZH support strings remain draft for staging review. No human linguistic or translation approval is implied.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress. Continue with balanced nine-lesson batches, Daily Learning expansion and full integration/browser/progress/allowance regression before Phase 3 closeout.
