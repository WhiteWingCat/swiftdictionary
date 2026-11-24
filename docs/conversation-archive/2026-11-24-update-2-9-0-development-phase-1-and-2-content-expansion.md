# 2026-11-24 — Update 2.9.0 development Phase 1 and Phase 2 content expansion

## Session purpose

Continue the owner-authorised Update 2.9.0 work after reading the latest Master Development Record, the approved development plan and the planning-decision archive. The owner asked for sustained development without routine small-batch reports and specified that the first staging preview must wait until Phase 4 is fully implemented and internally validated.

## Authority and scope

- The owner approved the U2.9.0 sequence and then separately instructed development to begin.
- The authoritative scope remains `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`.
- The approved work includes approximately 500–700 new English words where quality permits, full review of existing and new English definitions/grammar, English categories and Simplified Chinese translation QA, cross-language Favorite collections, visual-only Premium preparation, and optional English learning-content expansion only if capacity allows.
- Free dictionary search remains unlimited.
- The proposed Free 16-folder / Premium 40-folder capacity remains future Premium planning only. It is not enforced in U2.9.0.
- No staging preview before Phase 4 completion. No production merge, deployment or database write without separate owner approval.

## Branch and repository state

- Application branch: `feature/update-2-9-0-english-dictionary-collections`.
- Latest recorded feature-branch commit at this checkpoint: `22bc284e00cfcc41582319712974ac3ba861a9b8`.
- The feature branch is 55 commits ahead of `main` and 0 commits behind at the checkpoint.
- No pull request was opened.
- No staging preview was created.
- No production branch, production deployment, Supabase schema, data or policy was changed.
- The current `main` baseline remains commit `c53d12a06045700a884a244d3b9fe69e6e6e8f95`.

## Phase 1 — Repository and technical audit

Completed.

- Parsed the complete English array embedded in `main/index.html`: 810 entries, 810 unique headwords, 0 baseline duplicate headwords.
- Read-only comparison confirmed that all 506 authored additions have 0 normalised headword overlaps with the 810-entry baseline.
- The original candidate inventory contains 660 candidate headwords after 185 baseline-existing candidates were rejected.
- Existing saved-word storage is account-owned `public.saved_words` with RLS enabled. The earlier audit found no implemented collection CRUD or mixed-language collection membership.
- No database changes were made.

### Existing English baseline content scan

- All 810 entries have a headword, part of speech, pronunciation, English definition, Simplified Chinese definition, examples array and tip.
- After the Phase 2 editorial corrections integrated on the feature branch, 216 entries still have fewer than two general example sentences (42 second examples were added).
- 130 entries now contain a `senses` array, comprising 304 senses; all 304 have a Simplified Chinese sense translation (30 entries received 60 POS-specific sense records).
- 680 entries do not have an explicit `senses` array; 110 of these have multiple parts of speech and remain a priority for sense separation.
- 38 entries lack the optional `breakdown` and `related` fields.
- None of the 810 baseline entries has category assignments. Phase 3 must classify existing entries as well as the new additions.
- All 810 pronunciations passed a basic slash-delimited notation check. Phonetic accuracy and accent consistency remain editorial QA tasks.

This is a structural inventory, not a linguistic accuracy certification. The 30 sense patches and 42 example patches are now integrated into the feature-branch `index.html` at commit `9c09415afe879e1960dd254e6243e07c2dbb8615`.

## Phase 2 — English expansion and accuracy review

**Status: content target reached; full Phase 2 remains in progress pending linguistic QA and integration.**

### Authored batches

| Batch | Focus | Entries |
|---|---|---:|
| 01 | Core everyday actions | 20 |
| 02 | Everyday terms and core concepts | 20 |
| 03 | Everyday activities and recreation | 21 |
| 04 | Everyday places and public facilities | 19 |
| 05 | People and family relationships | 20 |
| 06 | Core actions, everyday concepts, education and places | 177 |
| 07 | Places and people in everyday life | 53 |
| 08 | Common emotions and descriptions | 43 |
| 09 | Common activities and everyday technology | 47 |
| 10 | Nature, environment and cultural life | 44 |
| 11 | Technology, places and education essentials | 42 |
| **Total** | | **506** |

