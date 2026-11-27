# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 03

## Scope

Continue expanding the draft Malay permanent Lessons catalogue. Human linguistic review and independent translation review are scheduled for the owner's staging review; no human approval is claimed.

## New lessons

Added 9 original draft lessons in `data/malay-lessons-expansion-03.js`:

- **Beginner:** family relationships and possessive phrases; places and directions; shopping, prices and quantities.
- **Intermediate:** adjective comparison; intensifiers; compound and complex sentences.
- **Advanced:** sentence-structure variation; paraphrasing and summarising; critical reading and source reliability.

The total catalogue is now **27 lessons**, with 9 at each difficulty. The new file loads after expansion batch 02 and before the shared content bootstrap. The manifest content version is `u3-ms-lessons-0.3.0`.

## Automated validation

U3.0 architecture/adapter/content regression passed **45/45 tests**, run [45932623195](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45932623195), commit `8fc2695e2147fd99e58cfcdd9fef5fde49c03fea`. This confirms syntax, package wiring and automated content contracts, not linguistic accuracy or browser/device acceptance.

## Review and release boundaries

All 27 lessons and EN/ZH support strings remain draft for staging review. No staging preview, database migration, production activation, main merge or deployment has occurred. The database compatibility and staging migration review remains a separate gate.

## Next work

Continue building balanced lesson coverage and strengthen quality checks for question uniqueness, answer distribution, examples and lesson progression. Then complete browser/device, progress and allowance validation before staging preparation.
