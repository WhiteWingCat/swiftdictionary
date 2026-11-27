# Third-party notices — U3.0 Malay Dictionary translation drafts

**Status:** Staging-only machine-assisted drafting. Human Malaysian Standard Malay review and production release approval remain pending.

## Translation tooling

- **Argos Translate** — offline Python translation library used only in the GitHub Actions generation runner. The upstream project README states that the library is dual-licensed under MIT or CC0: https://github.com/argosopentech/argos-translate#license
- **English → Malay model:** `en_ms-1.9` (OPUS-MT model package).
- **Chinese → English pivot model:** `zh_en-1.9` (OPUS-MT model package), followed by English → Malay.
- Argos community model-license guidance lists the OPUS-MT model packages, including `en_ms-1.9` and `zh_en-1.9`, under CC-BY 4.0: https://community.libretranslate.com/t/model-licenses-for-argos-translate/2442
- Argos package metadata does not necessarily expose an explicit per-model license field; an upstream issue discusses this gap: https://github.com/argosopentech/argos-translate/issues/533

**Conservative release treatment:** retain CC-BY 4.0 attribution for the OPUS-MT model packages unless the exact downloaded package metadata or upstream rights-holder documentation establishes a different licence. Confirm the exact package versions, training-corpus terms and attribution text before any public production release. The model binaries are used in CI and are not bundled into the website.

## Content provenance

- Translation inputs are SwiftDictionary's own original-authored English and Simplified Chinese Dictionary definitions.
- The pipeline does not scrape or copy DBP/PRPM, Kamus Dewan, or other third-party dictionary entries.
- Output is marked `machine_assisted_draft`; no translation is represented as human-reviewed or approved.
- The generated Malay text is intended for staging review only. Reviewers must check meaning, Malaysian Standard Malay spelling, register, polysemy, grammar, and cultural/contextual appropriateness.
- No user personal data is sent to an online translation service; the model inference runs locally in the GitHub Actions runner.

## Release gate

Before production release:
1. Verify exact model package licensing and required attribution.
2. Add the final attribution to the public third-party notices page.
3. Complete competent human review of Malay translations.
4. Preserve per-sense translation provenance and review status.
5. Do not import protected dictionary wording or claim DBP/PRPM endorsement.

This is a project risk record, not legal advice.
