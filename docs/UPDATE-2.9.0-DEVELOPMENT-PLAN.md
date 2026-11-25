# SwiftDictionary Update 2.9.0 — English Dictionary Expansion & Dashboard Collections

**Status:** Owner-approved plan (2026-11-24); Phases 1–3 are complete; Phase 4 Your Collections refinements are implemented and deployed to a controlled Cloudflare Pages staging preview for owner re-review; Phases 5–6 and final release QA remain open.  
**Predecessor:** Update 2.8.0 — completed and owner-confirmed live on 2026-11-24.  
**Next major milestone:** Update 3.0.0 — Introduction to Malay course.  
**Scope authority:** This document records the owner's approved U2.9.0 scope and sequencing. Any material scope, quota, entitlement or data-model change requires owner review.

## 1. Objective

Strengthen the English learning experience through a substantial, carefully validated dictionary expansion and improve Dashboard vocabulary organization through cross-language Favorite collections. Add English category filters, complete English-definition Simplified Chinese translation coverage, and prepare the visual interface/navigation for a future Premium plan without activating subscriptions.

## 2. Approved scope and priorities

### P0 — English dictionary expansion

- Add approximately **500–700 new English words**, targeting the upper end only where quality and review capacity allow.
- Prefer useful, commonly encountered vocabulary and a balanced spread across actions, everyday terms, activities, places, people/relationships, education, emotions/descriptions, science/technology, history/culture, and nature/environment.
- Avoid duplicates, low-value variants, overly obscure terms and artificial padding to reach a numerical target.
- Preserve the dictionary's established data conventions and search behaviour. Dictionary word-grid search remains free and unlimited.

**Acceptance criteria**
- Report baseline count, added count, final count, duplicates rejected and category distribution.
- Every new entry has a valid headword, appropriate part(s) of speech, complete contextual definition(s), and required supporting fields under the existing schema.
- No malformed, duplicate or accidentally empty records.
- Search continues to match English headwords rather than definitions or Chinese translations.

### P0 — Full English dictionary accuracy and completeness audit

Review **all existing and newly added English entries**, not only the new batch.

Check:
- Missing, vague, incomplete, duplicated or misleading definitions.
- Multiple senses and context distinctions.
- Parts of speech and grammatical usage.
- Verb forms, including present, past and future constructions where relevant; distinguish lemma/headword records from inflected forms and avoid needless duplicate entries.
- Singular/plural and other meaningful inflections where relevant.
- Examples and contextual accuracy where examples exist.
- Consistency between definitions, category assignments and translations.

Do not force every word into a tense list: future meaning is normally expressed through constructions, and English verbs have different forms depending on tense/aspect and context. Represent these accurately according to the current schema and learner-facing design.

**Acceptance criteria**
- A reproducible audit report records entries reviewed, issues found, corrections made and any unresolved exceptions.
- No known missing primary sense or incorrect grammatical claim remains in the accepted release dataset.
- Existing valid content is preserved; corrections do not silently remove useful senses.

### P0 — Dashboard Favorite: Your collections

Add a new **Your collections** panel directly below **Favorite words**.

**User experience**
- A plus () or **New folder** control opens an in-site modal centred on the screen with the background blurred/dimmed. Never use browser-native prompt, alert or confirm dialogs.
- The modal lets users enter a collection name and create it, with validation and clear inline error states. The New folder action should use a restrained, dimmed accent rather than a bright primary fill.
- Each created folder appears as an inline expandable/collapsible section, following the Dashboard Favorite words interaction pattern. Expanding it reveals the saved-word cards; collapsing it hides them without opening a separate folder modal.
- Selecting a word inside an expanded folder opens the existing shared dictionary detail panel, with the same definitions, examples, Chinese structure and stroke-order behaviour as Favorite words.
- Each folder has a custom in-site **…** actions menu on the right, with **Add words**, **Rename** and **Remove**. Do not use native browser menus, select controls, prompt, alert or confirm dialogs.
- **Add words** from a folder lets the user select saved English and Chinese words to include. A saved word may be included in multiple collections.
- The shared word detail panel exposes an **Add to collection** action beside the Favorite save button. It appears only when the current word is saved and lets the user select one or more folders. This provides the reverse path from Favorite words into collections.
- Removing a saved word from Favorite words must remove its membership from every collection automatically. Removing a word from a collection only removes that membership and must not unsave the word.
- Deleting a collection must not delete the saved words it contained.
- The panel description is exactly: “Customize and organize any saved words to your preferences.”
- Apply subtle drop shadows to relevant controls and custom menus. Handle empty collections, long names, duplicate names, loading/error states, keyboard use, touch targets and responsive desktop/mobile layouts.

**Data and security**
- Inspect the current Favorite/saved-word schema and synchronization implementation before designing changes; reuse existing stable word identity where safe.
- Collections and membership must be account-owned, synchronize across devices, and remain isolated between accounts.
- Enforce ownership and authorization through Supabase RLS and appropriately scoped database operations/RPCs. Do not rely on client-side filtering or UI checks as security.
- Consider uniqueness constraints, foreign keys, cascade semantics and indexes. Deleting a collection may delete its membership rows only; it must not delete the saved-word record.
- Verify language-agnostic membership. A collection can contain English and Chinese saved words simultaneously.
- Do not expose service-role credentials or weaken existing RLS policies.

**Future capacity boundary**
- The owner has proposed a folder-count limit of **16 for Free** and **40 for Premium** accounts. This is recorded as a future entitlement direction, not an active U2.9.0 subscription feature.
- During U2.9.0, the collection data model and UX should not assume unlimited folders. However, do not enforce these tier limits or modify existing entitlement/allowance behaviour unless separately approved after a technical and Premium-policy review. The UI-only Premium preparation must not create a hidden or partial subscription system.
- For future implementation, enforce the count server-side and protect against concurrent creation races. Preserve existing folders on downgrade; never silently delete user data. A recommended downgrade behaviour is to leave existing folders accessible while blocking creation above the Free cap until the user reduces the count or regains Premium. This remains a recommendation requiring future owner confirmation.

**Acceptance criteria**
- Cross-language collection membership works for English and Chinese saved words.
- Create, list, rename, add/remove membership and delete operations work for the authenticated owner.
- Account A cannot read or mutate Account B's collections or memberships, including through direct API/RPC attempts.
- Changes synchronize across sessions/devices and remain correct after sign-out/account switching.
- Collection membership operations do not corrupt Favorite words or learning progress.
- Automated database tests and authenticated browser tests cover RLS, authorization, concurrency, empty states and failure handling.

### P1 — English filter expansion

Expand the English dictionary filter into useful categories, including:
- Actions
- Everyday Terms
- Activities
- Places
- People & Relationships
- Science & Technology
- History & Culture
- Nature & Environment
- Education
- Emotions & Descriptions

Categories should be useful for discovery rather than arbitrary labels. Allow a word to belong to multiple appropriate categories where the existing model supports it. Avoid forcing an exclusive single category where that would misrepresent a word.

**Acceptance criteria**
- Every English entry has reviewed category assignments or an explicit uncategorized exception.
- Category filters return correct entries, combine predictably with search and pagination, and do not alter headword-only search semantics.
- Existing Chinese filtering and course selection remain unaffected.

### P0 — Simplified Chinese translations for English definitions

Ensure the selected Simplified Chinese translation is available and accurate throughout English dictionary definition content.

Check:
- Every English definition/sense has a corresponding Chinese translation.
- Multiple meanings remain distinct and context-appropriate in translation.
- Examples are translated where the current data model and UI support translated examples.
- Switching translation language refreshes the relevant detail content immediately, with no stale labels or cached text.
- Switching back and forth preserves correct content and does not require unrelated navigation.

Do not treat a populated translation field or changed language label as proof of quality. Review meaning, naturalness and sense alignment.

**Acceptance criteria**
- Translation coverage is reported by definition/sense, not just by headword.
- Missing or low-confidence translations are corrected or explicitly documented as exceptions before release.
- Browser regression tests cover language switching, multiple senses, and English/Chinese course combinations.

### P1 — Visual-only Get Premium Plan preparation

