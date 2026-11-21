# SwiftDictionary Update 2.7.0 — Development Continuation and Linguistic QA

Date: 2026-11-21

## Purpose

Continue from the latest Master Development Record and U2.7.0 conversation archive, inspect the current feature branch, perform a focused linguistic data review, and establish the next safe release gate.

## Source-of-truth documents reviewed

- `docs/MASTER-DEVELOPMENT-RECORD.md` on `docs/master-development-record`.
- `docs/UPDATE-2.7.0-DEVELOPMENT-PLAN.md`.
- `docs/conversation-archive/README.md`.
- Latest U2.7.0 archives: planning finalization, dictionary/Chinese Lessons progress, and implementation audit/QA checkpoint.
- Current application branch: `feature/update-2-7-0-chinese-dictionary-lessons`.

## Confirmed current implementation

- Dictionary data file: `data/chinese-characters.js`.
- Chinese dictionary expansion file contributes 519 new unique single-character records; combined with 206 existing entries the target catalogue is 725 unique characters.
- Eleven category values are represented: Actions, Expressions, Communication, People, Objects, Nature, Places, Time & Numbers, Emotions & States, Descriptions, Grammar & Function.
- Pinyin A–Z filtering indexes every listed reading; category and search filters can be combined.
- Dictionary grid remains character-only. Do not add pinyin to Dictionary cards.
- Chinese Lessons are stored separately in `data/chinese-lessons.js`, with 17 lessons and 112 questions (Beginner 7/44, Intermediate 5/34, Advanced 5/34).
- Lesson renderer places Chinese text first, pinyin directly underneath, and English support after it.
- Language-aware progress migration is `supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql`.
- Existing shared Free 5 / proposed Premium 15 permanent-lesson daily allowance is preserved across both learning languages.

## Work performed in this session

1. Read the latest Master Development Record and relevant U2.7.0 plan/archive documents before continuing.
2. Confirmed the application branch is `feature/update-2-7-0-chinese-dictionary-lessons`; no open U2.7.0 PR was found.
3. Retrieved the actual application source through the Git blob API after the file-content endpoint returned an empty body for the large `index.html`. The blob is the full 1,017,232-character application source at the branch's then-current source SHA `899ba69484b0e7a4f2a21e255c4c43b8796af2cc`.
4. Inspected the new Chinese dictionary data: 519 records, 519 unique character identities, all single-character entries, no missing core fields, all 11 category values valid, and 80 records with multiple listed readings.
5. Inspected the Chinese lesson dataset: 17 lessons and 112 questions; 716 bilingual text objects were found with Chinese, pinyin and English fields populated. A simple token-count comparison is not a valid pinyin-alignment test because pinyin is syllabified while Chinese text includes punctuation, Latin examples and formatting; automated presence checks do not establish linguistic correctness.
6. Checked selected pronunciation issues against the Ministry of Education's Revised Mandarin Chinese Dictionary:
   - `喂`: the source lists only `wèi`, not `wéi`; removed the unsupported alternate `wéi` from the new dictionary record and clarified its note.
   - `待`: corrected the pinyin of the related phrase `待在家` from `dài zài jiā` to `dāi zài jiā`. The example `等待` remains `dài`.
   - The same reference confirms `跑` has `pǎo` and `páo`, with `páo` meaning an animal digs the ground with its feet; retain this as a restricted secondary reading, not a common everyday reading.
   - The reference records `骑` with a historical/nominal `jì` reading; modern Mainland standard usage may differ, so it remains a manual-review item rather than being silently removed in this pass.
   - The reference records `玩` with `wán` and a literary `wàn` reading; ensure any secondary reading is clearly labelled as literary/restricted if retained.
7. Committed the two targeted dictionary corrections to the feature branch:
   - Commit: `e7d911f72d443e07eb6aa47a80229711a9288c05`
   - File: `data/chinese-characters.js`
   - New blob: `81069e2f3a1e8dd21043f5d92e374094dba39c4e`
8. No Supabase hosted migration, staging configuration change, production setting, merge or deployment was performed.

## External linguistic references consulted

- Ministry of Education, Taiwan, Revised Mandarin Chinese Dictionary — `喂`: https://dict.revised.moe.edu.tw/dictView.jsp?ID=11450
- Ministry of Education, Taiwan, Revised Mandarin Chinese Dictionary — `跑`: https://dict.revised.moe.edu.tw/dictView.jsp?ID=687
- Ministry of Education, Taiwan, Revised Mandarin Chinese Dictionary — `骑`: https://dict.revised.moe.edu.tw/dictView.jsp?ID=6279
- Ministry of Education, Taiwan, Revised Mandarin Chinese Dictionary — `玩`: https://dict.revised.moe.edu.tw/dictView.jsp?ID=11485

These are reference checks, not a full native-speaker review of all 725 entries or 716 lesson text blocks.

## Verification status

- Previously recorded U2.7.0 static/data, Chromium, PostgreSQL and disposable local Supabase/Auth/RPC checks passed at the earlier feature-branch heads, including workflow runs #44881091752 and #44881091714.
- The connector did not return workflow runs for the new commit through its PR-only commit-run lookup. Therefore the new pronunciation edits are **not yet claimed as CI-verified**.
- The two edits are small data-only changes, but the U2.7.0 static/data and browser workflows must be rerun or otherwise confirmed on commit `e7d911f72d443e07eb6aa47a80229711a9288c05`.
- The full manual linguistic review remains outstanding, particularly the 80 polyphonic entries, context-specific readings, tones, examples, Simplified forms, HSK candidate levels and all Chinese lesson pinyin.
- Owner preview testing remains outstanding.

## Legal, privacy and licensing boundary

The Malaysia PDPA and international/16+ risk planning in Section 12 of the U2.7.0 plan remains the current record. Formal legal/privacy review is deferred, not cleared. The dictionary source notices do not certify compliance. CC-CEDICT-derived material must remain free and unrestricted under its applicable CC BY-SA 4.0 terms. Existing 206-entry provenance remains an open review item.

## Next development gate

The next technical release step is owner-approved Singapore staging validation of the language-aware lesson migration and Cloudflare preview. The migration has only been exercised in disposable local CI so far. Do not apply it to hosted Singapore staging until the owner explicitly approves that specific staging migration. Production migration, merge to `main`, and production deployment each require separate explicit approval after staging and QA.

## Exact recovery point

- Application branch: `feature/update-2-7-0-chinese-dictionary-lessons`
- Latest application commit from this session: `e7d911f72d443e07eb6aa47a80229711a9288c05`
- Changed file: `data/chinese-characters.js`
- Documentation branch: `docs/master-development-record`
- Next action: rerun/confirm CI for the latest application commit, then request explicit approval before applying the migration to Singapore staging.
