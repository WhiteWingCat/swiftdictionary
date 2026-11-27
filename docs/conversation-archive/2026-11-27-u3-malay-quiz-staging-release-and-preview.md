# SwiftDictionary U3.0 — Malay Quiz staging release and preview

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Preview head:** `da5389c19b78d7d831551e7a8b13ba1c24b5f8ff`  
**Staging Supabase:** `ivatvkfrtifgfheeaelj` (Singapore region)  
**Production Supabase:** `pzymiesazmpyvnfvsbsc` — untouched

## Owner direction

The owner authorised importing Malay Quiz draft questions that passed accuracy/structure checks into staging without waiting for another review. This is staging-only approval. Independent human Malaysian Standard Malay and support-language review is deferred for staging feedback and is not production approval.

## Question-bank release

- Malay→English: 120 questions.
- Malay→Simplified Chinese: 120 questions.
- Total: 240 questions.
- Per support-language pair: 36 Beginner, 36 Intermediate, 48 Advanced.
- Every released record is `status='approved'` in the staging database with `approved_at` set.
- Source JSON packs remain editorially draft and carry `staging_release.status=owner_authorized_staging_only`, `human_linguistic_review=deferred`, and `production_release=false`.

Automated QA found and corrected 36 prompt/explanation field reversals in the two support packs, plus option-language mismatches and targeted question/answer clarity problems. Both support packs now share identical Malay prompts, explanations, answer keys and Malay option text, with independent English and Simplified Chinese support text. The validator checks Malay prompt/answer script, support-language script, unique options, answer-key membership, curriculum lesson/topic/difficulty/objective mapping, batch distributions and cross-pack parity.

## Staging migrations applied successfully

1. `20261127091352_swiftdictionary_update_3_0_malay_quiz_runtime` — secure server-side Malay Quiz runtime and language constraints.
2. `20261127091401_swiftdictionary_update_3_0_malay_quiz_content_release` — owner-authorized staging-only 240-question content release.

Both versions are present in the hosted staging migration ledger. Staging verification returned:
- 240 Malay Quiz rows; all 240 approved and timestamped.
- 120 Malay→English and 120 Malay→Simplified Chinese questions.
- 36/36/48 difficulty counts in each support-language pack.
- Zero invalid lesson/topic/difficulty catalogue links.
- Zero malformed language/answer-type records.
- Zero persistent Malay sessions or smoke-test users after verification.

The hosted staging database was exercised through authenticated public RPCs inside transactions that were rolled back. Malay→English Beginner session creation returned ten questions and kept answer keys/explanations private. Malay→Chinese session creation used the correct support pack and Chinese translation. Malay self-translation retained a Malay display preference while the runtime used the English support snapshot. No smoke-test user, session or answer reservation persisted.

## Automated regression

On application head `da5389c19b78d7d831551e7a8b13ba1c24b5f8ff`:
- U3.0 architecture/content regression: passed after correcting one outdated test that still expected Malay Quiz to be disabled.
- Cloudflare build-routing guard: passed.
- U2.9 English Dictionary QA: passed.
- U2.5 Flashcards regression: passed.
- U2.6 ACL drift regression: passed.
- Quiz database PostgreSQL job: passed, including question-bank validator, staging-release migration, authenticated RPC tests and allowance/session tests.
- Quiz local Supabase Auth/RPC/Chromium workflow: Auth/RPC and content release steps passed; authenticated Chromium Quiz and later cross-feature browser/security steps were still running at the time of this checkpoint.
- U2.3 allowance/Dashboard and U2.7 Chinese Dictionary workflows: PostgreSQL portions passed; browser/local Auth portions were still running.

Relevant run links:
- [U3.0 architecture 45971733925](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971733925)
- [Quiz database 45971734014](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971734014)
- [U2.3 allowance/Dashboard 45971733943](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971733943)
- [U2.7 Chinese Dictionary 45971734010](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971734010)
- [U2.6 ACL 45971734018](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971734018)
- [U2.5 Flashcards 45971733941](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971733941)
- [U2.9 English Dictionary 45971733971](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971733971)
- [Cloudflare routing 45971734012](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45971734012)

## Staging preview

Cloudflare Pages deployment for commit `da5389c` succeeded:
- [Commit-specific preview](https://593e1f28.swiftdictionary.pages.dev)
- [Stable feature-branch preview](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev)

The Pages check is successful. Staging Google OAuth, owner desktop/mobile acceptance and end-user visual acceptance still require the owner's browser test.

## Security and legal notes

The private Quiz tables remain in the non-exposed private schema; public RPC wrappers remain SECURITY INVOKER; private implementations derive identity from `auth.uid()`, use fixed search paths and explicit grants. Answer keys/explanations are not returned in active-session payloads and are evaluated server-side.

The staging security-advisor snapshot reports ten informational `rls_enabled_no_policy` notices on existing private-schema tables and one warning that leaked-password protection is disabled. These were not changed. The private tables must not be exposed through browser grants as a shortcut. The health-advisor result was empty.

Before public launch, retain original content provenance and model/source licence evidence, and review Malaysia PDPA 2010 and the 2024 amendments, privacy notice, retention/deletion, processor terms and cross-border processing with qualified counsel.

## Release boundary

- Staging Quiz capability is enabled in the feature branch.
- Staging has the 240-question playable Malay Quiz bank.
- Malay Flashcards remain disabled.
- PR #20 remains draft and unmerged.
- Production application and Supabase remain untouched.
- No public launch or production content approval has been made.
