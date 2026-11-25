# Update 2.9.0 — Phase 4 final feedback and Phase 5 Premium Plan — 2026-11-25

## Owner instructions

The owner reviewed the latest Phase 4 staging preview and requested three final Collections changes:
1. Folder cards should be full-width horizontal rows rather than column-aligned.
2. Remove the X button from saved words inside Your Collections; users should manage membership through the shared detail-panel **Add to collection** action.
3. Match the Favorite words Dashboard card background and stop using the old dark-background visual design.

The owner also authorised Phase 5 to proceed concurrently and replaced the old Premium prompt/dialog with a dedicated page. The page must show a complete Free/Premium comparison across unlimited dictionary search, Daily Learning capacity, permanent lesson allowance, Quiz allowance, Flashcard allowance and Collections folder capacity.

## Documentation and planning

- Read the current Master Development Record, Update 2.9.0 plan, Phase 4 archive and latest repository state before implementation.
- Updated `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md` with the six comparison categories, exact allowance values, proposed folder caps, non-transactional boundary, responsive/accessibility acceptance criteria and Malaysia/general legal planning.
- Plan update was committed to `docs/master-development-record` as `431c7f561953259c979f02610b5c01398ac4e3f3`.

## Phase 4 implementation

On `feature/u2-9-0-collections-feedback` / PR #18:
- Changed the Collections folder list to one full-width column and retained the folder title/count and overflow menu on a horizontal row.
- Removed the per-word X/remove control and its CSS. Folder membership is now removed through the shared saved-word detail panel's **Add to collection** picker.
- Your Collections copies the same card class as the Favorite words card to match its background/surface styling.
- Replaced the older dark modal/menu treatment with light neutral surfaces, restrained borders/shadows and reduced-motion handling.
- Preserved mixed English/Chinese membership, existing folder CRUD, account scoping and private Broadcast design.

## Phase 5 implementation

- Replaced the previous modal listener in `premium-plan.js` with navigation to `premium-plan.html`.
- Added the standalone `premium-plan.html` page and responsive `premium-plan.css`.
- The page shows all six comparison areas in a complete comparison table:
  - Dictionary word-grid search: Unlimited for both plans.
  - Daily Learning: Free 1 and Premium 3 successful completions per day for each of Daily Topic, Daily Application, Daily Discovery and Daily Revision.
  - Permanent Lessons: Free 5 and Premium 15 new starts per local day.
  - Quiz: Free 1 and Premium 3 new sessions per local day.
  - Flashcards: Free 3 and Premium 10 new games per local day.
  - Collections folders: Free 16 and Premium 40, explicitly marked proposed/future only.
- Included explanatory notes for the shared English/Chinese daily category allowances, completion-based charging, local-time reset, lesson resume/completed review behaviour and future-only collection caps.
- Direct loading/refresh and return-to-app navigation are supported.
- No checkout, payment provider, purchase action, subscription activation, billing portal, entitlement mutation, plan switching or folder-cap enforcement was added.

## Entitlement and database boundary

A read-only query against the isolated staging Supabase project's `public.learning_plan_limits` confirmed:
- Free: Daily Topic 1, Daily Application 1, Daily Discovery 1, Daily Revision 1, Permanent Lessons 5, Quiz 1, Flashcards 3.
- Premium: Daily Topic 3, Daily Application 3, Daily Discovery 3, Daily Revision 3, Permanent Lessons 15, Quiz 3, Flashcards 10.

No Supabase write or migration was made for this feedback round. The 16/40 folder caps remain informational proposals and are not enforced. Production Supabase and `main` remain untouched.

## Automated tests and deployment

- Updated the collections Playwright tests for full-width horizontal rows, Favorite card background matching, absence of X controls, detail-picker removal/reassignment and saved-word preservation.
- Replaced the earlier Premium dialog tests with dedicated-page navigation, six-row content and mobile-fit tests.
- An initial test run exposed obsolete dialog expectations and two test-fixture/assertion issues. These were corrected; the final relevant QA run **45576573180** passed all dictionary validators, whole-catalogue audit, artifact upload and **15 Playwright browser tests**.
- Cloudflare Pages successfully deployed commit `9a0752c68ab5161fea88adcbfb3acb9a153725a0` to isolated staging:
  - Branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev
  - Unique deployment: https://60523dea.swiftdictionary.pages.dev
- Cloudflare build-routing guard passed.
- The separate Cloudflare Workers Builds check for `swiftdictionary-testing` failed. It is distinct from the successful Cloudflare Pages deployment and must be triaged separately.
- Other cross-version PR checks were still in progress when this archive entry was prepared; this entry does not claim the entire consolidated suite is complete.

## Remaining acceptance checks

- Owner desktop/mobile review of the latest preview.
- First authenticated preview session must confirm the private Realtime channel reaches SUBSCRIBED and test cross-device collection refresh. Mocked Playwright and rollback-based RLS tests do not establish live two-device delivery.
- Final status of all remaining PR regression checks and separate triage of the Workers Builds failure.
- No merge, production migration, production deployment or Premium activation without separate explicit approval.

## Malaysia and general legal/privacy planning

No new personal-data category, third-party processor, tracking or transaction was added. The Premium page distinguishes configured entitlement values from a future purchase offer and labels folder caps as proposals. Existing Malaysia PDPA, international privacy, 16+ audience, content licensing and unpublished Terms/privacy review remain open. Any real Premium launch requires a separate review of consumer disclosures, pricing/tax, recurring billing, cancellation/refunds and payment-provider obligations. This is planning guidance, not legal advice or compliance clearance.
