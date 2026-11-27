# SwiftDictionary U3.0 — Phase 3 Daily Topic and Daily Application Expansion, Batch 01

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Status:** Implemented; automated workflow validation pending at time of archive creation. Content remains draft.

## Owner direction

Daily Topic and Daily Application are recurring learning activities. The previous inventory of three records per category was inadequate. Phase 3 is rebalanced to expand these daily categories alongside permanent Lessons, rather than allowing the lesson catalogue to dominate content work.

Initial milestone: 30 Topics and 30 Applications, with ten per difficulty (Beginner, Intermediate, Advanced). This is an initial milestone, not a final cap. Daily Discovery remains mixed and expandable. Daily Revision remains adaptive based on learner progress and weak areas, not a fixed catalogue. Permanent Lessons continue at a measured pace.

## Batch 01 additions

Nine new Daily Topics:
- Beginner: family relationships; spaces at home; food and mealtimes.
- Intermediate: time and duration; meN- prefix changes; active and passive sentences; prepositions in context.
- Advanced: paragraph unity and cohesion; arguments, evidence and inference.

Nine new Daily Applications:
- Beginner: describe locations at home; arrange a daily schedule; order food; give directions.
- Intermediate: correct affix usage; summarise a notice; compare viewpoints; write a formal email.
- Advanced: evaluate source reliability; review argument strength.

Each record includes Malay, English and Simplified Chinese fields. Applications include a multiple-choice check with four options and a keyed answer. Option translations were checked for contextual correspondence. All records remain draft; no claim of human Malaysian Standard Malay or independent translation approval is made.

## Inventory after Batch 01

| Category | Records |
|---|---:|
| Daily Topic | 12 |
| Daily Application | 12 |
| Daily Discovery | 93 |
| Fixed inventory total | 117 |
| Daily Revision | Adaptive; not a fixed count |

The 93 Discovery entries are dictionary-derived records, not 93 individually authored topic/application activities.

## Implementation

- Updated `data/malay-daily-learning.js`; content version `u3-ms-daily-0.2.0`.
- Updated `tests/u3-phase3-malay-learning.test.mjs` to assert 12 unique Topics and Applications, multilingual fields, four-option application checks and package integration counts.
- Application branch commits:
  - `aa920c6d64614bdf5589975e9bef406b18bf9550` — initial content addition.
  - `e60523307ef61b34c727c621b898f4f54caf74a7` — contextual option translation correction.
  - `f89bf5c8a780048027e6893bebf274f569715e5e` — expanded content tests.

## Validation and release boundaries

GitHub Actions was triggered by the test commit. The run was queued when this archive was written: [run 45938639727](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45938639727). Final outcome must be added after it completes.

No staging preview, main-branch merge, production deployment or database mutation is authorised. Human Malay editorial review, independent translation review, source verification, item-level rights clearance, and the required Malaysia/international privacy review remain pending before public activation. Draft content was independently composed; no DBP/PRPM protected text was intentionally copied. This is not legal advice or rights clearance.
