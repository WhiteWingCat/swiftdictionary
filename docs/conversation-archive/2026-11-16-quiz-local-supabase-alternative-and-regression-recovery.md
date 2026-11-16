# Conversation archive — 2026-11-16 Update 2.4.0 continuation and environment decision

## Owner decision

The owner explicitly declined using a Supabase Development Branch and instructed development to continue with an alternative. No Supabase Development Branch may be created or used, and this decision does not authorize a paid plan, billing activation or new recurring infrastructure.

## Approved alternative

Continue Update 2.4.0 on `feature/update-2-4-0-quiz` and keep PR #8 draft. Use:
- Disposable local Supabase through Supabase CLI and Docker for Auth, RPC, RLS, migration and authenticated browser integration tests.
- PostgreSQL 17 in GitHub Actions for deterministic schema/foundation and migration assertions.
- Fresh synthetic Free/Premium Auth users and test-only approved question fixtures.
- Existing Cloudflare Pages branch preview with explicit `?swiftMock=1` for fictional UI-only Mock User testing, only after deployment/hostname is verified.

The Cloudflare preview frontend must still be treated as connected to production Supabase unless a verified separate backend is configured. Do not use real accounts or data-changing preview flows. The 114 authored Quiz questions remain draft; this environment decision does not approve their publication.

## Repository and CI investigation

- Repository: `WhiteWingCat/wordbook`.
- Feature branch: `feature/update-2-4-0-quiz`.
- PR: [#8 — Draft: SwiftDictionary Update 2.4.0 — Quiz backend and content pipeline](https://github.com/WhiteWingCat/wordbook/pull/8).
- Previous branch head: `a51e0ee2111e65a03541911298157c9896dc2c28`.
- Quiz workflow #314 (run ID 43848032541): PostgreSQL foundation passed; local Supabase Auth/RPC job failed one authenticated browser test. The failed test navigated from Quiz to Lessons and clicked a lesson while the newly added first-visit Lessons introduction overlay was still intercepting pointer events. The other Quiz browser tests passed, including translation fallback, introduction persistence/account isolation, Chinese-course gating, Premium allowance/session enforcement and signed-out restrictions.
- Companion 2.3.x workflow #926: PostgreSQL and local Supabase compatibility jobs passed; Chromium regression failed 13 unrelated Lessons/Daily Learning tests for the same reason—the new guide overlay was not dismissed by the older suite setup.

## Changes made

1. `tests/browser/update-2-3-0-smoke.spec.js`: added test-suite setup to dismiss the new learning introduction overlay for this legacy regression suite. Dedicated Quiz runtime tests continue to own the introduction behaviour assertions.
   - Commit: `f1ffc99d387899af8e06ff71a63196188b31bc8e`.
2. `tests/browser/update-2-4-0-quiz-runtime.spec.js`: the authenticated lesson translation/Quiz test now explicitly waits for and dismisses the separate Lessons introduction before clicking a permanent lesson.
   - Commit: `47ed08907d0b91dcb41d2f9cd196309326a997b7`.

These were test-only changes. No application source, database migration, question content, production Supabase configuration/data, main branch, merge or deployment was changed.

## Validation state at archive time

New checks for branch head `47ed08907d0b91dcb41d2f9cd196309326a997b7` were observed running:
- Quiz PostgreSQL 17 foundation.
- Quiz disposable local Supabase Auth/RPC/Chromium runtime.
- 2.3.x Chromium regression.
- 2.3.x PostgreSQL migration/allowance tests.
- 2.3.x local Supabase Auth compatibility.

Do not describe these checks as passed until their final conclusions are confirmed.

## Legal, privacy and release safeguards

Use only synthetic identities and synthetic test data in disposable environments. Do not copy production personal data or expose service-role/OAuth secrets. Quiz progress, answer selections, scores, history and temporary no-repeat reservations remain account-linked learning data; Malaysia PDPA and relevant international/teen privacy, retention and deletion review remains a release gate. This is planning guidance, not legal advice.

## Next recovery steps

1. Inspect all current CI checks on `47ed08907d0b91dcb41d2f9cd196309326a997b7` and fix any remaining failures.
2. Continue Quiz backend/frontend edge-case validation against disposable local Supabase only.
3. Verify the Cloudflare Pages preview build and exact hostname before sharing an owner-facing Mock User link. Use only the explicit `?swiftMock=1` mode and fictional Free/Premium identities.
4. Keep the 114 authored questions as drafts pending separate owner content approval.
5. Keep PR #8 draft. No production schema/content migration, merge or deployment without explicit owner approval.
