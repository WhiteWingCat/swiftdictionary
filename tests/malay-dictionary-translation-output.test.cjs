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

test("U3.0 Malay Dictionary translations are complete in all three course directions", () => {
  const englishEntries = [
    ...(window.SWIFT_ENGLISH_BASE_DICTIONARY || []),
    ...(window.SWIFT_ENGLISH_EXPANSION || [])
  ];
  const chineseEntries = [
    ...(window.SWIFT_CHINESE_BASE_DICTIONARY || []),
    ...(window.SWIFT_CHINESE_WORDS || [])
  ];
  const malayEntries = window.SWIFT_MALAY_DICTIONARY || [];

  const englishCoverage = overlay.apply(englishEntries, "en");
  const chineseCoverage = overlay.apply(chineseEntries, "zh");

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

  const malaySenseCount = malayEntries.reduce(
    (sum, entry) => sum + (Array.isArray(entry.senses) && entry.senses.length ? entry.senses.length : 1),
    0
  );
  assert.equal(malayEntries.length, 650);
  assert.equal(malaySenseCount, 672);

  packages.createPackage({
    languageCode: "en",
    contentVersion: "u3-en-ms-translation-coverage-test",
    content: { dictionary: { entries: englishEntries } }
  });
  packages.createPackage({
    languageCode: "zh",
    contentVersion: "u3-zh-ms-translation-coverage-test",
    content: { dictionary: { entries: chineseEntries } }
  });
  packages.createPackage({
    languageCode: "ms",
    contentVersion: "u3-ms-en-zh-translation-coverage-test",
    content: { dictionary: { entries: malayEntries } }
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
  assert.equal(enToMs.length + zhToMs.length, 4797);
  assert.equal(msToEn.length + msToZh.length, 1344);

  for (const record of [...enToMs, ...zhToMs, ...msToEn, ...msToZh]) {
    assert.equal(record.status, "machine_assisted_draft");
    assert.equal(record.reviewerId, null);
  }
});
