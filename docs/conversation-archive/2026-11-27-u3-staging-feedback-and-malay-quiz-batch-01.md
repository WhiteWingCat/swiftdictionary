# SwiftDictionary U3.0 — Staging feedback corrections and Malay Quiz batch 01

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Documentation branch:** `docs/master-development-record`  
**Staging Supabase:** `ivatvkfrtifgfheeaelj`  
**Production:** untouched

## Owner feedback and fixes

The owner reviewed the Phase 3 staging preview and reported four Malay-specific display/review issues plus one navigation-state issue.

1. **Malay support-language selector:** removed the rule that disabled the Malay target option solely because the learning course was Malay. Both the Dictionary selector and Profile preference selector now enable Malay when the complete Malay Dictionary target corpus is available. The existing content renderer resolves the Malay native wording when Malay is selected as its own display language; English and Simplified Chinese remain available as Malay-course support languages.
2. **Daily Application option rendering:** the shared Daily Learning option renderer now recognises structured multilingual option records. For Malay it renders `option.ms` as the primary answer and the selected English/Simplified Chinese support field beneath it. String options remain supported, and Chinese pinyin rendering is unchanged. This removes object/placeholder output such as `[option option]`.
3. **Malay permanent Lesson review from Daily History:** the review action previously resolved only English and Chinese lesson catalogues. It now resolves `SWIFT_MALAY_LESSONS[difficulty]` for `ms`, allowing the original Malay lesson and its practice answers to open in read-only review. The history row still uses the saved completion timestamp and language code.
4. **Learning Progress language label:** active-language labels now resolve through `SWIFT_LANGUAGE_REGISTRY`, so `ms` displays as “Malay” instead of the raw code.
5. **Quiz unavailable-state copy:** removed the stale hard-coded “Chinese Quiz is coming soon” wording from the translation layer. The unavailable panel is recomputed from the current learning-language capability on each render and uses neutral language-specific copy. Existing Chinese Quiz capability remains enabled.

Implementation commits include:
- `02dca63` — selector, Daily History timestamp fallback, registry-based language label and capability-derived Quiz state.
- `36a03f5` — structured Malay Daily Application option rendering.
- `e9e3be1` — Malay permanent Lesson read-only review lookup.
- `84a5b48` — remove stale Chinese Quiz unavailable copy.
- `048a053` — correct Malay review catalogue selection by difficulty.
- `604e6b6` — add static regression tests and CI validator wiring.

The initial CI attempt exposed an imbalance in the first Quiz draft batch (five Beginner, four Intermediate and three Advanced questions). The bank was corrected to four questions per difficulty in both support-language packs; the latest CI rerun is pending. Do not treat the initial failed validator run as a successful test.

## Malay Quiz — first authoring batch

Added a draft-only Malay Quiz question bank using the existing Quiz content model:
- `content/quiz/questions.ms-en.draft.json`: 12 Malay questions with English support text.
- `content/quiz/questions.ms-zh.draft.json`: 12 Malay questions with Simplified Chinese support text.
- `content/quiz/curriculum-map.ms.json`: initial lesson/topic/objective mappings.
- `scripts/quiz/validate-malay-question-bank.mjs`: pair, metadata, option uniqueness, answer identity, difficulty and draft-state validator.
- `tests/malay-quiz-draft.test.mjs`: regression test for both language pairs.
- `tests/u3-phase3-staging-feedback.test.mjs`: static coverage for the five reported UI issues.
- Updated Malay language manifest with Quiz draft inventory; capability deliberately remains `quiz:false`.

The initial 12 questions are independently authored and cover four questions per difficulty. Content and translations remain drafts; owner Malaysian Standard Malay and independent support-language review is pending. This is only the first content batch, not a complete Quiz bank and not an approved release.

## Security and database boundary

No Quiz schema, Quiz RPC, allowance, Auth/RLS, question-bank, or catalogue database change was applied. The existing Quiz engine has separate English and Chinese runtime paths and private answer-key snapshots. Malay needs an equivalent server-side path that:
- checks the active registered `ms` learning language and selected `en` or `zh` support language;
- returns only question prompts and option text before completion;
- keeps correct-option IDs and explanations private until completed review;
- validates source lesson/topic/objective against the active Malay permanent-lesson catalogue;
- uses the existing one-active-session, no-repeat reservation, completion-only allowance and timezone logic;
- preserves existing English/Chinese Quiz behavior and history-deletion semantics.

The first batch is below the current production Quiz availability thresholds and cannot start a session. Do not enable Malay Quiz capability or expose a playable entry point until the full bank, language-aware RPC path, staging migration and end-to-end tests are complete.

Any database migration remains staging-only and requires schema diff, SQL review and separate explicit owner approval. Production remains untouched. PR #20 remains draft and unmerged.

## Validation and preview status

- Added the Malay Quiz draft validator to the U3.0 architecture/content CI workflow.
- Initial CI validator run failed only because the difficulty counts were not balanced; the content was corrected.
- A fresh U3.0 regression run on the corrected bank is pending; no final pass is claimed.
- Cloudflare preview auto-deployment and owner desktop/mobile acceptance must be confirmed against the final corrected branch head before issuing a new staging handoff.
- No merge, production deployment or ZIP was created.