Prepare interface and navigation for a future **Get Premium Plan** experience:
- Add a visible entry point in an appropriate location.
- Prepare a dedicated information page/panel.
- Present a clear Free-versus-Premium comparison and possible benefits, including that future Premium value is intended to extend beyond daily allowance increases alone.
- The proposed collection-folder capacities may be described as planned/proposed only if the UI makes their not-yet-active status clear and the owner approves the exact copy.

**Strict boundary**
- Visual and navigation preparation only.
- No checkout, payment provider, purchase, subscription activation, billing portal, entitlement mutation, subscription enforcement or new daily allowance rules.
- Do not represent Premium as available for purchase or imply legal/payment readiness.
- Existing allowances and dictionary access remain unchanged.

### P2 — Optional English Lessons, Quiz and Flashcards content expansion

This is explicitly optional. After core scope is complete and quality gates are satisfied, assess available capacity and expand English Lessons, Quiz and/or Flashcards with aligned content. Prioritise coherence and quality over quantity. Do not delay core deliverables or weaken QA to include optional additions. Any additions must preserve the existing difficulty, translation, answer-security, recall-mode, allowance and progress semantics.

## 3. Approved development sequence

1. **Repository audit and planning.** Inspect current main, English and Chinese content schemas/data, dictionary rendering/search/filtering, translations, Dashboard Favorite UI, saved-word Supabase tables/RLS/RPCs, account sync, existing allowance/entitlement foundations and Premium placeholders. Record baseline metrics and identify migration requirements. Use read-only production inspection; use isolated staging for implementation validation.
2. **English dictionary expansion and full accuracy review.** Establish a candidate word list, deduplicate against current data, add content in manageable internal batches, and validate the complete consolidated dataset. No intermediate downloadable ZIPs; provide one consolidated deliverable for the phase when complete and validated.
3. **English filter expansion and translation QA.** Implement categories and complete sense-level Simplified Chinese translations; test search/filter interactions and language switching.
4. **Favorite collections implementation.** Finalize the data model after schema/RLS audit, implement the in-site modal and collection management, then test cross-language membership, account isolation, sync and failure/concurrency behaviour.
5. **Visual-only Premium interface/navigation.** Implement presentation only; verify all payment/subscription/entitlement actions remain inactive.
6. **Optional English Lessons/Quiz/Flashcards expansion.** Proceed only if capacity remains and core acceptance criteria are met.
7. **Full QA and release preparation.** Run content validators, database/migration tests, RLS and ACL checks, authenticated browser tests, mobile/desktop responsive tests, account-switch and cross-device sync regression, translation/filter tests, existing-course regression and Cloudflare Pages preview checks. Report each evidence type separately; do not infer live OAuth or production behaviour from mocked tests.

## 4. Existing behaviour and non-regression requirements

- Dictionary word-grid search remains free and unlimited.
- Existing daily learning, lesson, quiz and flashcard allowance rules remain unchanged.
- Timezone/reset behaviour and successful-completion semantics remain unchanged.
- Existing learning progress, history, saved words, account switching, sign-in/out and cross-device synchronization must not regress.
- Chinese dictionary, lessons, Quiz, Flashcards and stroke-order behaviour remain intact.
- English course content must not display Chinese-only pinyin/character-structure UI.
- Translation changes must refresh dependent content immediately.
- Keep shared-device account switching available.
- Preserve mobile and desktop usability.
- Keep production branch/deployment and production database changes separately gated by explicit owner approval.

## 5. Legal, privacy, security and licensing review

A Malaysia-specific and general international legal-risk review is mandatory for this expansion. This is planning guidance, not legal advice or a compliance certification.

Review:
- Malaysia PDPA applicability and obligations, including transparency, purpose limitation, data minimisation, security, retention, access/correction, processors and cross-border transfers where relevant.
- International privacy and child/teen safeguards for the intended global 16+ audience; do not assume a single age threshold resolves every jurisdiction.
- Whether collection names and membership data are necessary and proportionate; avoid collecting or logging unnecessary behavioural data.
- User-facing explanation of any future Free/Premium collection cap and how downgrade affects existing collections.
- Content source provenance and licensing for new dictionary entries, definitions, translations and examples.
- Before actual Premium activation, review consumer protection, pricing/tax disclosures, cancellation/refund terms, recurring billing and payment-provider obligations.

No legal clearance, Premium launch approval or commercial-use licence is implied by this plan.

## 6. Release gates and reporting

Before staging preview is offered:
- Core scope is implemented and internally validated.
- Content baseline/addition/final counts and audit results are reported.
- Translation completeness and exception report is available.
- Collection CRUD, mixed-language membership, account isolation, sync and RLS tests pass.
- Existing dictionary, Chinese course, learning flows, allowances and account behaviour pass regression.
- Premium UI is demonstrably presentation-only.
- Supabase migration impact and staging status are documented; no production migration/write occurs without separate approval.
- Cloudflare Pages preview is checked and the exact preview reference is provided.

Before merge/release:
- Owner reviews staging preview and feedback is addressed.
- CI and required database/browser checks pass, with any explicitly accepted trade-offs recorded.
- Merge approval is obtained separately.
- Production database migration and production deployment remain separate owner-approved actions.

## 7. Current status / recovery point

- Plan approved on 2026-11-24; the owner subsequently instructed development to begin.
- Phase 1 repository/content/data audit is complete. The baseline contains 810 unique English entries; the read-only Favorite/saved-word review confirmed account-owned saved words with RLS and no existing collection CRUD/mixed-language membership.
- Phase 2 is complete on `feature/update-2-9-0-english-dictionary-collections`: 506 new English entries across seven source batches; 766 sense records; 1,316 projected unique English headwords; zero duplicate overlaps with the 810-entry baseline.
- The existing baseline now has 302 entries with 657 explicit sense records; all 176 multi-POS baseline entries have sense coverage, and all 810 baseline entries have at least two contextual examples. All 183 multi-POS expansion entries have separate POS-specific sense records.
- The baseline-aware Node validator, runtime equality/load-order checks and all three Playwright browser smoke tests passed in GitHub Actions run `45537066279` on commit `399ad92e06cd93bcc9f1cc6eabb7a7222c22d45c`.
- Internal model-assisted editorial QA is complete. This is not independent professional/native-speaker certification of every pronunciation or translation; that limitation is documented for release review.
- Phase 3 implementation is in progress; Phase 4 has not started. No staging preview has been created. Per owner instruction, do not prepare one until Phase 4 implementation and internal validation are complete.
- No Supabase schema, data or policy changes, production changes, merge or deployment have been made. Continue Phase 3 semantic/editorial and responsive regression review, then begin Phase 4 only after Phase 3 acceptance is met.


## 8. Implementation checkpoint — 2026-11-25

- Phase 1 is complete.
- Phase 2 is complete: 506 new English entries across seven source batches are integrated into `data/english-expansion.js`; the projected dictionary contains 1,316 unique English headwords and 766 sense records.
- All 183 multi-POS expansion entries have distinct POS-specific senses. The 810-entry baseline now has 302 entries with 657 explicit senses; all 176 baseline multi-POS entries have sense coverage, and every baseline entry has at least two contextual examples.
- Final QA passed in GitHub Actions run `45537066279` on commit `399ad92e06cd93bcc9f1cc6eabb7a7222c22d45c`: baseline-aware Node validation, runtime dataset equality, script load order and all three Playwright browser smoke tests.
- Internal model-assisted semantic/editorial and Simplified Chinese sense review is complete. It is not independent professional/native-speaker certification; that limitation is retained for release review.
- Phase 3 and Phase 4 have not started. The first staging preview remains withheld until Phase 4 implementation and internal validation are complete.
- No Supabase schema/data/policy changes, production merge/deployment, payment integration or Premium entitlement enforcement have occurred.


## 9. Phase 2 completion record — 2026-11-25

Phase 2 is formally complete. The 506-entry English expansion is integrated from seven source batches, with 766 sense records and a final projected English catalogue of 1,316 unique headwords. All 183 multi-POS additions now have separate POS-specific sense records, with no combined POS sense labels remaining. Thirty-eight further noun/verb definition/translation/example records were corrected after a focused semantic consistency audit.

