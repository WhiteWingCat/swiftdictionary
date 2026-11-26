# SwiftDictionary U3.0 Phase 2 — Malay Dictionary batch 07

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Batch commit:** `c5eb7b0d54cc3e40e7c7f5e7c5dcd93d909894f0`  
**Final content/test/manifest head:** `c6f8d5c635c4a79017d7f9a59a58426d34bd47db`  
**Package revision:** `u3-ms-dict-0.7.0`

## Owner direction

The owner requested batches of around 100+ new headwords. Batch 07 adds **110 new unique headwords**, within the preferred 100–120 range. The approximately 700-headword target remains a coverage goal, not permission to add low-value or dubious terms.

## Batch coverage

The 110 additions are drawn from Malaysian Standard Malay vocabulary for agriculture and food preparation; household and clothing items; tools, materials and measuring instruments; public and community facilities; transport infrastructure; waste and environmental care; qualities, feelings and interpersonal communication; administration; education and language study; and general concepts.

Each record has a stable `ms.dict.*` ID, Malaysian Malay headword, part of speech, original draft definition, English and Simplified Chinese support definition, examples, category metadata, explicit empty search aliases, and item-level provenance. New records do not mechanically generate inflections or morphology aliases.

## Counts

| Measure | Before batch 07 | Added | Current |
|---|---:|---:|---:|
| Unique headwords | 336 | 110 | **446** |
| Contextual senses | 358 | 110 | **468** |
| English/Simplified Chinese per-sense support translations | 716 | 220 | **936** |

All 446 entries remain editorial drafts. All 936 support translations remain machine-assisted drafts.

## Validation

- Updated dictionary content version to `u3-ms-dict-0.7.0` consistently across entries.
- Updated `content/languages/ms/manifest.json` to 446 headwords, 468 senses and batches 01–07.
- Updated the Malay dictionary regression assertions to the new package counts.
- The first content-only CI run on commit `c5eb7b0` failed on the expected stale test count assertions (the new package exposed 936 translation records while the test still expected 716). The assertions were updated; the corrected latest-head architecture workflow passed: [run 45817883224](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45817883224).
- The companion English Dictionary QA passed on the final application head (run [45817883250](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45817883250)). The Quiz database foundation workflow was still in progress at the latest status check and will be recorded when its outcome is confirmed.

## Editorial, legal and release boundaries

The entries are original-authored drafts; no DBP/PRPM/Kamus Dewan text was copied or scraped. Human Malaysian Standard Malay review, independent English/Chinese translation review, source verification and item-level rights clearance remain outstanding. The batch is not approved for public release.

The Malaysian privacy and broader international legal review gates remain required before public launch; this content-only batch does not clear them. No new personal-data processing, analytics, database schema, Supabase data/Auth/RLS, or migration changes were made.

The `ms` package remains `planned` and inactive. Malay is not selectable. No Malay Lessons, Daily Learning, Quiz or Flashcards implementation was started. No staging preview, main-branch merge, production deployment or ZIP was created. Phase 2 remains in progress.

**Next:** Continue with Batch 08 at 100–120 new unique headwords where quality permits, first checking the current catalogue to avoid duplicate headwords and aliases.
