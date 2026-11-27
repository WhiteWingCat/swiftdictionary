# SwiftDictionary U3.0 — Continuation and latest CI recovery point

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Test-only correction commit:** `20bf0e38b4c3073ae2d6d428ea61692850d8715a`  
**Documentation branch:** `docs/master-development-record`  
**PR:** #20 — draft/unmerged  
**Production:** untouched

## Owner request

Continue the remaining U3.0 work after the latest staging test. The authoritative plan and preceding Malay feedback archive were read before continuing.

## Findings and correction

The latest feature-head U2.7 Chinese Dictionary workflow failed at one legacy assertion in `tests/update-2-7-0/check-lessons-ui.mjs`. The assertion expected the literal `class="lesson-english-line"` string in the HTML, although the current renderer creates this class dynamically and the stylesheet contains its style rule. The runtime was not broken. The test now checks the English translation branch, the renderer's class token and the CSS selector. Commit `20bf0e38b4c3073ae2d6d428ea61692850d8715a` contains only this test correction.

## Latest workflow evidence on preceding feature head

| Workflow | Run | Result at checkpoint |
|---|---:|---|
| U3.0 Phase 1 architecture | 45982549101 | Passed |
| Cloudflare build routing | 45982548791 | Passed |
| Quiz DB foundation | 45982548937 | PostgreSQL passed; local Auth/RPC in progress |
| U2.5 Flashcards | 45982548915 | Static passed; Chromium cancelled by concurrency, rerun requested |
| U2.3 allowance/Dashboard | 45982549041 | PostgreSQL and local Supabase CLI passed; Chromium in progress |
| U2.6 ACL | 45982548979 | PostgreSQL passed |
| U2.7 Chinese Dictionary | 45982549061 | PostgreSQL passed; one stale UI assertion failed |
| U2.9 English Dictionary | 45982548960 | Passed |

Reruns were explicitly requested for the failed U2.7 job `140449878661` and cancelled Flashcards Chromium job `140450000784`. Their outcomes must be checked. The test correction commit also requires its own current-head regression verification.

## Remaining U3.0 product gaps

- English/Chinese Quiz banks do not yet have Malay support-language question packs.
- English/Chinese permanent lesson reader Malay translations cover topic, title, summary and main explanation; practice prompts/options remain in source language.
- English/Chinese Flashcard Malay support remains partial: 73 English and 124 Chinese entries. Cards without explicit translations are safely excluded.
- Malay Dictionary/learning translations remain editorial drafts except the separately owner-authorised staging Quiz content release; staging approval is not production approval.
- Staging OAuth, owner desktop/mobile linguistic acceptance and complete automated/browser/security regression remain open.

## Safety and legal/privacy

No Supabase migration, staging database mutation, production database mutation, PR merge or production deployment was performed during this continuation. Keep PR #20 draft/unmerged. Maintain Malaysian Standard Malay, original authorship/provenance, model licence/attribution review and the Malaysia Copyright Act 1987 / PDPA 2010 and 2024 amendments / international age and cross-border privacy checks before public activation. This is planning guidance, not legal advice or clearance.

## Exact next actions

1. Check the two rerun jobs and workflows triggered by `20bf0e38b4c3073ae2d6d428ea61692850d8715a`.
2. Complete translation coverage for English/Chinese lesson practice and Quiz, and expand Flashcard Malay overlays in small validated batches.
3. Keep missing language pairs explicitly unavailable until their content and runtime checks pass.
4. Re-run full cross-version CI, verify the current Cloudflare Pages staging preview and staging OAuth, then request owner desktop/mobile acceptance.
5. Do not merge or deploy production without separate explicit approval.
