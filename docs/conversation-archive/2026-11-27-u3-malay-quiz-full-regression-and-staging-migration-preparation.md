# SwiftDictionary U3.0 — Malay Quiz full regression and staging migration preparation

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated application head:** `06778339a692d0a1f9818b8d62aebdfd0b623f39`  
**Staging Supabase project:** `ivatvkfrtifgfheeaelj`  
**Production Supabase project:** `pzymiesazmpyvnfvsbsc` — untouched

## Owner request and scope

The owner asked to finish the full regression run and prepare the staging-only Malay Quiz migration after reviewing the latest Master Development Record, U3.0 development plan and current Malay Quiz conversation archives.

This checkpoint supersedes earlier notes that described the latest feature-head CI as pending. The complete automated regression matrix is now green on the validated application head.

## Malay Quiz content inventory

The Malay Quiz bank contains **120 questions per support-language pack**:

| Batch | Beginner | Intermediate | Advanced | Total per pair |
|---|---:|---:|---:|---:|
| 01 | 4 | 4 | 4 | 12 |
| 02 | 12 | 12 | 12 | 36 |
| 03 | 10 | 10 | 16 | 36 |
| 04 | 10 | 10 | 16 | 36 |
| **Total** | **36** | **36** | **48** | **120** |

The two packs are Malay→English and Malay→Simplified Chinese: **240 draft records combined**. Every record has a stable question ID, source lesson, topic, objective, difficulty, four distinct answer options, correct-option reference and support-language text. The validator enforces the per-batch and cumulative distributions, uniqueness, curriculum mapping and draft-only state. All content remains unapproved pending competent Malaysian Standard Malay and independent support-language review. The language manifest continues to keep `capabilities.quiz:false`.

## Secure server-side runtime and migration review

Candidate migration:

`supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql`

Blob SHA: `0585eba939aeafcc9b24ea664709eb16e1ce56a1`.

The additive migration:
- Extends the three existing private Quiz answer/snapshot language constraints from `en/zh` to `en/zh/ms`, validates them, and preserves the existing question-type constraints.
- Adds private Malay availability and start-session implementations and routes the existing public availability/start RPCs according to the caller's saved learning course.
- Keeps the question bank, answer keys, explanations and session snapshots in the non-exposed `private` schema.
- Uses authenticated, owner-scoped access, `auth.uid()`, fixed search paths, explicit grants and SECURITY INVOKER public wrappers around private implementations.
- Reuses the existing session snapshot, answer-save, submit/scoring, review, abandon, allowance and no-repeat machinery. No client-supplied correct answer is trusted.
- Preserves the existing Quiz start-allowance semantics: a new session consumes one start allowance through the existing session trigger; resuming does not charge again; abandonment does not refund the start; submission does not add a second charge.
- Supports Malay→English and Malay→Simplified Chinese. For `ms → ms`, the server uses the English support snapshot internally while the UI remains Malay-only.

No draft-bank import or approval is part of this schema migration. Draft content must remain draft until the separate content-review/release decision.

## Full automated regression result

All workflows below completed successfully on application head `06778339a692d0a1f9818b8d62aebdfd0b623f39`:

| Workflow | Result |
|---|---|
| U3.0 architecture, adapters, translation and content parity — [45964373403](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373403) | Passed |
| Cloudflare build-routing guard — [45964373304](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373304) | Passed |
| U2.3 allowance and Dashboard regression (PostgreSQL 17, Chromium and local Auth) — [45964373204](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373204) | Passed |
| U2.5 Flashcards regression (including Chromium) — [45964373468](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373468) | Passed |
| U2.6 ACL drift regression — [45964373256](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373256) | Passed |
| U2.7 Chinese Dictionary and lesson-start/allowance regression — [45964373410](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373410) | Passed |
| U2.9 English Dictionary QA — [45964373423](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373423) | Passed |
| Quiz database foundation — [45964373238](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373238) | Passed |

