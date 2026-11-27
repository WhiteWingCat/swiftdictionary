# SwiftDictionary U3.0 — Complete Malay Dictionary translations and staging preview readiness

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Latest application commit:** `df7e8e1efa78774fba917f5e6a8acaefee421b37`  
**Documentation branch:** `docs/master-development-record`  
**Staging Supabase project:** `ivatvkfrtifgfheeaelj`  
**Production:** untouched

## Owner request

Continue U3.0 work until a staging preview is ready. Complete the remaining translation work and fix:
1. Missing Malay section in Dashboard Favorite Words.
2. Malay saved-word clicks in Your Collections not responding.
3. Incorrect Malay activity naming/content in Daily History.

## Translation corpus — complete machine-assisted coverage

The GitHub Actions workflow `Generate U3.0 Malay Dictionary translation drafts` completed successfully.

- English: 1,316 headwords and 1,931 meanings translated to Malay.
- Simplified Chinese: 725 headwords and 825 meanings translated to Malay.
- Total: 2,041 headwords and 2,756 meanings; zero missing headwords or senses.
- Existing Malay Dictionary: 650 headwords and 672 meanings; all 672 retain English and Simplified Chinese support translations.
- 658 English and 499 Chinese sense translations were retained from the authored/manual draft overrides. Remaining meanings were generated using the offline Argos pipeline.
- Output size: 1,197,626 bytes.
- Engine: Argos Translate en→ms 1.9 and zh→en 1.9 followed by en→ms 1.9.
- Every generated/retained target translation remains `machine_assisted_draft`; reviewer is null. This is complete coverage, not human linguistic approval.

Generator workflow: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45953123750

## Malay UI fixes

- Dashboard Favorite Words now includes a Bahasa Melayu group and resolves entries through the language content package.
- Your Collections resolves Malay saved-word clicks through the package-backed dictionary lookup. The add-word picker copy includes Malay.
- When opening a saved word from Dashboard/Collections, the active learning-course and Profile preference selectors are synchronised. Malay is removed as its own support language when the Malay course is active.
- Daily History separates Lessons from Daily Learning and uses explicit labels: Daily Topic, Daily Application, Daily Discovery and Daily Revision. Malay lesson/activity titles and language labels are resolved from Malay content packages.
- Added Playwright coverage for adding/opening a Malay saved word in a collection and for Dashboard Malay favourites and Malay support-language selectors.
- The Malay dictionary category filter remains in the branch.

## Additional regression fix

Flashcards course switching had a regression: switching from English Mixed Recall to Chinese reset the selected mode to Word Recall instead of preserving the equivalent Translation Recall slot. The initial render remap did not fix the event handler, so both render fallback and the `swiftdictionary:course-changed` handler now preserve the equivalent mode. This change is included in the latest branch head.

## Latest commits in scope

- `1d17c2d4` — Dashboard Malay favourites, Collections lookup, Daily History naming/grouping, selector support and package mapping.
- `0c27d5da` — Malay collection-picker copy.
- `8372a3c2` — Malay target translation mapping in the package adapter.
- `b70f617b` — explicit missing-translation states.
- `718bcfbf` — Malay browser regression coverage.
- `d27ea8f8` — initial Flashcards course-switch recall mode preservation.
- `857b5378` and `c6ec324d` — synchronise translation preferences when opening saved words across courses.
- `df7e8e1e` — complete 2,756-meaning Malay translation corpus generated and validated.

## CI status and owner approval

The translation-generation workflow passed and pushed the complete translation file. The bot-authored commit then triggered PR workflows, which GitHub marked `action_required`. These are pending approval, not test failures or test passes. The repository owner must use GitHub's **Approve and run** action for the workflows below before full regression acceptance can be claimed.

- U3.0 Phase 1 architecture regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012262
- U2.9 English Dictionary QA and Malay Dashboard/Collections browser tests: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012263
- U2.3 allowance and Dashboard browser regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012261
- U2.5 Flashcards regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012203
- Cloudflare build-routing guard: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012269
- U2.7 Chinese filter checks: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012095
- U2.6 ACL regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012094

Earlier checks passed on prior commits, including U3.0 architecture/build routing, English/Chinese dictionary checks and U2.6 ACL regression. They do not replace final-head approval and reruns.

## Staging preview

- Branch preview alias: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev
- Draft PR #20: https://github.com/WhiteWingCat/swiftdictionary/pull/20
- Latest application commit: `df7e8e1efa78774fba917f5e6a8acaefee421b37`

The `.pages.dev` host uses the staging Supabase configuration; production Supabase, production hosting and production credentials remain untouched. The preview alias was deployed earlier in Phase 3, but publication of the generated latest commit was not independently confirmed from Cloudflare's deployment service. Treat this as the staging preview endpoint and confirm the deployed build when opening it.

Staging Google OAuth has not been independently verified for this preview host. If sign-in fails, the staging Supabase Google provider redirect allowlist must include the preview host before account-backed acceptance.

## Legal-risk review

Malaysia Copyright Act 1987 (Act 332), section 8, treats translations/adaptations as derivative works. The source definitions are original SwiftDictionary-authored content; no DBP/PRPM/Kamus Dewan or other third-party dictionary text was imported. Argos model artifact licenses are separate from the MIT/CC0 package-index license. The en→ms 1.9 model is listed among CC-BY-4.0 packages in Argos maintainer discussion; the exact zh→en artifact license still needs direct confirmation before public production release. Retain model attribution and do not mark drafts approved.

References:
- https://www.myipo.gov.my/wp-content/uploads/2025/09/Copyright-Act-1987-Act-332.pdf
- https://github.com/argosopentech/argos-translate/issues/507
- https://github.com/argosopentech/argospm-index

Inference ran locally in GitHub Actions using project Dictionary definitions and translation overrides only; no learner account data or personal learning history was included.

## Release state

Translation coverage is complete as machine-assisted drafts and the three requested Malay UI fixes are implemented. Final CI approval, latest Cloudflare publication confirmation, staging OAuth verification and owner desktop/mobile linguistic review remain open. PR #20 remains draft and unmerged. Do not merge or deploy production without separate approval.
