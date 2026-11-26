# Long-term language roadmap and mandatory development workflow rules

**Date:** 2026-11-26  
**Production baseline:** SwiftDictionary Update 2.9.1  
**Documentation branch:** docs/master-development-record  
**Status:** Owner-approved roadmap direction and standing workflow rules; no implementation or release action authorised by this record.

## Planned major language roadmap

The owner proposes the following sequence:

- **Update 3.0 — Malay Expansion**
- **Update 4.0 — Japanese Expansion**
- **Update 5.0 — Korean Expansion**

Moderate updates are expected between major updates. They can deliver incremental features, refinements, bug fixes, technical preparation, content improvements and infrastructure work. The sequence is a planning baseline that can be revisited with the owner; it does not mean Japanese or Korean implementation starts immediately.

Future support-language translations may be prepared progressively in the background, as described in the multilingual architecture record. Support-language availability does not make a language a selectable learning course. Japanese and Korean still require their own dictionary, independently authored educational content, language-specific processing and launch QA before becoming learning languages.

## Five owner-approved standing workflow rules

### 1. Keep root README current

Whenever development is pushed/merged to production main and affects the released application/project status, update the repository root README as part of the same release workflow. The displayed version and status must match what is actually live. The owner noted that README still showed 2.8.0 after 2.9.0 had shipped. Check and correct it to the current actual release (U2.9.1 at the time of this record), verify the committed result, and never claim a release before it is deployed.

### 2. Live Supabase migration before production main update

If a release requires a database migration, inspect current Live schema/history and test the migration in non-production first. Obtain explicit owner approval, apply the required Live Supabase migration, and verify it successfully **before** merging/pushing the dependent application changes to production main and deploying live. If migration fails or cannot be verified, stop the release. If no migration is required, record that fact. This rule does not authorise production database changes without approval; compatibility and recovery planning remain necessary.

### 3. Complete and verify implementation before staging handoff

A staging preview is for owner acceptance testing, not for discovering whether the feature has actually been implemented. Complete the agreed feature and test its real flows, data/persistence, errors, responsive behaviour, integration and affected regressions before handing it over. Run available static, automated, integration and browser/runtime checks; inspect errors/logs where available; ensure staging config/migrations/data are ready. Report exactly what was tested, passed, not tested and known limitations. Never pretend the system works or claim tests passed without executing them. If a check is blocked by tools, access, environment or plan limits, disclose it and do not imply verification.

### 4. Website-created prompts and dropdowns, not browser-native UI

Use website-built UI components for product prompts and dropdown interactions. Avoid browser-native alert(), confirm() and prompt(), and avoid browser-controlled dropdown presentation where a designed website dropdown is required. Existing instances should be identified and replaced during relevant maintenance; do not claim the whole app has been audited until checked. Custom components must preserve keyboard accessibility, focus, screen-reader semantics, validation and mobile usability. Intentionally styled native form controls may be appropriate when they behave as part of the website interface; the aim is to avoid browser-controlled UI that breaks consistency.

### 5. Consistent feature UI

Every new feature must follow the established design and interaction language of Lessons, Quiz and Flashcards. Reuse established spacing, typography, panel/card treatments, controls, navigation, responsive behaviour and interaction patterns. Use drop shadows where appropriate for hierarchy; smooth, purposeful transitions for state changes and interactions; and colour-coded panels/tabs/statuses where they improve recognition or grouping. Maintain coherent hover, focus, active, disabled, loading, success, warning and error states. Respect reduced-motion preferences and accessibility. Keep the established overall dark theme and dark-blue panel treatment coherent. Do not apply effects indiscriminately; use them when appropriate. Verify desktop and mobile presentation.

## Release checklist

Before every production release, record that:
1. Implementation is complete and internally tested before staging handoff.
2. Staging preview uses the tested code/configuration.
3. Relevant automated, integration, browser and regression tests were actually executed and truthfully reported.
4. Website-created prompts/dropdowns are used in changed workflows where required.
5. UI consistency with Lessons, Quiz and Flashcards is checked.
6. Live Supabase migration need is assessed; if required, approved migration is applied and verified before production main merge/deploy.
7. Root README reflects the actual release version/status.
8. MDR and archive are updated on the docs branch and never merged into production main.
9. Standing Malaysia/international legal, privacy and licensing review is completed for relevant changes.
10. Explicit owner approval is obtained at merge and production release gates.

## Relationship to earlier multilingual architecture record

The independent-curriculum decision remains in force: every language can author its own educational content; English is not the master curriculum. The shared platform/language package architecture, translation registry, staged advance translation strategy, three-level QA and language-specific adapters remain the intended foundation. U3.0 Malay is the first proving case; Japanese and Korean follow in the planned major roadmap.

## Recovery point for a future conversation

Read the latest MDR sections:
- “Multilingual platform and language-expansion development structure — owner-approved direction (2026-11-26)”
- “Long-term language roadmap and mandatory development workflow rules — owner-approved (2026-11-26)”

Treat U2.9.1 as the production baseline at the time of this record. Do not infer that U3.0 implementation has begun or that exact scope, language pairs, background translation volume, architecture or migrations are finalised. Apply the five standing workflow rules to future work.

