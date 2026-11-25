# 2026-11-25 — Update 2.9.0 Phase 3 category filters and translation QA

## Owner instruction

The owner confirmed Phase 2 complete and instructed immediate Phase 3 development. The owner’s standing restriction remains: do not create or provide a staging preview until Phase 4 is fully implemented and internally validated.

## Authority and boundaries

- The approved scope and sequence remain in `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`.
- Application implementation remains isolated on `feature/update-2-9-0-english-dictionary-collections`.
- Phase 1 and Phase 2 remain complete. Phase 3 is in progress; Phase 4 has not started.
- No staging preview, production merge/deployment, production database write, Supabase schema/RPC/RLS change, payment integration or Premium entitlement enforcement was performed.
- Dictionary search remains free and unlimited.
- Proposed Free 16-folder / Premium 40-folder capacities remain future planning only.

## Phase 3 implementation

### English topic categories

Added:
- `data/english-baseline-categories.js` — additive category metadata for all 810 original English headwords.
- `english-category-filters.js` — a dedicated English topic-filter row with ten approved categories.
- Script references in `index.html` — baseline metadata loads before the application dictionary state; filter controller loads after the main application script.
- Existing 506 expansion entries retain their category arrays in the seven source batches and `data/english-expansion.js`.

The ten topic categories are Actions, Everyday Terms, Activities, Places, People & Relationships, Science & Technology, History & Culture, Nature & Environment, Education, and Emotions & Descriptions.

Topic filters are separate from the existing POS filters and compose with headword-only search, alphabet selection, saved-word filtering and pagination. The English topic row hides/resets when switching to Chinese. Existing Chinese category and pinyin filters remain unchanged.

All 1,316 English entries have at least one category assignment. Combined category assignment counts (multi-category entries count in every category): Actions 442; Everyday Terms 379; Activities 62; Places 83; People & Relationships 68; Science & Technology 74; History & Culture 33; Nature & Environment 49; Education 68; Emotions & Descriptions 249.

These baseline category assignments are initial model-assisted editorial classifications. They are not represented as independent expert review; broader semantic spot checks remain part of Phase 3.

### Simplified Chinese translation coverage

Added `scripts/dictionary/validate-english-phase3.mjs`, which checks approved categories and Simplified Chinese headword/sense translation presence across baseline and expansion data.

Coverage inventory:
- Baseline: 810 entries with non-empty Simplified Chinese headword definitions; 302 entries with 657 explicit sense records, all with non-empty Simplified Chinese translations. The remaining 508 entries are single-POS records without explicit sense arrays and use the headword-level translation field.
- Expansion: 506 entries with non-empty Simplified Chinese headword definitions and 766 sense records, all with non-empty Simplified Chinese translations.
- The audit reports no missing category assignments, unapproved category labels, missing headword translations or missing sense translations.

Browser tests verify translation switching on a multi-sense entry and a single-sense baseline fallback entry. Field completeness and these runtime checks do not constitute professional/native-speaker certification of every translation nuance.

### Automated QA

Added `tests/browser/u2-9-0-english-categories.spec.js` and extended `.github/workflows/u2-9-0-dictionary-qa.yml` to run the Phase 3 content audit and browser checks alongside the existing Phase 2 validator/smoke tests.

Test failures and corrections:
1. Initial tests queried the topic row while its parent dictionary filter panel was closed. The tests were corrected to open the filter panel first.
2. One translation test initially assumed Chinese was already selected. It now explicitly selects Chinese before checking the translation, then tests switching back and forth.
3. A non-exact POS selector for “Verbs” also matched “Adverbs”. It was corrected to use an exact accessible name.
4. These were test assumptions/selectors; no application defect was inferred from them.

Final successful GitHub Actions run: **45540254655**, commit `95b9253b5a796d4cb2a62b838690659bc599fffe`. All workflow steps passed:
- Existing Phase 2 baseline/expansion validator.
- Phase 3 category and Chinese translation coverage audit.
- Playwright test-runner installation.
- Chromium installation.
- All six browser tests (three existing English expansion tests and three Phase 3 tests).

## Legal, privacy, security and licensing review

- This phase adds public-facing category metadata and filter UI only. It adds no new user data, tracking, external processor, Supabase schema/RPC/RLS change or new personal-data processing purpose.
- Malaysia PDPA applicability and existing privacy obligations remain relevant to the wider service. The intended global 16+ audience still requires jurisdiction-specific age/child-privacy screening before broader onboarding. This feature work is not a legal compliance certification.
- Category metadata is original editorial classification. Definitions, translations and examples still require content-provenance/licensing review before public release or monetisation. No third-party wordlist was added in this phase.
- No payment, subscription, billing, Premium entitlement or allowance behaviour was changed.

## Outstanding Phase 3 work

- Continue semantic/editorial spot checks of category assignments and Simplified Chinese translations; correct misleading topic labels or sense mismatches.
- Complete responsive desktop/mobile checks and interaction regression across search, alphabet, saved words, pagination, POS filters and Chinese course controls.
- Keep Phase 4 blocked until Phase 3 acceptance criteria are met.

## Recovery point

- Application branch: `feature/update-2-9-0-english-dictionary-collections`.
- Latest successful CI commit: `95b9253b5a796d4cb2a62b838690659bc599fffe`.
- Latest successful workflow run: `45540254655`.
- Feature progress record: `docs/U2.9.0-IMPLEMENTATION-PROGRESS.md`.
- No staging preview or PR was created. Do not prepare staging until Phase 4 is implemented and internally validated.
- Documentation updates belong on `docs/master-development-record`; do not merge internal records into production `main`.
