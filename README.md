# SwiftDictionary Update 2.7.0 — Chinese Course & Dictionary Expansion

> **Release candidate:** Update 2.7.0 is being prepared on `feature/update-2-7-0-chinese-dictionary-lessons`. It has not been merged into `main` or released to production. The current branch preview uses the staging Supabase project.

SwiftDictionary is a vocabulary and language-learning web application for English and Simplified Chinese. It includes a searchable dictionary, structured lessons, daily learning activities, quizzes, flashcards, saved words, account-based synchronisation and learner progress.

The dictionary remains free and unlimited. Daily learning allowances apply to learning activities, not dictionary searches.

## What Update 2.7.0 adds

### Chinese dictionary expansion

- Adds **519 new single-character Chinese dictionary records**, bringing the combined Chinese character catalogue to **700+ unique characters**.
- Keeps the one-character-per-card grid design. Multi-character vocabulary appears in related words and detail content.
- Adds Chinese category filters and pinyin-initial filters. Pinyin search works without tone marks, and polyphonic characters can appear under each applicable initial.
- Expands character definitions with contextual senses, examples, related words and pronunciation information.
- Adds separate-sense examples with pinyin support, including coverage checks to prevent missing pinyin in Chinese example sentences.
- Keeps pinyin beneath the character in the grid; pinyin and detailed explanations are shown in the character detail view.
- Adds a public [Chinese dictionary data sources and attribution page](data-sources.html), with the source registry also documented in `data/CHINESE-DICTIONARY-SOURCES.md`.

### Chinese learning course

- Adds **17 Chinese lessons** across the three difficulty levels:
  - Beginner: 7 lessons and 44 practice questions.
  - Intermediate: 5 lessons and 34 practice questions.
  - Advanced: 5 lessons and 34 practice questions.
- Provides **112 practice questions** in total, with four answer choices per question.
- Presents Chinese learning text with pinyin and English support, including explanations, examples, sentence breakdowns, questions and answer choices.
- Covers pronunciation and pinyin, tones, word order, measure words, negation, question particles and other foundational topics.
- Gives English and Chinese courses independent permanent-lesson progress and practice-result records. Switching the learning course does not mix the two courses' lesson history.
- Keeps lesson content expandable, with a focused reader and interactive practice.

### Chinese Daily Learning content

- Adds Chinese Daily Topic, Daily Application and Daily Discovery content pools: 6 topics, 7 application activities and 93 Discovery entries.
- Integrates the Chinese course with the existing four Daily Learning categories: Daily Topic, Daily Application, Daily Discovery and Daily Revision.
- Keeps the shared daily schedule and adaptive revision behaviour.
- Adds a clear explanation beneath Daily Learning: each activity category has one allowance shared across English and Chinese. Switching courses does not create a second allowance.
- Keeps a scheduled Discovery item visible in an exhausted course as a disabled **Daily limit reached** card, rather than leaving the category empty when the other course has used the shared allowance.
- Allows completed content to be reopened in review mode without starting another activity or consuming another allowance.

### Lessons and Daily Learning interface improvements

- Redesigns the Lessons experience for both learning courses, including expandable lesson content, updated practice-question and answer layouts, and responsive difficulty navigation.
- Refines the Daily Learning activity drawer and its responsive activity tabs and allowance display.
- Uses horizontal slide-in/slide-out motion for the Daily Learning drawer under normal motion settings. The backdrop has its own fade, and users who request reduced motion receive a brief fade instead of the slide.
- Restricts lesson emphasis to useful learning content: explanations, examples in context and sentence-breakdown content. Titles, headings, descriptions, questions, choices and answers are not highlighted.
- Removes the previous subject/verb/object role-based emphasis. Bilingual Chinese, pinyin and English sentence content remains intact.

### Lesson allowance and course-aware progress safeguards

- A new permanent lesson consumes one lesson-start allowance only after the learner confirms the first start. The database enforces the charge atomically with the first progress record.
- Resuming an unfinished lesson and reviewing a completed lesson remain free.
- Daily activities continue to consume their allowance only after successful completion. Starting, resuming or abandoning a daily activity does not consume a completion allowance.
- Daily allowances reset at midnight in the user's configured IANA timezone.
- Daily activity allowances are shared by activity category across English and Chinese; they are not separate per-course quotas.
- Completed Daily Learning content resolves against the language of the loaded activity/session, not merely the currently visible course selector. This prevents the wrong course's content from appearing during review.

