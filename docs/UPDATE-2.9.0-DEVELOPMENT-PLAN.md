# SwiftDictionary Update 2.9.0 — English Dictionary Expansion & Dashboard Collections

**Status:** Owner-approved plan (2026-11-24); implementation not yet started.  
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
- The modal lets users enter a collection name and create it, with validation and clear inline error states.
- Users can open a collection, add saved words, remove words from that collection, rename a collection and delete a collection.
- A saved word may be included in multiple collections.
- Collections accept saved words from both English and Chinese regardless of current learning-course or translation-language selection.
- Removing a word from a collection must not remove it from the global Favorite words list.
- Deleting a collection must not delete the saved words it contained.
- Handle empty collections, long names, duplicate names, loading/error states, keyboard use, touch targets and responsive desktop/mobile layouts.

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

- Plan approved on 2026-11-24.
- Implementation has not started.
- No U2.9.0 code, dictionary content, migrations, schema, staging or production changes have been made as part of this planning approval.
- Begin with Phase 1 only after a separate owner instruction to start development.
