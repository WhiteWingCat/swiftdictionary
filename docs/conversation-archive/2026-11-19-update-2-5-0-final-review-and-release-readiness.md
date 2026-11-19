# Update 2.5.0 — owner final review fixes and release-readiness gate (2026-11-19)

## Owner decision and scope

The owner completed the latest testing preview review and reported two remaining defects:

1. Lesson titles and descriptions still did not display in Simplified Chinese.
2. Quiz and Flashcards first-time introduction prompts still did not appear on first entry.

The owner requested both fixes plus a release-readiness review and merge decision, and explicitly said no further Mock User testing was needed. No merge, deployment or database migration was authorised by this request.

## Investigation and fixes

### Lessons title/description translation

- Audited the frontend lesson catalogue and its Simplified Chinese map.
- Confirmed all 17 permanent lesson IDs have Chinese title and summary metadata, including the two new Update 2.5.0 lessons.
- Identified the defect in `refreshTranslationViews()`: it re-rendered an open lesson reader but did not re-render the lesson-library cards, which use `lessonField()` for localized topic/title/summary values.
- Added a conditional `renderLessons()` call when the Lessons page is visible and the learner is viewing the library rather than an active lesson reader.

### First-entry Quiz/Flashcards introductions

- Reviewed the guide preference loader, dismissal persistence, page navigation wrapper and authentication refresh path.
- The previous navigation wrapper depended on the URL hash matching the page argument. This could miss the guide when route state and actual page visibility were temporarily out of sync.
- Changed the trigger to check the target page's actual visibility after preferences load.
- Changed auth refresh to identify the currently visible learning page rather than infer it solely from the hash.
- Added a MutationObserver fallback watching visibility changes on Lessons, Quiz and Flashcards, so initial hash navigation or other future visibility-based navigation paths also trigger the guide.
- Added a guard against rendering the same guide twice while it is already open.
- Existing stored dismissal preferences are preserved. A previously dismissed guide should not reappear merely because of this fix.

## Implementation checkpoint

- Repository: `WhiteWingCat/swiftdictionary`
- Branch: `feature/update-2-5-0-flashcards`
- Commit: `71d8246fab2ef6f2d1d50109d1a0cee3d0420ad7`
- Changed application file: `index.html`
- PR #12: open, unmerged, target `main`.
- The changes are UI/rendering only; no schema, RPC or personal-data collection change was introduced.

## Validation and CI evidence

- Workflow #44496878670: JavaScript syntax and Flashcards page-integration checks passed; mock account/allowance/collection/timer regression tests passed (25/25); Chromium Mock User browser tests passed (14/14). This browser job ran automatically because the branch push triggers the repository workflow. No separate manual Mock User cycle was started.
- Workflow #44496878607: PostgreSQL Quiz foundation job passed. Local Supabase Auth/Quiz runtime integration was still in progress at the last status check. The preceding attempt's browser fixture failed because it did not provide the required three distinct topics for an Advanced Quiz (`Quiz requires at least three distinct topics`). The latest run is not marked passed until it completes.
- Workflow #44496878563: all jobs passed, including PostgreSQL 17 migration, policy, allowance-ledger, deletion, concurrency, browser smoke and local Supabase Auth compatibility.
- Prior workflow #44492546210 passed 25/25 mock account tests and 14/14 Chromium Mock User tests, but it predates commit `71d8246` and is not treated as validation of the latest fixes.

## Release-readiness review and merge decision

**Decision: hold PR #12; do not merge yet.**

Reasons:

1. The Quiz database foundation workflow was still in progress at the latest check; its companion PostgreSQL foundation job passed.
2. The Quiz runtime suite previously failed on insufficient synthetic topic coverage; confirm the current run completes and that no product defect remains.
3. The two new permanent lesson IDs still exist in the frontend and content-catalogue migration draft, but that catalogue migration has not been applied to staging or production. Live lesson completion remains gated on explicit owner approval and the appropriate migration.
4. Flashcards database migrations need ordered staging validation and explicit owner approval before production rollout.

PR #12 reports open and mergeable, with 171 commits and 24 changed files. GitHub's mergeable flag does not constitute a release approval. Merge, production deployment and staging/production migrations remain separate approval gates.

## Supabase and security review

- Flashcards tables are created in the non-exposed `private` schema and have RLS enabled.
- Direct browser-role table grants are revoked for the Flashcards foundation tables; the mode-specific review table is RLS-enabled and has no direct API policies/grants.
- RPC implementations derive the acting user from `auth.uid()`, use an empty `search_path`, and are exposed through narrow authenticated wrappers.
- Existing CI SQL coverage includes ownership, allowance enforcement, session lifecycle, deletion and concurrency behaviour.
- Source review is not a substitute for the pending Supabase security-advisor output or staging verification.
- Supabase CLI v3's 2026-11-04 breaking change alters local/hosted command targeting and confirmation behaviour. The current CI uses CLI v2.81.3; update deployment scripts and explicitly review remote targeting before adopting v3.

## Legal and privacy planning

The two final fixes change only page rendering and first-entry guide presentation. They introduce no new personal-data category, processor, analytics event, raw-answer telemetry or retention behaviour. Existing account-scoped dismissal preferences, Flashcards history and deletion controls remain unchanged. Continue the standing Malaysia PDPA and international/16+ privacy review before wider public/commercial expansion. This is planning, not legal advice or a compliance certification.

## Recovery and boundaries

Continue from branch `feature/update-2-5-0-flashcards`, commit `71d8246fab2ef6f2d1d50109d1a0cee3d0420ad7`. Keep documentation on `docs/master-development-record`. PR #12 remains open and unmerged. No production deployment, staging migration, production migration or production data operation occurred.
