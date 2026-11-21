# Chinese Dictionary Expansion — Data Sources and Provenance

Last reviewed: 2026-11-21

This file records source provenance for the new Chinese single-character records. The per-entry `sourceIds` field points to the sources below. This document is a data notice, not legal advice.

## Source registry

### `cc-cedict-2026-11-20`

- Source: CC-CEDICT, a community-maintained Chinese–English dictionary, using the 2026-11-20 snapshot mirrored by [rhcarvalho/cedict](https://github.com/rhcarvalho/cedict).
- Snapshot commit: `9f027e342cc57310780f4db0355f54f90d33674d`.
- Data blob: `f78ede59be528797ba1ff6aa625f0b0ba77befae`.
- Original source: https://cc-cedict.org/ and https://www.mdbg.net/chinese/dictionary?page=cc-cedict.
- Licence: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).
- Fields used: concise English glosses/meaning references and cross-checking of common pronunciations. New English definitions and Chinese summaries are adapted/translated from the source and must retain CC BY-SA 4.0 attribution/share-alike conditions.
- The app's Dictionary remains free and unrestricted. Do not place CC-CEDICT-derived dictionary content behind a subscription or otherwise add restrictions inconsistent with the licence.

### `unihan-18.0.0`

- Source: Unicode Unihan Database, Unicode 18.0.0.
- Official data: https://www.unicode.org/Public/18.0.0/ucd/Unihan.zip.
- Extracted reference files used: [mozillazg/pinyin-data](https://github.com/mozillazg/pinyin-data), branch `update-unihan-18.0.0`, commit `fe29ad32bdf352b31a02b9936e537f575432e9a6`; `kMandarin.txt` blob `7d4aa1189dce0f8da5f3dc79a8094abc1d73bc31`, `kHanyuPinyin.txt` blob `05579572f51639218e5e23b21594bc63f2d5ec0e`, `kHanyuPinlu.txt` blob `abc37486838a6bcb5b6a619b4a61fee1710dfd59`.
- Reference property documentation: https://www.unicode.org/reports/tr38/.
- Licence: Unicode License v3, https://www.unicode.org/license.txt.
- Fields used: `kMandarin` and related pronunciation data to establish pinyin readings; Unihan readings are reference data, not a guarantee of pronunciation in every word or sentence.
- Preserve the Unicode copyright and permission notice in associated documentation. Validate polyphonic readings against actual common words and sentences.

### `hsk30-pleco`

- Source: HSK 3.0 character list from https://github.com/elkmovie/hsk30.
- Snapshot commit: `7f3d4fdcfcb6e826001df062747c943d1fa8160e`.
- Data blob: `e055ee77b4f3062c32a7e9b291a39db7c8ce3bd5`.
- Licence: MIT; the source file header credits Pleco Inc. (2021).
- Use: candidate selection and HSK level metadata only. The source itself warns that the list was OCR-processed and not extensively proofread. Every selected character and level must be independently checked before inclusion.

## SwiftDictionary-authored fields

- `categories`: original SwiftDictionary learning classifications. A character can belong to multiple categories.
- `examples`: original SwiftDictionary example sentences, subject to linguistic review.
- `breakdown`: original learning hints; these are mnemonic/visual learning associations, not claims of historical etymology.
- `related`: selected related words with pinyin, authored/curated for learning use.
- `definitionZh`: concise Chinese explanations adapted from the English glosses. Since the English glosses are CC-CEDICT-derived, the adapted translations retain the CC BY-SA 4.0 provenance.
- `sourceIds`: source registry IDs identifying the provenance used for each new entry.
- `hskLevel`: selection metadata from the HSK 3.0 candidate list.

## Separation from Chinese Lessons

Do not copy CC-CEDICT definitions or its expressive wording into the Chinese Lessons curriculum. Lessons should use original explanations, examples and exercises. Reusing a character as a linguistic fact/headword is distinct from copying the dictionary's gloss text; keep lesson content authored separately and review its own sources/licences.

## Validation safeguards

- Keep the source snapshot commit/blob identifiers stable in the record.
- Verify every character is a single Simplified Chinese Han character and does not duplicate an existing entry.
- Verify pinyin tone marks and all common readings; avoid importing obscure readings merely because a source lists them.
- Verify definitions, categories and example sentences in context.
- Do not infer that the existing 206 entries are cleared by these new-source notices; their original provenance remains to be audited separately.
