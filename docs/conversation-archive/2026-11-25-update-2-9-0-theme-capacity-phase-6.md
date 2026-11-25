# Update 2.9.0 — theme clarification, active collection capacity and Phase 6 start — 2026-11-25

## Owner feedback and decisions

The owner reviewed the latest U2.9.0 staging preview and clarified three items:
1. The overall SwiftDictionary page background remains dark. Panels should use the existing deep-blue Favorite words Dashboard surface, not white. Apply the same surface to Premium page panels, custom dropdowns, dialogs and prompts.
2. Folder capacity is now approved as an active mechanic: Free 16, Premium 40. Do not show capacity counts in Your Collections. When creation is attempted at the limit, show an in-site plan-specific notification. Never delete existing folders on downgrade.
3. English saved-word cards in Your Collections must not compress; retain Dictionary card dimensions and responsive sizing.

The owner also asked that the next planned phase proceed alongside this feedback.

## Theme implementation

- Updated `premium-plan.css` and `premium-plan.html` to use the existing dark page shell, deep-blue panel gradients, dark-blue comparison cells and notes, restrained shadows, blue accents and reduced-motion support.
- Updated Your Collections' injected styles: custom folder menus, add/rename/remove dialogs, inputs, membership rows and prompts use deep-blue surfaces. The modal backdrop is darker and blurred.
- Favorite words and Your Collections continue to share the same panel class/surface.
- Intentionally light stroke-order drawing canvas remains unchanged because it is a functional paper-like drawing surface, not a UI panel.

## Active 16/40 folder capacity implementation

- Added `supabase/migrations/20261125101500_swiftdictionary_update_2_9_0_favorite_collection_capacity_limits.sql`.
- Applied the migration successfully to isolated staging project `ivatvkfrtifgfheeaelj`. No production database was modified.
- Authenticated direct INSERT on `public.favorite_collections` is revoked and the insert RLS policy is removed. Creation goes through `public.create_my_favorite_collection(text)`, a SECURITY INVOKER wrapper over a private SECURITY DEFINER function.
- The private implementation derives identity from `auth.uid()`, checks the active entitlement and validity dates, defaults missing/inactive/expired entitlements to Free, takes a transaction-scoped per-user advisory lock, counts that user's existing folders and inserts only below the plan cap.
- Free cap: 16. Active Premium cap: 40. No count or capacity meter appears in Your Collections.
- At capacity, the UI displays an accessible in-app error that states the applicable plan/limit and asks the user to remove an existing folder before creating another.
- Downgrade behaviour preserves all existing folders and memberships. The lower Free limit only blocks additional folder creation until the count is below 16 or Premium is active again.
- Premium remains unavailable for purchase. No checkout, payment provider, subscription activation or entitlement mutation was added.

## Database validation

- Updated `supabase/tests/favorite_collections.sql` for RPC-only creation and the reduced set of direct collection policies.
- The complete SQL regression passed against isolated staging in a transaction. It covered collection ownership and cross-account isolation, direct INSERT denial, RPC privileges, Free folder 17 rejection and Premium folder 41 rejection. All test folder and entitlement changes rolled back.
- The migration's active entitlement lookup was checked against existing `user_entitlements` schema and current plan limits. No learning allowances were changed.
- Supabase health advisor returned no findings. Security advisor continues to show the pre-existing 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning; no collections-specific issue was introduced.

## English word-grid sizing

- English collection grid now uses the Dictionary `word-grid` / `word-card` base style with a minimum 110px track and 58px card height, so the inner folder padding cannot compress cards below the intended size.
- Chinese character collections retain a 66px minimum track and 1:1 square cards.
- Added browser assertions for the English minimum track/card height and Chinese square behaviour.
- An earlier browser run on commit `358cf32` failed the first sizing assertion because the test compared absolute track widths in different-width parent containers; it also found a non-exact Premium status locator. The CSS now sets the 110px minimum explicitly and the test checks that minimum instead of comparing absolute track widths; the Premium locator uses exact text matching.

## Phase 6 optional English learning content expansion

- Inspected the English permanent lesson catalogue, the English Quiz draft bank, curriculum objective map and Flashcards data source.
- Added 15 original bilingual English Quiz draft questions (five Beginner, five Intermediate, five Advanced) to `content/quiz/questions.en-zh.draft.json`, aligned with existing lesson objectives in `b-articles`, `i-collocations` and `a-near-synonyms`.
- Draft bank now contains 214 questions: 129 knowledge, 15 word-definition and 70 Chinese-translation questions. The source remains draft-only; no questions were approved, imported into staging or made live.
- Updated `content/quiz/README.md` to reflect the 214-question draft count.
- Verified that English Flashcards already uses the full `englishWords` dictionary dataset, including the U2.9.0 English expansion. No duplicate English Flashcard vocabulary bank was added; existing recall modes, timing, progress and allowances are unchanged.
- Added `node scripts/quiz/validate-question-bank.mjs` to the U2.9.0 QA workflow and enabled the existing disposable local Supabase Quiz/Auth/RPC regression workflow for the U2.9.0 feature branch. Human bilingual/factual review remains required before any future content approval.

## Automated QA and deployment status