The existing 810-entry baseline was refreshed and enriched: 302 entries now contain 657 explicit sense records; all 176 multi-POS baseline entries have sense coverage; all 810 entries have at least two contextual general examples; and no duplicate baseline headwords or missing core fields remain. Twenty additional high-frequency single-POS entries received 40 separate sense records. The refreshed audit is stored in `data/english-baseline-qa-audit.json`.

The 506 additions have zero duplicate headwords and zero overlap with the baseline. Required fields, Simplified Chinese sense translations, examples, approved categories, declared-POS coverage, and runtime equality pass. Latest full successful verification: GitHub Actions run `45537066279`, commit `399ad92e06cd93bcc9f1cc6eabb7a7222c22d45c`; all Node and Playwright browser checks passed.

Internal model-assisted editorial QA is complete, but it is not a substitute for independent professional/native-speaker certification of every lexical nuance, IPA accent variant or translation. This is a documented release-review limitation, not a claim of certified linguistic review.

Phase 3 and Phase 4 remain not started. Staging preview remains withheld until Phase 4 is implemented and internally validated. No Supabase schema/data/policy writes, production merge/deployment, payment implementation or Premium entitlement enforcement occurred during Phase 2.


## 10. Phase 3 implementation checkpoint — 2026-11-25

The owner confirmed Phase 2 complete and instructed immediate Phase 3 work. Core category/filter and translation-coverage implementation is now integrated on `feature/update-2-9-0-english-dictionary-collections`.

- Added `data/english-baseline-categories.js` for the 810 original English headwords. The 506 expansion entries already carry topic categories. All 1,316 entries now have at least one approved topic category; multi-category assignment is supported.
- Added `english-category-filters.js` and wired it into `index.html`. The ten approved English topic categories appear separately from the existing part-of-speech filters. Topic filtering composes with headword-only search, alphabet selection, saved-word filtering and pagination. English topic controls hide/reset for Chinese; Chinese category and pinyin filters remain intact.
- Added `scripts/dictionary/validate-english-phase3.mjs` to audit category coverage/labels and Simplified Chinese headword/sense translation presence across baseline and expansion content.
- Translation inventory: all 810 baseline headword definitions have Simplified Chinese translations; 657 explicit baseline sense records are translated. All 506 expansion headword definitions and 766 expansion sense records have Simplified Chinese translations. This is structural completeness, not professional/native-speaker certification.
- Combined category assignment counts (multi-category entries count in each category): Actions 442; Everyday Terms 379; Activities 62; Places 83; People & Relationships 68; Science & Technology 74; History & Culture 33; Nature & Environment 49; Education 68; Emotions & Descriptions 249.
- Added Playwright coverage for topic/search/POS composition, multi-sense translation switching, single-sense translation fallback and Chinese-course filter isolation.
- Final full CI run `45540254655`, commit `95b9253b5a796d4cb2a62b838690659bc599fffe`, passed all steps: existing Phase 2 validator, Phase 3 category/translation audit, Playwright setup, Chromium setup and six browser smoke tests. Earlier test runs failed on test assumptions/selectors; the tests were corrected and the final run is green.
- Malaysia/general legal and privacy check: the phase adds public editorial category metadata and UI only, with no new personal-data collection, tracking, external processor, Supabase change, or payment/subscription feature. Existing PDPA, global 16+ age screening, content-provenance/licensing and privacy obligations remain applicable; this is not legal clearance.
- No Supabase schema/data/policy write, staging preview, production merge/deployment, payment integration or Premium enforcement occurred. Dictionary search remains free and unlimited; proposed 16-Free/40-Premium folder caps remain future planning only.
- **Phase 3 remains in progress** pending broader semantic/editorial spot checks of category assignments and Chinese translations, plus responsive and interaction regression. Phase 4 remains blocked until Phase 3 acceptance criteria are satisfied. Staging preview remains withheld until Phase 4 implementation and internal validation are complete.


### Phase 3 follow-up — editorial spot checks and mobile regression (2026-11-25)

- An additional semantic scan manually corrected 89 clearly specialist baseline headwords that had been too broadly classified, including science/environment, history/culture and education terms.
- Latest combined category assignment counts: Actions 442; Everyday Terms 307; Activities 62; Places 85; People & Relationships 71; Science & Technology 147; History & Culture 46; Nature & Environment 73; Education 70; Emotions & Descriptions 233.
- Added a 390px narrow-viewport Playwright test for filter wrapping, horizontal overflow and an actual Places-filter selection.
- Latest full CI run **45540937597**, commit `82ba00e4d6913eede952a3d7f0aa998d93054784`, passed both data validators, Playwright/Chromium setup and all seven browser tests.
- This improves automated and targeted category QA but does not replace a full human/native-speaker review of every category or Chinese translation. Phase 3 remains in progress; Phase 4 remains blocked.


### Phase 3 translation-content audit strengthening — 2026-11-25

- The Phase 3 validator now requires every headword/sense Chinese translation to contain CJK characters and rejects known placeholder/fallback phrases, in addition to checking field presence and category coverage.
- Latest audit: 810/810 baseline headword translations, 657/657 baseline sense translations, 506/506 expansion headword translations and 766/766 expansion sense translations present; zero non-CJK translation fields and zero placeholder translations.
- Targeted sense-alignment spot checks covered 20 high-frequency baseline entries and 8 expansion entries. The sampled multi-meaning Chinese senses remained distinct and context-appropriate; this does not certify every translation.
- Latest CI run **45541339325**, commit `48ec2caabe3e8dae3fa223380efd9d51852ca6e8`, passed both data validators and all seven browser tests.


### P1 visual-only Premium information UI — implemented (2026-11-25)

- Added a global-header “Premium plan” entry and an in-site Free/Premium comparison dialog.
- The copy clearly identifies Premium and Collections as future proposals, not currently available. It states dictionary search remains free and unlimited, proposed Free/Premium folder capacities are 16/40 once Collections launches, and future Premium value may include higher daily learning allowances and additional organisation benefits.
- No checkout, payment, purchase, subscription, billing portal, entitlement mutation, allowance change or Supabase integration exists in this UI.
- Added keyboard handling, focus restoration/containment and narrow-mobile responsive styling. Playwright checks confirm future-only copy, no purchase action and mobile fit.
- Latest CI run **45541902319**, commit `0279d056fa1b11c0f31b1263ac918daacab0edcd`, passed both validators and all nine browser tests.
- Malaysia/general legal check: no transaction or new personal-data processing is introduced. Payment, recurring billing, tax, consumer disclosure, cancellation/refund and payment-provider obligations must be reviewed before any actual Premium activation. Folder capacities remain proposals only.


### Phase 3 expanded interaction regression — 2026-11-25

- Added coverage for all ten topic categories, verified each returns entries, checked topic-scoped pagination across five Actions pages, and verified switching to Chinese resets the English topic selection.
- Expanded Premium UI regression for future-only copy, no purchase action, Escape/focus restoration and mobile fit.
- Latest full CI run **45542196426**, commit `70f3e27486a8609aa11c22c29fae6529cb94fe09`, passed both validators and all ten browser tests.
- Core implementation is integrated; broader semantic/editorial review remains open. Phase 3 remains in progress and Phase 4 is blocked.


### Expansion-data translation and category regression — 2026-11-25

- Added browser checks for an expansion entry's explicit multi-sense Chinese translations and live English/Chinese switching, plus category filtering of an expansion-only headword.
- Latest full CI run **45542376568**, commit `234c0b2edb4b61e8d6dac0ed03c52db8c4a15083`, passed both validators and all ten browser tests.


## 2026-11-25 — Phase 3 completion checkpoint

**Phase 3 is complete. Phase 4 is now the next development phase, but has not been started.** No staging preview has been created.

### Full-catalogue editorial and structural audit

- Added `scripts/dictionary/audit-english-catalogue.mjs`, a reproducible audit covering all 810 baseline entries and 506 expansion entries (1,316 total).
- Latest audit: zero duplicate headwords, missing required fields, invalid parts of speech, insufficient examples, duplicate examples, duplicate senses, multi-POS entries lacking sense coverage, missing/unapproved topic categories, or structurally incomplete Chinese translations.
- Reviewed all 15 concise-definition flags manually/model-assisted; all are intentionally concise, contextually supported definitions rather than omissions. The report records 15 reviewed and accepted, zero unresolved short-definition candidates.
- The report is preserved as the `u2-9-0-english-catalogue-editorial-audit` artifact in the final QA run.