## What changed or was fixed

- Corrected missing pinyin in Chinese Dictionary examples for separate meanings.
- Improved Chinese character discovery through category and pinyin-initial filters, including polyphonic readings.
- Corrected course-aware lesson progress and completed-content review so English and Chinese histories remain independent.
- Fixed the Daily Learning drawer's conflicting modal animation and hidden-state behaviour; normal-motion panel movement is now slide-only.
- Fixed the English Daily Discovery empty state when the shared category allowance has already been used in Chinese.
- Added translated allowance guidance so users understand why changing courses does not reset daily usage.
- Corrected Chinese lesson example details, including the year example `二零二六年` with matching `líng` pinyin and the Chinese example name 李明 / Lǐ Míng.
- Refreshed the relevant frontend asset cache versions to ensure browsers load the updated Daily Learning and Lessons interface.

No existing dictionary, Google sign-in, account switching, saved-word synchronisation, stroke-order lesson or unlimited dictionary-search functionality was intentionally removed.

## Current application features

The application has five main pages: **Dictionary**, **Lessons**, **Quiz**, **Flashcards** and **Profile**.

- **Dictionary:** English word search and Simplified Chinese character search, detailed definitions and examples, translation-language switching, saved words and Chinese stroke-order learning.
- **Lessons:** English and Chinese permanent lesson libraries, Beginner/Intermediate/Advanced difficulty levels, interactive practice, course-specific progress and completed-lesson review.
- **Daily Learning:** Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision, with account-synchronised preferences and daily allowances.
- **Quiz:** The English Quiz experience, including its 199-question bank, progress and allowance integration.
- **Flashcards:** English Flashcards, review progress and allowance integration.
- **Profile:** Learning progress, preferences, timezone, account information and account/data-management controls.

Quiz and Flashcards are available features delivered in Updates 2.4.0 and 2.5.0. They are not Coming Soon placeholders.

## Daily allowance reference

The configured allowance model is:

| Activity | Free | Premium entitlement |
|---|---:|---:|
| New permanent lesson starts | 5 per local day | 15 per local day |
| Daily Topic completions | 1 per local day | 3 per local day |
| Daily Application completions | 1 per local day | 3 per local day |
| Daily Discovery completions | 1 per local day | 3 per local day |
| Daily Revision completions | 1 per local day | 3 per local day |
| Dictionary searches | Unlimited | Unlimited |

The daily activity limits are shared across English and Chinese for the same activity category. For example, completing English Daily Topic uses that day's Daily Topic allowance for Chinese as well.

Premium entitlement infrastructure exists, but this project does not currently include a payment, checkout or subscription-purchase flow. Premium values in this table describe the configured entitlement limits, not an available purchase offer.

## Supabase changes in Update 2.7.0

This update adds three migrations:

1. `supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql` — separates permanent lesson progress and practice results by learning language and updates the server-side lesson content catalogue.
2. `supabase/migrations/20261122123000_update_2_7_0_chinese_daily_learning_catalog.sql` — registers the Chinese Daily Learning content in the server-side catalogue while preserving shared category allowances.
3. `supabase/migrations/20261122143000_update_2_7_0_lesson_start_allowance.sql` — enforces the first-confirmed-start allowance for permanent lessons while keeping resume and completed review free.

These migrations were validated against disposable PostgreSQL/Supabase test environments and applied to the U2.7.0 staging Supabase project for preview testing. **They have not been applied to production.** Review the live schema and migration history before any future application; do not re-run migrations blindly or apply them to production without explicit release approval.

## Build, hosting and configuration

- Hosting is through Cloudflare Pages connected to this GitHub repository. `main` is the production branch; feature branches create preview deployments.
- `build.sh` selects the expected Supabase environment based on the Cloudflare Pages branch and refuses to build if the configured project URL or publishable key does not match that environment.
- Cloudflare Pages must provide `SWIFT_SUPABASE_URL` and `SWIFT_SUPABASE_PUBLISHABLE_KEY` for the appropriate environment. The build generates `supabase-config.js` in the deployment output; do not commit service-role keys or OAuth client secrets.
- Keep the project's existing `banner.svg` and local `supabase-config.js` intact when working locally unless a separately reviewed change requires otherwise.
- Do not copy only `index.html` when deploying this update. The application also depends on its JavaScript, stylesheet, data, source-attribution, migration and other repository assets.
- Do not merge this release candidate or deploy it to production until the owner has completed the final review and explicitly approved release.

