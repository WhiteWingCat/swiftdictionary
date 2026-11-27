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

## Follow-up fixes after first reruns

### English lesson practice translation regression

U2.7 browser checks passed after the static assertion was corrected, but a U2.3 browser test then exposed a real regression: `lessonPractice` ignored the existing Chinese practice translation map and returned only English source prompts/options. Updated the shared resolver to use `lessonZh[lessonId].practices` for English→Chinese, preserving option shuffle order and answer identity. Malay practice is used only when a real explicit per-question Malay record exists; otherwise the source language is retained. Commit: `a200261170be9f970f8d791f04d30bc6cb3536b7`.

The U3 staging regression test was updated to assert this translation-aware selection and safe fallback (commit `bd26c3054bfe6c4f0c43d0bb7d6a8ee51378c8f2`).

### Quiz authenticated test fixture

The Quiz PostgreSQL run failed in the existing Premium no-repeat scenario with `topic_coverage_unavailable`. Investigation showed that the synthetic test bank had only five topics. The production selection algorithm uses a per-topic cap and a random greedy no-repeat strategy; over three Premium sessions, a small test fixture could randomly consume topic diversity even though the intended runtime rule was correct. Expanded the isolated SQL fixture to eight topics and eight matching lesson catalogue rows (commit `9ed29866c160c3abadca2701420140cb4add8619`). No production Quiz runtime or content was changed by this fixture fix.

### Dictionary translation generator

A comment-only trigger commit was pushed to the watched manual-overrides path to invoke the existing offline Argos generation workflow: `e19731b683297a4e3d96d17331bfc713a0f9b149`. The generator's output was still zero bytes at the last inspection. The workflow run/output must be independently verified before claiming 1,316 English / 1,931 sense and 725 Chinese / 825 sense Malay Dictionary translation coverage.

## Latest CI status

On `bd26c305`, U3.0 architecture (45983294047), Cloudflare routing (45983293929), U2.7 Chinese (45983293926), U2.6 ACL (45983294155), U2.5 Flashcards (45983293915), U2.3 allowance/Dashboard (45983293897) and U2.9 English Dictionary (45983293986) passed. The Quiz DB job was cancelled by concurrency.

On `e19731b`, U3.0 architecture (45983789213), Cloudflare routing (45983789172) and U2.9 English Dictionary (45983789246) passed. U2.7 PostgreSQL passed while its Chromium job continued (45983789192); U2.3 PostgreSQL passed while Auth/Chromium continued (45983789272); U2.5 static passed while Chromium continued (45983789263); U2.6 ACL and Quiz DB/Auth were still running or queued (45983789194 and 45983789207). These do not yet constitute full acceptance.

Remaining gaps: English/Chinese Quiz target-Malay packs; Malay target translations for English/Chinese lesson practice prompts/options; full English/Chinese Flashcard Malay coverage; generated dictionary overlay validation; final browser/security matrix; staging OAuth; owner desktop/mobile acceptance. No production action is authorised.