### Editorial corrections and coverage

- Corrected 14 expansion sense definitions/translations to improve self-contained meaning and English–Chinese alignment, including lecture, father, mother, pedestrian, favourite, cycle, picnic, design, golf, kayak, breeze, coral, telephone and text message.
- Corrected the headword-level Chinese definition alignment for pedestrian, breeze and coral.
- Translation coverage remains complete: baseline 810/810 headwords and 657/657 senses; expansion 506/506 headwords and 766/766 senses. No translation fields lack CJK characters or contain detected placeholders.
- Category assignments cover all 1,316 entries, with 1,536 total assignments across the ten approved categories.

### Interaction and responsive QA

- All ten English topic categories return results; topic filtering composes with headword search and POS filtering and scopes pagination correctly.
- Switching between English and Chinese resets/hides the English topic filter without disturbing Chinese character filtering.
- Multi-sense and expansion translation switching is verified, including the corrected 14-entry sense translations.
- Premium information dialog remains visual-only, clearly future-only and without payment, checkout, subscription or entitlement changes.
- Final full CI run **45544792646**, commit `278a2c20472988935f615f1e0b2bab1d551fadde`, passed both dictionary validators, the whole-catalogue audit, Playwright/Chromium setup, all **11 browser tests**, and audit-artifact upload.

### Release boundary and legal/privacy review

- No Supabase schema, data, RLS policy, RPC or production database changes were made. No production merge/deployment or staging preview was created.
- No new personal-data collection, tracking, third-party processor, payment, subscription or Premium entitlement behaviour was introduced.
- Malaysia/general legal planning remains: existing PDPA/privacy, 16+ audience, content provenance/licensing and accessibility obligations remain applicable. Actual Premium activation requires separate consumer, payment, tax, cancellation/refund and processor review. This is planning, not legal clearance.
- Dictionary word-grid search remains free and unlimited. Proposed folder limits remain future policy only.
- Phase 4 may now begin on the feature branch, following the approved collections data/security design. Staging remains withheld until Phase 4 is implemented and internally validated.


## 11. Phase 4 kickoff checkpoint — 2026-11-25

Phase 4 has started on feature/update-2-9-0-english-dictionary-collections after the owner confirmed Phase 3 completion and instructed development to proceed.

### Initial implementation

- Added favorite-collections.js with the first implementation of the Your collections panel, in-site folder creation/rename/delete dialogs, collection detail view, mixed English/Chinese saved-word selection, membership add/remove, empty/loading/error feedback, account-aware refresh and optional Realtime refresh.
- Wired the module to load after the main application script through account-deletion.js.
- Added a Playwright browser spec for mocked collection CRUD, mixed-language membership and the invariant that collection deletion does not delete Favorite words.
- Extended the U2.9.0 GitHub Actions workflow to include the new browser spec and collection-related paths.
- Added a static SQL regression test for RLS, policy counts, cascading foreign keys, name uniqueness and grants.

### Database foundation

- Added public.favorite_collections and public.favorite_collection_items in the isolated staging Supabase project only.
- Staging migration ledger version: 20261125041816 (swiftdictionary_update_2_9_0_favorite_collections).
- Both tables have RLS enabled. Four collection policies enforce owner-scoped SELECT/INSERT/UPDATE/DELETE; three membership policies enforce owner-scoped SELECT/INSERT/DELETE and require ownership of both the collection and the saved-word row.
- Added a case-insensitive per-user unique folder-name index, owner/creation and membership lookup indexes, and cascading foreign keys from membership to both collection and saved-word rows.
- Names are trimmed and limited to 1–48 characters. No Free/Premium folder cap is enforced.
- Read-only post-checks confirmed RLS and all seven policies, expected indexes and cascade constraints. Existing staging saved_words count remained 14; the new collection tables remain empty after schema checks.
- Supabase security advisor showed no new collections-specific finding; the same pre-existing private-schema RLS informational findings and leaked-password-protection warning remain.

### Remaining Phase 4 acceptance work

- Verify the actual rendered Favorite words anchor and panel placement.
- Run and fix the new Playwright suite and all existing U2.9.0 regression suites.
- Complete authenticated staging CRUD and adversarial two-account RLS tests, including direct attempts to attach another account’s saved word to a folder.
- Verify cross-device refresh/Realtime fallback, account switching, duplicate names, long names, error handling, concurrency, keyboard accessibility and desktop/mobile layouts.
- Run database regression checks and Supabase advisors after any follow-up changes.
- Update privacy/terms copy as needed before release; collections store user-created folder names and references to existing account-owned saved words. Malaysia PDPA and general international privacy/16+ safeguards remain applicable. This is planning, not legal clearance.

No staging preview has been created. The first staging preview remains withheld until Phase 4 is fully implemented and internally validated. Production Supabase, production data, main, deployment, payment/subscription and entitlement enforcement remain untouched. Dictionary search remains free and unlimited; existing learning allowances remain unchanged.


### Phase 4 SQL regression follow-up — 2026-11-25

The static collections SQL regression script was executed against isolated staging and passed with a rollback. It verifies RLS enablement, all seven owner-scoped policies, auth.uid()/owner predicates, membership checks against both collection and saved-word ownership, cascading foreign keys, case-insensitive name uniqueness, anonymous access denial and authenticated grants. This is schema/policy-structure validation, not an adversarial two-account API test. The new Playwright spec and workflow are committed, but successful CI execution remains unverified.


### Phase 4 mocked browser QA follow-up — 2026-11-25

GitHub Actions run 45547406099 passed on commit e4a605bc4ee880882b2b7ed998450e7f014eb27d. All 12 browser tests passed, including Favorite Collections mocked CRUD and mixed-language membership; all English dictionary validators and the whole-catalogue audit passed. Earlier test failures were fixed by replacing hidden section containers with divs and targeting the intended membership row rather than assuming sort order. This is mocked Supabase coverage, not live authenticated API verification. The module request through the account-deletion.js loader is visible in the browser logs. Real dashboard placement, live staging CRUD, cross-account RLS behaviour, responsive/accessibility checks and staging preview remain outstanding.


### Phase 4 Realtime and loader checkpoint — 2026-11-25

Added and applied the isolated staging Realtime migration 20261125043448_swiftdictionary_update_2_9_0_favorite_collections_realtime.sql, adding only favorite_collections and favorite_collection_items to supabase_realtime. The strengthened SQL regression, including publication membership, passed with rollback. The frontend loader now runs from supabase-config.js at DOMContentLoaded after core app bindings are declared, and loads favorite-collections.js?v=2.9.0-p4 to avoid stale cache. A new real-app-shell loader test has been added; a new CI run is being triggered. The prior run 45547652317 passed all 12 tests before this new loader test and Realtime migration. Live authenticated API tests, two-account authorization, actual dashboard placement and cross-device event delivery remain outstanding.


### Realtime and loader CI result — passed

Run 45547652317 passed all 13 browser tests, including the real application-shell test that verifies the Favorite Collections module loads through supabase-config.js after the core app. Run 45547784739 passed all 13 browser tests after the SQL regression gained a Realtime publication assertion, and run 45547828600 passed after workflow path filters were corrected. The strengthened SQL regression was separately executed against staging and passed. CRUD browser interactions use a mocked Supabase client; live authenticated CRUD, two-account authorization and actual Realtime delivery remain unverified.


### Phase 4 dashboard placement — verified

Run 45548152492 passed all 13 Playwright tests. The app-shell DOM assertion confirms the Favorite words profile card and Your collections panel are adjacent in the intended order, with the collection panel immediately below Favorite words and before Learning progress. The module loader also passed. Visual review on signed-in desktop/mobile sessions, authenticated staging CRUD, two-account authorization and actual Realtime delivery remain open.


### Phase 4 expanded regression and staging integrity — passed

