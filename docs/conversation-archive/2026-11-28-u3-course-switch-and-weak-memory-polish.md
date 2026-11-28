# U3.0 staging polish — 2026-11-28

This archive records the owner's latest feedback and the corresponding implementation work. See the Master Development Record and Update 3.0 Development Plan for the complete release context.



## U3.0 staging polish checkpoint — 2026-11-28 (Quiz course switching and Weak Memory)

Latest known application head at this checkpoint: `caa9527f4e6ad4e7dcef66d67c62102d3812af28` on `feature/update-3.0-phase-0-audit`; PR #20 remains a staging draft and production remains untouched.

### Owner direction on review

The owner explicitly waived any human-required linguistic/editorial review as a prerequisite for this update. The owner will review content on the live website. Do not hold the update for a separate human-review stage and do not describe machine-assisted content as human-approved. Automated completeness, source alignment, lexical, distinct-answer, structural and runtime checks remain required.

### Staging feedback fixes

- **Quiz course switching:** the global course selector already updates the in-memory course and queues a preference write. The Quiz-specific switch handler then redundantly re-read `user_preferences`, creating an avoidable stale-preference/race path. Removed that second read from the switch path. The handler now waits for the queued write and checks the course-selection version, selected option and request ID before refreshing Quiz availability/history. A regression browser test exercises repeated transitions `zh → ms → en → ms → zh → en` and checks the selected course, overview, difficulty copy and persisted preference at each step.
- **Weak Memory latency:** review detail could trigger first-use language-bank indexing and Malay gloss fallback work on the learner's click. The runtime now warms indexes for the languages represented in saved weak-memory items, warms the Malay fallback map when Malay is selected, and caches enriched detail by card key and translation language. The cache is invalidated when content packages or account review data are refreshed. Flashcards runtime cache key is `3.0.0-ms28`.
- Added static regression assertions for the Quiz preference hand-off and Weak Memory preload/detail cache. Updated both cache-version expectations in the account-deletion and Flashcards page checks to `3.0.0-ms28` after the asset version bump.

### Validation checkpoint

- U3.0 Phase 1 architecture/content regression passed on the latest checkpoint.
- Cloudflare build-routing guard passed after updating the two stale Flashcards cache-version assertions. The preceding run had failed only because one test still expected `ms27` after the asset had advanced to `ms28`.
- U2.3 PostgreSQL migration/allowance regression passed.
- U2.5 Flashcards checks, Quiz database foundation, U2.6 ACL, U2.7 Chinese, U2.9 English and both translation-generation workflows were queued/in progress at the checkpoint. Do not call the complete regression matrix green until the latest-head runs finish.

### Outstanding translation completeness item

The current application-branch file `data/languages/malay-dictionary-translations.js` was confirmed empty (0 bytes) at this checkpoint. The Dictionary translation generator/validator expects complete Malay target-language coverage for 1,316 English headwords / 1,931 senses and 725 Chinese headwords / 825 senses. The translation-generation workflow is responsible for producing this draft output and running its coverage/lexical validator. Do not claim the entire multilingual Dictionary layer is complete until the generated file is present and both language inventories pass with zero missing headwords/senses and zero configured lexical flags. Learning-support packs for Lessons, Quiz and Flashcards remain separate from this Dictionary overlay and must not be treated as substitutes for it.

No new personal-data collection, third-party sharing or user-data purpose was introduced by these UI/performance fixes. Existing Malaysia Copyright Act 1987, PDPA 2010/2024 amendment, cross-border processing, and model/corpus licence/attribution checks remain release considerations. Leaked-password protection remains excluded by the owner's earlier instruction. Production merge/deployment remains unauthorised.