- The earlier relevant browser run reported 14 passed and 2 failed. Both failures were isolated to the new test assertions and have been corrected as described above.
- New full U2.9.0 browser, dictionary, Chinese, Flashcards, allowance, ACL, routing and Quiz/Auth regression runs were queued after the fixes. Do not mark them passed until the latest commit's checks finish.
- A new Cloudflare Pages preview must be generated from the latest feature branch commit and checked to route only to isolated staging Supabase before it is handed to the owner.
- PR #18 remains open on `feature/u2-9-0-collections-feedback`. No merge, production migration, production deployment or Premium purchase/activation occurred.

## Legal/privacy review

Folder caps use existing account identity and existing account-owned collection rows; no new personal-data category, processor, tracking or transaction was added. Existing folders must remain intact on downgrade. Premium is not available to purchase. Any real Premium launch requires a separate Malaysia-specific and international privacy, consumer and payment review. This is planning, not legal advice or compliance clearance.


## Follow-up validation and Quiz release boundary — 2026-11-25

- The U2.9.0 QA run on feature commit `7a1aaea` passed English dictionary validation, category/translation audit, whole-catalogue audit, 214-question Quiz draft validation, Mock Quiz/Flashcards regression tests and **16 Playwright browser tests**.
- The 15 new Phase 6 Quiz questions remain draft-only. To preserve the earlier owner-authorized 199-question release, the first 199 source questions are marked `release_approved: true` and the 15 Phase 6 additions are `false`. Default SQL export includes all 214 as drafts; `--approve-for-release` exports only the previously authorized 199. No Phase 6 addition was approved or made live.
- Updated `mock-testing.js` for the 214-question source bank while preserving the old 199-question release subset and 56/62/81 release distribution. Updated the draft-import SQL assertion to verify all 15 Phase 6 rows remain draft, map to active lessons/objectives and contain valid four-option answer records.
- The disposable Quiz database foundation job passed both the 214-question draft import and the separate 199-question approved release-export regression.
- Cross-version tests on the same feature commit passed: Flashcards unit/mock and Chromium browser tests; Chinese dictionary and lesson browser tests; U2.7 lesson-start allowance; U2.3 allowance/dashboard; U2.6 ACL; PostgreSQL migration/allowance; Chromium regression smoke; and Cloudflare build-routing guard.
- Cloudflare Pages successfully deployed commit `7a1aaea`: unique URL https://bf0603b6.swiftdictionary.pages.dev and branch preview https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev. The Pages deployment and build-routing guard passed.
- The separate `Workers Builds: swiftdictionary-testing` check failed again. This is independent from the successful Pages deployment and should be triaged as a Workers build configuration/infrastructure issue.
- The separate Local Supabase Auth/RPC integration job was still running authenticated Quiz runtime tests, signed-out Flashcards/Preferences, permanent Lessons allowance notification and local security-advisor checks at the time of this archive update.
- No production migration, production merge, production deployment, Premium payment or entitlement assignment occurred.


## Additional regression discovered during full authenticated testing

- A local Auth/Quiz integration run exposed a race in the existing permanent lesson confirmation flow. The allowance refresh could re-render the lesson list while the confirmation dialog remained open, detaching the original lesson card button; confirming then did not continue the start.
- Fixed by adding stable `data-lesson-id` values to lesson cards and resolving the current card after re-render before continuing. If the replacement card is disabled, the user now receives the relevant status message.
- Extended the authenticated Quiz runtime test to force a topic-filter re-render while the confirmation is open, and extended the U2.7 static UI test for the stable-ID fallback.
- This failure happened before Quiz launch and was not caused by the Phase 6 draft questions. The updated authenticated local Supabase run on commit `78280d4` was still in progress at the time of this addendum.


## Final consolidated QA and staging handoff — 2026-11-25

- Latest feature commit `78280d4` passed the U2.9.0 English QA workflow, including 16 Playwright browser tests, Quiz draft validation, Mock Quiz/Flashcards regression and whole-catalogue audits.
- Local Supabase Auth/RPC integration passed, including authenticated Quiz runtime, signed-out Flashcards/Preferences, permanent Lessons allowance notifications, local security advisors and the lesson confirmation re-render test. The lesson-start race fix is verified.
- Quiz database foundation passed the 214-question draft import and the separate 199-question previously owner-authorized release export. The 15 Phase 6 questions remain draft-only and excluded from the approved release.
- Cross-version checks passed: U2.3 allowance/dashboard, U2.5 Flashcards and Chromium mock-user browser, U2.6 ACL, U2.7 Chinese dictionary/lessons and lesson-start allowance, PostgreSQL migration/allowance, Chromium regression smoke, Supabase CLI local Auth and Cloudflare build-routing guard.
- Cloudflare Pages deployed commit `78280d4`: unique preview https://b7576dea.swiftdictionary.pages.dev; branch preview https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev; Premium comparison at `/premium-plan.html`.
- The separate `Workers Builds: swiftdictionary-testing` check failed. Pages and its build-routing guard passed. The failed check belongs to a separate Cloudflare Workers production build and remains an infrastructure item to triage.
- The staging Free 16 / Premium 40 migration and complete transactional SQL regression passed. No production migration, merge, payment flow or entitlement assignment occurred. PR #18 remains open for owner review.
