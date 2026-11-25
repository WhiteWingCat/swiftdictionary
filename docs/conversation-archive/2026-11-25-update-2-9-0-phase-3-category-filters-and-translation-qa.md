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

All 1,316 English entries have at least one category assignment. Combined category assignment counts (multi-category entries count in every category): Actions 442; Everyday Terms 307; Activities 62; Places 85; People & Relationships 71; Science & Technology 147; History & Culture 46; Nature & Environment 73; Education 70; Emotions & Descriptions 233.

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

Initial successful GitHub Actions run: **45540254655**, commit `95b9253b5a796d4cb2a62b838690659bc599fffe`. The subsequent editorial and mobile follow-up run is recorded below. All workflow steps passed:
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

## Editorial and mobile follow-up

- Added 89 targeted manual overrides after scanning specialist baseline entries for misclassification.
- Added a 390px viewport test for filter wrapping, horizontal overflow and topic selection.
- Latest authoritative CI run: **45540937597**, commit `82ba00e4d6913eede952a3d7f0aa998d93054784`. All workflow steps and seven browser tests passed.
- Updated combined category assignment counts are the figures listed above. All baseline/expansion Chinese headword and sense translation fields remain complete in the automated audit.
- Phase 3 remains in progress pending broader semantic/editorial review. No staging preview until Phase 4 is complete and internally validated.

## Translation-content audit strengthening

- Validator now requires CJK characters in every headword/sense Chinese translation and rejects known placeholders/fallback phrases.
- Latest audit counts: 810 baseline headword translations, 657 baseline sense translations, 506 expansion headword translations and 766 expansion sense translations; zero missing, non-CJK or placeholder translations.
- Targeted model-assisted spot checks covered 20 baseline and 8 expansion entries; this is not professional/native-speaker certification.
- Latest CI run **45541339325**, commit `48ec2caabe3e8dae3fa223380efd9d51852ca6e8`, passed both data validators and all seven browser tests.

## Visual-only Premium information UI

- Added a global-header “Premium plan” entry and a Free/Premium comparison dialog.
- The dialog marks Premium and Collections as future proposals, not available for purchase. It shows the proposed 16-Free/40-Premium folder capacities for the future Collections feature, higher daily learning allowances as a proposed Premium benefit, and explicitly says dictionary search remains free and unlimited.
- No checkout, payment, purchase, billing portal, subscription activation, entitlement mutation, allowance change or Supabase integration was added.
- Responsive/mobile and keyboard accessibility are included. Tests cover no purchase action, Escape close, focus restoration and narrow mobile fit.
- Latest CI run **45541902319**, commit `0279d056fa1b11c0f31b1263ac918daacab0edcd`, passed all workflow steps and nine browser tests.
- Legal check: informational-only, no new personal-data processing or consumer transaction. Actual Premium activation still requires separate Malaysia/international payment, tax, consumer disclosure, cancellation/refund and processor review.

## Expanded category, pagination and Premium UI regression

- Added tests for all ten topic categories, topic-scoped pagination across five Actions pages, and reset of English topic selection after switching to Chinese and back.
- Premium UI tests cover proposed 16/40 folder capacities, unlimited free dictionary search, future-only disclosure, no checkout/payment/subscription action, Escape/focus restoration and narrow-mobile fit.
- Latest full CI run **45542196426**, commit `70f3e27486a8609aa11c22c29fae6529cb94fe09`, passed both validators and all ten browser tests.
- Phase 3 remains in progress pending broader semantic/editorial review; Phase 4 remains blocked. No staging preview.