Run 45548503961 passed all 13 Playwright tests. Mocked collection coverage now includes empty and duplicate names, mixed English/Chinese membership, create/rename/delete, removal without deleting saved words, and account switching between two mock users. The test double was fixed to read the active account dynamically. Folder counts were optimized to a single membership query. The SQL schema regression passed after adding the Realtime publication assertion. A post-migration staging check confirms 14 saved words remain, zero collection/membership rows exist, and both tables are published to supabase_realtime. Supabase security advisor findings remain the same ten informational private-schema notices and one leaked-password-protection warning; no collection-specific finding appeared. Live authenticated API/RLS testing, actual Realtime delivery and signed-in visual/accessibility review remain outstanding.


### Phase 4 saved-word schema alignment

Staging schema inspection showed saved_words has only id, user_id, course and word columns (no created_at). The collection picker was corrected to order by id descending, browser fixtures were aligned, and the SQL regression now asserts the existing schema contract. The strengthened SQL regression passed against staging; browser CI for this correction is in progress. No staging preview or production change has occurred.


### Phase 4 schema-aligned browser QA — passed

Run 45548857974 passed all 13 browser tests. The saved-word picker uses the actual saved_words.id column because staging has no created_at; the SQL regression now verifies the exact id/user_id/course/word schema and passed. Browser coverage includes duplicate/blank names, mixed-language memberships, CRUD, saved-word preservation, two-account UI switching, loader initialization and Favorite words placement. Staging still has 14 saved words, zero collections/memberships and both tables in supabase_realtime. The security advisor has no new collections-specific finding. Two new indexes appear unused while tables are empty but are retained for expected lookup/FK patterns. Live authenticated API/RLS, real Realtime delivery and signed-in device visual/accessibility checks remain outstanding.


### Secure private Realtime Broadcast redesign — 2026-11-25

- Replaced the initial Postgres Changes subscription with account-scoped private Broadcast topics (favorite-collections:<auth.uid()>). Supabase documents that DELETE events cannot be filtered and DELETE events are not RLS-filtered; a table-level Postgres Changes listener therefore was not acceptable for user-owned collection data.
- Added a realtime.messages SELECT policy restricted to authenticated users whose auth.uid() matches the current private topic and whose extension is broadcast.
- Added a trigger function in the non-exposed private schema. It is SECURITY DEFINER, uses an empty search_path, resolves the owner from the collection or saved-word parent for cascading membership deletes, and has EXECUTE revoked from PUBLIC, anon and authenticated. Only table triggers can invoke it.
- Added AFTER INSERT/UPDATE/DELETE triggers to both collection tables. Client subscriptions now use private=true and handle INSERT, UPDATE and DELETE Broadcast events. Account switching removes the previous channel and creates the new user's private topic. A visible status message appears if the channel reports an error or timeout.
- Removed both collection tables from the supabase_realtime Postgres Changes publication in migration 20261125050329, so the app cannot accidentally fall back to unfiltered DELETE events.
- Staging migrations now include 20261125050023 (private Broadcast policy/triggers) and 20261125050329 (remove Postgres Changes publication). The SQL regression passed after asserting the topic-scoped policy, both triggers, SECURITY DEFINER + empty search_path, revoked API-role execution, and no direct Postgres Changes publication membership.
- The authenticated two-account SQL regression also passed in a rollback transaction. It checks each account's own CRUD, cross-account SELECT/UPDATE/DELETE denial, rejection of membership that references another account's collection or saved word, and rejection of user_id reassignment. No fixture rows remain.
- Important staging runtime condition: no Realtime WebSocket client has yet connected to this staging project, so realtime.messages currently has no daily partitions. Supabase creates its rolling message partitions when a client first joins over WebSocket (and the janitor maintains them while the project remains active). Calling a database broadcast before the first socket connection logs WarnSendingBroadcastMessage: no partition of relation messages found for row; this is expected before any listener exists, not evidence that the trigger function is malformed. We deliberately did not create or alter Supabase-managed objects in the locked realtime schema. The first authenticated staging-preview session must establish the private channel; then actual cross-device delivery can be verified.
- Supabase security advisor has no collections-specific finding. Existing findings remain 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning. Performance advisor continues to report unused indexes in empty tables; the saved-word FK index remains justified for cascade cleanup.
- Privacy/legal review: collection names and saved-word references are user-created account data. Malaysia PDPA and general international privacy obligations remain a pre-publication review item. The current Terms page is still explicitly unpublished; no legal approval or public terms/privacy representation is claimed.
- No production database, main branch, deployment or staging preview was changed or created by this work.


### Phase 4 staging-preview readiness — 2026-11-25

- Implementation and internal validation are complete enough for a controlled staging preview. No preview deployment has been created yet; production and main remain untouched.
- Latest GitHub Actions run 45550967547 passed all 13 Playwright tests. Coverage includes collections CRUD, mixed English/Chinese membership, duplicate/blank names, preserving saved words on membership removal, two-account UI isolation, stale-response protection during account switching, private Broadcast configuration/event handlers, channel replacement on account switch, app-shell loader, Favorite words placement, mobile viewport and keyboard dialog behaviour, and desktop no-overflow checks.
- The staging SQL regression passed after the private Broadcast redesign. It validates owner-scoped collection/membership RLS, cross-account SELECT/UPDATE/DELETE denial, foreign collection/saved-word membership rejection, user_id reassignment denial, anon table access restrictions, topic-scoped private Broadcast receive policy, both triggers, SECURITY DEFINER with empty search_path, and no API-role EXECUTE grant.
- Final staging integrity query: saved_words 14; favorite_collections 0; favorite_collection_items 0; collection tables in supabase_realtime publication 0; private Broadcast policy 1; broadcast triggers 2. The two collection tables are intentionally removed from Postgres Changes because DELETE events cannot be filtered or RLS-authorized there.
- Supabase migration history confirms four Phase 4 migrations applied: base collections (20261125041816), initial Realtime publication (20261125043448), private Broadcast triggers/policy (20261125050023), and removal from Postgres Changes (20261125050329).
- Supabase health advisor: no findings. Security advisor: no collections-specific finding; existing unrelated findings remain 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning. Performance advisor: 15 unused-index notices overall; the collection saved-word FK index is expected to be unused while the empty collection tables have no membership rows.
- Two-account RLS was exercised in a transaction as the authenticated PostgreSQL role using two existing staging accounts; all test data was rolled back. This is a real database RLS execution, not a browser REST/JWT test.
- Live Realtime delivery is the one acceptance check that requires a connected authenticated browser session. The staging project currently has no Realtime WebSocket client history and no daily messages partitions. Supabase creates the rolling partitions when a client first joins over WebSocket. The first staging-preview session must verify that the private channel reaches SUBSCRIBED and that changes on a second signed-in device cause the expected refresh. The app shows a fallback status if the channel errors or times out, and refreshes on focus/visibility return.
- Staging preview readiness is therefore approved for controlled user acceptance, with live authenticated cross-device delivery explicitly marked as the first preview smoke test. This is not a claim that live two-device delivery has already been observed.
- Legal/privacy: Malaysia PDPA and general international privacy review remains a pre-publication item for user-created collection names and account-linked saved-word references. The Terms page remains an unpublished placeholder; no legal clearance is claimed.


### Interim staging review opened — 2026-11-25

- Opened PR #17, **SwiftDictionary Update 2.9.0 — Staging review checkpoint (Phases 1–4)**, solely to organize and trigger a controlled preview review. PR: https://github.com/WhiteWingCat/swiftdictionary/pull/17
- Cloudflare Pages reported a successful preview deployment for commit 72152496c40eede6dafbdf1bdd0c7355225a1f1e. Branch preview: https://feature-update-2-9-0-english.swiftdictionary.pages.dev (unique deployment preview: https://9abfc9c5.swiftdictionary.pages.dev).
- This is an interim checkpoint, not a final U2.9.0 release. Phase 5 (visual-only Premium interface/navigation) and Phase 6 (optional aligned English Lessons/Quiz/Flashcards content expansion) remain open, followed by full QA and release preparation.
- The first user acceptance smoke test is authenticated private Broadcast channel subscription and actual cross-device collection refresh. Mocked browser tests and rollback-based SQL RLS tests have passed, but live two-session Realtime delivery has not yet been observed.
- The preview is routed through the existing build.sh environment guard to the isolated staging Supabase project (ivatvkfrtifgfheeaelj); production Supabase and the main branch have not been modified or deployed.
- The PR explicitly prohibits merge/production rollout until all remaining phases, final release gates and owner approval are complete. Free unlimited dictionary search and existing learning allowances remain unchanged.
- At PR creation, Cloudflare Pages preview was successful. The PR-triggered regression workflows were still running; a separate Cloudflare Workers Builds check for swiftdictionary-testing reported failure and is not the Pages deployment. Investigate/triage that check before final release sign-off.


