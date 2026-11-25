# SwiftDictionary Update 2.9.0 — Owner follow-up and Phase 6 expansion

Date: 2026-11-25
Application branch: `feature/u2-9-0-collections-feedback`
PR: #18 (open; base `main`)
Application checkpoint: `d27750988a6e2ad097436b0810b237c7f44d449f`

## Owner feedback

1. Collection word cards were compressed after a saved word was added. A long headword such as “bioavailability” must remain fully readable, and adding it must not resize the parent panel.
2. Folder order must be freely movable to the top, bottom or any position.
3. Phase 6 should expand permanent Lessons and Flashcards as well as Quiz, where there are genuine educational gaps.
4. Folder expand/collapse animation should also apply to Favorite words and other Dashboard disclosure patterns.

## Implemented changes

### Collections layout and ordering

- Reused the Dictionary/Favorite word-card sizing rules for English collection cards; preserved the panel's geometry after membership changes.
- Added long-word browser coverage for desktop and 390px mobile layouts, plus Chinese square-card regression.
- Added draggable folder handles and drop-position feedback.
- Added keyboard-accessible move-up/move-down controls for folders.
- Persisted ordering with an owner-checked Supabase RPC. Client sends one reorder RPC per move.
- Reorder SQL calculates actual rank rather than assuming stored sort_order values are gap-free. This handles deleted folders and sparse stored positions.
- Added SQL coverage for account isolation, direct access restrictions and reordering after deletion.

### Expand/collapse animation

- Added restrained height/opacity transitions to collection folders and native Dashboard details disclosures, including Favorite words.
- Preserved existing DOM nesting/direct-child relationships; an initial wrapper approach broke existing selectors and was replaced before acceptance.
- Collapsed content is inert during the transition; rapid toggles are sequence-guarded.
- Reduced-motion preference disables transitions and applies immediate state changes.

### English permanent Lessons

- Runtime inspection found 17 English lessons in the browser catalogue but only 15 in the server allowlist. Added the two already-visible missing IDs to the server catalogue.
- Added three original curriculum-led lessons:
  - Beginner: Ask questions and form negative statements.
  - Intermediate: Use the passive voice when the action matters.
  - Advanced: Report statements, questions and requests accurately.
- English permanent lesson catalogue now contains 20 lessons: Beginner 8, Intermediate 6, Advanced 6.
- Added Simplified Chinese translations for lesson reader fields and practice prompts/options.
- Added the new stable lesson IDs and objectives to `content/quiz/curriculum-map.en.json`.
- Added a server allowlist migration and transactional tests for all 20 English lessons.

### English Quiz

- Added nine original bilingual Quiz questions aligned to the three new lessons.
- Phase 6 draft additions now total 24 (15 earlier additions + 9 new questions).
- Draft source bank now contains 223 questions: 64 Beginner, 70 Intermediate, 89 Advanced.
- All 24 Phase 6 questions remain `release_approved=false`; the previously owner-approved 199-question release subset is unchanged.
- Updated the curriculum map, draft validator, mock Quiz expected totals, SQL draft import assertions and 20-lesson test catalogue.

### English Flashcards

- Added 15 original English multiword expressions, collocations, phrasal verbs and idiomatic expressions.
- Each has a Simplified Chinese meaning and contextual example.
- Cards use the existing English phrase/all recall sets; no dictionary headword duplication or allowance change.

## Validation checkpoint

Successful latest application checks on checkpoint `d27750988a6e2ad097436b0810b237c7f44d449f`:

- U2.9.0 English QA: run `45598338317`.
- U2.3 allowance/dashboard regression: run `45598338297`.
- U2.5 Flashcards browser regression: run `45598338382`.
- U2.6 ACL regression: run `45598338168`.
- U2.7 Chinese regression: run `45598338333`.
- Cloudflare build-routing guard: run `45598338207`.
- Quiz database PostgreSQL job passed the 223-row draft import and separate 199-row release export.
- Local Supabase Auth/RPC job passed U2.9.0 collection/order migrations and SQL/RLS tests, the 20-lesson server allowlist migration/test, Quiz draft import and 199-question release export. Authenticated Chromium Quiz runtime and final local security-advisor steps were still in progress at the time of this archive entry.

## Release and safety boundaries

- No refreshed staging preview was handed to the owner at this checkpoint.
- PR #18 remains open. No merge or production deployment.
- No production database migration/write, Premium checkout, subscription activation or entitlement assignment.
- Dictionary search remains free and unlimited; existing learning allowances remain unchanged.
- The new folder order is account-owned metadata. No new personal-data category, tracking or processor was introduced. New lesson and Flashcards content is original.
- Malaysia PDPA, international privacy/16+ safeguards and future Premium consumer/payment review remain open planning items, not legal clearance.
