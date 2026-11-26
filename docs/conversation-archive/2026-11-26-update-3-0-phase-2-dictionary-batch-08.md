# U3.0 Phase 2 — Malay Dictionary batch 08

Date: 2026-11-26

## Outcome

Added 204 new unique Malaysian Standard Malay dictionary headwords. The package now contains 650 headwords, 672 contextual senses and 1,344 per-sense English/Simplified Chinese support-translation records. Package revision: u3-ms-dict-0.8.0.

The batch exceeded the preferred 100–120 headwords because the prepared coverage set contained 203 valid unique entries. One additional common workplace headword, pekerja, brought the catalogue to the lower boundary of the owner's 650–750 target band. This is an exception and does not change the preferred size of future batches.

Coverage includes communication and digital life, administration and commerce, transport, sport, health and anatomy, food, household appliances, geography, weather, environmental care, community and function words. New records use stable Malay IDs, original-authored definitions and contextual examples, per-sense English and Simplified Chinese machine-assisted draft translations, and item-level provenance. Search aliases remain empty unless explicitly curated; no blind stemming or morphology expansion was introduced.

## Repository changes

Application branch: feature/update-3.0-phase-0-audit

- data/languages/malay-dictionary.js — batch 08 content and package revision.
- content/languages/ms/manifest.json — version u3-ms-dict-0.8.0, 650 headwords, 672 senses, batches 01–08.
- tests/u3-phase2-malay-dictionary.test.mjs — updated catalogue and translation-count assertions.

Latest application commit: 67b5691eda1d76dcd3746f90ccb96993dc2555cb.

## Validation state

English Dictionary QA passed on the intermediate batch-08 content head 11f5e78e4cf46a8bdd2fd94f3185471c2d08e731, workflow [45832076858](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45832076858). Later commits updated the package counts and added the final pekerja record. Therefore that success is not final-head validation.

Architecture workflow attempts on subsequent rapid pushes were cancelled. The latest English QA was still in progress at the latest check. Final-head architecture and English QA must be checked before marking this batch validated. The 204-entry batch is structurally prepared but has not yet earned a final validation sign-off.

## Editorial, legal and activation status

All 650 records remain original-authored drafts. All 1,344 support translations remain machine-assisted drafts. Competent human Malaysian Standard Malay review, independent translation review, source verification and item-level rights clearance remain outstanding. Medical, technical, administrative and environmental vocabulary needs careful subject-matter review. Automated checks are not a substitute for professional editorial validation.

No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysia PDPA and broader international privacy/legal review remain required before public launch.

The ms package remains planned/inactive and unselectable. No Malay Lessons, Daily Learning, Quiz or Flashcards content was added. No Supabase schema/data/Auth/RLS changes or migrations, staging preview, main merge, production deployment or ZIP occurred.

## Next actions

1. Confirm final-head architecture regression and English Dictionary QA.
2. Inspect failures and correct structural, count, alias, translation and runtime regressions.
3. Run a whole-catalogue editorial quality pass, especially on technical and medical terms.
4. Continue to keep Malay inactive until all U3.0 activation gates are satisfied.
