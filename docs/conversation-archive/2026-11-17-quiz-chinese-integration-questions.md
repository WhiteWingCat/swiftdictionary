# Update 2.4.0 — Chinese-translation integration questions and Mock Quiz validation

**Date:** 2026-11-17  
**Repository:** `WhiteWingCat/wordbook`  
**Implementation branch:** `feature/update-2-4-0-quiz`  
**Implementation commit:** `710f043a43e116c90d4b3a6fb779605658bd2333`  
**PR:** #8 — open, draft, unmerged

## Owner approval

The owner approved the proposed Chinese-integration distribution for the English-learning Quiz when Simplified Chinese is selected as the translation language:

- Beginner: 1 Chinese-translation question within 10 total questions.
- Intermediate: 4 within 15 total questions.
- Advanced: 7 within 20 total questions.

The distribution does not add questions to the existing 10/15/20 session lengths and does not change the source-difficulty composition.

## Implementation

### Draft content

- Expanded the bilingual draft pack from 114 to 150 questions.
- The original 114 knowledge questions remain: Beginner 30, Intermediate 36, Advanced 48.
- Added 36 original Chinese-translation assessment questions: Beginner 3, Intermediate 12, Advanced 21. The 3x bank supply is intended to support the Premium three-completion daily allowance without exhausting the required translation-question pool.
- Each new item asks an English-language learner to select the most accurate Simplified Chinese translation. The four answer choices are displayed in Chinese; English glosses are supporting metadata.
- Revised the nine previously identified duplicate Chinese support-option sets. The updated validator checks four distinct English options and four distinct Chinese options after Unicode normalisation for every draft question.

### Mock User behaviour

- The Mock adapter loads the 150-item pack only inside the existing exact-host plus `?swiftMock=1` opt-in boundary.
- For an English-learning session with Chinese selected as the translation language, the Mock selector inserts exactly 1/4/7 Chinese-translation questions by difficulty and fills the remaining slots with the existing knowledge questions.
- When English is selected as the translation language, the Mock selector uses knowledge questions only.
- Total session lengths, source-difficulty composition, answer-key hiding, shuffled option order, local scoring, history and allowance simulation remain intact.
- The UI displays Chinese answer choices as the primary text for Chinese-translation items.
- Previous/Next navigation is disabled while answer saving is pending to avoid losing a rapid navigation action.

### Database boundary

The authenticated Quiz schema/RPC layer does not yet support the new `question_type` field. The 36 Chinese-translation questions are therefore preview-only and are deliberately excluded from SQL export/import. CI continues to import only the 114 knowledge questions into disposable PostgreSQL/local Supabase environments. No staging migration/import or production database change occurred.

## Validation

- Quiz database foundation workflow [#417](https://github.com/WhiteWingCat/wordbook/actions/runs/44047597209): passed PostgreSQL validation, supported draft import, disposable local Supabase Auth/RPC/session tests, authenticated Chromium runtime tests and Supabase security advisors.
- Companion 2.3.x regression workflow [#974](https://github.com/WhiteWingCat/wordbook/actions/runs/44047597250): passed PostgreSQL, Chromium and Supabase Auth compatibility checks.
- Earlier Quiz run #415 failed because a double-escaped Unicode-normalisation regex generated false duplicate-option reports. Corrected in commit `710f043`; the subsequent run #417 passed.
- Earlier Quiz run #413 exposed a save/navigation timing race. Navigation controls are now disabled while saving; authenticated Chromium runtime tests passed in #417.
- Structural CI is not human editorial approval. The 150-item pack remains `draft`.

## Safety and release boundaries

- PR #8 remains draft/open/unmerged. Production `main` was not changed.
- No Quiz schema/RPC migration, question import, staging migration, production data/configuration change or production deployment was performed.
- The separate Supabase staging project remains empty pending a safe clean-schema bootstrap; see the staging approval archive.
- Cloudflare Pages deployment of commit `710f043` has not yet been confirmed. Do not share the preview link until the deployment is verified.
- The new content is original and adds no learner personal-data fields or tracking. Existing Malaysia PDPA, international/16+ privacy, retention/deletion and cross-border processing reviews remain release gates.
- All question content requires human bilingual accuracy review and explicit owner approval before learner-facing publication.

## Recovery / next steps

1. Verify the Cloudflare Pages deployment for the latest feature commit.
2. Share the Mock User preview only after deployment is confirmed; use fictional Test User A (Free) and Test User B (Premium).
3. Gather owner feedback on the 1/4/7 distribution and question quality.
4. After owner acceptance, add backend question-type support on the feature branch and validate in isolated staging only after the clean-schema bootstrap is complete.
5. Do not merge PR #8 or deploy production without explicit owner approval.
