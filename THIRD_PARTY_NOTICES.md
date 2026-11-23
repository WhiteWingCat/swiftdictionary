# Third-party notices

## Hanzi Writer 3.7.3

SwiftDictionary uses Hanzi Writer to render Chinese characters and animate stroke order.

- Project: https://github.com/chanind/hanzi-writer
- Documentation: https://hanziwriter.org/docs.html
- License: MIT
- Copyright: Copyright (c) 2014 David Chanin

The Hanzi Writer JavaScript library is loaded from jsDelivr at runtime. The MIT license permits reuse, including commercial reuse, provided that the copyright and permission notice are retained with copies or substantial portions of the software. The MIT license text is reproduced below.

### MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Hanzi Writer character stroke data

- Data project: https://github.com/chanind/hanzi-writer-data
- Original data source: https://github.com/skishore/makemeahanzi
- License identified by the upstream data project: Arphic Public License
- License text: `ARPHICPL.TXT` (included in this release)

The upstream Hanzi Writer Data project states that its character data is licensed separately from Hanzi Writer's source code, originates from Make Me a Hanzi, and was extracted from fonts by Arphic Technology. SwiftDictionary requests character JSON from `hanzi-writer-data@2.0.1` at runtime; it does not bundle or modify those JSON files in this release. The unmodified license text is supplied as a notice for the upstream data lineage.

The MIT license for the JavaScript library does not replace the separate license for the stroke data. Reassess the exact terms before bundling, modifying, redistributing the data, or introducing paid features that use it.


## CC-CEDICT Chinese–English dictionary and Flashcard vocabulary data (2026-11-20 snapshot)

SwiftDictionary's Chinese single-character dictionary entries and the new multi-character Flashcard vocabulary bank use selected/adapted English glosses and pronunciation references from CC-CEDICT. The U2.8.0 Flashcard draft includes 904 multi-character vocabulary entries whose source identifiers point to this CC-CEDICT snapshot; the separate 24 useful-expression cards are SwiftDictionary-authored.

- Original project: https://cc-cedict.org/
- MDBG project page: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
- Data snapshot mirror: https://github.com/rhcarvalho/cedict
- Snapshot commit: `9f027e342cc57310780f4db0355f54f90d33674d`
- Original data licence: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)

Attribution: **CC-CEDICT**, community-maintained Chinese–English dictionary, originally made available through MDBG. SwiftDictionary has selected single-character entries and adapted/translated glosses for learner use; the content has been modified and is not endorsed by the original project. CC-CEDICT-derived dictionary data, Flashcard vocabulary glosses and adapted glosses are distributed under CC BY-SA 4.0. SwiftDictionary-authored examples, Chinese learning cues and original useful-expression cards are separately identified as original contributions. The underlying CC-CEDICT-derived data is included in publicly accessible static assets; Flashcard gameplay allowances govern interactive sessions and do not gate access to the licensed data files. The Dictionary remains free and unrestricted; no additional access restrictions are imposed on this licensed data.

## Unicode Unihan 18.0.0 pronunciation data

SwiftDictionary uses Unihan 18.0.0 pinyin readings as a reference for new Chinese character records.

- Data: https://www.unicode.org/Public/18.0.0/ucd/Unihan.zip
- Property documentation: https://www.unicode.org/reports/tr38/
- Licence: https://www.unicode.org/license.txt

### Unicode License v3 — Copyright and Permission Notice

Copyright © 2021-2026 Unicode, Inc.

NOTICE TO USER: Carefully read the following legal agreement. BY DOWNLOADING, INSTALLING, COPYING OR OTHERWISE USING DATA FILES, AND/OR SOFTWARE, YOU UNEQUIVOCALLY ACCEPT, AND AGREE TO BE BOUND BY, ALL OF THE TERMS AND CONDITIONS OF THIS AGREEMENT. IF YOU DO NOT AGREE, DO NOT DOWNLOAD, INSTALL, COPY, DISTRIBUTE OR USE THE DATA FILES OR SOFTWARE.

Permission is hereby granted, free of charge, to any person obtaining a copy of data files and any associated documentation (the "Data Files") or software and any associated documentation (the "Software") to deal in the Data Files or Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Data Files or Software, and to permit persons to whom the Data Files or Software are furnished to do so, provided that either (a) this copyright and permission notice appear with all copies of the Data Files or Software, or (b) this copyright and permission notice appear in associated Documentation.

THE DATA FILES AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS.

IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THE DATA FILES OR SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in these Data Files or Software without prior written authorization of the copyright holder.

SPDX-License-Identifier: Unicode-3.0

## mozillazg/pinyin-data extraction files

The extracted Unihan pronunciation reference files are also distributed through `mozillazg/pinyin-data`.

- Source snapshot: https://github.com/mozillazg/pinyin-data/tree/update-unihan-18.0.0
- Licence: MIT
- Copyright: Copyright (c) 2016 mozillazg

### MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## HSK 3.0 character list (candidate selection)

SwiftDictionary uses the HSK 3.0 character list from `elkmovie/hsk30` to prioritize candidate characters and record HSK level metadata.

- Source: https://github.com/elkmovie/hsk30
- Snapshot commit: `7f3d4fdcfcb6e826001df062747c943d1fa8160e`
- Original file header: Copyright (c) 2021 Pleco Inc.
- Licence: MIT (see the source repository's LICENSE file)

The upstream list warns that it was OCRed and not extensively proofread. SwiftDictionary uses it as a candidate-selection reference only and validates selected characters against dictionary and pronunciation sources.

### MIT License — Copyright (c) 2021 Pleco Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

See [data/CHINESE-DICTIONARY-SOURCES.md](data/CHINESE-DICTIONARY-SOURCES.md) for per-entry source identifiers and snapshot hashes.
