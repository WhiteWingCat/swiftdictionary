# 2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 02

## Scope

Continue expanding the Malay permanent Lessons content while keeping it as draft content for the owner's staging review. No human linguistic or independent translation review was performed or claimed.

## New lessons

Added 9 original draft lessons in `data/malay-lessons-expansion-02.js`:

- **Beginner:** daily routines; time and days; polite food ordering.
- **Intermediate:** ongoing/completed/future aspect markers; prepositions for location, direction and recipients; conjunctions and logical relationships.
- **Advanced:** active/passive constructions (including pronoun-specific passive patterns); discourse cohesion and reference; evidence-based arguments and fact/opinion distinctions.

Total Malay permanent Lessons catalogue is now **18 lessons**, with 6 per difficulty. The file is loaded after the base lesson catalogue and before the shared content-package bootstrap. The manifest version is `u3-ms-lessons-0.2.0`.

## Automated validation

U3.0 architecture/adapter/content regression passed **45/45 tests**, run [45932215643](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45932215643), commit `9ee2d59b77e1ac9ded2e4ffa205ee9bbfdb79ac3`. This covers syntax, package wiring, lesson structure and content contracts; it does not certify linguistic or translation quality or browser/device behaviour.

## Review and release boundaries

All 18 lessons and English/Simplified Chinese support strings remain draft. The user plans human review during staging review. No staging preview, database migration, production activation, main merge or deployment has occurred. Existing database constraints and approved-content catalogue still require a reviewed, environment-specific staging migration and separate owner approval.

## Next work

Continue expanding the Malay lesson catalogue with balanced difficulty coverage, then improve automated checks for question uniqueness, answer distribution, examples and lesson structure. Complete browser/device and progress/allowance integration validation before staging preparation.