The Quiz database workflow passed both jobs: PostgreSQL 17 foundation tests and disposable local Supabase Auth/RPC integration. The local Supabase job applied the U3.0 Malay enablement fixture and candidate runtime migration; verified explicit grants; imported and asserted all 240 Malay records as drafts; validated the existing 199-question release export; seeded only synthetic approved test content; ran authenticated Malay session tests; ran Chromium Quiz browser tests; ran Flashcards, Preferences, Lessons and Chinese Dictionary regressions; and ran local security advisors.

Authenticated Malay runtime assertions covered Beginner (10), Intermediate (15) and Advanced (20), both support-language pairs, same-language Malay display fallback, answer-key/explanation redaction before submission, server-side score evaluation, answer reveal only in completed review, cross-account review denial, one allowance charge on session creation, no second charge on resume and no refund on abandon.

The earlier failures were corrected before this green run: the Quiz-only Malay lesson fixture avoids the unrelated Daily Discovery rotation uniqueness collision; integration users use isolated UUIDs; the migration no longer duplicates the existing start-allowance trigger; the SQL exporter writes its status line to stderr; and browser assertions now wait for serialized answer saves and expect all four Daily History groups. No runtime security or validation rule was weakened to obtain a pass.

## Hosted staging preflight — read-only

The dedicated staging project is healthy. Its migration history currently includes the three Phase 3 Malay enablement/catalogue migrations but does **not** include version `20261127130000`.

Read-only SQL confirmed:
- One active Malay language registry row exists.
- Zero Malay Quiz question-bank records exist.
- Zero approved Malay Quiz questions exist.
- Zero Malay Quiz sessions exist.
- The three Quiz language constraints still accept only `en` and `zh`; the candidate migration is therefore still required.
- No hosted staging migration or seed was executed.

The staging security-advisor snapshot reports informational RLS-without-policy notices on private-schema tables and the existing leaked-password-protection warning. These are baseline findings; no staging security setting was changed. The private-schema RLS posture must be reviewed in context and must not be “fixed” by granting browser access to private Quiz tables.

## Staging approval boundary and next gate

The candidate SQL and disposable-local integration evidence are prepared, but the hosted staging migration has **not** been applied. The owner's wording was to prepare the migration, not to authorise its execution. A separate explicit approval is still required after the owner reviews the exact SQL and staging diff.

Until that approval:
- Do not apply migration `20261127130000` to hosted staging.
- Do not import the 240 draft questions into hosted staging.
- Do not mark any Malay question approved or enable the Malay Quiz capability.
- Do not merge PR #20, merge the feature branch, or deploy production.
- Keep production Supabase and its migration ledger untouched.

The stable Cloudflare Pages preview alias is `https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev`; its deployment at the exact validated head and staging Google OAuth have not been independently confirmed in this checkpoint. Owner desktop/mobile browser acceptance and Malay linguistic/translation review remain outstanding.

## Malaysia and general legal/privacy planning

The Quiz questions are independently authored; no DBP/PRPM/Kamus Dewan entries or third-party question bank were copied. Preserve per-item authorship/provenance and machine-assisted translation status. Before public activation, complete rights and model-artifact licence/attribution review.

Quiz account IDs, submitted answers, scores, timestamps and progress are personal data. The migration reuses existing account-scoped learning data structures and does not add device fingerprinting, raw keystroke capture or unrelated telemetry. Before public launch, review Malaysia PDPA 2010 and the 2024 amendments, privacy-notice purpose/retention wording, processor terms, access/deletion coverage and cross-border processing for the actual hosting regions. This is planning guidance, not legal advice or a compliance certification.

## Recovery point

- Application branch: `feature/update-3.0-phase-0-audit`
- Validated application head: `06778339a692d0a1f9818b8d62aebdfd0b623f39`
- Candidate migration: `supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql`
- Migration blob SHA: `0585eba939aeafcc9b24ea664709eb16e1ce56a1`
- Staging project: `ivatvkfrtifgfheeaelj`, schema unchanged by this session
- PR: [#20 — U3.0 Phase 3 staging preview](https://github.com/WhiteWingCat/swiftdictionary/pull/20), draft and unmerged
- Production project: `pzymiesazmpyvnfvsbsc`, untouched
