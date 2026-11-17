# SwiftDictionary Indie staging approval and creation

**Date:** 2026-11-17  
**Conversation:** SwiftDictionary Indie confirmation and temporary real Quiz testing environment  
**Repository:** `WhiteWingCat/wordbook`  
**Working branch:** `feature/update-2-4-0-quiz`

## Owner decisions and approvals

The owner confirmed the earlier proposal to create a temporary real Quiz testing environment with both conditions:
1. Create a separate Supabase staging project, not a Supabase Development Branch, with no production connection and no paid-plan activation.
2. Load the 114 authored Quiz draft questions into staging for testing only. This does not approve the questions for production publication.

The owner clarified that the earlier zero-cost estimate of **US$0/month** was the basis for approval. No paid upgrade, paid add-on or additional charge is authorised.

The owner also requested that every conversation related to SwiftDictionary be archived to prevent loss of project decisions and implementation history.

## Supabase staging project created

- Organisation: `SwiftDictionary Indie`
- Project: `SwiftDictionary Indie Staging`
- Project ref: `ivatvkfrtifgfheeaelj`
- Region: `ap-southeast-1` (Singapore)
- Created: 2026-11-17 02:57:54 UTC
- Initial status: `ACTIVE_HEALTHY`
- Postgres: 17.12
- Quoted project cost: **US$0/month**
- The project was created after retrieving the current organisation-specific cost quote and obtaining its zero-cost confirmation ID.
- Existing production project `pzymiesazmpyvnfvsbsc` was not modified or connected to staging.
- No Supabase Development Branch was created.
- No paid plan or paid add-on was activated.

## Current implementation state and blockers

The new project is healthy but initially empty. Its migration history is empty.

The 2.4.0 branch contains Quiz migrations, draft question content and tests. However, the checked-in 2.2.0 reconciliation migration explicitly assumes that the 2.2.0 lesson schema already exists; it does not create that schema. Several 2.3.0 migrations also depend on pre-existing user, entitlement, preference, learning-limit and activity-log tables. Therefore, applying the 2.4.0 migrations directly to this empty project would be unsafe and incomplete.

**No migrations have yet been applied to staging. No questions have yet been imported.** Before proceeding, establish a complete, reviewed schema bootstrap for a clean project using the current branch's migration sources and verified schema definitions. Do not replay the 2.2.0 reconciliation migration as if it were a schema-creation migration. Do not copy production user data. A read-only schema inspection/export may be used to reconstruct the necessary baseline, but no production writes are authorised.

After the clean schema is established:
1. Apply and verify the ordered 2.2.0/2.3.0/2.4.0 schema and RPC changes.
2. Run security and performance advisors and the relevant SQL tests.
3. Validate the draft question-bank import assertions and expected counts: Beginner 30, Intermediate 36, Advanced 48 (114 total).
4. Import these questions into staging only, with draft/test-only status; do not publish them in production.
5. Create a separate staging Auth test account and configure the Cloudflare Pages preview to use only the staging URL and publishable key.
6. Run authenticated Quiz tests for session persistence, scoring, history, allowance enforcement and account isolation.
7. Keep the existing mock preview and production configuration unchanged until staging is verified.

The owner previously approved the 114 questions for test-only use in this isolated environment. No further approval is required for that specific use. Any paid cost, production data change, production deployment or publication of the questions requires separate explicit approval.

## Safety, cost and legal/privacy boundaries

- Monitor Free-plan resource, storage, database and activity limits. A US$0/month project quote is not a guarantee that all future usage remains free.
- Stop before any paid-plan activation, paid add-on or nonzero charge.
- Do not put service-role or secret keys in frontend code or repository files.
- Use only fictional/test learner data in staging.
- Do not use production accounts or production user data in staging.
- Review Malaysia PDPA applicability, international-user privacy requirements, intended 16+ audience, retention/deletion disclosures and cross-border processing before any public release. This is planning guidance, not legal advice.
- Production schema/data, production hosting and the existing PR/main branch state remain unchanged by the staging-project creation.

## Recovery checklist for the next conversation

1. Re-read this archive and the latest Master Development Record.
2. Inspect the current branch and all migrations/content-import scripts.
3. Build a safe clean-database bootstrap from verified schema definitions; do not assume migration history alone is sufficient.
4. Continue with staging migrations and question import only after the bootstrap is validated.
5. Update this archive or create a follow-up archive, the archive index and the Master Development Record after each meaningful SwiftDictionary conversation/session.
