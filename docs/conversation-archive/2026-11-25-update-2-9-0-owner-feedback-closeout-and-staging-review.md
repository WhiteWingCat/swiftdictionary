# Update 2.9.0 — owner feedback closeout and staging review — 2026-11-25

## Context and owner direction

The owner asked to resume U2.9.0 after reviewing the latest Master Development Record and conversation archive, and supplied four follow-up requirements:

1. Preserve the Favorite words panel/grid dimensions when a saved word is added to Your Collections. The long word `bioavailability` must not be compressed or pushed into an adjacent card area.
2. Allow folders to be dragged to any position, including the top and bottom, with accessible alternatives.
3. Expand English Lessons and Flashcards as well as Quiz where there is a clear educational reason; additional permanent lessons are welcome where curriculum gaps exist.
4. Animate folder expand/collapse and apply the same treatment to Favorite words and other Dashboard disclosures.

The owner requested that no refreshed staging preview be handed over until implementation and validation were complete.

## Implementation

### Collections sizing

- Aligned the collection panel's 22px padding with the Favorite words `.profile-card` surface on desktop and mobile.
- Collection grids reuse `word-grid favorite-word-grid` and the existing Chinese `character-grid` classes. Removed the collection-specific 150px column override and extra inner padding so responsive breakpoints match Favorite words.
- Compensated for the one-pixel folder-card border on both sides so the collection card tracks match the Favorite reference width without changing the outer panel width.
- Added desktop/mobile regression coverage using `bioavailability`, checking grid track widths, card widths, panel width stability and horizontal text overflow.

### Persistent folder ordering

- Added `favorite_collections.sort_order`, deterministic backfill and a per-account reorder RPC.
- Drag/drop supports moving a folder to any position; visible move-up/move-down buttons provide touch-friendly and keyboard-accessible alternatives.
- The RPC uses a transaction-scoped per-account advisory lock, row locks, owner predicates and RLS. It executes as SECURITY INVOKER; authenticated users rely on owner-scoped SELECT/UPDATE policies rather than a public SECURITY DEFINER RPC.
- New folders append after the account's current final order key. Existing folder IDs, names and memberships were preserved.
- SQL tests cover account isolation, reordering, append order, deletion/normalisation, constraints and invoker security. The staging test account already had two folders; the test was corrected to account for pre-existing data and runs in a rollback transaction.

### Expand/collapse motion

- Your Collections folders use max-height/opacity transitions.
- A shared enhancer applies the same transition to all Dashboard `#profilePage details` disclosures, including Favorite words and progress sections.
- Collapsed content is inert to keyboard navigation. Reduced-motion users receive immediate state changes. Existing Favorite DOM structure and detail-panel behavior are preserved.
- Browser tests cover collection motion, Favorite disclosure state, reduced motion and keyboard accessibility.

### English learning content

- Added three original permanent English lessons:
  - Beginner — Question forms and negatives
  - Intermediate — Passive voice
  - Advanced — Reported speech
- Each new lesson has five practice questions, contextual examples, objectives and Simplified Chinese lesson/practice translations. Two previously browser-visible English lessons were reconciled into the server allowlist. The active English permanent lesson catalogue now contains 20 lessons (8 Beginner, 6 Intermediate, 6 Advanced).
- Added six further lesson-aligned Quiz questions. The source bank now has 229 questions: 199 previously owner-approved release questions and 30 Phase 6 draft-only questions. All 30 drafts remain unapproved and are excluded from the approved release subset.
- Added ten original bilingual multiword expressions to English Flashcards. The curated phrase bank now has 25 entries; ordinary English word cards continue to come from the shared dictionary dataset. No exact dictionary headword duplicates were introduced.
- Existing allowances, timers, progress, answer validation, recall modes, and account behavior were not changed.

## Supabase and staging

Four U2.9.0 migrations were applied only to the isolated staging Supabase project `ivatvkfrtifgfheeaelj`:

- `20261125085850_swiftdictionary_update_2_9_0_favorite_collection_capacity_limits.sql`
- `20261125105110_swiftdictionary_update_2_9_0_favorite_collection_ordering.sql`
- `20261125105244_swiftdictionary_update_2_9_0_english_lesson_expansion.sql`
- `20261125105351_swiftdictionary_update_2_9_0_reorder_rpc_invoker_security.sql`

The filenames were reconciled to the exact versions recorded by staging migration history to prevent a later CLI push from treating applied migrations as missing.

Staging verification confirmed the non-null `sort_order` column, authenticated reorder RPC, 20 active English permanent lesson catalogue rows, and the existing two collections/nine memberships. The collection SQL regression passed and rolled back without changing owner data. Supabase health advisor returned no findings. The security advisor has no new collection-specific warning; existing private-schema informational notices and the pre-existing leaked-password-protection warning remain.

No production Supabase migration, production data write, production merge, production deployment, Premium activation, entitlement mutation or allowance change occurred.

## Automated validation — all successful

All checks below passed on application commit `6409b7981656d27a6385400862df3557a757828d`:

| Check | GitHub Actions run |
|---|---:|
| U2.9.0 English dictionary, content and Chromium browser QA | `45601282736` |
| Flashcards syntax, integration, mock regressions and Chromium browser tests | `45601282876` |
| Quiz database foundation and local Supabase Auth/RPC integration | `45601282873` |
| U2.3 allowance/dashboard regression | `45601282803` |
| U2.6 ACL drift regression | `45601282613` |
| U2.7 Chinese dictionary/lesson and allowance regression | `45601282617` |
| Cloudflare build-routing guard | `45601282708` |

The U2.9.0 browser suite passed the long-word grid comparison, folder reordering, inline folder behavior, reduced-motion disclosure behavior, account isolation, shared word details, capacity limits and new lesson checks. The local Supabase workflow passed U2.9.0 migrations and RLS/order/security tests, Quiz draft import, the separate 199-question approved release export, authenticated Quiz runtime tests, signed-out Flashcards/Preferences, permanent Lessons allowance notifications and local security-advisor checks.

Earlier CI runs exposed and corrected: stale Quiz validator counts, a legacy test expecting a wider-than-Favorite collection card, an overly strict sub-pixel width comparison, and a disclosure test fixture with no visible Favorite card. The final latest-head QA run is green.

## Cloudflare Pages staging preview

Cloudflare Pages deployed the latest application commit `6409b79` successfully:

- Deployment-specific preview: https://adc32f85.swiftdictionary.pages.dev
- Branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev

The Cloudflare build-routing guard passed. A separate Cloudflare Workers Builds check for `swiftdictionary-testing` is distinct from the successful Pages deployment and must not be described as a Pages failure.

## Legal, privacy and licensing planning

- The `sort_order` field is minimal account-linked preference metadata and does not introduce a new personal-data category, tracking purpose or processor.
- Malaysia planning considered the Personal Data Protection Act 2010 and 2024 amendments, current JPDP breach-notification/DPO guidance and 2026 registration material. Confirm the operator/controller's PDPA scope and any applicable registration, DPO and breach obligations before public release; do not assume a free project is automatically outside the Act.
- Staging is hosted in Singapore and the existing production project in Japan. Assess Section 129 of Act 709, the JPDP cross-border transfer guideline, provider processor terms, safeguards and privacy-notice disclosure before release.
- For EU/EEA users, review GDPR territorial scope and principles, and jurisdiction-specific child-consent rules; a global 16+ label is not a substitute for local requirements.
- New lesson, Quiz and Flashcard material is original. Keep content provenance. This is planning, not legal advice, legal clearance or a licensing certification.

## Current recovery point and owner gate

- Feature branch: `feature/u2-9-0-collections-feedback`
- Open PR: https://github.com/WhiteWingCat/swiftdictionary/pull/18
- Application head: `6409b7981656d27a6385400862df3557a757828d`
- PR #18 description has been refreshed with scope, evidence and staging URLs.
- Latest staging preview is ready for owner review. Do not merge or deploy to production until the owner explicitly approves.
- All 30 new Quiz questions remain draft-only pending separate content approval. No new Premium purchase/activation or allowance behavior is included.
