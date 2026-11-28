# Language content packages

SwiftDictionary separates shared application infrastructure from independently authored language content. Each package is identified by its ISO-style language code and declares its locale, script, capabilities, content revision, source files, provenance and approval state.

## Package rules

- Keep stable content IDs independent of display text and translation wording.
- Each content record carries `schemaVersion`, `languageCode` and `contentVersion` in the normalized package representation.
- Corrections increment the content revision without changing the stable ID.
- Translations are separate records keyed by source content ID and source/target language; record source revision, translation revision, provenance, workflow status and reviewer reference.
- A source revision change makes its translations stale until reviewed again.
- Keep draft and approved status explicit. Never silently publish draft content.
- A language may be registered as planned before it is active or selectable.
- Preserve language-specific linguistic rules through adapters; do not make the shared UI assume that every language behaves like English or Chinese.

## Current packages

- `en`: English; active; legacy U2.9.1 content is being wrapped in the U3.0 contract.
- `zh`: Simplified Chinese; active; retains single-Han-character grid, Pinyin and stroke-order behaviour.
- `ms`: Malaysian Standard Malay; active only on the isolated U3.0 Phase 3 development/staging branch for Dictionary, Lessons and Daily Learning review. Quiz and Flashcards remain unavailable until their later phases. Do not activate Malay in production until owner staging review, rights/provenance, legal and release gates pass.

See each language's `manifest.json` for source inventory and status.