## Verification performed

The latest pre-polish application head passed the following automated workflows:

- U2.7.0 Chinese dictionary static/data checks, Chinese Lessons content and pinyin checks, Lessons/Daily Learning UI checks, full Lessons/Daily Learning Chromium regressions, Chinese filter browser checks and Chinese bilingual-layout browser checks.
- PostgreSQL 17 permanent lesson-start allowance regression, including concurrent first-start and test-exemption coverage.
- Update 2.3.x PostgreSQL, Supabase Auth and Chromium regressions.
- Update 2.5.0 Flashcards database and Chromium regressions.
- Update 2.6.0 ACL drift regression.
- Quiz database foundation and local Supabase Auth/RPC integration.
- Cloudflare build-routing guard.

A successful automated workflow is not a substitute for the owner's live staging review. The latest staging preview was reviewed and accepted by the owner before the polishing pass began; the README-only release-preparation commit will trigger fresh branch checks and a new preview deployment.

## Data sources, licensing and learning accuracy

- New Chinese dictionary records use adapted CC-CEDICT-derived glosses and pronunciation cross-checks. CC-CEDICT is licensed under **CC BY-SA 4.0**; attribution and share-alike conditions are documented in `THIRD_PARTY_NOTICES.md` and `data-sources.html`.
- Unihan pronunciation references are covered by the Unicode License v3. HSK candidate-level metadata uses the attributed HSK 3.0 character-list source. The pinyin-data extraction source and its MIT attribution are also documented.
- Hanzi Writer is MIT-licensed. Its character stroke data has a separate Arphic Public License lineage; see `THIRD_PARTY_NOTICES.md` and `ARPHICPL.TXT`.
- Chinese Lessons are separately authored learning content; the dictionary's CC-CEDICT wording is not copied into the lesson curriculum.
- Definitions, glosses, pinyin, examples and learning explanations are educational references, not certified translations or specialist advice. Context-sensitive and polyphonic readings should continue to receive linguistic review.

Do not add access restrictions to CC BY-SA-derived dictionary content that conflict with its licence. Dictionary search remains free and unlimited.

## Privacy, security and legal preparation

SwiftDictionary is intended as a free personal learning project for a global audience aged 16+. Account-linked profile, preference, entitlement, saved-word and learning-activity data may be personal data. The project aims to minimise tracking and does not need raw practice answers for its progress summaries.

- Keep Row Level Security enabled and owner-scoped for user-owned Supabase data.
- Never expose a Supabase service-role key or Google OAuth client secret in browser code or repository files.
- Account switching and sign-out must continue to isolate saved words and user data on shared devices.
- Account deletion and learning-history deletion are distinct operations; describe their effects accurately.
- Review retention, privacy notice, processor and cross-border arrangements, age-related requirements and data-subject rights before public launch or broader onboarding.

This README is a product and engineering summary, not a legal compliance certification. Formal Malaysia PDPA and general international legal/privacy review remain outstanding; no statement here should be interpreted as legal clearance.

## Release history

- **SwiftDictionary Update 2.7.0:** Adds 519 Chinese dictionary characters, the Chinese permanent Lessons course, Chinese Daily Learning content, language-specific lesson progress, shared cross-course allowance guidance, redesigned Lessons/Daily Learning UI and the fixes documented above. Currently in release preparation; not yet merged or deployed to production.
- **SwiftDictionary Update 2.6.1:** Authentication and learning-data initialisation hotfix.
- **SwiftDictionary Update 2.6.0:** Account deletion, learning-history management, authentication UI and account/data-management improvements.
- **SwiftDictionary Update 2.5.0:** English Flashcards experience, review progress and allowance integration.
- **SwiftDictionary Update 2.4.0:** English Quiz experience, question bank, progress and allowance integration.
- **SwiftDictionary Update 2.3.0:** Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision, completion-based daily activity allowances and expanded learning progress.
- **SwiftDictionary Update 2.2.0:** English Lessons foundation with three difficulty levels, permanent lesson library and interactive practice.
- **SwiftDictionary Update 2.1.0:** Five-page navigation, signed-in Profile, preferences, progress overview and learning-data foundation.
- **SwiftDictionary Update 1.1.0:** Common English vocabulary and Chinese character expansion.
- **v19:** Consolidated Chinese linguistic review and interactive stroke-order learning.

---

*Release preparation note: this README describes the U2.7.0 release candidate. Update the status and deployment details after the owner approves and the production release is completed.*