### Phase 4 owner feedback refinements — 2026-11-25

- Owner reviewed the first Phase 4 staging preview and requested a dimmer New folder action, inline expandable folders, a folder actions menu, assignment from the shared word detail panel, automatic membership removal when a saved word is unsaved, relevant button shadows, and revised panel description.
- Implemented the revised interaction on branch `feature/u2-9-0-collections-feedback`; current review PR is #18: https://github.com/WhiteWingCat/swiftdictionary/pull/18. Earlier PR #17 was closed without merging and superseded by PR #18.
- Folder contents now expand inline into English and Simplified Chinese word-card groups. Selecting a word opens the shared dictionary detail drawer. Folder menu actions are custom in-site UI (Add words / Rename / Remove), not native browser dropdowns.
- The detail drawer includes Add to collection beside the Favorite button, visible only when the word is saved. Users can assign the word to multiple folders or remove its memberships there.
- Verified the existing `favorite_collection_items.saved_word_id` foreign key already uses `ON DELETE CASCADE`; no schema migration was necessary. Expanded the staging SQL regression to delete a saved word inside a rollback transaction and assert its memberships are removed.
- Hardened private Realtime channel cleanup on sign-out/account changes and added per-folder request sequencing so stale asynchronous loads cannot overwrite a newer collapsed/reopened state.
- GitHub Actions on commit `25f10b2dfc28837e6fc799cff44b1b0c8215c763`: Cloudflare Pages deployment succeeded; build-routing, English data validation, PostgreSQL migration/ACL/allowance regressions, Chinese static/browser checks, authenticated Supabase integration, Flashcards and Chromium regression jobs passed. The browser regression suite reported 79 passed and 22 skipped, including the three new Your Collections tests. A separate Cloudflare Workers Builds check for `swiftdictionary-testing` failed; it is distinct from the successful Cloudflare Pages deployment and remains a separate infrastructure item.
- The rollback SQL regression passed on isolated staging. Afterward the staging row counts remained saved_words 14, favorite_collections 1, favorite_collection_items 3; these reflect the owner's staging test data and were preserved. Supabase health advisor returned no findings; security advisor showed only the pre-existing private-schema informational notices and leaked-password-protection warning, with no new collections-specific finding.
- Current branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev (deployment: https://c780307d.swiftdictionary.pages.dev). Preview is routed to isolated staging Supabase. No production database, main branch or live deployment changes were made.
- Phase 4 remains subject to owner acceptance of this revised preview. Phases 5 (visual-only Premium navigation/interface preparation) and 6 (optional aligned English Lessons/Quiz/Flashcards content expansion) remain open, followed by final full QA and release preparation. No subscription, allowance, folder-cap or payment enforcement was activated; dictionary search remains free and unlimited.
- Legal/privacy: this refinement reuses existing account-owned collection names and saved-word references; no new personal-data category or third-party processor was introduced. Malaysia PDPA and general international privacy review remain pre-publication requirements.

- Preview pointer follow-up: a docs-only progress-record commit `cc4081a4663af62d2ab53886d6474b2635be73de` redeployed the same application code successfully. The branch preview URL remains https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev; latest deployment-specific URL is https://4fa9c4e2.swiftdictionary.pages.dev. No application source changed in that docs-only commit.


## 12. Owner feedback update — 2026-11-25 (Phase 4 refinement and Phase 5 expansion)

The owner reviewed the controlled Phase 4 staging preview and supplied final Phase 4 visual/interaction corrections while authorising Phase 5 to proceed in parallel.

### Phase 4 final staging corrections

1. **Folder row layout:** render each collection folder as a full-width horizontal row, with the expand/collapse affordance and folder name/count aligned in the main row and the overflow actions at the far right. Do not stack the folder title and actions into a narrow vertical/column arrangement. Preserve responsive wrapping only where required on small screens.
2. **No per-word X/remove control:** remove the X button from every saved-word card inside Your Collections. Collection membership is managed exclusively through the shared word detail panel's **Add to collection** control, which allows the user to uncheck/remove that folder membership. This avoids duplicate removal affordances and keeps one authoritative interaction.
3. **Favorite-matched surface:** use the same current UI surface/background treatment as the Dashboard **Favorite words** panel for Your Collections and its word cards. Do not revive the legacy dark-panel/background treatment. The prohibition on the old dark-background design applies to all new and revised UI in this and future updates; use the current theme tokens/surface system, not hard-coded legacy dark colors.

The Phase 4 feature branch and existing PR #18 remain the base for these corrections. Do not merge or deploy to production. Retain the account-owned schema/RLS/private Broadcast design, mixed-language support, shared detail panel and all passing regression coverage.

### Phase 5 — dedicated Premium Plan page (expanded owner requirements)

The earlier Premium information dialog is superseded. Clicking **Premium plan** must navigate to a dedicated in-app page/route, not open a prompt, browser dialog, or modal. Provide an obvious in-app way to return to the prior app page, and ensure direct loading/refresh of the Premium route works with the existing static/hash routing model.

The page must show a complete, readable Free-versus-Premium comparison. Do not hide, abbreviate, collapse by default, or omit any of these six comparison areas:

1. **Dictionary word-grid search:** Unlimited for both Free and Premium. This must be prominent and must never imply that search is a paid feature.
2. **Daily Learning Capacity:** Free: 1 completion per day for each of Daily Topic, Daily Application, Daily Discovery and Daily Revision (four category allowances, shared between English and Chinese). Premium: 3 completions per day for each of those four categories (also shared between courses). Successful completion consumes an allowance; starting, resuming or abandoning does not.
3. **Permanent Lessons Daily Allowance:** Free: 5 new permanent lesson starts per local day. Premium: 15 per local day. Resuming an unfinished lesson and reviewing a completed lesson remain free and do not consume another start.
4. **Quiz Daily Allowance:** Free: 1 new Quiz session per local day. Premium: 3 per local day.
5. **Flashcard Daily Allowance:** Free: 3 new Flashcard games per local day. Premium: 10 per local day.
6. **Collections folder capacity:** Free: up to 16 folders; Premium: up to 40 folders. These capacities are still proposed future entitlements and are not enforced in U2.9.0. Label them clearly as proposed/planned, not currently active. Existing folders must never be deleted as a result of a future downgrade; the recommended future behaviour remains to preserve existing folders and block new creation above the Free cap until within the cap or Premium is regained, pending future owner approval.

All daily figures above are the configured staging entitlement values verified read-only in `public.learning_plan_limits` on 2026-11-25. They describe the current entitlement configuration, not a purchase offer. Daily reset uses the learner's configured local timezone. The four Daily Learning category limits are shared across English and Chinese, not doubled by switching course.

### Premium page presentation and strict implementation boundary

- Use the current light/neutral theme surfaces and existing design tokens. Never use the old dark-background design.
- Make the page polished, clear and responsive. Use restrained card elevation/drop shadows, generous spacing, hierarchy, and subtle entrance/hover transitions where appropriate. Respect `prefers-reduced-motion`.
- Show the six areas as explicit comparison rows/sections with complete values and explanatory notes. On mobile, preserve all details in a readable stacked comparison; do not truncate or hide rows.
- Premium remains informational only. Do not add checkout, payment provider, purchase, subscription activation, billing portal, entitlement mutation, plan switching or allowance enforcement. Do not imply that Premium is currently available to buy.
- Keep dictionary search unlimited for both plans and keep all existing entitlement/allowance values unchanged.
- The 16/40 folder caps remain visual proposals only. Do not enforce them in the client or database, and do not alter collection creation behaviour in Phase 4.
- Keep the page accessible: semantic headings/table or equivalent, keyboard navigation, visible focus, sufficient contrast, reduced-motion support and direct-route fallback.

### Phase 5 acceptance tests

- Clicking Premium plan navigates to the dedicated page and does not open a modal/dialog or browser prompt.
- Direct route load and refresh work; browser back/forward navigation is coherent.
- Both plans visibly list all six comparison areas and every exact value above.
- Unlimited dictionary search is stated for Free and Premium.
- Daily Learning notes state the per-category and cross-course shared nature, and successful-completion semantics.
- Lesson notes distinguish new starts from resume/review.
- Collection capacities are clearly marked proposed/planned and no enforcement exists.
- No purchase/payment/subscription/entitlement mutation action or external payment request is present.
- Desktop and mobile visual checks pass; animations respect reduced-motion settings.
- Existing dictionary, learning, account, collections and allowance regression tests continue to pass.

### Updated sequencing and release gate

Phase 4 final feedback corrections and Phase 5 dedicated-page work may proceed concurrently on the same U2.9.0 feature branch, with coordinated edits to avoid conflicts. Phase 6 remains optional and must not delay the requested staging preview. After both tracks are complete, run the consolidated U2.9.0 validation suite and deploy a controlled Cloudflare Pages preview routed only to isolated staging Supabase. Do not merge to `main`, apply production migrations or deploy production without separate explicit owner approval.

### Legal/privacy check

This Phase 5 page only presents already configured allowances and proposed folder capacities; it must not collect new personal data or initiate a transaction. The distinction between configured entitlement limits and an unavailable purchase offer must be explicit to avoid misleading consumer-facing claims. Before any actual Premium sale or activation, conduct a fresh Malaysia-specific and international legal review covering PDPA applicability, controller/processor roles, cross-border processing, consumer disclosures, pricing/tax, recurring billing, cancellation/refunds and payment-provider terms. The 16+ audience and existing privacy/retention/legal questions remain open. This is planning guidance, not legal advice or compliance clearance.


## 13. Implementation checkpoint — Phase 4 feedback and Phase 5 dedicated page — 2026-11-25

The owner feedback has been implemented on `feature/u2-9-0-collections-feedback` (PR #18 remains open; no merge or production release was performed).

### Phase 4 feedback implementation

- Collection folder cards now occupy one full-width row. The folder toggle/name/count and right-aligned overflow menu remain on the same horizontal line.
- Removed the per-word X/remove button from Your Collections. Membership removal is handled through the shared saved-word detail panel's **Add to collection** picker.
- Your Collections copies the Favorite words card class so its surface/background matches the adjacent Dashboard card, rather than introducing a separate legacy panel treatment.
- Reworked collection menus/dialogs to a neutral light surface with softer borders/shadows and reduced-motion handling. No old dark-background visual treatment is retained in this module.

### Phase 5 implementation

- Replaced the old Premium modal behaviour with navigation from the existing global **Premium plan** control to a standalone `premium-plan.html` page. The page supports direct load/refresh and a back-to-app link.
- The page displays all six required comparison rows without collapsed details:
  - Dictionary word-grid search: Unlimited for Free and Premium.
  - Daily Learning: Free 1 and Premium 3 successful completions per day for each of Daily Topic, Daily Application, Daily Discovery and Daily Revision.
  - Permanent Lessons: Free 5 and Premium 15 new starts per local day.
  - Quiz: Free 1 and Premium 3 new sessions per local day.
  - Flashcards: Free 3 and Premium 10 new games per local day.
  - Collections: Free 16 and Premium 40 folders, explicitly labelled proposed future benefits only.
- Added full explanatory notes for shared English/Chinese daily categories, successful-completion charging, local timezone resets, lesson resume/review behaviour and the inactive/proposed folder caps.
- The page is responsive, uses a light neutral surface with restrained shadows and transitions, and respects `prefers-reduced-motion`.
- No payment, checkout, subscription, billing, plan switch, entitlement mutation or folder-cap enforcement was added.

### Read-only entitlement verification

A read-only query against the isolated staging project's `public.learning_plan_limits` confirmed:
- Free: `daily_topic=1`, `daily_application=1`, `daily_discovery=1`, `daily_revision=1`, `lesson=5`, `quiz=1`, `flashcard=3`.
- Premium: `daily_topic=3`, `daily_application=3`, `daily_discovery=3`, `daily_revision=3`, `lesson=15`, `quiz=3`, `flashcard=10`.
- No Supabase write or migration was performed for this feedback round. The 16/40 folder caps remain presentation-only proposals.

### Automated validation and preview deployment

- Updated the collections Playwright tests to verify horizontal folder rows, Favorite words surface matching, absence of X buttons, detail-picker membership removal/reassignment and dedicated Premium page navigation/content/mobile fit.
- Replaced earlier Premium-dialog tests with dedicated-page tests.
- GitHub Actions run **45576573180** passed the dictionary validators, whole-catalogue audit, artifact upload and all **15 Playwright browser tests**.
- Cloudflare Pages deployed commit `9a0752c68ab5161fea88adcbfb3acb9a153725a0` successfully to isolated staging:
  - Branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev
  - Unique deployment: https://60523dea.swiftdictionary.pages.dev
- Cloudflare build-routing guard passed. The broader PR regression suite was still running at this checkpoint; do not treat the entire cross-version suite as complete until all relevant checks report final status.
- The separate Cloudflare Workers Builds check for `swiftdictionary-testing` failed. It is distinct from the successful Cloudflare Pages deployment; investigate/triage separately before final release sign-off.

### Remaining staging acceptance and release boundary

- Owner should review the new preview on desktop and mobile, including the Premium route and actual signed-in Collections experience.
- The first signed-in preview session must still verify the private Realtime channel reaches SUBSCRIBED and then test cross-device collection refresh. Automated mocked browser tests and rollback-based RLS checks are not evidence of live cross-device delivery.
- Continue waiting for the remaining PR checks and investigate any failure before declaring consolidated U2.9.0 QA complete.
- No merge, production Supabase migration, production deployment, Premium sale/activation or folder-cap enforcement is authorised by this checkpoint. Dictionary search remains unlimited for Free and Premium.

### Legal/privacy check

This feedback round adds no new personal-data category, processor, tracking, transaction or entitlement mutation. The comparison page clearly distinguishes existing configured learning allowances from a future purchase offer and labels folder limits as proposals. Existing Malaysia PDPA, international privacy, 16+ audience, content licensing and unpublished Terms/privacy review remain open. Any actual Premium launch requires a separate legal and consumer/payment review; this is planning, not legal clearance.


## 14. Owner feedback — theme clarification, active folder capacity, grid sizing and Phase 6 start — 2026-11-25

The owner clarified the visual direction and approved the 16/40 collection folder limits as active mechanics. This section supersedes the earlier statements in Sections 12–13 that the folder limits were only proposals. The Premium page's folder capacity values are now active plan limits for accounts whose entitlement is Free or Premium; Premium itself remains unavailable for purchase and no entitlement activation/payment flow is introduced.

### 14.1 Theme clarification

- Keep the existing SwiftDictionary dark overall page background.
- Use the current deep-blue dashboard panel surface (the Favorite words panel treatment) for the Premium page's hero, comparison table, notes, and relevant secondary panels.
- Apply matching dark-blue surfaces to Your Collections custom dropdown menus, dialogs/prompts and text inputs. Do not introduce white surfaces in these application components.
- Retain readable contrast, soft shadows, restrained blue accents, subtle motion and reduced-motion support.
- Preserve intentionally paper-white stroke-order drawing surfaces; those are functional writing canvases, not UI panels.

### 14.2 Active Collections capacity

- Free account: maximum **16** folders.
- Premium account with a valid active entitlement: maximum **40** folders.
- No count, remaining-capacity indicator or capacity meter is shown in Your Collections.
- When the user attempts to create another folder at the limit, show an in-site accessible error that names the account's plan and limit and explains that an existing folder must be removed before creating another.
- Existing folders and memberships are never automatically deleted, including if a Premium entitlement later expires or changes to Free. If an account is above the Free limit after downgrade, existing folders remain available; new creation is blocked until below the Free limit or Premium access is restored.
- Enforce the limit in PostgreSQL, not just the UI. Authenticated direct INSERT is revoked and creation goes through `public.create_my_favorite_collection(text)`, backed by a private SECURITY DEFINER implementation. The implementation derives the user from `auth.uid()`, checks the active entitlement and validity dates, serializes creates per user with a transaction-scoped advisory lock, counts the user's existing folders, then inserts only below the correct limit. Invalid/expired/missing entitlements use Free.
- The folder-cap migration is staging-only: `20261125101500_swiftdictionary_update_2_9_0_favorite_collection_capacity_limits.sql`. It has been applied to isolated staging project `ivatvkfrtifgfheeaelj`; production remains untouched.
- The database regression now checks that direct authenticated INSERT is unavailable, the RPC is available only to authenticated users, the original account-scoped CRUD and cross-account RLS rules still hold, Free folder 17 is rejected, Premium folder 41 is rejected, and all test mutations roll back.
- The live isolated-staging SQL regression passed after correcting the test to use the RPC-only creation path and to reset fixture folder rows between Free and Premium cases. The test runs in a transaction and rolls back.

### 14.3 English collection word-grid sizing

- English saved-word cards in Your Collections use the same `word-card` / `word-grid` base sizing and 58px minimum card height as Dictionary cards.
- The English collection grid uses `repeat(auto-fill, minmax(110px, 1fr))`, preventing the inner folder padding from squeezing each card below the dictionary card minimum width.
- Simplified Chinese keeps its square character grid with a 66px minimum column size and 1:1 cards; the English width fix must not affect Chinese.
- Browser tests check the English minimum track width and card height, as well as Chinese square-card behaviour.

### 14.4 Phase 6 — optional aligned English learning-content expansion (started)

- Audited the current English permanent lesson catalogue, Quiz question-bank source pack, curriculum objective map and Flashcards data flow.
- Added **15 original bilingual English Quiz draft questions** to `content/quiz/questions.en-zh.draft.json`, five each at Beginner, Intermediate and Advanced. They are aligned with already-taught objectives in `b-articles`, `i-collocations` and `a-near-synonyms`; no new un-taught objective or lesson dependency is introduced.
- Updated the Quiz content README: the draft bank now contains 214 questions (129 knowledge, 15 word-definition and 70 Chinese-translation). The pack remains draft-only; no new questions were approved, imported into staging or made selectable in the live Quiz.
- Flashcards already derives its English learning vocabulary from the complete `englishWords` dictionary array (including the U2.9.0 expansion), rather than requiring a separate English flashcard bank. Avoid duplicating the same vocabulary into a second static deck. Existing Flashcards modes, recall timing, progress and allowances remain unchanged.
- Added `node scripts/quiz/validate-question-bank.mjs` to the U2.9.0 QA workflow and enabled the existing disposable local Supabase Quiz integration workflow on the U2.9.0 feature branch. This validates the draft source and cross-version Quiz/Auth/allowance regressions without touching production.
- This is an initial Phase 6 content addition, not a claim that the optional expansion is finished. Continue only with lesson-aligned material and preserve the rule that a question cannot assess material absent from its permanent lesson. Human bilingual/factual review remains required before any future approval/release.

### 14.5 Validation checkpoint and recovery point

- Staging migration applied successfully.
- Direct transactional SQL verification passed for Free 16 and Premium 40, including the first rejected creation after each limit; the transaction rolled back.
- Full `supabase/tests/favorite_collections.sql` staging regression passed after its fixtures were updated to use the new RPC-only create path.
- Supabase health advisor returned no findings. Security advisor continues to show the existing 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning; no collections-capacity-specific finding was introduced.
- An earlier browser run on commit `358cf32` exposed two test issues: the English grid assertion compared absolute track widths despite different inner container widths, and a Premium status locator was not exact. The UI sizing was tightened to a 110px minimum per English grid track, the assertion now tests that minimum and 58px card height, and the Premium status locator uses exact matching. A newer full QA run is queued; do not treat it as passed until the latest commit's checks complete.
- Latest application feature branch: `feature/u2-9-0-collections-feedback`; PR #18 remains open. No production merge, production migration, production deployment, purchase flow or Premium entitlement assignment has occurred.
- Current controlled preview deployment must be regenerated after the latest source changes and checked against the isolated staging Supabase route before handing a new preview to the owner.

### Legal/privacy check

The folder-cap implementation uses existing account identity and existing collection rows; it introduces no new personal-data category, processor, tracking or payment transaction. The active capacity is an access/feature entitlement. Preserve data on downgrade and do not disclose folder counts in the collection panel. Premium is not for sale or activated by this change. Before any actual Premium launch, conduct a separate Malaysia-specific and international consumer/payment/privacy review, including PDPA applicability, cross-border processing, price/tax disclosure, recurring billing, cancellation/refund and payment-provider terms. This is planning, not legal advice or compliance clearance.


### 14.6 Latest validation results — 2026-11-25

- U2.9.0 English QA on feature commit `7a1aaea` completed successfully: English baseline/expansion validation, category and translation audit, whole-catalogue audit, 214-question Quiz draft validation, Mock Quiz/Flashcards regression tests and **16 Playwright browser tests** all passed.
- Phase 6 draft expansion now has an explicit release boundary. The original 199 questions retain `release_approved: true` from the earlier owner-authorized release; the 15 new Phase 6 questions are `release_approved: false`. Default export keeps all 214 as drafts. The `--approve-for-release` export includes only the 199 previously authorized questions. No new Phase 6 question is approved, imported as approved or made live.
- Updated the Quiz mock adapter to accept the 214-question bank while preserving the original 199-question release subset and original 56/62/81 distribution. Added a draft-import SQL assertion that independently verifies all 15 Phase 6 rows remain draft, mapped to an active source lesson and learning objective, with four options and one answer key.
- The disposable `quiz-db-foundation` job passed on commit `7a1aaea`, including draft import and the previously authorized 199-question release-export regression.
- Cross-version checks on the same feature commit passed: Flashcards unit/mock and Chromium browser checks, Chinese dictionary and lesson browser checks, U2.7 lesson-start allowance regression, U2.3 allowance/dashboard regression, U2.6 ACL regression, PostgreSQL migration/allowance checks, Chromium browser regression smoke tests and Cloudflare build-routing guard.
- Cloudflare Pages deployed commit `7a1aaea` successfully; build-routing guard passed. Unique preview: https://bf0603b6.swiftdictionary.pages.dev ; branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev.
- The separate `Workers Builds: swiftdictionary-testing` check failed again. Cloudflare Pages and its build-routing guard both passed; this is a separate Workers build configuration/infrastructure check and must be triaged independently, not mistaken for a failed Pages deployment.
- The separate Local Supabase Auth/RPC integration job was still running authenticated Chromium Quiz runtime, signed-out Flashcards/Preferences, permanent Lessons allowance and local security-advisor checks at the time of this update. Await its final status before declaring the entire consolidated regression matrix complete.
- The staging capacity migration and full `supabase/tests/favorite_collections.sql` transaction regression remain passed. No production data or entitlement was changed.


### 14.7 Authenticated lesson-start race found and fixed during consolidated QA

- The first full local Auth/Quiz integration run on commit `7a1aaea` found one pre-existing race in the permanent lesson confirmation flow: the lesson allowance refresh could re-render `#lessonCards` while the confirmation dialog was open, detaching the original button. Confirming then silently skipped the start because the handler required the original node to remain connected.
- Fixed by assigning each rendered lesson card a stable `data-lesson-id` and resolving the current card by that ID when the original node has been replaced. If the refreshed card is now disabled, the confirmation closes with an explanatory lesson-status message instead of silently doing nothing.
- Extended the authenticated Quiz runtime browser test to force a lesson-topic filter re-render while the confirmation is open, then confirm the start. Extended the U2.7 static regression to assert the stable-ID fallback.
- The first failing run was not caused by the new Quiz content; the failure occurred before Quiz launch, at the permanent lesson start. The later run on commit `78280d4` is exercising the explicit race regression. Await the final Local Supabase Auth/RPC job result before calling this resolved.
