const test = require("node:test");
const assert = require("node:assert/strict");

global.window = {};
require("../js/core/language-registry.js");
require("../js/core/content-contracts.js");
require("../js/core/translation-registry.js");
require("../js/core/content-packages.js");

require("../data/languages/english-dictionary.js");
require("../data/english-expansion.js");
require("../data/languages/chinese-dictionary.js");
require("../data/chinese-characters.js");
require("../data/languages/malay-dictionary.js");
require("../data/languages/malay-dictionary-translations.js");
require("../js/core/dictionary-translation-overlay.js");

const packages = window.SWIFT_CONTENT_PACKAGES;
const registry = window.SWIFT_TRANSLATION_REGISTRY;
const overlay = window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY;

const english = [
  ...(window.SWIFT_ENGLISH_BASE_DICTIONARY || []),
  ...(window.SWIFT_ENGLISH_EXPANSION || [])
];
const chinese = [...new Map([
  ...(window.SWIFT_CHINESE_BASE_DICTIONARY || []),
  ...(window.SWIFT_CHINESE_WORDS || [])
].filter(entry => entry && entry.word).map(entry => [String(entry.word), entry])).values()];
const malay = window.SWIFT_MALAY_DICTIONARY || [];

function senseCount(entries) {
  return entries.reduce((total, entry) => total + (Array.isArray(entry.senses) && entry.senses.length ? entry.senses.length : 1), 0);
}

test("U3.0 source Dictionary inventories are complete and the Chinese grid catalogue is unique", () => {
  assert.equal(english.length, 1316);
  assert.equal(senseCount(english), 1931);
  assert.equal(new Set(english.map(entry => entry.word)).size, english.length);

  assert.equal(chinese.length, 725);
  assert.equal(senseCount(chinese), 825);
  assert.equal(new Set(chinese.map(entry => entry.word)).size, chinese.length);
  assert.ok(chinese.every(entry => [...String(entry.word)].length === 1));

  assert.equal(malay.length, 650);
  assert.equal(senseCount(malay), 672);
  assert.equal(new Set(malay.map(entry => entry.word)).size, malay.length);
});

test("Malay target-language overlay covers every English and Chinese headword and meaning", () => {
  const englishRecords = window.SWIFT_DICTIONARY_MS_TRANSLATIONS.languages.en;
  console.log("MALAY_OVERLAY_DIAGNOSTIC", JSON.stringify({
    englishCount: english.length,
    recordCount: Object.keys(englishRecords || {}).length,
    exactMatches: english.filter(entry => englishRecords?.[entry.word]).length,
    sampleWords: english.slice(0, 12).map(entry => entry.word),
    sampleKeys: Object.keys(englishRecords || {}).slice(0, 12)
  }));
  const englishCoverage = overlay.apply(english, "en");
  const chineseCoverage = overlay.apply(chinese, "zh");

  assert.deepEqual(
    {
      entries: englishCoverage.totalEntries,
      translatedEntries: englishCoverage.translatedEntries,
      senses: englishCoverage.totalSenses,
      translatedSenses: englishCoverage.translatedSenses,
      complete: englishCoverage.complete
    },
    { entries: 1316, translatedEntries: 1316, senses: 1931, translatedSenses: 1931, complete: true }
  );
  assert.deepEqual(
    {
      entries: chineseCoverage.totalEntries,
      translatedEntries: chineseCoverage.translatedEntries,
      senses: chineseCoverage.totalSenses,
      translatedSenses: chineseCoverage.translatedSenses,
      complete: chineseCoverage.complete
    },
    { entries: 725, translatedEntries: 725, senses: 825, translatedSenses: 825, complete: true }
  );

  assert.equal(window.SWIFT_DICTIONARY_MS_TRANSLATIONS.status, "machine_assisted_draft");
  assert.ok(english.every(entry => entry.translationStatus?.ms === "machine_assisted_draft"));
  assert.ok(chinese.every(entry => entry.translationStatus?.ms === "machine_assisted_draft"));
});

test("content packages register complete translation records in all three course directions", () => {
  packages.createPackage({
    languageCode: "en",
    contentVersion: "u3-en-ms-translation-coverage-test",
    content: { dictionary: { entries: english } }
  });
  packages.createPackage({
    languageCode: "zh",
    contentVersion: "u3-zh-ms-translation-coverage-test",
    content: { dictionary: { entries: chinese } }
  });
  packages.createPackage({
    languageCode: "ms",
    contentVersion: "u3-ms-en-zh-translation-coverage-test",
    content: { dictionary: { entries: malay } }
  });

  const records = registry.list();
  const enToMs = records.filter(record => record.sourceLanguageCode === "en" && record.targetLanguageCode === "ms");
  const zhToMs = records.filter(record => record.sourceLanguageCode === "zh" && record.targetLanguageCode === "ms");
  const msToEn = records.filter(record => record.sourceLanguageCode === "ms" && record.targetLanguageCode === "en");
  const msToZh = records.filter(record => record.sourceLanguageCode === "ms" && record.targetLanguageCode === "zh");

  assert.equal(enToMs.length, 3247);
  assert.equal(zhToMs.length, 1550);
  assert.equal(msToEn.length, 672);
  assert.equal(msToZh.length, 672);

  for (const record of [...enToMs, ...zhToMs]) {
    assert.equal(record.status, "machine_assisted_draft");
    assert.equal(record.reviewerId, null);
  }
  for (const record of [...msToEn, ...msToZh]) {
    assert.ok(["draft", "machine_assisted_draft"].includes(record.status));
    assert.equal(record.reviewerId, null);
  }
});

test("Malay Dictionary generator uses curated glosses for isolated Chinese source text", () => {
  const exporter = fs.readFileSync(path.join(root, "scripts/content/export-malay-translation-input.cjs"), "utf8");
  const generator = fs.readFileSync(path.join(root, "scripts/content/generate-malay-dictionary-translations.py"), "utf8");
  assert.ok(exporter.includes("window.SWIFT_FLASHCARD_MALAY_SUPPORT"));
  assert.ok(generator.includes('malay_glosses.get("zh", {}).get(source_text, "")'));
  assert.ok(generator.includes('re.search(r"[\\u3400-\\u9fff]"'));
});
