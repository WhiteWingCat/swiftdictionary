# SwiftDictionary U3.0 — Malay feedback fixes and Flashcards staging

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Current application head at checkpoint:** `d323ed32114465ac7e5c58c1d815b2f780d1eb0a`  
**Staging Supabase:** `ivatvkfrtifgfheeaelj`  
**Production Supabase:** `pzymiesazmpyvnfvsbsc` — untouched

## Owner feedback

The owner tested the Malay staging preview and reported:
1. Malay translation was missing across Lessons, Quiz and Flashcards.
2. Some Daily Learning questions displayed `[object Object]`.
3. Some Daily Learning activities could not open because their IDs were absent from the approved learning catalogue.

The owner also authorised continuing the Flashcards work alongside these fixes.

## Implemented and deployed to staging database

### Daily Learning renderer

- Added a shared `dailyLocalizedText` resolver that accepts plain strings, numbers, arrays and multilingual `{en,zh,ms}` objects.
- Updated question prompts, answer options and feedback explanations to resolve the current learning language and selected support language before escaping/rendering.
- Replaced the remaining Chinese/Malay feedback branches that previously passed object values directly into the DOM.
- Regression assertions cover prompts, options and explanations and reject the previous direct-object rendering path.

### Daily Discovery catalogue repair

Migration `20261127093503_swiftdictionary_update_3_0_malay_daily_discovery_catalogue_sync` is applied to staging.

- Reconciled the 93 active Malay Daily Discovery catalogue IDs with the current 93-entry dictionary-derived discovery pool.
- Stale IDs are deactivated and their rotation slots cleared; records are not deleted.
- Current IDs are upserted with stable rotation order 1–93 and the required null topic/difficulty metadata.
- Staging now reports exactly 93 active Malay Daily Discovery catalogue rows.
- Authenticated transaction-rolled-back smoke tests accepted the current day's three scheduled Discovery IDs, including their date suffix. The 60 Daily Topic and 60 Daily Application catalogue entries were also exercised; no persistent test sessions/users were left behind.

## Malay Flashcards staging foundation

The following additive migrations are applied to staging:

1. `20261127093826_swiftdictionary_update_3_0_malay_flashcards_runtime`
2. `20261127094212_swiftdictionary_update_3_0_flashcard_support_language_snapshot`
3. `20261127094247_swiftdictionary_update_3_0_flashcard_support_language_payload`

The Malay language registry and manifest now enable Flashcards in the staging feature branch. The Malay package exposes a dictionary-derived source with **650 entries**. All 650 entries have an English and Simplified Chinese definition. Supported recall modes are word, definition, mixed and sentence; card filters include all, common, nouns, verbs, adjectives and phrases.

The secure server runtime now accepts `en`, `zh` and `ms` learning/support language codes, scopes custom cards to the authenticated user's selected learning language, stores the selected support-language code, and returns that code in the authenticated Flashcard data payload. Existing owner-scoped session and server-side evaluation rules are retained.

Authenticated staging RPC smoke tests verified:
- Malay→English and Malay→Chinese Flashcard session creation.
- English→Malay session creation when a Malay support snapshot is supplied.
- Malay custom-card save/read with the correct language and support-language codes.
- No persistent smoke-test users, cards or sessions after rollback.

### Malay translation availability and current coverage

The global Malay target selector is no longer tied to Dictionary translation coverage. Malay is selectable for English and Chinese courses; when the active learning course is Malay, Malay is correctly treated as the source language and English/Chinese remain its support languages.

A Malay support translation dataset now covers all **17 English and 17 Chinese permanent lessons** for topic, title, summary and the main explanation. The lesson reader selects these translations for the corresponding course. Practice prompts/options remain in their source language for now, and the reader explicitly discloses that gap.

Important remaining coverage gaps:
- The English/Chinese Quiz banks do not yet have Malay support-language question packs. The UI now refuses to start those combinations with a clear message rather than showing the wrong language. The Malay Quiz itself remains available with 120 Malay→English and 120 Malay→Chinese questions.
- English/Chinese Flashcard entries do not yet have a complete Malay translation overlay. The runtime supports per-card Malay translations and the UI fails clearly when the selected set has no Malay support text. The Malay learning course's own 650-card source bank has English and Chinese support definitions.

These gaps remain open; this checkpoint must not be described as complete Malay support-language coverage across every learning surface.

## Automated regression at checkpoint

- Cloudflare build-routing guard passed on the preceding application head.
- U3.0 architecture regression failed once on an outdated static assertion expecting the former selector gate; the assertion was updated and a rerun was queued on the latest head.
- Flashcards static checks passed; the authenticated Chromium Flashcards browser job was still running.
- Quiz PostgreSQL, U2.3 allowance/Dashboard, U2.6 ACL, U2.7 Chinese Dictionary and U2.9 English Dictionary workflows were queued or running on the latest head.
- Do not call the full regression matrix complete until the reruns finish.

## Release boundary and legal planning

- PR #20 remains draft and unmerged.
- Only staging Supabase `ivatvkfrtifgfheeaelj` received the new migrations.
- Production Supabase and production hosting remain untouched.
- The content is original machine-assisted draft material. Retain provenance and licence evidence. Before public launch, review Malaysia PDPA 2010 and the 2024 amendments, privacy notice, retention/deletion, processor terms and cross-border processing with qualified counsel.

## Preview

The stable feature-branch preview alias is [https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev). The latest commit-specific Pages preview must be confirmed from the Cloudflare deployment check before publishing a new commit-specific link.