The 506 entries are stored in `data/english-expansion-batch-01.json` through `data/english-expansion-batch-11.json`. They are not yet merged into the live `englishWords` array.

### Structural validation evidence

A connector-side JavaScript audit parsed the full 810-entry baseline, all eleven batch files and the candidate inventory:

- Baseline: 810 entries, 810 unique headwords, 0 duplicate headwords.
- Additions: 506 entries, 506 unique normalised headwords.
- Normalised baseline/addition overlap: 0.
- Candidate inventory membership: all 506 additions present; no duplicate normalised candidate headwords.
- Required text fields, two examples, sense records, Simplified Chinese sense fields, course values and approved categories: 0 structural errors.
- Candidate inventory: 506 authored, 154 still candidates.
- Projected English dictionary size after eventual integration: 1,316 entries.
- Multiword headwords were normalised to natural space-separated forms where appropriate (e.g. “bus stop”, “police station”, “post office”, “department store” and “social media”).

Category assignment counts for the new entries (a multi-category entry counts once in each category):

| Category | Assignments |
|---|---:|
| Actions | 75 |
| Everyday Terms | 149 |
| Activities | 52 |
| Places | 72 |
| People & Relationships | 58 |
| Science & Technology | 51 |
| History & Culture | 26 |
| Nature & Environment | 42 |
| Education | 59 |
| Emotions & Descriptions | 43 |

A reproducible validator was added at `scripts/dictionary/validate-english-expansion.mjs`. It was corrected so an empty related-word string is allowed, and duplicate comparisons normalise spaces and hyphens. The standalone script has not yet been executed in an actual checked-out Node/CI environment; the connector-side audit performed equivalent checks and additionally verified the full baseline overlap after the baseline patches were integrated.

### Editorial and integration gates still open

- Review all 810 existing English entries and all 506 additions for definition accuracy, common versus obscure senses, POS, grammatical patterns, inflections, natural examples, pronunciation accuracy/accent consistency and Simplified Chinese meaning alignment.
- Prioritise the 258 baseline entries with fewer than two general examples and the 710 baseline entries without an explicit sense array.
- Resolve entries where multiple parts of speech or meanings are combined too broadly.
- Review the 154 remaining candidates and add only worthwhile vocabulary; do not pad the 500–700 target.
- Produce a reproducible content QA report and consolidated runtime dataset.
- Integrate the approved additions without changing Chinese course data or headword-only search semantics.
- Execute the repository validator in Node/CI and run runtime/browser checks before closing Phase 2.

## Legal, privacy, security and licensing review

The current planning review was reread and applied to this phase. This is planning guidance, not legal advice or legal clearance.

- Malaysia PDPA applicability is fact-specific; a free public service is not automatically outside the Act. Obtain Malaysian legal advice on the project's actual activity and controller status.
- The intended global 16+ audience still requires jurisdiction-specific child/teen privacy screening; 16+ is not a blanket exemption.
- Collection names and membership will be account-linked personal data. Phase 4 must minimise collection, use owner-scoped RLS and avoid unnecessary logs.
- Supabase's primary database region was previously observed in Tokyo, Japan; a cross-border transfer assessment must cover all relevant providers, backups, logs and subprocessors, not just the primary region.
- Review source provenance and licensing for dictionary content, translations and examples before public release or future monetisation.
- Future Premium folder caps and payment features require a separate consumer/payment/privacy review before activation.
- No new personal-data collection or database operation was introduced in this content-authoring phase.

## Recovery point and next actions

1. Continue Phase 2 editorial QA and runtime integration. Do not mark Phase 2 complete merely because the 506-entry structural target has been reached.
2. Complete Phase 3 category/filter implementation and translation QA after the consolidated English dataset is stable.
3. For Phase 4, read the Supabase skill and re-audit migrations, schema, RLS, RPCs, indexes and account ownership before proposing collection changes. Keep production untouched.
4. Only after Phase 4 implementation and internal validation may a staging preview be prepared and shared for the owner's inspection.
5. Do not prepare intermediate ZIP files. Provide one consolidated deliverable when the relevant phase is complete and validated.
